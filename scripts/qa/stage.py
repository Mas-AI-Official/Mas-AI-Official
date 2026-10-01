"""Stage QA: captures the four homepage acts, scroll down then back up, the cursor lens,
reduced motion, and frame timing. Usage: python scripts/qa/stage.py [base_url] [out_dir]
Prints one verdict line per check (HELD / BREACHED / INCONCLUSIVE) and writes PNGs to out_dir."""
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3344'
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else 'qa-stage')
OUT.mkdir(parents=True, exist_ok=True)
VIEWPORTS = {'1440': (1440, 900), '390': (390, 844), '375': (375, 667)}
T_SHOTS = [0, 0.5, 1, 1.5, 1.75, 2, 2.3, 2.6, 3]
verdicts = []


def verdict(name, ok, detail):
    state = 'INCONCLUSIVE' if ok is None else ('HELD' if ok else 'BREACHED')
    verdicts.append((name, state, detail))
    print(f'{state:12} {name}: {detail}')


def block_h(page):
    return page.evaluate("document.querySelector('.stage__block').offsetHeight")


def go(page, t, bh):
    page.evaluate(f'window.scrollTo(0, {t * bh})')
    page.wait_for_timeout(450)


with sync_playwright() as p:
    browser = p.chromium.launch()
    for key, (w, h) in VIEWPORTS.items():
        ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2, has_touch=w < 900, is_mobile=w < 900)
        page = ctx.new_page()
        errors = []
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(BASE + '/', wait_until='networkidle')
        page.evaluate('document.fonts.ready')
        page.wait_for_timeout(1600)
        bh = block_h(page)
        overflow = page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
        verdict(f'{key} no horizontal scroll', overflow <= 0, f'overflow {overflow}px')
        for t in T_SHOTS:
            go(page, t, bh)
            page.screenshot(path=str(OUT / f'{key}-t{t:.2f}.png'))
        # Down then back up: the gap frame must match on the way back (shot again at t=1).
        go(page, 1, bh)
        page.screenshot(path=str(OUT / f'{key}-t1.00-up.png'))
        go(page, 0, bh)
        page.screenshot(path=str(OUT / f'{key}-t0.00-up.png'))
        shot_op = page.evaluate("getComputedStyle(document.querySelector('.stage__shot')).opacity")
        verdict(f'{key} screenshot hidden at top after round trip', float(shot_op) < 0.01, f'opacity {shot_op}')
        if w >= 900:
            box = page.evaluate("(() => { const r = document.querySelector('.stage__sticky').getBoundingClientRect(); return {x: r.x, y: r.y, w: r.width, h: r.height} })()")
            page.mouse.move(box['x'] + box['w'] * 0.64, box['y'] + box['h'] * 0.52)
            page.wait_for_timeout(120)
            page.mouse.move(box['x'] + box['w'] * 0.7, box['y'] + box['h'] * 0.5, steps=8)
            page.wait_for_timeout(500)
            page.screenshot(path=str(OUT / f'{key}-lens.png'))
            # Frame timing during a scripted scroll through all four acts.
            stats = page.evaluate("""async (bh) => {
              const frames = []; let last = performance.now(); let long = 0
              const po = new PerformanceObserver(l => { long += l.getEntries().length }); po.observe({type: 'longtask', buffered: false})
              let run = true; const tick = (n) => { frames.push(n - last); last = n; if (run) requestAnimationFrame(tick) }; requestAnimationFrame(tick)
              for (let i = 0; i <= 90; i++) { window.scrollTo(0, (i / 90) * 3 * bh); await new Promise(r => setTimeout(r, 22)) }
              run = false; po.disconnect()
              const s = frames.slice(2).sort((a, b) => a - b)
              return { n: s.length, p50: s[Math.floor(s.length * 0.5)], p95: s[Math.floor(s.length * 0.95)], max: s[s.length - 1], long }
            }""", bh)
            verdict(f'{key} frame p95 under 20 ms during scroll', stats['p95'] < 20, json.dumps(stats))
            go(page, 3.4, bh)
            page.wait_for_timeout(600)
            idle = page.evaluate("""() => new Promise(res => { let n = 0; const s = performance.now(); const f = () => { n++; if (performance.now() - s < 1000) requestAnimationFrame(f); else res(n) }; requestAnimationFrame(f) })""")
            verdict(f'{key} page rAF alive (sanity)', idle > 30, f'{idle} frames/s from the probe itself')
        cls = page.evaluate("""() => new Promise(res => { let v = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) v += e.value }).observe({type: 'layout-shift', buffered: true}); setTimeout(() => res(v), 300) })""")
        verdict(f'{key} CLS under 0.1', cls < 0.1, f'{cls:.4f}')
        verdict(f'{key} console errors', not errors, '; '.join(errors)[:300] or 'none')
        ctx.close()

    # Reduced motion: no sticky, stills drawn, no running animation.
    for key, (w, h) in {'1440': (1440, 900), '390': (390, 844)}.items():
        ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, reduced_motion='reduce')
        page = ctx.new_page()
        page.goto(BASE + '/', wait_until='networkidle')
        page.wait_for_timeout(800)
        sticky = page.evaluate("getComputedStyle(document.querySelector('.stage__sticky')).display")
        drawn = page.evaluate("""Array.from(document.querySelectorAll('canvas[data-still]')).map(c => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < x.length; i += 400) if (x[i] > 0) n++; return n })""")
        verdict(f'reduce {key} sticky removed', sticky == 'none', sticky)
        verdict(f'reduce {key} three stills drawn', len(drawn) == 3 and all(n > 50 for n in drawn), str(drawn))
        page.screenshot(path=str(OUT / f'reduce-{key}.png'), full_page=True)
        ctx.close()
    browser.close()

bad = [v for v in verdicts if v[1] == 'BREACHED']
print(f'\nSUMMARY {len(verdicts) - len(bad)}/{len(verdicts)} not breached; BREACHED: {[v[0] for v in bad]}')
