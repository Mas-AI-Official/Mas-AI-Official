"""Hero gold trace stays attached to the "Find the gap" rule after a resize, address-bar change or rotation while scrolled.
Regression: placeTrace measured against the pinned panel, so the start drifted by the scroll distance (2026-10-01).
Usage: python scripts/qa/trace.py [base_url]. Pass = path start within 3 px of the rule end at rest, every scenario."""
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3344'
MEAS = """() => { const p = document.querySelector('[data-trace]'), svg = p.ownerSVGElement, r = document.querySelector('[data-ruled]')
  const sr = svg.getBoundingClientRect(), rr = r.getBoundingClientRect(), s = p.getPointAtLength(0)
  return { off: [Math.round(s.x - (rr.right - sr.left + 6)), Math.round(s.y - (rr.bottom - sr.top - 1))], sy: Math.round(scrollY) } }"""
TOP = "window.scrollTo({top: 0, behavior: 'instant'})"

def run(b, name, w, h, mobile, steps):
    pg = b.new_page(viewport={'width': w, 'height': h}, is_mobile=mobile, has_touch=mobile)
    pg.goto(BASE + '/', wait_until='networkidle'); pg.wait_for_timeout(1200)
    for s in steps:
        s(pg); pg.wait_for_timeout(500)
    pg.evaluate(TOP); pg.wait_for_timeout(700)
    m = pg.evaluate(MEAS)
    ok = abs(m['off'][0]) <= 3 and abs(m['off'][1]) <= 3
    print(f"{'HELD' if ok else 'BREACHED':9} {name}: start offset from rule end {m['off']} px")
    pg.close()
    return ok

with sync_playwright() as p:
    b = p.chromium.launch()
    res = [
        run(b, '1440 untouched', 1440, 900, False, []),
        run(b, '1440 scroll 600, resize 1440->1380, back to top', 1440, 900, False,
            [lambda pg: pg.evaluate("window.scrollTo({top: 600, behavior: 'instant'})"), lambda pg: pg.set_viewport_size({'width': 1380, 'height': 900})]),
        run(b, '390 untouched', 390, 844, True, []),
        run(b, '390 scroll 500, address bar hides (844->900), back to top', 390, 844, True,
            [lambda pg: pg.evaluate("window.scrollTo({top: 500, behavior: 'instant'})"), lambda pg: pg.set_viewport_size({'width': 390, 'height': 900})]),
        run(b, '390 rotate to 844x390 while scrolled, rotate back', 390, 844, True,
            [lambda pg: pg.evaluate("window.scrollTo({top: 400, behavior: 'instant'})"), lambda pg: pg.set_viewport_size({'width': 844, 'height': 390}),
             lambda pg: pg.set_viewport_size({'width': 390, 'height': 844})]),
    ]
    b.close()
print('VERDICT', 'HELD' if all(res) else 'BREACHED')
