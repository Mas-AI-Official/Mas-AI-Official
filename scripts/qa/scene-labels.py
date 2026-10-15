"""Capabilities system scene: for each of the 8 variants, no two texts the canvas draws overlap (station names, overlay
labels), at 320 to 1440 px. Records fillText on the panel canvas the same way wire-labels.py does for the hero.
Usage: python scripts/qa/scene-labels.py [base] ["css override to try"]"""
import sys
from playwright.sync_api import sync_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3344'
CSS = sys.argv[2] if len(sys.argv) > 2 else ''
RECORD = """(() => {
  let f = 0
  const tick = () => { f++; requestAnimationFrame(tick) }
  requestAnimationFrame(tick)
  window.__txt = []
  const alphaOf = (s) => { const m = /rgba?\\(([^)]+)\\)/.exec(String(s)); if (!m) return 1; const p = m[1].split(/[ ,\\/]+/).filter(Boolean); return p.length > 3 ? parseFloat(p[3]) : 1 }
  const orig = CanvasRenderingContext2D.prototype.fillText
  CanvasRenderingContext2D.prototype.fillText = function (text, x, y, ...rest) {
    if (this.canvas.closest && this.canvas.closest('.caps__panel')) {
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
LAST = """() => { const t = window.__txt; if (!t.length) return []; const f = Math.max(...t.map(e => e.f)); return t.filter(e => e.f === f) }"""
def ov(a, b): return a['x'] < b['x'] + b['w'] and b['x'] < a['x'] + a['w'] and a['y'] < b['y'] + b['h'] and b['y'] < a['y'] + a['h']
bad = 0
with sync_playwright() as p:
    br = p.chromium.launch()
    for w, h in ([(320, 568), (375, 667)] if CSS else [(320, 568), (360, 780), (375, 667), (390, 844), (430, 932), (768, 1024), (1440, 900)]):
        pg = br.new_page(viewport={'width': w, 'height': h}, is_mobile=w < 900, has_touch=w < 900)
        pg.add_init_script(RECORD)
        pg.goto(BASE + '/', wait_until='networkidle')
        if CSS: pg.add_style_tag(content=CSS)
        pg.wait_for_timeout(500)
        sw = pg.evaluate("Math.round(document.querySelector('.caps__scene').getBoundingClientRect().width)")
        out = []
        for i in range(8):
            pg.locator('.caps__tick').nth(i).click(); pg.wait_for_timeout(1500)
            fr = [e for e in pg.evaluate(LAST) if e['a'] >= 0.3 and e['text'].strip()]
            hits = sorted({tuple(sorted((a['text'], b['text']))) for a in fr for b in fr if a is not b and ov(a, b)})
            if hits: out.append((i, hits)); bad += 1
        print(f'{w}x{h} scene {sw}px:', out or 'clean')
        pg.close()
    br.close()
print('VERDICT', 'HELD' if not bad else f'BREACHED ({bad})')
