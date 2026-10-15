"""Hero wire labels: every branch of the wiring is named on every screen size, and no name prints over another.
Records what the stage canvas actually draws (fillText, through the canvas transform, with its effective alpha), frame
by frame, while the trace reads the wiring (G 0.6 to 1.2). Per viewport:
  1. every wire label is visible (alpha >= 0.3) in at least one frame;
  2. in no frame does a visible wire label overlap another visible text (a station name, the queue count, the gap,
     another label), and the hand-off label is never printed twice at once.
Usage: python scripts/qa/wire-labels.py [--base http://localhost:3344]"""
import argparse

from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('--base', default='http://localhost:3344')
ap.add_argument('--widths', default='', help='comma-separated viewport widths to run, default all')
A = ap.parse_args()

LABELS = ['new lead', 'copied by hand', 're-typed by hand', 'booking', 'invoice', 'chased by email']
VIEWPORTS = [(430, 932, True), (412, 915, True), (390, 844, True), (375, 667, True), (360, 780, True), (320, 568, True), (768, 1024, True), (1440, 900, False), (1920, 1080, False)]
RECORD = """(() => {
  let f = 0
  const tick = () => { f++; requestAnimationFrame(tick) }
  requestAnimationFrame(tick)
  window.__txt = []
  const alphaOf = (s) => { const m = /rgba?\\(([^)]+)\\)/.exec(String(s)); if (!m) return 1; const p = m[1].split(/[ ,\\/]+/).filter(Boolean); return p.length > 3 ? parseFloat(p[3]) : 1 }
  const orig = CanvasRenderingContext2D.prototype.fillText
  CanvasRenderingContext2D.prototype.fillText = function (text, x, y, ...rest) {
    if (this.canvas.closest && this.canvas.closest('.stage')) {
      const m = this.getTransform(), w = this.measureText(text).width * m.a
      const sx = m.a * x + m.e, sy = m.d * y + m.f
      const left = this.textAlign === 'center' ? sx - w / 2 : this.textAlign === 'right' || this.textAlign === 'end' ? sx - w : sx
      const px = parseFloat(/([\\d.]+)px/.exec(this.font)[1]) * m.d
      const top = this.textBaseline === 'middle' ? sy - px / 2 : this.textBaseline === 'alphabetic' ? sy - px * 0.8 : sy
      const c = [...document.querySelectorAll('canvas')].indexOf(this.canvas)
      window.__txt.push({f, c, text: String(text), x: left, y: top, w, h: px, a: this.globalAlpha * alphaOf(this.fillStyle)})
      if (window.__txt.length > 4000) window.__txt.splice(0, 2000)
    }
    return orig.call(this, text, x, y, ...rest)
  }
})()"""
GOTO = """(G) => { const s = document.querySelector('.stage'); const bs = [...s.querySelectorAll(':scope > .stage__block')];
  const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
  const k = Math.min(bs.length - 1, Math.floor(G)), b = bs[k];
  window.scrollTo({top: s.getBoundingClientRect().top + scrollY + b.offsetTop + (G - k) * b.offsetHeight - h, behavior: 'instant'}) }"""
LAST = """() => { const t = window.__txt; if (!t.length) return []; const f = Math.max(...t.map(e => e.f)); return t.filter(e => e.f === f) }"""

problems = []


def bad(msg):
    if msg not in problems:
        problems.append(msg)
        print('BREACHED', msg)


def overlap(a, b):
    return a['x'] < b['x'] + b['w'] and b['x'] < a['x'] + a['w'] and a['y'] < b['y'] + b['h'] and b['y'] < a['y'] + a['h']


with sync_playwright() as p:
    browser = p.chromium.launch()
    for w, h, mob in VIEWPORTS:
        if A.widths and str(w) not in A.widths.split(','):
            continue
        pg = browser.new_page(viewport={'width': w, 'height': h}, is_mobile=mob, has_touch=mob)
        pg.add_init_script(RECORD)
        pg.goto(A.base + '/', wait_until='networkidle')
        pg.wait_for_timeout(7000)  # the intro
        seen = set()
        for i in range(13):
            G = 0.6 + i * 0.05
            pg.evaluate(GOTO, G)
            pg.wait_for_timeout(450)
            frame = [e for e in pg.evaluate(LAST) if e['a'] >= 0.3 and e['text'].strip()]
            wires = [e for e in frame if e['text'] in LABELS]
            seen |= {e['text'] for e in wires}
            # Two copies drawn at the same spot read as one; two copies anywhere else are a double print.
            hops = {(e['c'], round(e['x']), round(e['y'])) for e in wires if e['text'] == 're-typed by hand'}
            if len(hops) > 1:
                bad(f'{w}x{h} G{G:.2f}: the hand-off label is printed {len(hops)} times')
            for a in wires:
                for b in frame:
                    if b is a or b['c'] != a['c'] or (b['text'] == a['text'] and abs(b['x'] - a['x']) < 2 and abs(b['y'] - a['y']) < 2):
                        continue
                    if overlap(a, b):
                        bad(f"{w}x{h} G{G:.2f}: '{a['text']}' overlaps '{b['text']}'")
        missing = [lbl for lbl in LABELS if lbl not in seen]
        print(f'{w}x{h}: labels seen {sorted(seen)}')
        if missing:
            bad(f'{w}x{h}: never shown: {missing}')
        pg.close()
    browser.close()

print('VERDICT', 'HELD' if not problems else f'BREACHED ({len(problems)})')
