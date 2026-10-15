"""First-viewport reveals: nothing a visitor can already see waits for JavaScript, and nothing in view ever dips.
A sampler installed before the page's own scripts records, on every animation frame, each [data-reveal] element inside
the viewport whose opacity is below 0.99. Any such frame is a breach: either content waited for hydration, or it was
painted and then hidden (the flash a lazy arm produces).
  1. Hard load of every route in out/sitemap.xml at 1440x900 and 390x844, CPU slowed 4x so hydration is late. Sampled
     from the first frame until 1 s after the page is armed (html.reveal-live). A route with reveals that never arms
     is INCONCLUSIVE, never a pass.
  2. Client navigation: from the home page, follow an in-site link to each route in CLIENT_ROUTES and sample from the
     click until 1.2 s after the new page is in place.
LCP and its gap to FCP are reported for the hard loads, not gated.
Usage: python scripts/qa/firstview.py [base_url] [--routes /,/blueprint/]"""
import argparse
import re
from pathlib import Path

from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('base', nargs='?', default='http://localhost:3344')
ap.add_argument('--routes', default='')
A = ap.parse_args()

if A.routes:
    ROUTES = [r.strip() for r in A.routes.split(',') if r.strip()]
else:
    xml = Path('out/sitemap.xml').read_text(encoding='utf-8')
    ROUTES = sorted({re.sub(r'^https?://[^/]+', '', u) or '/' for u in re.findall(r'<loc>([^<]+)</loc>', xml)})
CLIENT_ROUTES = ['/blueprint/', '/company/', '/work/', '/start/']

SAMPLER = """(() => {
  window.__fv = []
  const tick = () => {
    const root = document.documentElement, vh = innerHeight, dims = []
    let n = 0
    for (const el of document.querySelectorAll('[data-reveal]')) {
      n++
      const r = el.getBoundingClientRect()
      if (r.width < 2 || r.height < 2 || r.bottom <= 0 || r.top >= vh) continue
      const o = +getComputedStyle(el).opacity
      if (o < 0.99) dims.push([el.tagName + '.' + String(el.className).split(' ')[0], Math.round(r.top), +o.toFixed(2)])
    }
    window.__fv.push({t: Math.round(performance.now()), live: root.classList.contains('reveal-live'), n, dims})
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})()"""
PAINT = """() => new Promise(res => {
  const fcp = performance.getEntriesByName('first-contentful-paint')[0]
  let lcp = 0
  new PerformanceObserver(l => { for (const e of l.getEntries()) lcp = e.startTime }).observe({type: 'largest-contentful-paint', buffered: true})
  setTimeout(() => res({fcp: fcp ? Math.round(fcp.startTime) : null, lcp: Math.round(lcp)}), 50)
})"""
LIVE = "() => document.documentElement.classList.contains('reveal-live')"
HAS = "() => document.querySelectorAll('[data-reveal]').length"


def first_dims(frames):
    bad = [f for f in frames if f['dims']]
    return (len(bad), bad[0]['t'], bad[0]['dims'][:2]) if bad else None


problems, inconclusive = [], []
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, w, h, mobile in (('1440', 1440, 900, False), ('390', 390, 844, True)):
        # 1. Hard loads.
        for route in ROUTES:
            ctx = b.new_context(viewport={'width': w, 'height': h}, is_mobile=mobile, has_touch=mobile)
            ctx.add_init_script(SAMPLER)
            pg = ctx.new_page()
            ctx.new_cdp_session(pg).send('Emulation.setCPUThrottlingRate', {'rate': 4})
            pg.goto(A.base + route, wait_until='load')
            has = pg.evaluate(HAS)
            armed = True
            if has:
                try:
                    pg.wait_for_function(LIVE, timeout=10000)
                except Exception:
                    armed = False
            pg.wait_for_timeout(1000)
            frames = pg.evaluate('window.__fv')
            paint = pg.evaluate(PAINT)
            gap = (paint['lcp'] - paint['fcp']) if paint['fcp'] else None
            d = first_dims(frames)
            if not armed:
                verdict = 'INCONCLUSIVE'
                inconclusive.append(f'{name} {route}')
            elif d:
                verdict = 'BREACHED'
                problems.append(f'{name} {route}')
            else:
                verdict = 'HELD'
            detail = f'{d[0]} dim frames from {d[1]} ms, e.g. {d[2]}' if d else 'no dim frame'
            print(f"{verdict:12} load {name} {route}: {len(frames)} frames, {has} reveals, armed {armed}; {detail}; FCP {paint['fcp']} LCP {paint['lcp']} (gap {gap})")
            ctx.close()
        # 2. Client navigation from the home page.
        ctx = b.new_context(viewport={'width': w, 'height': h}, is_mobile=mobile, has_touch=mobile)
        ctx.add_init_script(SAMPLER)
        pg = ctx.new_page()
        for route in CLIENT_ROUTES:
            pg.goto(A.base + '/', wait_until='load')
            pg.wait_for_timeout(1500)
            found = pg.evaluate("(r) => { const a = document.querySelector(`a[href='${r}']`); if (!a) return false; window.__fv = []; a.click(); return true }", route)
            if not found:
                inconclusive.append(f'{name} nav {route}')
                print(f'INCONCLUSIVE nav  {name} / -> {route}: no in-site link to it on the home page')
                continue
            pg.wait_for_function('(r) => location.pathname === r', arg=route, timeout=10000)
            pg.wait_for_timeout(1200)
            frames = pg.evaluate('window.__fv')
            d = first_dims(frames)
            if d:
                problems.append(f'{name} nav {route}')
            detail = f'{d[0]} dim frames from {d[1]} ms after the click, e.g. {d[2]}' if d else 'no dim frame'
            print(f"{'BREACHED' if d else 'HELD':12} nav  {name} / -> {route}: {len(frames)} frames; {detail}")
        ctx.close()
    b.close()
if problems:
    print('VERDICT', f'BREACHED ({len(problems)}): {problems}' + (f'; inconclusive {inconclusive}' if inconclusive else ''))
elif inconclusive:
    print('VERDICT', f'INCONCLUSIVE ({len(inconclusive)}): {inconclusive}')
else:
    print('VERDICT HELD')
