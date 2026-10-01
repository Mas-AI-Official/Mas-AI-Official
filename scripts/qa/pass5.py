"""Pass-5 checks (separate from pass3.py and pass4.py): real browser zoom at 200%, computed text size under the
three text-enlargement mechanisms, the A/B/C/D category audit, JavaScript disabled, every built route loaded
directly, back/forward history, the /start/ inquiry under mocked responses (no real send), WebKit emulation and
reduced motion.

Usage: python scripts/qa/pass5.py [--base http://localhost:3344] [--out DIR] [--only 1,5,7]

Every line is HELD / BREACHED / INCONCLUSIVE. INCONCLUSIVE means the condition could not be measured; it is never
a pass. Nothing here changes the site; a product defect is reported, not fixed.

Audit categories (checks 1 and 3):
  A  ordinary: the text is readable at some scroll position (it may sit below the fold at rest)
  B  text that stays obscured by sticky UI (header, pinned panel and its 28 px fade, guide launcher) at every
     scroll position tried, including targeted settled placements
  C  text clipped by an overflow hidden/clip ancestor on either axis (every ancestor on the containing-block
     path is walked), or text that never reaches an effective opacity of 1
  D  horizontal overflow (scrollWidth > clientWidth)
"""
import argparse
import json
import math
import re
import shutil
import sys
import tempfile
import time
from contextlib import contextmanager
from io import BytesIO
from pathlib import Path
from urllib.parse import unquote, urlparse

import numpy as np
from playwright.sync_api import sync_playwright

# Never write a Windows path with backslashes in this repo: Tailwind scans it for class names and reads
# a backslash followed by hex digits as a CSS escape; an out-of-range one fails the build.
ap = argparse.ArgumentParser()
ap.add_argument('--base', default='http://localhost:3344')
ap.add_argument('--out', default='qa-out/pass5')
ap.add_argument('--only', default='')
ARGS = ap.parse_args()
BASE = ARGS.base.rstrip('/')
OUT = Path(ARGS.out)
OUT.mkdir(parents=True, exist_ok=True)
ONLY = {int(x) for x in ARGS.only.split(',') if x.strip()}
ROOT = Path(__file__).resolve().parents[2]

ZOOM_LEVEL = math.log(2) / math.log(1.2)  # Chromium zoom level for 200% (1.2 ** level == 2): 3.8017840169239308
GREETING_LEAD = "Hi. I'm Daena, the governance side of MAS-AI."
NEED_TEXT = 'QA mock test, not a real inquiry'
verdicts = []


def verdict(name, ok, detail):
    state = 'INCONCLUSIVE' if ok is None else ('HELD' if ok else 'BREACHED')
    verdicts.append((name, state, detail))
    print(f'{state:12} {name}: {detail}', flush=True)


def info(msg):
    print(f'INFO         {msg}', flush=True)


def trunc(items, n=6):
    items = list(items)
    return '[' + '; '.join(str(i) for i in items[:n]) + (f'; +{len(items) - n} more' if len(items) > n else '') + ']'


# ---------------------------------------------------------------------------------------------------------------
# Page-side library. Shared by the category audit, the per-stop audit and the no-JS probe.
# ---------------------------------------------------------------------------------------------------------------
LIB = r"""
const doc = document.documentElement
const sleep = (ms) => new Promise(r => setTimeout(r, ms))
const raf = () => Promise.race([new Promise(r => requestAnimationFrame(() => r())), sleep(120)])
const header = document.querySelector('.site-header')
const stage = document.querySelector('.stage')
const sticky = stage ? stage.querySelector(':scope > .stage__sticky') : null
const launcher = document.querySelector('[data-testid="guide-launcher"]')
const hb = () => header ? Math.max(0, header.getBoundingClientRect().bottom) : 0
// Reading floor: the header, plus the pinned panel and its 28 px fade on phones while the panel is displayed.
const floorNow = () => {
  let f = hb()
  if (sticky && innerWidth < 900 && getComputedStyle(sticky).display !== 'none') {
    const r = sticky.getBoundingClientRect()
    if (r.height > 0) f = Math.max(f, r.bottom + 28)
  }
  return f
}
const launcherRect = () => { if (!launcher) return null; const r = launcher.getBoundingClientRect(); return r.width > 0 && r.height > 0 ? r : null }
const ceilFor = (r, lr) => lr && r.right > lr.left - 4 && r.left < lr.right + 4 ? Math.min(innerHeight, lr.top - 4) : innerHeight
const desc = (a) => a.tagName.toLowerCase() + (a.id ? '#' + a.id : '') + (typeof a.className === 'string' && a.className.trim() ? '.' + a.className.trim().split(/\s+/)[0] : '')
const label = (e) => desc(e) + ' "' + (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 36) + '"'
const chains = new Map()
const chainOf = (e) => { let c = chains.get(e); if (!c) { c = []; for (let n = e; n && n.nodeType === 1; n = n.parentElement) c.push(n); chains.set(e, c) } return c }
const effOpacity = (e) => { let o = 1; for (const n of chainOf(e)) { const v = parseFloat(getComputedStyle(n).opacity); if (!isNaN(v)) o *= v } return o }
const isStuck = (e) => chainOf(e).some(n => { const p = getComputedStyle(n).position; return p === 'sticky' || p === 'fixed' })
// The text lines of an element's own text nodes (not its children's), in viewport coordinates.
const textRect = (e) => {
  let l = 1e9, t = 1e9, r = -1e9, b = -1e9, n = 0, firstH = 0
  for (const c of e.childNodes) {
    if (c.nodeType !== 3 || !c.textContent.trim()) continue
    const rg = document.createRange(); rg.selectNodeContents(c)
    for (const q of rg.getClientRects()) { if (q.width < 0.5 || q.height < 0.5) continue; if (!n) firstH = q.height; l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom); n++ }
  }
  if (!n) return null
  // A Range box is the font's content area. With a line-height below that (tight headings) the line box is shorter and
  // the glyphs sit inside it, so trim the negative half-leading from the first and last line.
  const lh = parseFloat(getComputedStyle(e).lineHeight)
  const cs = getComputedStyle(e)
  if (!isNaN(lh) && firstH > lh + 0.5) { const o = (firstH - lh) / 2; t += o; b -= o }
  // A block's own text cannot render outside its content box by more than the font's leading: clamp small overshoots
  // (larger ones are real overflow and stay visible to the clip check).
  if (cs.display !== 'inline') {
    const br = e.getBoundingClientRect(), fs = parseFloat(cs.fontSize) || 16
    const ct = br.top + (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.paddingTop) || 0), cb = br.bottom - (parseFloat(cs.borderBottomWidth) || 0) - (parseFloat(cs.paddingBottom) || 0)
    if (t < ct && ct - t <= 0.25 * fs) t = ct
    if (b > cb && b - cb <= 0.25 * fs) b = cb
  }
  return {left: l, top: t, right: r, bottom: b, width: r - l, height: b - t}
}
const SKIP = 'script, style, noscript, svg, canvas, template, .guide, .visually-hidden, .skip-link, .sr-only, [hidden]'
const collect = (root) => [...root.querySelectorAll('*')].filter(e => {
  if (e.closest(SKIP)) return false
  if (!e.getClientRects().length) return false
  if (getComputedStyle(e).visibility === 'hidden') return false
  const r = textRect(e)
  return !!r && r.width >= 2 && r.height >= 2
})
// The next node whose overflow can clip this one: its containing block (fixed escapes every ancestor).
const cbOf = (n) => {
  const pos = getComputedStyle(n).position
  if (pos === 'fixed') return null
  if (pos === 'absolute') {
    for (let a = n.parentElement; a; a = a.parentElement) {
      const cs = getComputedStyle(a)
      if (cs.position !== 'static' || cs.transform !== 'none' || cs.filter !== 'none' || cs.perspective !== 'none' || /transform|filter|perspective/.test(cs.willChange)) return a
    }
    return doc
  }
  return n.parentElement
}
const clipOf = (e, r) => {
  const out = []
  for (let a = e, guard = 0; a && guard < 200; a = cbOf(a), guard++) {
    const cs = getComputedStyle(a)
    const cx = cs.overflowX === 'hidden' || cs.overflowX === 'clip', cy = cs.overflowY === 'hidden' || cs.overflowY === 'clip'
    if (!cx && !cy) continue
    if (cs.display === 'inline' || cs.display === 'contents') continue
    let box
    if (a === doc || a === document.body) {
      if (!cx) continue
      box = {left: 0, right: innerWidth, top: -1e9, bottom: 1e9}
    } else {
      const br = a.getBoundingClientRect()
      box = {left: br.left + a.clientLeft, top: br.top + a.clientTop, right: br.left + a.clientLeft + a.clientWidth, bottom: br.top + a.clientTop + a.clientHeight}
    }
    const dx = cx ? Math.max(box.left - r.left, r.right - box.right, 0) : 0
    const dy = cy ? Math.max(box.top - r.top, r.bottom - box.bottom, 0) : 0
    if (dx > 1 || dy > 1) out.push(desc(a) + ' x' + Math.round(dx) + ' y' + Math.round(dy))
  }
  return out
}
const overflowNow = () => Math.max(doc.scrollWidth, document.body.scrollWidth) - doc.clientWidth
const modeNow = () => !stage ? 'n/a' : stage.hasAttribute('data-flow') ? 'flow' : (sticky && getComputedStyle(sticky).display === 'none' ? 'flow (css)' : 'pinned')
"""

# Category audit of a whole page. Phase 1: a scroll scan (cheap, resolves most text). Phase 2: every element the scan
# could not resolve gets settled placements (centre, top, bottom of the free window, 850 ms each) before it counts.
AUDIT = r"""async (cfg) => {
  /*LIB*/
  const STEP = cfg.step || 48, DWELL = cfg.dwell === undefined ? 40 : cfg.dwell, SETTLE = cfg.settle || 850
  const DEADLINE = Date.now() + (cfg.deadlineMs || 300000); let aborted = false
  window.scrollTo({top: 0, behavior: 'instant'}); await sleep(400)
  const recs = collect(document.body).map(e => { const r = textRect(e)
    return {e, bestVis: 0, inHeader: !!header && header.contains(e), stuck: isStuck(e), docTop: r.top + scrollY, docBottom: r.bottom + scrollY, opSeen: false, whole: false, topSeen: false, bottomSeen: false, tall: false, clipDone: false, clip: null} })
  // Share of the text box that is inside the reading window and clear of the launcher (reported for B items).
  const visFrac = (r, f, lr) => {
    const top = Math.max(r.top, f), bot = Math.min(r.bottom, innerHeight)
    const full = (r.bottom - r.top) * (r.right - r.left); if (bot <= top || full <= 0) return 0
    let a = (bot - top) * (r.right - r.left)
    if (lr) { const ox = Math.max(0, Math.min(r.right, lr.right + 4) - Math.max(r.left, lr.left - 4)), oy = Math.max(0, Math.min(bot, lr.bottom + 4) - Math.max(top, lr.top - 4)); a -= ox * oy }
    return a / full
  }
  const resolved = (x) => x.opSeen && x.clipDone && (x.whole || (x.topSeen && x.bottomSeen && x.tall))
  const evalOne = (x, f, lr) => {
    const r = textRect(x.e); if (!r) return
    if (r.bottom <= 0 || r.top >= innerHeight) return
    if (effOpacity(x.e) < 0.99) return
    x.opSeen = true
    if (!x.clipDone) { x.clip = clipOf(x.e, r); x.clipDone = true }
    // The header is the obstruction itself: its text only has to be on screen, inside the viewport.
    if (x.inHeader) { if (r.top >= -1 && r.bottom <= innerHeight + 1) { x.whole = true } return }
    const ceil = ceilFor(r, lr), win = ceil - f, h = r.bottom - r.top
    x.bestVis = Math.max(x.bestVis, visFrac(r, f, lr))
    if (r.top >= f - 1 && r.bottom <= ceil + 1) x.whole = true
    if (r.top >= f - 1 && r.top < ceil - 2) x.topSeen = true
    if (r.bottom <= ceil + 1 && r.bottom > f + 2) x.bottomSeen = true
    if (h > win - 24) x.tall = true
  }
  const snapshot = (all) => {
    const f = floorNow(), lr = launcherRect()
    for (const x of recs) {
      if (resolved(x)) continue
      if (!all && !x.stuck && (x.docBottom < scrollY - 400 || x.docTop > scrollY + innerHeight + 400)) continue
      evalOne(x, f, lr)
    }
  }
  let overflow = overflowNow(), overflowAt = 0, steps = 0, floorMax = 0
  const maxY = () => Math.max(0, doc.scrollHeight - innerHeight)
  for (let y = 0; steps < 4000; y += STEP, steps++) {
    if (Date.now() > DEADLINE) { aborted = true; break }
    y = Math.min(y, maxY())
    window.scrollTo({top: y, behavior: 'instant'}); await raf(); await sleep(DWELL)
    const o = overflowNow(); if (o > overflow) { overflow = o; overflowAt = Math.round(scrollY) }
    floorMax = Math.max(floorMax, floorNow())
    snapshot(false)
    if (y >= maxY()) break
  }
  const place = async (x, mode) => {
    for (let i = 0; i < 3; i++) {
      const r = textRect(x.e); if (!r) return
      const f = floorNow(), lr = launcherRect(), ceil = ceilFor(r, lr), h = r.bottom - r.top
      const want = mode === 'top' ? f + 4 : mode === 'bottom' ? ceil - 4 - h : f + Math.max(4, (ceil - f - h) / 2)
      const dy = r.top - want
      if (Math.abs(dy) < 1) break
      window.scrollBy({top: dy, behavior: 'instant'}); await raf()
    }
    await sleep(SETTLE)
  }
  const pending = () => recs.filter(x => !resolved(x))
  const phase1Left = pending().length
  let placements = 0
  for (const x of pending()) { if (Date.now() > DEADLINE) { aborted = true; break } if (resolved(x) || placements > 500) continue; placements++; await place(x, 'center'); snapshot(true) }
  for (const mode of ['top', 'bottom']) for (const x of pending()) { if (Date.now() > DEADLINE) { aborted = true; break } if (resolved(x) || !x.opSeen || placements > 500) continue; placements++; await place(x, mode); snapshot(true) }
  const B = [], C = []; let A = 0
  for (const x of recs) {
    const readable = x.whole || (x.topSeen && x.bottomSeen && x.tall)
    const flags = 'whole' + +x.whole + ' top' + +x.topSeen + ' bottom' + +x.bottomSeen + ' tall' + +x.tall
    let bad = false
    if (!x.opSeen) { C.push(label(x.e) + ' [never opacity 1]'); bad = true }
    else {
      if (!readable) { B.push(label(x.e) + ' [' + flags + ', best visible ' + Math.round(x.bestVis * 100) + '%]'); bad = true }
      if (x.clip && x.clip.length) { C.push(label(x.e) + ' [clipped by ' + x.clip.slice(0, 2).join(', ') + ']'); bad = true }
    }
    if (!bad) A++
  }
  return {aborted, mode: modeNow(), total: recs.length, A, B, C, overflow, overflowAt, launcher: !!launcherRect(), steps, phase1Left, placements, floorMax: Math.round(floorMax), innerW: innerWidth, innerH: innerHeight, dpr: devicePixelRatio}
}"""
AUDIT = AUDIT.replace('/*LIB*/', LIB)

# One act at its rest position (GOTO(k) already done): copy under the header or pinned panel, clipped or dim text,
# horizontal overflow, and on desktop the copy column running into the canvas.
STOP = r"""(k) => {
  /*LIB*/
  const blocks = [...stage.querySelectorAll(':scope > .stage__block')]
  const b = blocks[k], copy = b.querySelector('.stage__copy')
  const f = floorNow()
  const under = [], clipped = [], dim = []
  let maxRight = 0
  const els = collect(copy)
  for (const e of els) {
    const r = textRect(e)
    if (r.top < f - 1) under.push(label(e) + ' top ' + Math.round(r.top) + ' < floor ' + Math.round(f))
    const o = effOpacity(e); if (o < 0.99) dim.push(label(e) + ' opacity ' + o.toFixed(2))
    const c = clipOf(e, r); if (c.length) clipped.push(label(e) + ' ' + c[0])
    maxRight = Math.max(maxRight, e.getBoundingClientRect().right)  // the box, as pass4 did: truncated text must not count past its own clip
  }
  let overlap = 0
  if (innerWidth >= 900 && sticky && getComputedStyle(sticky).display !== 'none') {
    const cv = stage.querySelector('.stage__canvas').getBoundingClientRect()
    overlap = Math.max(0, Math.round(maxRight - (cv.left + 40)))
  }
  const cr = copy.getBoundingClientRect()
  return {mode: modeNow(), floor: Math.round(f), n: els.length, under, clipped, dim, overflow: overflowNow(), overlap, copyTop: Math.round(cr.top), copyBottom: Math.round(cr.bottom), belowFold: Math.max(0, Math.round(cr.bottom - innerHeight))}
}"""
STOP = STOP.replace('/*LIB*/', LIB)

FLOOR = '() => {' + LIB + ' return floorNow() }'
GOTO = """(G) => { const s = document.querySelector('.stage'); const bs = [...s.querySelectorAll(':scope > .stage__block')];
  const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
  const k = Math.min(bs.length - 1, Math.floor(G)), b = bs[k];
  window.scrollTo({top: s.getBoundingClientRect().top + scrollY + b.offsetTop + (G - k) * b.offsetHeight - h, behavior: 'instant'}) }"""

# A sampled copy of a canvas (RGBA) for pixel comparison and blank detection.
SAMPLE = """(sel) => { const c = document.querySelector(sel); if (!c) return null; const W = c.width, H = c.height
  if (!W || !H) return {w: W, h: H, n: 0, data: []}
  const d = c.getContext('2d').getImageData(0, 0, W, H).data; const sx = Math.max(1, Math.floor(W / 200)), sy = Math.max(1, Math.floor(H / 120)); const out = []
  for (let y = 0; y < H; y += sy) for (let x = 0; x < W; x += sx) { const i = (y * W + x) * 4; out.push(d[i], d[i + 1], d[i + 2], d[i + 3]) }
  return {w: W, h: H, n: out.length / 4, data: out} }"""


def arr(s):
    return np.array(s['data'], dtype=np.int16).reshape(-1, 4) if s and s['data'] else np.zeros((0, 4), dtype=np.int16)


def sample(page, sel):
    return page.evaluate(SAMPLE, sel)


def mean_diff(a, b):
    x, y = arr(a), arr(b)
    if x.shape != y.shape or not len(x):
        return None
    return float(np.abs(x - y).mean())


def blank_stats(s):
    a = arr(s)
    if not len(a):
        return {'n': 0, 'opaque': 0.0, 'colours': 0, 'blank': True}
    opaque = float((a[:, 3] > 0).mean())
    colours = len({(int(r) >> 3, int(g) >> 3, int(b) >> 3, int(al) >> 5) for r, g, b, al in a[:: max(1, len(a) // 4000)]})
    return {'n': len(a), 'opaque': round(opaque, 3), 'colours': colours, 'blank': opaque < 0.005 or colours < 4}


# ---------------------------------------------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------------------------------------------
def new_ctx(browser, w, h, mobile, dpr=2, **kw):
    return browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=dpr, is_mobile=mobile, has_touch=mobile, **kw)


def boot(page, path='/', wait=1000):
    page.goto(BASE + path, wait_until='networkidle')
    try:
        page.locator('[data-testid="guide-launcher"]').wait_for(state='visible', timeout=8000)
    except Exception:
        pass
    page.wait_for_timeout(wait)


def set_fonts(ctx, page, scale):
    ctx.new_cdp_session(page).send('Page.setFontSizes', {'fontSizes': {'standard': round(16 * scale / 100), 'fixed': round(13 * scale / 100)}})


def goto_act(page, g, wait=500):
    page.evaluate(GOTO, g)
    page.wait_for_timeout(wait)


def audit_verdict(name, res, min_total=25):
    """One A/B/C/D line for a full-page audit result."""
    B, C, D = res['B'], res['C'], res['overflow']
    detail = (f"mode {res['mode']}; {res['innerW']}x{res['innerH']} css px; {res['total']} text elements; A={res['A']} B={len(B)} C={len(C)} D={D}px"
              f"{' at scrollY ' + str(res['overflowAt']) if D > 0 else ''}; launcher {'present' if res['launcher'] else 'NOT mounted'}; phase-2 placements {res['placements']}")
    if B:
        detail += f"; B {trunc(B)}"
    if C:
        detail += f"; C {trunc(C)}"
    if res.get('aborted'):
        verdict(name, None, f"the audit hit its 300 s deadline before finishing; {detail}")
    elif res['total'] < min_total:
        verdict(name, None, f"only {res['total']} text elements measured, page not rendered as expected; {detail}")
    elif res['placements'] >= 500 and (B or C):
        verdict(name, None, f"phase-2 placement cap (500) reached, so the B/C list may be incomplete; {detail}")
    else:
        verdict(name, not B and not C and D <= 0, detail)


def stop_problems(stops):
    bad = []
    for s in stops:
        tag = f"G{s['G']}{s['dir']}"
        for key in ('under', 'clipped', 'dim'):
            for item in s[key]:
                bad.append(f'{tag} {key}: {item}')
        if s['overflow'] > 0:
            bad.append(f"{tag} overflow {s['overflow']}px")
        if s['overlap'] > 0:
            bad.append(f"{tag} copy over canvas {s['overlap']}px")
    return bad


def cdp_shooter(ctx, page):
    """Screenshots under real browser zoom: Playwright's own page.screenshot returns a blank frame there (measured), so
    this asks the browser compositor directly. Returns a function(path)."""
    import base64
    cdp = ctx.new_cdp_session(page)

    def shoot(path):
        r = cdp.send('Page.captureScreenshot', {'format': 'png', 'fromSurface': True})
        Path(path).write_bytes(base64.b64decode(r['data']))
    return shoot


def merge_stop(a, b):
    for key in ('under', 'clipped', 'dim'):
        a[key] = a[key] + [x for x in b[key] if x not in a[key]]
    a['overflow'] = max(a['overflow'], b['overflow'])
    a['overlap'] = max(a['overlap'], b['overlap'])
    return a


def run_stops(page, order, shot_prefix=None, shoot=None):
    out = []
    for direction, gs in order:
        for g in gs:
            goto_act(page, g)
            if g == 5:  # the live log rolls new rows (new subjects, longer text): sample it twice
                page.wait_for_timeout(1500)
            r = page.evaluate(STOP, g)
            if g == 5:
                page.wait_for_timeout(2500)
                r = merge_stop(r, page.evaluate(STOP, g))
            r['G'], r['dir'] = g, direction
            out.append(r)
            if shot_prefix and direction == 'down':
                page.evaluate('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))')
                (shoot or (lambda path: page.screenshot(path=path)))(str(OUT / f'{shot_prefix}-act{g}.png'))
    return out


def asymmetry(stops):
    down = {s['G']: s for s in stops if s['dir'] == 'down'}
    bad = []
    for s in stops:
        if s['dir'] != 'up' or s['G'] not in down:
            continue
        d = down[s['G']]
        if d['mode'] != s['mode'] or abs(d['copyTop'] - s['copyTop']) > 2 or d['n'] != s['n']:
            bad.append(f"G{s['G']}: down {d['mode']} top {d['copyTop']} n {d['n']} vs up {s['mode']} top {s['copyTop']} n {s['n']}")
    return bad


# ---------------------------------------------------------------------------------------------------------------
# Real browser zoom
# ---------------------------------------------------------------------------------------------------------------
MODES = {
    'headless-new': dict(headless=True, channel='chromium'),
    'headless-shell': dict(headless=True),
    'headed': dict(headless=False),
}


@contextmanager
def chrome_ctx(p, win, zoom, mode):
    d = tempfile.mkdtemp(prefix='p5-zoom-')
    try:
        if zoom:
            (Path(d) / 'Default').mkdir(parents=True)
            (Path(d) / 'Default' / 'Preferences').write_text(json.dumps({'partition': {'default_zoom_level': {'x': ZOOM_LEVEL}}}))
        ctx = p.chromium.launch_persistent_context(user_data_dir=d, no_viewport=True, args=[f'--window-size={win[0]},{win[1]}'], **MODES[mode])
        try:
            page = ctx.pages[0] if ctx.pages else ctx.new_page()
            yield ctx, page
        finally:
            ctx.close()
    finally:
        shutil.rmtree(d, ignore_errors=True)


ENV = "({dpr: devicePixelRatio, iw: innerWidth, ih: innerHeight, ow: outerWidth, oh: outerHeight})"


def find_real_zoom(p, win):
    """Launches with and without the zoom preference in each mode until the zoom is demonstrably real."""
    tried = []
    for mode in MODES:
        try:
            with chrome_ctx(p, win, False, mode) as (ctx, page):
                page.goto(BASE + '/', wait_until='domcontentloaded')
                base = page.evaluate(ENV)
            with chrome_ctx(p, win, True, mode) as (ctx, page):
                page.goto(BASE + '/', wait_until='domcontentloaded')
                zoomed = page.evaluate(ENV)
        except Exception as e:
            tried.append(f'{mode}: launch failed {str(e)[:120]}')
            continue
        ok = abs(zoomed['dpr'] / base['dpr'] - 2) < 0.02 and abs(zoomed['iw'] * 2 - base['iw']) <= 6
        tried.append(f"{mode}: dpr {base['dpr']} -> {zoomed['dpr']}, innerWidth {base['iw']} -> {zoomed['iw']}")
        if ok:
            return {'mode': mode, 'base': base, 'zoom': zoomed, 'tried': tried}
    return {'mode': None, 'tried': tried}


# ---------------------------------------------------------------------------------------------------------------
# Check 1: real zoom 200%
# ---------------------------------------------------------------------------------------------------------------
def check1(p):
    for win in ((1440, 900), (1280, 800)):
        tag = f'{win[0]}x{win[1]} window'
        proof = find_real_zoom(p, win)
        if not proof['mode']:
            verdict(f'1 real browser zoom 200% ({tag}): zoom is real (dpr x2, innerWidth x0.5)', None, 'the zoom preference was not applied in any launch mode: ' + ' | '.join(proof['tried']))
            continue
        b, z = proof['base'], proof['zoom']
        verdict(f'1 real browser zoom 200% ({tag}): zoom is real (dpr x2, innerWidth x0.5)', True,
                f"mode {proof['mode']}; unzoomed dpr {b['dpr']}, innerWidth {b['iw']}x{b['ih']}; zoomed dpr {z['dpr']}, innerWidth {z['iw']}x{z['ih']} (ratio dpr {z['dpr'] / b['dpr']:.3f}, innerWidth {z['iw'] / b['iw']:.3f}); outer {z['ow']}x{z['oh']}; zoom level {ZOOM_LEVEL!r}")
        prefix = f'zoom200-{win[0]}'
        with chrome_ctx(p, win, True, proof['mode']) as (ctx, page):
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            shoot = cdp_shooter(ctx, page)
            boot(page, '/')
            res = page.evaluate(AUDIT, {})
            audit_verdict(f'1 zoom200 {tag}: home page (acts 1-7 and the rest), categories B/C/D', res)
            stops = run_stops(page, [('down', range(7))], shot_prefix=prefix, shoot=shoot)
            bad = stop_problems(stops)
            blank = []
            if stops[0]['mode'].startswith('flow'):
                blank = [i for i in range(6) if blank_stats(sample(page, f'canvas[data-still="{i}"]'))['blank']]
            verdict(f'1 zoom200 {tag}: acts 1-7 at rest (G 0..6): no copy under the header or panel, nothing clipped or dim, no overflow, stills drawn', not bad and not blank and all(s['n'] > 0 for s in stops),
                    f"mode {stops[0]['mode']}; text per act {[s['n'] for s in stops]}; below the fold at rest (ordinary) {[s['belowFold'] for s in stops]}; problems {trunc(bad)}; blank stills {blank}; pageerrors {errors[:2]}")
        with chrome_ctx(p, win, True, proof['mode']) as (ctx, page):
            shoot = cdp_shooter(ctx, page)
            for path in ('/start/', '/work/'):
                boot(page, path)
                res = page.evaluate(AUDIT, {})
                audit_verdict(f'1 zoom200 {tag}: {path}, categories B/C/D', res, min_total=10)
                page.evaluate('window.scrollTo(0, 0)')
                page.wait_for_timeout(300)
                shoot(str(OUT / f'{prefix}-{path.strip("/")}-top.png'))


# ---------------------------------------------------------------------------------------------------------------
# Check 2: computed text size under the three mechanisms
# ---------------------------------------------------------------------------------------------------------------
SIZES = """() => {
  const fs = (e) => e ? parseFloat(getComputedStyle(e).fontSize) : null
  const out = {'#hero-title': fs(document.querySelector('#hero-title'))}
  ;[...document.querySelectorAll('.stage__copy')].forEach((c, i) => { out['copy ' + (i + 1) + ' first p'] = fs(c.querySelector('p')) })
  out['.btn (first in main)'] = fs(document.querySelector('main .btn'))
  out['footer link'] = fs(document.querySelector('footer a'))
  const l = document.querySelector('[data-testid="guide-launcher"]')
  out['guide launcher label'] = l && l.innerText.trim() ? fs(l) : null
  const hv = document.querySelector('.guide__hover, .guide__caption')
  out['guide hover/caption label'] = hv ? fs(hv) : null
  return out }"""
REQUIRED = ['#hero-title'] + [f'copy {i} first p' for i in range(1, 8)] + ['.btn (first in main)', 'footer link']


def sizes_table(title, cols, data):
    rows = list(data[cols[0]].keys())
    info(f'{title}: computed font-size in css px')
    wd = max(10, *(len(str(c)) + 2 for c in cols))
    info('  ' + 'element'.ljust(28) + ''.join(str(c).rjust(wd) for c in cols))
    for r in rows:
        info('  ' + r.ljust(28) + ''.join((f'{data[c][r]:.1f}' if data[c][r] is not None else 'n/a').rjust(wd) for c in cols))


def check2(p):
    browser = p.chromium.launch()
    for (w, h) in ((375, 667), (390, 844)):
        data = {}
        for scale in (100, 130, 200):
            ctx = new_ctx(browser, w, h, True)
            page = ctx.new_page()
            set_fonts(ctx, page, scale)
            boot(page, '/', wait=800)
            data[scale] = page.evaluate(SIZES)
            ctx.close()
        sizes_table(f'2 {w}x{h} Page.setFontSizes standard 16*s / fixed 13*s', [100, 130, 200], data)
        missing = [r for r in REQUIRED if any(data[s][r] is None for s in data)]
        flat = [r for r in data[100] if data[100][r] is not None and not (data[100][r] < data[130][r] < data[200][r])]
        if missing:
            verdict(f'2 {w}x{h} text size grows with the font-size setting (100/130/200)', None, f'elements not found: {missing}')
        else:
            verdict(f'2 {w}x{h} text size grows with the font-size setting (100/130/200)', not flat,
                    'every measured text element grows' if not flat else 'did not increase: ' + '; '.join(f'{r} {data[100][r]}/{data[130][r]}/{data[200][r]}' for r in flat))
    browser.close()
    # Real 200% zoom: css px stay put by definition, so the comparison is rendered size (css px x zoom factor).
    win = (1440, 900)
    proof = find_real_zoom(p, win)
    if not proof['mode']:
        verdict('2 real 200% zoom: text renders larger than at 100%', None, 'zoom not applied: ' + ' | '.join(proof['tried']))
        return
    with chrome_ctx(p, win, False, proof['mode']) as (ctx, page):
        boot(page, '/', wait=800)
        base = page.evaluate(SIZES)
    with chrome_ctx(p, win, True, proof['mode']) as (ctx, page):
        boot(page, '/', wait=800)
        zoomed = page.evaluate(SIZES)
    zf = proof['zoom']['dpr'] / proof['base']['dpr']
    rendered = {'100%': base, '200% css px': zoomed, '200% rendered': {k: (v * zf if v is not None else None) for k, v in zoomed.items()}}
    sizes_table(f'2 real zoom, {win[0]}x{win[1]} window (rendered = css px x {zf:.2f})', ['100%', '200% css px', '200% rendered'], rendered)
    missing = [r for r in REQUIRED if base[r] is None or zoomed[r] is None]
    flat = [r for r in base if base[r] is not None and zoomed[r] is not None and not (zoomed[r] * zf > base[r])]
    ratios = {r: round(zoomed[r] * zf / base[r], 2) for r in base if base[r] and zoomed[r]}
    if missing:
        verdict('2 real 200% zoom: text renders larger than at 100%', None, f'elements not found: {missing}')
    else:
        verdict('2 real 200% zoom: text renders larger than at 100%', not flat, f'rendered-size ratio by element {ratios}' if not flat else 'not larger: ' + trunc(flat))


# ---------------------------------------------------------------------------------------------------------------
# Check 3: A/B/C/D at six text sizes, down and back up
# ---------------------------------------------------------------------------------------------------------------
def check3(p):
    browser = p.chromium.launch()
    cases = [(w, h, True, s) for (w, h) in ((320, 568), (375, 667), (390, 844)) for s in (100, 115, 130, 150, 175, 200)]
    cases += [(1440, 900, False, s) for s in (100, 200)]
    for (w, h, mobile, scale) in cases:
        name = f'{w}x{h} text {scale}%'
        ctx = new_ctx(browser, w, h, mobile)
        page = ctx.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        print(f'  .. {name}: start', flush=True)
        set_fonts(ctx, page, scale)
        boot(page, '/')
        print(f'  .. {name}: booted, auditing', flush=True)
        res = page.evaluate(AUDIT, {})
        audit_verdict(f'3 {name}: categories A/B/C/D, full scroll', res)
        print(f'  .. {name}: audit done, stops', flush=True)
        order = [('down', range(7)), ('up', range(6, -1, -1))]
        stops = run_stops(page, order)
        bad, asym = stop_problems(stops), asymmetry(stops)
        modes = sorted({s['mode'] for s in stops})
        verdict(f'3 {name}: each stop G 0..6 down then 6..0 up: copy clear of header and panel, nothing clipped or dim, no overflow, same both ways', not bad and not asym and all(s['n'] > 0 for s in stops) and not errors,
                f"mode {modes}; below the fold at rest (ordinary) {[s['belowFold'] for s in stops if s['dir'] == 'down']}; problems {trunc(bad)}; direction asymmetry {trunc(asym)}; pageerrors {errors[:2]}")
        if (w, h, scale) == (375, 667, 130):
            goto_act(page, 4)
            page.screenshot(path=str(OUT / 'text-375x667-130-act4.png'))
            detail = f"{'flow' if res['mode'].startswith('flow') else res['mode']} mode (stage data-flow {'set' if res['mode'].startswith('flow') else 'not set'}); A={res['A']} B={len(res['B'])} C={len(res['C'])} D={res['overflow']}px; rest-position problems {trunc(bad)}; asymmetry {trunc(asym)}; B {trunc(res['B'])}; C {trunc(res['C'])}"
            verdict('3 EXPLICIT 375x667 @130%: A/B/C/D and every stop', not res['B'] and not res['C'] and res['overflow'] <= 0 and not bad and not asym, detail)
        ctx.close()
    browser.close()


# ---------------------------------------------------------------------------------------------------------------
# Check 4: JavaScript disabled
# ---------------------------------------------------------------------------------------------------------------
NOJS = r"""() => {
  /*LIB*/
  const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' }
  const copies = [...document.querySelectorAll('.stage__copy')].map((c, i) => { const r = c.getBoundingClientRect(); const cs = getComputedStyle(c)
    return {i, display: cs.display, visibility: cs.visibility, op: +effOpacity(c).toFixed(2), top: Math.round(r.top + scrollY), bottom: Math.round(r.bottom + scrollY), h: Math.round(r.height), text: c.innerText.trim().slice(0, 30)} })
  const stills = [...document.querySelectorAll('canvas[data-still]')].map(c => { const r = c.getBoundingClientRect(); return {i: +c.dataset.still, display: getComputedStyle(c).display, w: Math.round(r.width), h: Math.round(r.height)} })
  const imgs = [...document.querySelectorAll('.stage img')].map(i => { const r = i.getBoundingClientRect(); return {cls: i.className, display: getComputedStyle(i).display, w: Math.round(r.width), h: Math.round(r.height), natural: i.naturalWidth, act: (i.closest('.stage__block') || {}).id} })
  const reveal = [...document.querySelectorAll('[data-reveal]')].map(e => effOpacity(e))
  const headerItems = [...document.querySelectorAll('.site-header a, .site-header button')].filter(vis).map(e => ({tag: e.tagName.toLowerCase(), text: (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 30), href: e.getAttribute('href')}))
  const primary = document.querySelector('nav[aria-label="Primary"]')
  const primaryItems = primary ? [...primary.querySelectorAll('a, button')].map(e => ({tag: e.tagName.toLowerCase(), text: (e.innerText || '').trim(), href: e.getAttribute('href'), rendered: vis(e)})) : []
  const hrefs = new Set([...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')))
  return {jsClass: doc.classList.contains('js'), copies, stills, imgs, revealMin: reveal.length ? Math.min(...reveal) : null, revealN: reveal.length, headerItems, primaryItems,
    servicesLinked: hrefs.has('/services/'), overflow: overflowNow(), innerW: innerWidth}
}""".replace('/*LIB*/', LIB)


def check4(p):
    browser = p.chromium.launch()
    for (w, h, mobile) in ((390, 844, True), (1440, 900, False)):
        t = f'{w}x{h} JS off'
        ctx = new_ctx(browser, w, h, mobile, dpr=1, java_script_enabled=False)
        page = ctx.new_page()
        page.goto(BASE + '/', wait_until='load')
        page.wait_for_timeout(500)
        r = page.evaluate(NOJS)
        page.screenshot(path=str(OUT / f'nojs-{w}-home-full.png'), full_page=True)
        cps = r['copies']
        order_bad = [f"copy {a['i']} bottom {a['bottom']} > copy {b['i']} top {b['top']}" for a, b in zip(cps, cps[1:]) if b['top'] < a['bottom'] - 1]
        hidden = [c['i'] for c in cps if c['display'] == 'none' or c['visibility'] == 'hidden' or c['op'] < 0.99 or c['h'] < 10]
        ok = len(cps) == 7 and not r['jsClass'] and not hidden and not order_bad and (r['revealMin'] is None or r['revealMin'] >= 0.99)
        verdict(f'4 {t}: all 7 .stage__copy visible (opacity 1, displayed) in reading order', ok if not r['jsClass'] else None,
                f"js class present {r['jsClass']}; copies {len(cps)}; not visible {hidden}; overlap/out of order {order_bad}; data-reveal elements {r['revealN']} min opacity {r['revealMin']}")
        blank = []
        for s in r['stills']:
            blank.append(s['i'] if (s['display'] == 'none' or not s['w'] or not s['h']) else None)
        blank = [b for b in blank if b is not None]
        shown_imgs = [i for i in r['imgs'] if i['display'] != 'none' and i['w'] > 0]
        info(f"4 {t}: still canvases {len(r['stills'])}, blank or not rendered {len(blank)} (display none: no script runs to draw them); images displayed in the acts {[(i['act'], i['cls'], str(i['w']) + 'x' + str(i['h'])) for i in shown_imgs]}; acts with visual content {sorted({i['act'] for i in shown_imgs})} of {[c['i'] + 1 for c in cps]}")
        verdict(f'4 {t}: no horizontal overflow', r['overflow'] <= 0, f"scrollWidth - clientWidth = {r['overflow']} at {r['innerW']} px")
        dead = [i for i in r['headerItems'] if i['tag'] == 'button']
        nohref = [i for i in r['primaryItems'] if i['rendered'] and not i['href']]
        links = [f"{i['text'] or '(icon)'}->{i['href']}" for i in r['headerItems'] if i['tag'] == 'a']
        verdict(f'4 {t}: header navigation works without script (every rendered nav item is a link with an href)', not dead and not nohref,
                f"rendered header links {links}; dead controls (buttons that need script) {[d['text'] for d in dead]}; primary nav items without href {[i['text'] for i in nohref]}; /services/ linked elsewhere on the page {r['servicesLinked']}")
        ctx.close()
        # /start/
        ctx = new_ctx(browser, w, h, mobile, dpr=1, java_script_enabled=False)
        page = ctx.new_page()
        page.goto(BASE + '/start/', wait_until='load')
        page.wait_for_timeout(400)
        mail = page.evaluate("""() => [...document.querySelectorAll('a[href^="mailto:"]')].map(a => { const r = a.getBoundingClientRect(); const cs = getComputedStyle(a); return {href: a.getAttribute('href'), text: a.innerText.trim(), shown: r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden', inMain: !!a.closest('main')} })""")
        action = page.evaluate("[...document.querySelectorAll('form')].map(f => f.getAttribute('action'))")
        seen = page.evaluate("document.querySelector('main').innerText.replace(/\\s+/g, ' ').trim().slice(0, 240)")
        page.screenshot(path=str(OUT / f'nojs-{w}-start.png'), full_page=True)
        # Does the form itself do anything? Pick a chip and press Continue.
        try:
            page.get_by_label('A slow manual process').check(timeout=2000)
            page.get_by_role('button', name='Continue').click(timeout=2000)
            page.wait_for_timeout(600)
            after = page.evaluate("({url: location.href, step: (document.querySelector('.t-mono') || {}).innerText, h: (document.querySelector('#inq-heading') || {}).innerText})")
        except Exception as e:
            after = {'error': str(e)[:120]}
        good = [m for m in mail if m['shown'] and m['href'].lower() == 'mailto:masoud.masoori@mas-ai.co']
        real_action = [a for a in action if a and a.strip() and a.strip() != '#']
        verdict(f'4 {t}: /start/ has a working no-script path (visible mailto link or a real form action)', bool(good or real_action),
                f"visible mailto links {[m['text'] for m in good]}; form actions {action}; Continue with script off leaves the form at {after}; a visitor sees: {seen!r}")
        ctx.close()
    browser.close()


# ---------------------------------------------------------------------------------------------------------------
# Check 5: every built route, loaded directly
# ---------------------------------------------------------------------------------------------------------------
def routes():
    out = ROOT / 'out'
    paths = []
    for f in sorted(out.rglob('index.html')):
        rel = f.relative_to(out).parent.as_posix()
        paths.append('/' if rel == '.' else f'/{rel}/')
    paths.append('/investors.html')
    return paths


def check5(p):
    paths = routes()
    browser = p.chromium.launch()
    ctx = new_ctx(browser, 1280, 800, False, dpr=1)
    page = ctx.new_page()
    errs, cons, badres = [], [], []
    page.on('pageerror', lambda e: errs.append(str(e)[:160]))
    page.on('console', lambda m: cons.append(m.text[:160]) if m.type == 'error' else None)
    page.on('response', lambda r: badres.append(f'{r.status} {urlparse(r.url).path}') if r.status >= 400 and r.request.resource_type != 'document' else None)
    rows = []
    for path in paths:
        errs.clear()
        cons.clear()
        badres.clear()
        try:
            resp = page.goto(BASE + path, wait_until='networkidle')
            page.keyboard.press('Shift')  # arms the lazy guide so its chunk loads inside the window
            page.wait_for_timeout(1400)
            status = resp.status if resp else None
            h1 = page.evaluate("document.querySelectorAll('h1').length")
            title = page.evaluate("(document.querySelector('h1') || {}).innerText || ''")
            rows.append({'path': path, 'status': status, 'h1': h1, 'h1text': title[:40], 'pageerror': list(errs), 'console': list(cons), 'failed_resources': list(badres)})
        except Exception as e:
            rows.append({'path': path, 'status': None, 'h1': -1, 'h1text': '', 'pageerror': [f'goto failed: {str(e)[:120]}'], 'console': [], 'failed_resources': []})
    ctx.close()
    browser.close()
    n = len(rows)
    (OUT / 'routes.json').write_text(json.dumps(rows, indent=1), encoding='utf-8')
    s_bad = [f"{r['path']}={r['status']}" for r in rows if r['status'] != 200]
    h_bad = [f"{r['path']} h1={r['h1']}" for r in rows if r['h1'] != 1]
    e_bad = [f"{r['path']}: {(r['pageerror'] + r['console'])[0]} (failed resources {r['failed_resources']})" for r in rows if r['pageerror'] or r['console']]
    clean = [r for r in rows if r['status'] == 200 and r['h1'] == 1 and not r['pageerror'] and not r['console']]
    verdict(f'5 direct loads: HTTP 200 ({n - len(s_bad)}/{n})', not s_bad, f'not 200: {trunc(s_bad, 10)}')
    verdict(f'5 direct loads: exactly one h1 ({n - len(h_bad)}/{n})', not h_bad, f'0 or >1 h1: {trunc(h_bad, 10)}')
    verdict(f'5 direct loads: no pageerror and no console error ({n - len(e_bad)}/{n})', not e_bad, f'with errors: {trunc(e_bad, 6)}')
    verdict(f'5 direct loads: pages fully clean {len(clean)}/{n}', len(clean) == n, f'{n} routes from out/**/index.html plus /investors.html')


# ---------------------------------------------------------------------------------------------------------------
# Check 6: navigation history
# ---------------------------------------------------------------------------------------------------------------
def deploy_hashes(page, sel):
    """Local, Hybrid, Local again, plus an idle frame pair: the mode change must exceed what the animation does alone."""
    page.wait_for_timeout(400)
    a = sample(page, sel)
    page.wait_for_timeout(450)
    a2 = sample(page, sel)
    page.get_by_role('button', name='Local', exact=True).click()
    page.wait_for_timeout(550)
    s1 = sample(page, sel)
    page.get_by_role('button', name='Hybrid', exact=True).click()
    page.wait_for_timeout(550)
    s2 = sample(page, sel)
    page.get_by_role('button', name='Local', exact=True).click()
    page.wait_for_timeout(550)
    s3 = sample(page, sel)
    return {'idle': mean_diff(a, a2), 'local_vs_hybrid': mean_diff(s1, s2), 'local_vs_local': mean_diff(s1, s3)}


def deploy_ok(d):
    if None in d.values():
        return None
    return d['local_vs_hybrid'] >= 0.25 and d['local_vs_hybrid'] > 3 * max(d['idle'], d['local_vs_local'], 0.02)


def fmt_d(d):
    return ', '.join(f'{k} {v:.3f}' if v is not None else f'{k} n/a' for k, v in d.items())


def deploy_in_window(page):
    """GOTO around act 5 until both mode buttons sit in the reading window."""
    floor = page.evaluate(FLOOR)
    ih = page.evaluate('innerHeight')
    for g in (4.0, 3.9, 4.1, 3.8, 4.2, 3.7, 4.3, 3.6, 4.4, 3.5, 4.5):
        goto_act(page, g, wait=450)
        ok = True
        for name in ('Local', 'Hybrid'):
            box = page.get_by_role('button', name=name, exact=True).bounding_box()
            if not box or box['y'] < floor + 2 or box['y'] + box['height'] > ih - 2:
                ok = False
        if ok:
            return g
    return None


def live_canvas(page):
    flow = page.evaluate("document.querySelector('.stage').hasAttribute('data-flow')")
    return ('canvas[data-still="4"]' if flow else '.stage__canvas'), flow


def check6(p):
    browser = p.chromium.launch()
    ctx = new_ctx(browser, 1440, 900, False, dpr=1)
    page = ctx.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)[:160]))
    boot(page, '/')
    page.evaluate('window.__p5 = 424242')
    page.get_by_role('navigation', name='Primary').get_by_role('link', name='Work', exact=True).click()
    page.wait_for_url('**/work/', timeout=10000)
    page.wait_for_selector('h1', timeout=8000)
    page.wait_for_timeout(800)
    work_h1 = page.evaluate("document.querySelector('h1').innerText")
    marker = page.evaluate('window.__p5')
    verdict('6 header link Work is a client-side navigation (page state survives)', marker == 424242 and work_h1.strip() != '' if marker == 424242 else None,
            f"marker {marker}; url {page.url}; /work/ h1 {work_h1!r}" + ('' if marker == 424242 else '; the click did a full page load, so the history checks below run against a fresh document'))
    page.go_back()
    page.wait_for_selector('#hero-title', timeout=8000)
    page.wait_for_timeout(1500)
    back_marker = page.evaluate('window.__p5')
    live = blank_stats(sample(page, '.stage__canvas'))
    verdict('6 after go_back the stage canvas is drawn again', not live['blank'] and page.url.rstrip('/') == BASE, f"url {page.url}; canvas samples {live}; marker {back_marker}")
    g = deploy_in_window(page)
    if g is None:
        verdict('6 after go_back: GOTO(4) and a deploy mode click change the canvas', None, 'Local and Hybrid never sat in the reading window together')
    else:
        sel, flow = live_canvas(page)
        d = deploy_hashes(page, sel)
        verdict('6 after go_back: GOTO(4) and a deploy mode click change the canvas', deploy_ok(d), f"G {g}; {'flow still' if flow else 'pinned canvas'}; mean abs diff: {fmt_d(d)} (need local_vs_hybrid >= 0.25 and > 3x idle and local_vs_local)")
    page.screenshot(path=str(OUT / 'history-after-back.png'))
    verdict('6 after go_back: no page errors', not errors, f'{errors[:3]}')
    page.go_forward()
    page.wait_for_url('**/work/', timeout=8000)
    page.wait_for_selector('h1', timeout=8000)
    page.wait_for_timeout(800)
    fwd_h1 = page.evaluate("document.querySelector('h1').innerText")
    verdict('6 go_forward renders the /work/ h1', fwd_h1 == work_h1 and fwd_h1.strip() != '' and '/work/' in page.url, f"url {page.url}; h1 {fwd_h1!r} vs first visit {work_h1!r}; pageerrors {errors[:2]}")
    page.screenshot(path=str(OUT / 'history-after-forward.png'))
    ctx.close()
    # In-page anchors, direct load. Every stage block id; report the act-5 (deploy) numbers for each viewport.
    for (w, h, mobile) in ((1440, 900, False), (390, 844, True)):
        ctx = new_ctx(browser, w, h, mobile, dpr=2)
        page = ctx.new_page()
        perr = []
        page.on('pageerror', lambda e: perr.append(str(e)[:160]))
        bad, lines = [], []
        for anchor in ('hero', 'gap', 'decision', 'build', 'deploy', 'runs', 'daena'):
            page.goto(f'{BASE}/#{anchor}', wait_until='networkidle')
            page.wait_for_timeout(1800)
            r = page.evaluate("""(id) => { const b = document.getElementById(id); const s = document.querySelector('.stage'); const st = s.querySelector(':scope > .stage__sticky'); const hd = document.querySelector('.site-header').getBoundingClientRect().bottom
              const hh = b.querySelector('h1, h2, .stage__eyebrow'); const r = hh.getBoundingClientRect(); const sr = st.getBoundingClientRect(); const cs = getComputedStyle(st)
              const floor = (!s.hasAttribute('data-flow') && innerWidth < 900 && cs.display !== 'none') ? Math.max(hd, sr.bottom + 28) : hd
              return {scrollY: Math.round(scrollY), blockTop: Math.round(b.getBoundingClientRect().top), headingTop: Math.round(r.top), headingBottom: Math.round(r.bottom), floor: Math.round(floor), flow: s.hasAttribute('data-flow'), stickyDisplay: cs.display, stickyTop: Math.round(sr.top), stickyH: Math.round(sr.height), header: Math.round(hd), ih: innerHeight} }""", anchor)
            st = blank_stats(sample(page, 'canvas[data-still="%d"]' % min(5, ['hero', 'gap', 'decision', 'build', 'deploy', 'runs', 'daena'].index(anchor)) if r['flow'] else '.stage__canvas'))
            if anchor == 'deploy':
                page.screenshot(path=str(OUT / f'anchor-deploy-{w}.png'))
            problems = []
            if r['scrollY'] <= 0 and anchor != 'hero':
                problems.append('did not scroll')
            if r['headingTop'] < r['floor'] - 1:
                problems.append(f"heading top {r['headingTop']} under floor {r['floor']}")
            if r['headingBottom'] > r['ih']:
                problems.append('heading below the fold')
            if st['blank'] and anchor != 'daena':
                problems.append(f'canvas blank {st}')
            lines.append(f"#{anchor}: scrollY {r['scrollY']}, block top {r['blockTop']}, heading {r['headingTop']}..{r['headingBottom']}, floor {r['floor']}, {'flow' if r['flow'] else 'pinned (sticky display ' + r['stickyDisplay'] + ', top ' + str(r['stickyTop']) + ', h ' + str(r['stickyH']) + ')'}")
            if problems:
                bad.append(f'#{anchor}: ' + ', '.join(problems))
        verdict(f'6 {w}x{h} direct load of each in-page anchor: scrolls there, heading not under the header or panel, canvas drawn', not bad and not perr, f"problems {trunc(bad)}; pageerrors {perr[:2]}; {' | '.join(lines)}")
        ctx.close()
    browser.close()


# ---------------------------------------------------------------------------------------------------------------
# Check 7: inquiry form under mocked responses
# ---------------------------------------------------------------------------------------------------------------
FORM_HOST = 'formsubmit.co'
ENDPOINT = 'https://formsubmit.co/ajax/masoud.masoori@mas-ai.co'
CORS = {'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST, OPTIONS'}
MOCKS = {
    'a 200 success true': dict(kind='fulfill', status=200, body='{"success":"true","message":"ok"}', ctype='application/json'),
    'b network failure': dict(kind='abort'),
    'c 500 html body': dict(kind='fulfill', status=500, body='<html><body><h1>Internal Server Error</h1></body></html>', ctype='text/html'),
    'd 200 success false': dict(kind='fulfill', status=200, body='{"success":"false","message":"x"}', ctype='application/json'),
    'e 200 not json': dict(kind='fulfill', status=200, body='OK, thanks', ctype='text/plain'),
}
EXPECT_MSG = {
    'b network failure': 'We could not reach the form service. Check your connection, then try again.',
    'c 500 html body': 'The form service returned an error (status 500), so your message was not delivered.',
    'd 200 success false': 'The form service did not accept the message, so it was not delivered.',
    'e 200 not json': 'The form service replied in a way we could not read. We cannot confirm your message arrived, so please email it instead of retrying.',
}
DATA = {'name': 'QA Test', 'email': 'qa@example.test', 'phone': '555 0100', 'company': 'QA Co', 'size': '5 people'}


def fill_inquiry(page):
    page.get_by_label('A slow manual process').check()
    page.get_by_role('button', name='Continue').click()
    page.locator('#inq-today').fill(NEED_TEXT)
    page.get_by_label('Email', exact=True).check()
    page.get_by_label('CRM', exact=True).check()
    page.get_by_role('button', name='Continue').click()
    page.get_by_label('On our own servers or devices').check()
    page.get_by_label('Within 3 months').check()
    page.locator('#inq-company').fill(DATA['company'])
    page.locator('#inq-size').fill(DATA['size'])
    page.get_by_role('button', name='Continue').click()
    page.locator('#inq-name').fill(DATA['name'])
    page.locator('#inq-email').fill(DATA['email'])
    page.locator('#inq-phone').fill(DATA['phone'])


def run_mock(browser, key, delay_ms=0, double=False):
    cfg = MOCKS[key]
    ctx = new_ctx(browser, 1280, 900, False, dpr=1)
    posts, other_hosts, preflights = [], [], []

    def handler(route):
        req = route.request
        host = urlparse(req.url).hostname or ''
        if host in ('localhost', '127.0.0.1'):
            return route.continue_()
        if host == FORM_HOST:
            if req.method == 'OPTIONS':
                preflights.append(req.url)
                return route.fulfill(status=204, headers=CORS)
            if req.method == 'POST':
                posts.append({'url': req.url, 'body': req.post_data})
                if delay_ms:
                    page.wait_for_timeout(delay_ms)
                if cfg['kind'] == 'abort':
                    return route.abort()
                return route.fulfill(status=cfg['status'], headers=CORS, content_type=cfg['ctype'], body=cfg['body'])
        other_hosts.append(f'{req.method} {host}')
        return route.abort()

    ctx.route('**/*', handler)
    page = ctx.new_page()
    perr = []
    page.on('pageerror', lambda e: perr.append(str(e)[:160]))
    boot(page, '/start/', wait=300)
    fill_inquiry(page)
    submit = page.get_by_role('button', name='Send inquiry')
    if double:
        submit.dblclick()
    else:
        submit.click()
    outcome = 'none'
    try:
        page.wait_for_selector('.inq-done, .inq-failure', timeout=8000)
        outcome = 'sent' if page.locator('.inq-done').count() else 'failed'
    except Exception:
        pass
    page.wait_for_timeout(300)
    return ctx, page, {'posts': posts, 'other': other_hosts, 'pre': preflights, 'outcome': outcome, 'perr': perr}


def check7(p):
    browser = p.chromium.launch()
    for key in MOCKS:
        ctx, page, m = run_mock(browser, key)
        body_text = page.evaluate('document.body.innerText')
        sent_heading = 'Thank you. We have it.' in body_text
        live = page.evaluate("(document.querySelector('.visually-hidden[role=status]') || {}).innerText || ''")
        posted = [json.loads(x['body']) if x['body'] else {} for x in m['posts']]
        post_ok = len(m['posts']) == 1 and m['posts'][0]['url'] == ENDPOINT and posted[0].get('What happens today') == NEED_TEXT and posted[0].get('name') == DATA['name'] and posted[0].get('email') == DATA['email']
        page.screenshot(path=str(OUT / f"inquiry-{key[0]}.png"), full_page=True)
        if key.startswith('a'):
            email_shown = page.evaluate("(document.querySelector('.inq-done strong') || {}).innerText || ''")
            alert = page.locator('.inq-failure').count()
            verdict(f'7a mock {key}: the sent view appears, no failure block, one POST', m['outcome'] == 'sent' and sent_heading and email_shown == DATA['email'] and not alert and post_ok,
                    f"outcome {m['outcome']}; sent heading {sent_heading}; email shown {email_shown!r}; failure block {alert}; POSTs {len(m['posts'])} to {m['posts'][0]['url'] if m['posts'] else None}; body ok {post_ok}; live region {live!r}; pageerrors {m['perr'][:2]}; requests aborted to other hosts {sorted(set(m['other']))}")
            ctx.close()
            continue
        # Failure variants.
        fail_ok = False
        msg = ''
        if m['outcome'] == 'failed':
            title = page.evaluate("(document.querySelector('.inq-failure h3') || {}).innerText || ''")
            msg = page.evaluate("(document.querySelector('.inq-failure > p') || {}).innerText || ''")
            fail_ok = title.strip() == 'Your message has not been sent' and msg.strip() == EXPECT_MSG[key]
        no_success = not sent_heading and live.strip() != 'Your inquiry was sent.' and page.locator('.inq-done').count() == 0
        verdict(f'7{key[0]} mock {key}: no success shown; the failure message is the exact one for that failure', m['outcome'] == 'failed' and no_success and fail_ok,
                f"outcome {m['outcome']}; sent heading shown {sent_heading}; live region {live!r}; failure message {msg!r} (expected {EXPECT_MSG[key]!r})")
        verdict(f'7{key[0]} mock {key}: exactly one POST, to the contract endpoint, carrying the entered data', post_ok and len(m['posts']) == 1, f"POSTs {len(m['posts'])}; urls {[x['url'] for x in m['posts']]}; preflights {len(m['pre'])}; pageerrors {m['perr'][:2]}")
        mail = page.evaluate("[...document.querySelectorAll('.inq-failure a[href^=\"mailto:\"]')].map(a => ({href: a.getAttribute('href'), text: a.innerText.trim()}))")
        if mail:
            dec = unquote(mail[0]['href'])
            need = [NEED_TEXT, DATA['name'], DATA['email'], DATA['company'], DATA['size'], DATA['phone']]
            miss = [n for n in need if n not in dec]
            mail_ok = mail[0]['href'].startswith('mailto:masoud.masoori@mas-ai.co?subject=') and not miss and mail[0]['text'] == 'Email it to masoud.masoori@mas-ai.co'
            verdict(f'7{key[0]} mock {key}: the mailto fallback is present and carries the entered text', mail_ok, f"link text {mail[0]['text']!r}; missing from the decoded href {miss}; href starts {mail[0]['href'][:70]!r}")
        else:
            verdict(f'7{key[0]} mock {key}: the mailto fallback is present and carries the entered text', False, 'no mailto link in the failure block')
        # Every value must survive a trip back through the steps.
        missing = []
        if m['outcome'] == 'failed':
            v = page.evaluate("({name: document.querySelector('#inq-name').value, email: document.querySelector('#inq-email').value, phone: document.querySelector('#inq-phone').value})")
            for k in ('name', 'email', 'phone'):
                if v[k] != DATA[k]:
                    missing.append(f'{k} {v[k]!r}')
            page.get_by_role('button', name='Back').click()
            v = page.evaluate("({company: document.querySelector('#inq-company').value, size: document.querySelector('#inq-size').value, data: (document.querySelector('input[name=data]:checked') || {}).value, timeline: (document.querySelector('input[name=timeline]:checked') || {}).value})")
            for k, want in (('company', DATA['company']), ('size', DATA['size']), ('data', 'own'), ('timeline', '3-months')):
                if v[k] != want:
                    missing.append(f'{k} {v[k]!r}')
            page.get_by_role('button', name='Back').click()
            v = page.evaluate("({today: document.querySelector('#inq-today').value, tools: [...document.querySelectorAll('input[name=tools]:checked')].map(i => i.value)})")
            if v['today'] != NEED_TEXT:
                missing.append(f"today {v['today']!r}")
            if sorted(v['tools']) != ['crm', 'email']:
                missing.append(f"tools {v['tools']}")
            page.get_by_role('button', name='Back').click()
            v = page.evaluate("(document.querySelector('input[name=need]:checked') || {}).value")
            if v != 'manual':
                missing.append(f'need {v!r}')
        verdict(f'7{key[0]} mock {key}: every entered value is still there when the visitor goes back to edit', m['outcome'] == 'failed' and not missing, f"outcome {m['outcome']}; missing or changed {missing}")
        ctx.close()
    # Double click on Send while the response is slow: still one POST.
    ctx, page, m = run_mock(browser, 'a 200 success true', delay_ms=700, double=True)
    verdict('7a2 mock a with a double click on Send and a slow response: exactly one POST', len(m['posts']) == 1 and m['outcome'] == 'sent', f"POSTs {len(m['posts'])}; outcome {m['outcome']}")
    ctx.close()
    browser.close()


# ---------------------------------------------------------------------------------------------------------------
# Check 8: WebKit, iPhone 13 descriptor (emulation)
# ---------------------------------------------------------------------------------------------------------------
def check8(p):
    wk = 'WebKit emulation, not a real iPhone'
    dev = p.devices['iPhone 13']
    browser = p.webkit.launch()
    ctx = browser.new_context(**dev)
    page = ctx.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)[:160]))
    boot(page, '/')
    vp = page.evaluate('({w: innerWidth, h: innerHeight, dpr: devicePixelRatio, ua: navigator.userAgent.slice(0, 80)})')
    mode = page.evaluate("document.querySelector('.stage').hasAttribute('data-flow') ? 'flow' : 'pinned'")
    load_errors = list(errors)
    verdict(f'8 [{wk}] home loads with no page errors', not load_errors and page.locator('#hero-title').count() == 1, f"{vp}; pageerrors at load {load_errors[:3]}")
    info(f'8 [{wk}] stage mode: {mode}')
    # GOTO 0..6: a screenshot at each act; consecutive acts must differ and every act's copy must sit clear of the panel.
    shots, stops = [], []
    for g in range(7):
        goto_act(page, g, wait=600)
        png = page.screenshot(path=str(OUT / f'webkit-iphone13-act{g}.png'))
        shots.append(png)
        r = page.evaluate(STOP, g)
        r['G'], r['dir'] = g, 'down'
        stops.append(r)
    from PIL import Image, ImageChops, ImageStat
    diffs = []
    for a, b in zip(shots, shots[1:]):
        diffs.append(round(ImageStat.Stat(ImageChops.difference(Image.open(BytesIO(a)).convert('L'), Image.open(BytesIO(b)).convert('L'))).mean[0], 2))
    bad = stop_problems(stops)
    new_errors = errors[len(load_errors):]
    verdict(f'8 [{wk}] GOTO 0..6: acts change between stops (mean pixel diff >= 0.5), copy clear of the header/panel, not clipped, no new page errors', min(diffs) >= 0.5 and not bad and not new_errors,
            f"mode {stops[0]['mode']}; consecutive mean diffs {diffs}; problems {trunc(bad)}; new pageerrors during the walk {new_errors[:3]}")
    # Deploy picker.
    g = deploy_in_window(page)
    if g is None:
        verdict(f'8 [{wk}] deploy picker changes the canvas', None, 'Local and Hybrid never sat in the reading window together')
    else:
        sel, flow = live_canvas(page)
        d = deploy_hashes(page, sel)
        verdict(f'8 [{wk}] deploy picker changes the canvas', deploy_ok(d), f"G {g}; {'flow still' if flow else 'pinned canvas'}; mean abs diff: {fmt_d(d)}")
    # Guide.
    page.evaluate('window.scrollTo(0, 0)')
    launcher = page.locator('[data-testid="guide-launcher"]')
    try:
        launcher.wait_for(state='visible', timeout=8000)
        launcher.click()
        page.locator('[data-testid="guide-panel"]').wait_for(state='visible', timeout=4000)
        first = page.evaluate("(document.querySelector('[data-testid=guide-log] .guide__msg p') || {}).innerText || ''")
        verdict(f'8 [{wk}] guide launcher opens and the greeting starts with the exact sentence', first.startswith(GREETING_LEAD + ' '), f'first message {first[:110]!r}')
        page.screenshot(path=str(OUT / 'webkit-iphone13-guide.png'))
    except Exception as e:
        verdict(f'8 [{wk}] guide launcher opens and the greeting starts with the exact sentence', False, f'launcher or panel did not appear: {str(e)[:150]}')
    ctx.close()
    # /start/ in a fresh page, so its errors are its own.
    ctx = browser.new_context(**dev)
    page = ctx.new_page()
    serr = []
    page.on('pageerror', lambda e: serr.append(str(e)[:160]))
    boot(page, '/start/', wait=800)
    h1 = page.evaluate("(document.querySelector('h1') || {}).innerText || ''")
    verdict(f'8 [{wk}] /start/ loads and shows the first inquiry step', h1.strip() == 'Bring us a bottleneck.' and page.locator('input[name=need]').count() == 8 and not serr, f"h1 {h1!r}; need chips {page.locator('input[name=need]').count()}; pageerrors {serr[:2]}")
    ctx.close()
    # Reduced motion: stills in normal flow.
    ctx = browser.new_context(**dev, reduced_motion='reduce')
    page = ctx.new_page()
    perr = []
    page.on('pageerror', lambda e: perr.append(str(e)[:160]))
    boot(page, '/', wait=1200)
    r = page.evaluate("""() => { const st = document.querySelector('.stage__sticky'); const cs = getComputedStyle(st); const out = {stickyDisplay: cs.display, stickyRect: Math.round(st.getBoundingClientRect().height), flowAttr: document.querySelector('.stage').hasAttribute('data-flow')}
      out.stills = [...document.querySelectorAll('canvas[data-still]')].map(c => { const r = c.getBoundingClientRect(); return {i: +c.dataset.still, display: getComputedStyle(c).display, w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top + scrollY)} })
      out.copies = [...document.querySelectorAll('.stage__copy')].map(c => Math.round(c.getBoundingClientRect().top + scrollY)); return out }""")
    blanks = [(s['i'], blank_stats(sample(page, f'canvas[data-still="{s["i"]}"]'))) for s in r['stills']]
    blank_ids = [i for i, b in blanks if b['blank']]
    in_flow = r['stickyDisplay'] == 'none' and all(s['display'] == 'block' and s['w'] > 100 and s['h'] > 50 for s in r['stills']) and len(r['stills']) == 6
    verdict(f'8 [{wk}] reduced motion: six stills in normal flow, none blank', in_flow and not blank_ids and not perr, f"sticky display {r['stickyDisplay']}; stills {[(s['i'], s['display'], s['w'], s['h']) for s in r['stills']]}; blank stills {blank_ids}; pageerrors {perr[:2]}")
    page.screenshot(path=str(OUT / 'webkit-iphone13-reduced.png'))
    ctx.close()
    browser.close()


# ---------------------------------------------------------------------------------------------------------------
# Check 9: reduced motion (Chromium)
# ---------------------------------------------------------------------------------------------------------------
def check9(p):
    browser = p.chromium.launch()
    for (w, h, mobile) in ((390, 844, True), (1440, 900, False)):
        t = f'{w}x{h} reduced motion'
        ctx = new_ctx(browser, w, h, mobile, dpr=1, reduced_motion='reduce')
        page = ctx.new_page()
        perr = []
        page.on('pageerror', lambda e: perr.append(str(e)[:160]))
        boot(page, '/', wait=1200)
        r = page.evaluate("""() => { const s = document.querySelector('.stage'); const st = s.querySelector('.stage__sticky'); const cs = getComputedStyle(st)
          const stuck = [...s.querySelectorAll('*')].filter(e => { const c = getComputedStyle(e); return (c.position === 'sticky' || c.position === 'fixed') && e.getClientRects().length > 0 }).map(e => e.className || e.tagName)
          const pick = document.querySelector('#deploy .stage__modes'), still = document.querySelector('#deploy .stage__still'), copy = document.querySelector('#deploy .stage__copy')
          const rc = (e) => { const r = e.getBoundingClientRect(); return {top: Math.round(r.top + scrollY), bottom: Math.round(r.bottom + scrollY), left: Math.round(r.left), w: Math.round(r.width)} }
          const before = [...s.querySelectorAll(':scope > .stage__block')].slice(0, 6).map(b => { const c = b.querySelector('.stage__copy'), i = b.querySelector('.stage__still'); return {id: b.id, still: rc(i), copy: rc(c)} })
          return {position: cs.position, display: cs.display, stickyRect: Math.round(st.getBoundingClientRect().height), stuck, flowAttr: s.hasAttribute('data-flow'), picker: rc(pick), deployStill: rc(still), deployCopy: rc(copy), blocks: before,
            stills: [...document.querySelectorAll('canvas[data-still]')].map(c => { const r = c.getBoundingClientRect(); return {i: +c.dataset.still, display: getComputedStyle(c).display, w: Math.round(r.width), h: Math.round(r.height)} }), innerW: innerWidth} }""")
        effective = r['position'] in ('sticky', 'fixed') and r['display'] != 'none' and r['stickyRect'] > 0
        verdict(f'9 {t}: the stage is not sticky (.stage__sticky not rendered, nothing in the stage pinned)', not effective and not r['stuck'],
                f"computed position {r['position']} (still declared) but display {r['display']}, rendered height {r['stickyRect']}; rendered sticky or fixed elements in the stage {r['stuck']}; data-flow {r['flowAttr']}")
        blanks = [(s['i'], blank_stats(sample(page, f'canvas[data-still="{s["i"]}"]'))) for s in r['stills']]
        blank_ids = [i for i, b in blanks if b['blank']]
        shown = all(s['display'] == 'block' and s['w'] > 100 and s['h'] > 50 for s in r['stills'])
        verdict(f'9 {t}: all six still canvases displayed and drawn (non-blank)', len(r['stills']) == 6 and shown and not blank_ids and not perr, f"stills {[(s['i'], s['w'], s['h']) for s in r['stills']]}; blank {blank_ids}; stats {[(i, b['opaque'], b['colours']) for i, b in blanks]}; pageerrors {perr[:2]}")
        if mobile:
            after = r['deployStill']['top'] >= r['picker']['bottom'] - 1
            above = [b['id'] for b in r['blocks'] if b['id'] != 'deploy' and not (b['still']['bottom'] <= b['copy']['top'] + 1)]
            verdict(f'9 {t}: the deploy still sits after its picker, the other stills before their copy', after and not above, f"deploy still top {r['deployStill']['top']} vs picker bottom {r['picker']['bottom']}; deploy copy {r['deployCopy']['top']}..{r['deployCopy']['bottom']}; other acts whose still is not above the copy {above}")
            page.screenshot(path=str(OUT / 'reduced-390-deploy.png'))
        ctx.close()
    browser.close()


CHECKS = {1: check1, 2: check2, 3: check3, 4: check4, 5: check5, 6: check6, 7: check7, 8: check8, 9: check9}

if __name__ == '__main__':
    t0 = time.time()
    with sync_playwright() as pw:
        for n, fn in CHECKS.items():
            if ONLY and n not in ONLY:
                continue
            print(f'\n=== check {n} ({time.time() - t0:.0f}s) ===', flush=True)
            try:
                fn(pw)
            except Exception as e:  # a harness failure is reported, never a pass
                import traceback
                verdict(f'{n} HARNESS ERROR in check {n}', None, f'{type(e).__name__}: {str(e)[:300]}')
                traceback.print_exc()
    held = sum(v[1] == 'HELD' for v in verdicts)
    bad = [v for v in verdicts if v[1] == 'BREACHED']
    inc = [v for v in verdicts if v[1] == 'INCONCLUSIVE']
    print(f'\nPASS-5 SUMMARY HELD {held} BREACHED {len(bad)} INCONCLUSIVE {len(inc)} of {len(verdicts)} verdicts in {time.time() - t0:.0f}s')
    (OUT / 'pass5.json').write_text(json.dumps(verdicts, indent=1), encoding='utf-8')
