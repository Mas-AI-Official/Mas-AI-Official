"""Phone menu sheet at 390x844: every phone visitor's navigation, so it gets its own gate.
  1. tap the toggle: the sheet shows, the toggle says expanded, focus moves to the sheet's first link, the page stops scrolling,
     and the sheet enters with one animation that ends fully opaque;
  2. Escape: the sheet hides, focus returns to the toggle, page scroll is restored;
  3. tap a link in the sheet: the sheet closes and the page navigates there;
  4. reduced motion: the sheet opens with no animation at all.
Usage: python scripts/qa/sheet.py [base_url]"""
import sys

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3344'
STATE = """() => { const s = document.querySelector('.site-sheet'), t = document.querySelector('.site-header__toggle')
  const first = s.querySelector('a, button'), a = document.activeElement
  return {hidden: s.hidden || getComputedStyle(s).display === 'none', expanded: t.getAttribute('aria-expanded'),
    focusFirst: a === first, focusToggle: a === t, focusIn: s.contains(a), overflow: document.documentElement.style.overflow,
    anims: s.getAnimations().length, opacity: +getComputedStyle(s).opacity, firstHref: first.getAttribute('href')} }"""

bad = []
def check(name, ok, detail):
    print(f"{'HELD    ' if ok else 'BREACHED'} {name}: {detail}")
    if not ok:
        bad.append(name)

with sync_playwright() as p:
    b = p.chromium.launch()
    for reduce in (False, True):
        ctx = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True,
                            reduced_motion='reduce' if reduce else 'no-preference')
        pg = ctx.new_page()
        pg.goto(BASE + '/', wait_until='networkidle')
        pg.wait_for_timeout(600)
        tag = 'reduce' if reduce else 'motion'
        pg.locator('.site-header__toggle').tap()
        pg.wait_for_timeout(40)
        s = pg.evaluate(STATE)
        if reduce:
            check(f'{tag} open', not s['hidden'] and s['expanded'] == 'true' and s['focusFirst'] and s['anims'] == 0,
                  f"hidden {s['hidden']}, expanded {s['expanded']}, focus on first link {s['focusFirst']}, animations {s['anims']}")
        else:
            check(f'{tag} open', not s['hidden'] and s['expanded'] == 'true' and s['focusFirst'] and s['overflow'] == 'hidden' and s['anims'] == 1,
                  f"hidden {s['hidden']}, expanded {s['expanded']}, focus on first link {s['focusFirst']}, page overflow {s['overflow']!r}, animations {s['anims']}")
            pg.wait_for_timeout(400)
            s2 = pg.evaluate(STATE)
            check(f'{tag} settled', s2['opacity'] == 1 and s2['anims'] == 0, f"opacity {s2['opacity']}, animations {s2['anims']} after 440 ms")
        pg.keyboard.press('Escape')
        pg.wait_for_timeout(100)
        s = pg.evaluate(STATE)
        check(f'{tag} escape', s['hidden'] and s['focusToggle'] and s['overflow'] == '',
              f"hidden {s['hidden']}, focus on toggle {s['focusToggle']}, page overflow {s['overflow']!r}")
        pg.locator('.site-header__toggle').tap()
        pg.wait_for_timeout(300)
        href = pg.evaluate(STATE)['firstHref']
        pg.locator('.site-sheet a').first.tap()
        pg.wait_for_url(f'**{href}', timeout=8000)
        pg.wait_for_timeout(300)
        s = pg.evaluate(STATE)
        path = pg.evaluate('location.pathname')
        check(f'{tag} link', s['hidden'] and path == href and s['overflow'] == '', f"navigated to {path} (expected {href}), sheet hidden {s['hidden']}")
        ctx.close()
    b.close()
print('VERDICT', 'HELD' if not bad else f'BREACHED ({len(bad)}): {bad}')
