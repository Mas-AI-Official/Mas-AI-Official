"""Cross-engine smoke: the same visitor paths in Chromium (Chrome, Edge, Samsung Internet), WebKit (Safari, every iOS
browser) and Firefox, on a phone, a small phone, a tablet and a desktop. Emulated engines, not real devices: iOS Safari
on a phone is approximated by WebKit with a touch viewport.
Per engine and viewport:
  1. every route loads with no page error and no console error, exactly one visible h1, no horizontal overflow;
  2. home: the hero gold line is drawn (a visible dash, not just a path), scrolling the capabilities in 8 px strides
     walks the active step exactly 0 to 7 with no step back, and a progress tick lands its own step at the reading
     line and takes focus, from a panel that is not yet stuck and from a stuck one;
  3. phones: the menu sheet opens on tap and closes on Escape;
  4. /start/: choosing a need and pressing Continue moves to step 2.
Writes a contact sheet per engine to --out.
Usage: python scripts/qa/engines.py [--base http://localhost:3344] [--out qa-out/engines]"""
import argparse
from pathlib import Path

from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('--base', default='http://localhost:3344')
ap.add_argument('--out', default='qa-out/engines')
A = ap.parse_args()
OUT = Path(A.out)
OUT.mkdir(parents=True, exist_ok=True)

ROUTES = ['/', '/start/', '/blueprint/', '/work/', '/services/', '/company/', '/what-is-daena/']
VIEWPORTS = [('phone', 390, 844, True), ('small', 375, 667, True), ('narrow', 320, 568, True), ('tablet', 768, 1024, True),
             ('desktop', 1440, 900, False)]
CAPS = """async () => {
  const top = document.querySelector('.caps').getBoundingClientRect().top + scrollY
  const end = document.querySelector('.caps__steps').getBoundingClientRect().bottom + scrollY
  const seen = []
  for (let y = top - innerHeight / 2; y < end; y += 8) {
    window.scrollTo({top: y, behavior: 'instant'})
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
    const a = [...document.querySelectorAll('.caps__step')].findIndex(s => s.dataset.active === 'true')
    if (seen[seen.length - 1] !== a) seen.push(a)
  }
  return seen
}"""

problems = []


def bad(msg):
    problems.append(msg)
    print('BREACHED', msg)


with sync_playwright() as p:
    for engine in ('chromium', 'webkit', 'firefox'):
        browser = getattr(p, engine).launch()
        shots = []
        for vname, w, h, touch in VIEWPORTS:
            opts = {'viewport': {'width': w, 'height': h}, 'has_touch': touch}
            if touch and engine != 'firefox':
                opts['is_mobile'] = True  # Firefox has no mobile emulation; it still gets the touch viewport
            ctx = browser.new_context(**opts)
            page = ctx.new_page()
            errors = []
            page.on('pageerror', lambda e: errors.append(f'pageerror {str(e)[:120]}'))
            page.on('console', lambda m: errors.append(f'console {m.text[:120]}') if m.type == 'error' else None)
            tag = f'{engine} {vname}'
            for route in ROUTES:
                errors.clear()
                try:
                    page.goto(A.base + route, wait_until='load', timeout=45000)
                    page.wait_for_timeout(900)
                except Exception as e:  # noqa: BLE001
                    bad(f'{tag} {route}: did not load: {str(e)[:120]}')
                    continue
                s = page.evaluate("""() => ({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
                  h1: [...document.querySelectorAll('h1')].filter(e => e.getClientRects().length).length})""")
                if s['sw'] > s['cw'] + 1:
                    bad(f"{tag} {route}: horizontal overflow {s['sw']} > {s['cw']}")
                if s['h1'] != 1:
                    bad(f"{tag} {route}: {s['h1']} visible h1")
                if route == '/':
                    page.wait_for_timeout(6500)  # the intro draws the hero line
                    drawn = page.evaluate("(() => { const t = document.querySelector('[data-trace]'); return t && t.getAttribute('d') ? parseFloat(getComputedStyle(t).strokeDasharray) : 0 })()")
                    if not drawn or drawn < 0.5:
                        bad(f'{tag} /: hero gold line not drawn (visible dash {drawn})')
                    page.screenshot(path=str(OUT / f'{engine}-{vname}-home.png'))
                    shots.append((f'{vname} home', OUT / f'{engine}-{vname}-home.png'))
                    seen = page.evaluate(CAPS)
                    if seen != list(range(8)):
                        bad(f'{tag} /: capabilities did not walk exactly 0 to 7 in order: {seen}')
                    # Ticks: from a panel not yet stuck (section head at the top), then from a stuck one.
                    page.evaluate("window.scrollTo({top: document.querySelector('.caps').getBoundingClientRect().top + scrollY - 80, behavior: 'instant'})")
                    page.wait_for_timeout(300)
                    for target in (3, 6, 0, 4):
                        page.locator('.caps__tick').nth(target).click()
                        page.wait_for_timeout(1300)
                        got = page.evaluate("[...document.querySelectorAll('.caps__step')].findIndex(s => s.dataset.active === 'true')")
                        focus = page.evaluate("[...document.querySelectorAll('.caps__step')].indexOf(document.activeElement)")
                        if got != target or focus != target:
                            bad(f'{tag} /: tick {target} landed on step {got}, focus on step {focus}')
                    page.screenshot(path=str(OUT / f'{engine}-{vname}-caps.png'))
                    shots.append((f'{vname} caps', OUT / f'{engine}-{vname}-caps.png'))
                    if touch and w < 960:
                        page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
                        page.locator('.site-header__toggle').click()
                        page.wait_for_timeout(400)
                        opened = page.evaluate("!document.querySelector('.site-sheet').hidden")
                        page.keyboard.press('Escape')
                        page.wait_for_timeout(300)
                        closed = page.evaluate("document.querySelector('.site-sheet').hidden")
                        if not (opened and closed):
                            bad(f'{tag} /: menu sheet opened {opened}, closed on Escape {closed}')
                if route == '/start/':
                    before = page.locator('#inq-heading').inner_text()
                    page.locator('.inq-chip input').first.check(force=True)
                    page.get_by_role('button', name='Continue').click()
                    page.wait_for_timeout(600)
                    after = page.locator('#inq-heading').inner_text()
                    if after == before:
                        bad(f'{tag} /start/: Continue did not move to step 2')
                    page.screenshot(path=str(OUT / f'{engine}-{vname}-start.png'))
                    shots.append((f'{vname} start', OUT / f'{engine}-{vname}-start.png'))
                real = [e for e in errors if 'favicon' not in e]
                if real:
                    bad(f'{tag} {route}: {real[:2]}')
            ctx.close()
            print(f'checked {tag}')
        browser.close()
        # Contact sheet for the engine.
        ims = [(lbl, Image.open(f).convert('RGB')) for lbl, f in shots]
        if ims:
            th = 360
            row = [(lbl, im.resize((int(im.width * th / im.height), th))) for lbl, im in ims]
            sheet = Image.new('RGB', (sum(im.width + 6 for _, im in row), th + 20), (40, 40, 40))
            d, x = ImageDraw.Draw(sheet), 0
            for lbl, im in row:
                sheet.paste(im, (x, 20)); d.text((x + 3, 4), lbl, fill=(255, 255, 255)); x += im.width + 6
            sheet.save(OUT / f'sheet-{engine}.png')

print('VERDICT', 'HELD' if not problems else f'BREACHED ({len(problems)})')
