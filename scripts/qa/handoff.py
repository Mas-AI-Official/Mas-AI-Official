"""Hero-to-act-2 hand-off lines: scrub the story from G 0 to 1.5 and check every visible line.
Pass, at every sampled position where a line is visible:
  0. it never passes through copy text in the stage (away from its own anchor);
  1. its copy end is within 3 px of its live anchor (hero: the "Find the gap" rule end; act 2: the "a system" mark end);
  2. its free tip (the end that grows or retracts) is inside the viewport, below the header: never pointing off-screen.
Also writes a contact sheet per viewport to --out.
Usage: python scripts/qa/handoff.py [--base http://localhost:3344] [--out qa-out/handoff]"""
import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('--base', default='http://localhost:3344')
ap.add_argument('--out', default='qa-out/handoff')
A = ap.parse_args()
OUT = Path(A.out)
OUT.mkdir(parents=True, exist_ok=True)

GOTO = """(G) => { const s = document.querySelector('.stage'); const bs = [...s.querySelectorAll(':scope > .stage__block')];
  const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
  const k = Math.min(bs.length - 1, Math.floor(G)), b = bs[k];
  window.scrollTo({top: s.getBoundingClientRect().top + scrollY + b.offsetTop + (G - k) * b.offsetHeight - h, behavior: 'instant'}) }"""

STATE = """() => {
  const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64
  const out = {}
  const lines = [['hero', '[data-trace]', '[data-ruled]', 'start'], ['act2', '[data-trace2]', '[data-mark]', 'end']]
  for (const [name, sel, anchorSel, anchorAt] of lines) {
    const p = document.querySelector(sel), a = document.querySelector(anchorSel)
    if (!p || !a || !p.getAttribute('d')) { out[name] = {visible: 0}; continue }
    const svg = p.ownerSVGElement.getBoundingClientRect(), ar = a.getBoundingClientRect()
    const cs = getComputedStyle(p)
    const len = parseFloat(cs.strokeDasharray.split(/[ ,]+/)[0]) || 0
    const off = parseFloat(cs.strokeDashoffset) || 0
    const from = -off, to = from + len
    const L = p.getTotalLength()
    const at = (f) => { const q = p.getPointAtLength(Math.max(0, Math.min(1, f)) * L); return [q.x + svg.left, q.y + svg.top] }
    const anchorEnd = anchorAt === 'start' ? at(0) : at(1)
    // Expected anchor: hero rule end +6 px at its bottom - 1; act 2 mark end +6 px at its bottom - 1.
    const expect = [ar.right + 6, ar.bottom - 1]
    const tip = anchorAt === 'start' ? at(from) : at(to)
    // What a visitor sees: a hidden panel or a faded-out svg is not a visible line, whatever its dash says.
    const hidden = getComputedStyle(p.ownerSVGElement.parentElement).display === 'none' || +getComputedStyle(p.ownerSVGElement).opacity < 0.02
    const rects = []
    for (const el of document.querySelectorAll('.stage__copy h1, .stage__copy h2, .stage__copy p:not(.visually-hidden), .stage__copy .btn')) {
      // Text nodes only: a block-level span inside a heading returns its whole block width, not the glyphs.
      const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      for (let tn; (tn = tw.nextNode());) {
      if (!tn.textContent.trim()) continue
      const r = document.createRange(); r.selectNodeContents(tn)
      // Ink, not the line box: consecutive line boxes of tight display type overlap, so a line running between two
      // lines of a heading would count as inside one. Keep the inner part of each line box (display headings carry
      // more ascender space above the caps: measured 2026-10-01, the hero line clears "system." by 7 px at 390).
      for (const q of r.getClientRects()) if (q.width > 2 && q.height > 2) rects.push({el, left: q.left, right: q.right, top: q.top + (/^H[12]$/.test(el.tagName) ? 0.3 : 0.18) * q.height, bottom: q.bottom - 0.12 * q.height})
      }
    }
    const cross = []
    if (!hidden && len > 0.005) {
      for (let i = 0; i <= 60; i++) {
        const f = from + (to - from) * i / 60, [x, y] = at(f)
        if (Math.hypot(x - expect[0], y - expect[1]) < 14) continue
        if (y < headerH) continue
        // Only text a visitor can see there: copy scrolled behind the opaque phone panel is not crossed.
        const topEl = document.elementFromPoint(x, y)
        for (const q of rects) if (x > q.left + 1 && x < q.right - 1 && y > q.top && y < q.bottom && topEl && (topEl === q.el || q.el.contains(topEl))) { cross.push([Math.round(x), Math.round(y)]); break }
      }
    }
    out[name] = {cross: cross.slice(0, 3), visible: hidden ? 0 : +len.toFixed(3), anchorErr: [Math.round(anchorEnd[0] - expect[0]), Math.round(anchorEnd[1] - expect[1])],
      tip: tip.map(Math.round), headerH, vw: innerWidth, vh: innerHeight,
      markFill: name === 'act2' ? getComputedStyle(document.querySelector('[data-markfill]')).transform : undefined}
  }
  return out
}"""

GS = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.5]
SHEET = [0, 0.15, 0.3, 0.6, 0.75, 0.9, 1.0, 1.2, 1.35]
VIEWPORTS = [('1440', 1440, 900, False), ('1333', 1333, 717, False), ('390', 390, 844, True), ('375', 375, 667, True)]

problems, allok = [], True
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, w, h, mobile in VIEWPORTS:
        pg = b.new_page(viewport={'width': w, 'height': h}, is_mobile=mobile, has_touch=mobile)
        pg.goto(A.base + '/', wait_until='networkidle')
        pg.wait_for_timeout(7500)  # the intro draws the hero line between 5.5 and 6.4 s
        shots, seen = [], {'hero': 0, 'act2': 0}
        for G in GS:
            pg.evaluate(GOTO, G)
            pg.wait_for_timeout(180)
            s = pg.evaluate(STATE)
            flow = pg.evaluate("document.querySelector('.stage').hasAttribute('data-flow')")
            for ln in ('hero', 'act2'):
                v = s[ln]
                if not v['visible'] or v['visible'] < 0.005:
                    continue
                seen[ln] += 1
                ex, ey = v['anchorErr']
                tx, ty = v['tip']
                if v['cross']:
                    problems.append(f'{name} G={G} {ln}: line passes through copy text at {v["cross"]}')
                if abs(ex) > 3 or abs(ey) > 3:
                    problems.append(f'{name} G={G} {ln}: copy end {v["anchorErr"]} px from its anchor')
                if not (v['headerH'] - 2 <= ty <= v['vh'] + 2 and -2 <= tx <= v['vw'] + 2):
                    problems.append(f'{name} G={G} {ln}: free tip {v["tip"]} is off-screen (viewport {v["vw"]}x{v["vh"]})')
            if G in SHEET:
                f = OUT / f'{name}-G{G:.2f}.png'
                pg.screenshot(path=str(f))
                shots.append((G, f))
        if flow:
            print(f'NOTE {name}: stage is in flow mode (no pinned panel), lines are hidden by design')
        elif not seen['hero'] or not seen['act2']:
            problems.append(f'{name}: a line was never visible (hero {seen["hero"]}, act2 {seen["act2"]} samples)')
        print(f'{name}: hero visible at {seen["hero"]} samples, act2 at {seen["act2"]} samples')
        # Contact sheet.
        from PIL import Image, ImageDraw
        ims = [Image.open(f).convert('RGB') for _, f in shots]
        tw = 480 if w > 900 else 240
        th = int(tw * h / w)
        cols = len(ims)
        sheet = Image.new('RGB', (cols * (tw + 6), th + 24), (40, 40, 40))
        d = ImageDraw.Draw(sheet)
        for i, ((G, _), im) in enumerate(zip(shots, ims)):
            sheet.paste(im.resize((tw, th)), (i * (tw + 6), 24))
            d.text((i * (tw + 6) + 4, 4), f'G {G:.2f}', fill=(255, 255, 255))
        sheet.save(OUT / f'sheet-{name}.png')
        pg.close()
    b.close()

for x in problems:
    print('BREACHED', x)
print('VERDICT', 'HELD' if not problems else f'BREACHED ({len(problems)})')
