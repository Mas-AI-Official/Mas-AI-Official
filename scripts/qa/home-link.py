"""Clicking the header or footer wordmark brings the visitor to the top of the home page, from the home page
itself (mid-page and near the end) and from another page, at 390 and 1440. Usage: python scripts/qa/home-link.py [base]"""
import sys
from playwright.sync_api import sync_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3344'
bad = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, w, h, mob in (('390', 390, 844, True), ('1440', 1440, 900, False)):
        for start, sel, depth in (('/', '.site-header .wordmark', 2500), ('/', '.site-header .wordmark', 9000),
                                  ('/', 'footer .wordmark', None), ('/work/', '.site-header .wordmark', 1500)):
            pg = b.new_page(viewport={'width': w, 'height': h}, is_mobile=mob, has_touch=mob)
            pg.goto(BASE + start, wait_until='networkidle'); pg.wait_for_timeout(800)
            if depth is None:
                pg.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)')
            else:
                pg.evaluate(f'window.scrollTo(0, {depth})')
            pg.wait_for_timeout(500)
            y0 = pg.evaluate('scrollY')
            el = pg.locator(sel).first
            el.scroll_into_view_if_needed()
            (el.tap() if mob else el.click())
            pg.wait_for_timeout(2500)
            y1, path = pg.evaluate('scrollY'), pg.evaluate('location.pathname + location.hash')
            ok = y1 <= 1 and path == '/'
            print(f'{"HELD" if ok else "BREACHED"} {name} from {start} scrolled {round(y0)} click {sel}: scrollY {round(y1)} at {path}')
            if not ok: bad.append(1)
            pg.close()
    b.close()
print('VERDICT', 'HELD' if not bad else f'BREACHED ({len(bad)})')
