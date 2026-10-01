"""Pass-3 QA for mas-ai.co: captures every narrative moment at desktop, tablet and phone sizes and prints
HELD / BREACHED / INCONCLUSIVE lines. Usage: python scripts/qa/pass3.py [base_url] [out_dir]"""
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3344'
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else 'qa-pass3')
OUT.mkdir(parents=True, exist_ok=True)
verdicts = []


def verdict(name, ok, detail):
    state = 'INCONCLUSIVE' if ok is None else ('HELD' if ok else 'BREACHED')
    verdicts.append((name, state, detail))
    print(f'{state:12} {name}: {detail}')


# One pinned stage since pass 4: hero 0, gap 1, decision 2, build 3, deploy 4, runs 5, proof 6.
GOTO = """(G) => { const s = document.querySelector('.stage'); const bs = [...s.querySelectorAll(':scope > .stage__block')];
  const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
  const k = Math.min(bs.length - 1, Math.floor(G)), b = bs[k];
  const y = s.getBoundingClientRect().top + scrollY + b.offsetTop + (G - k) * b.offsetHeight - h;
  window.scrollTo({top: y, behavior: 'instant'}) }"""


def to_g(page, G):
    page.evaluate(GOTO, G)
    page.wait_for_timeout(500)


def to_two(page, local):
    """Moments that used to live in stage two, at their new story positions."""
    to_g(page, {0: 2.02, 0.6: 2.6, 1: 3, 2: 5, 2.6: 5.6, 3: 6}[local])


def to_el(page, sel, offset=0):
    page.evaluate(f"(() => {{ const e = document.querySelector('{sel}'); window.scrollTo({{top: e.getBoundingClientRect().top + scrollY - 64 + {offset}, behavior: 'instant'}}) }})()")
    page.wait_for_timeout(600)


def shot(page, name):
    page.screenshot(path=str(OUT / f'{name}.png'))


FRAMES = """async ([sel, span]) => {
  const s = document.querySelector(sel); const top = s.getBoundingClientRect().top + scrollY - 64
  const frames = []; let last = performance.now(); let long = 0
  const po = new PerformanceObserver(l => { long += l.getEntries().length }); po.observe({type: 'longtask', buffered: false})
  let run = true; const tick = (n) => { frames.push(n - last); last = n; if (run) requestAnimationFrame(tick) }; requestAnimationFrame(tick)
  for (let i = 0; i <= 90; i++) { window.scrollTo(0, top + (i / 90) * span); await new Promise(r => setTimeout(r, 22)) }
  run = false; po.disconnect()
  const f = frames.slice(2).sort((a, b) => a - b)
  return { n: f.length, p50: +f[Math.floor(f.length * 0.5)].toFixed(1), p95: +f[Math.floor(f.length * 0.95)].toFixed(1), over20: f.filter(x => x > 20).length, long }
}"""

VIEWPORTS = {'1920': (1920, 1080), '1440': (1440, 900), '1024': (1024, 768), '768': (768, 1024), '390': (390, 844), '375': (375, 667)}

with sync_playwright() as p:
    browser = p.chromium.launch()
    for key, (w, h) in VIEWPORTS.items():
        phone = w < 900
        ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2, has_touch=w < 768, is_mobile=w < 768)
        page = ctx.new_page()
        errors = []
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(BASE + '/', wait_until='networkidle')
        full = key in ('1440', '390', '375')
        # Hero intro beats (time-based after fonts load).
        page.wait_for_timeout(900)
        if full:
            shot(page, f'{key}-01-hero-quiet')
        page.wait_for_timeout(2000)
        if full:
            shot(page, f'{key}-02-hero-friction')
        page.wait_for_timeout(5200)
        shot(page, f'{key}-03-hero-diagnosis')
        overflow = page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
        verdict(f'{key} no horizontal scroll', overflow <= 0, f'{overflow}px')
        if not phone:
            page.mouse.move(w * 0.72, h * 0.55)
            page.wait_for_timeout(400)
            page.mouse.move(w * 0.7, h * 0.5, steps=6)
            page.wait_for_timeout(500)
            if full:
                shot(page, f'{key}-04-hero-lens')
        for G, name in [(1, '05-gap'), (1.6, '06-deciding'), (2, '07-decision')]:
            to_g(page, G)
            if full or name == '07-decision':
                shot(page, f'{key}-{name}')
        to_el(page, '#services')
        shot(page, f'{key}-08-capabilities')
        if full:
            for tab in ('Custom software', 'AI websites and digital products', 'Private and enterprise AI'):
                page.get_by_role('tab', name=tab).click()
                page.wait_for_timeout(800)
                shot(page, f"{key}-09-cap-{tab.split()[0].lower()}")
        for local, name in [(0, '10-statement'), (0.6, '11-building'), (1, '12-build'), (2, '13-runs'), (2.6, '14-handoff'), (3, '15-proof')]:
            to_two(page, local)
            if name == '12-build' and full:
                # Act 4b sits between build and runs now: capture each deployment mode on the way.
                to_g(page, 4)
                for mode in ('local', 'private', 'cloud', 'hybrid'):
                    page.get_by_role('button', name={'local': 'Local', 'private': 'Private cloud', 'cloud': 'Cloud', 'hybrid': 'Hybrid'}[mode], exact=True).click()
                    page.wait_for_timeout(500)
                    shot(page, f'{key}-12b-deploy-{mode}')
                to_two(page, local)
            if name == '13-runs':
                page.wait_for_timeout(2500)
            if full or name in ('12-build', '15-proof'):
                shot(page, f'{key}-{name}')
        log_lines = page.evaluate("[...document.querySelectorAll('[data-log] li')].filter(li => li.textContent.trim()).length")
        verdict(f'{key} live log printed during runs', log_lines > 0, f'{log_lines} lines')
        to_el(page, '#work')
        shot(page, f'{key}-16-work')
        to_el(page, '#start', -80)
        page.wait_for_timeout(400)
        shot(page, f'{key}-17-closing')
        p_val = page.evaluate("getComputedStyle(document.querySelector('.closing__svg')).getPropertyValue('--p')")
        verdict(f'{key} closing lines drawn when in view', float(p_val or 0) > 0.6, f'--p {p_val}')
        # Chatbot: closed, then open.
        launcher = page.locator('[data-testid="guide-launcher"]')
        if launcher.count():
            if not phone:
                launcher.hover()
                page.wait_for_timeout(300)
            shot(page, f'{key}-18-chat-closed')
            launcher.click()
            page.wait_for_timeout(500)
            shot(page, f'{key}-19-chat-open')
            head = page.locator('[data-testid="guide-panel"]').inner_text()[:80]
            verdict(f'{key} guide opens in Daena mode on /', 'Daena' in head and 'AI Guide' in head, head.replace('\n', ' | '))
            page.keyboard.press('Escape')
        else:
            verdict(f'{key} guide launcher present', False, 'not mounted')
        # Round trip: back to the top restores the hero.
        # Instant jump, then wait until the page is really at the top (html has scroll-behavior: smooth,
        # so a plain scrollTo was still travelling when the old check read the trace).
        page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
        page.wait_for_function('window.scrollY === 0', timeout=5000)
        page.wait_for_timeout(500)
        op = page.evaluate("getComputedStyle(document.querySelector('.stage__trace')).opacity")
        verdict(f'{key} scroll back to top restores hero', float(op) > 0.9, f'trace opacity {op}')
        cls, src = page.evaluate("""() => new Promise(res => { let v = 0; const s = []; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) { v += e.value; if (e.value > 0.01) s.push(e.value.toFixed(3) + ' ' + (e.sources || []).map(x => x.node ? (x.node.id || x.node.className || x.node.nodeName) : '?').join('+')) } }).observe({type: 'layout-shift', buffered: true}); setTimeout(() => res([v, s.slice(0, 4).join('; ')]), 300) })""")
        verdict(f'{key} CLS under 0.1', cls < 0.1, f'{cls:.4f} {src}')
        if key == '1440':
            runs = [page.evaluate(FRAMES, ['.stage', 2400]) for _ in range(3)] + [page.evaluate(FRAMES, ['#build', 3000]) for _ in range(3)]
            worst = max(r['p95'] for r in runs)
            verdict('1440 frame p95 under 20 ms (6 runs, both stages)', worst < 20, json.dumps(runs))
            page.goto(BASE + '/company/', wait_until='networkidle')
            ctrl = page.evaluate(FRAMES, ['main', 2400])
            verdict('1440 control page (no canvas) frame p95', ctrl['p95'] < 20, json.dumps(ctrl))
            # Keyboard: tab into the capability tablist and move with arrows.
            page.goto(BASE + '/', wait_until='networkidle')
            page.locator('.caps__tab').first.focus()
            page.keyboard.press('ArrowDown')
            sel = page.evaluate("document.activeElement.getAttribute('aria-selected') + ' ' + document.activeElement.textContent")
            verdict('keyboard: ArrowDown moves the capability tab', sel.startswith('true') and 'Automation' in sel, sel)
            # Klyntar mode on /security/.
            page.goto(BASE + '/security/', wait_until='networkidle')
            page.wait_for_timeout(2500)
            page.mouse.move(10, 10)
            page.wait_for_timeout(1500)
            shot(page, '1440-20-security-head')
            lz = page.locator('[data-testid="guide-launcher"]')
            if lz.count():
                lz.click()
                page.wait_for_timeout(500)
                shot(page, '1440-21-klyntar-open')
                head = page.locator('[data-testid="guide-panel"]').inner_text()[:80]
                verdict('guide switches to Klyntar mode on /security/', 'Klyntar' in head and 'Security Mode' in head, head.replace('\n', ' | '))
            page.goto(BASE + '/automation/', wait_until='networkidle')
            page.wait_for_timeout(900)
            shot(page, '1440-22-service-automation')
            page.goto(BASE + '/work/', wait_until='networkidle')
            page.wait_for_timeout(600)
            page.screenshot(path=str(OUT / '1440-23-work-page.png'), full_page=True)
        if key == '390':
            page.goto(BASE + '/security/', wait_until='networkidle')
            page.wait_for_timeout(2500)
            lz = page.locator('[data-testid="guide-launcher"]')
            if lz.count():
                lz.click()
                page.wait_for_timeout(500)
                shot(page, '390-21-klyntar-open')
        verdict(f'{key} console errors', not errors, '; '.join(errors)[:300] or 'none')
        ctx.close()

    for key, (w, h) in {'1440': (1440, 900), '390': (390, 844)}.items():
        ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, reduced_motion='reduce')
        page = ctx.new_page()
        page.goto(BASE + '/', wait_until='networkidle')
        page.wait_for_timeout(900)
        sticky = page.evaluate("[...document.querySelectorAll('.stage__sticky')].map(s => getComputedStyle(s).display).join(',')")
        drawn = page.evaluate("""Array.from(document.querySelectorAll('canvas[data-still]')).map(c => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < x.length; i += 400) if (x[i] > 0) n++; return n })""")
        verdict(f'reduce {key} both stages unpinned', sticky == 'none', sticky)
        verdict(f'reduce {key} six stills drawn', len(drawn) == 6 and all(n > 40 for n in drawn), str(drawn))
        page.screenshot(path=str(OUT / f'reduce-{key}.png'), full_page=True)
        ctx.close()
    browser.close()

bad = [v for v in verdicts if v[1] == 'BREACHED']
print(f'\nSUMMARY {len(verdicts) - len(bad)}/{len(verdicts)} not breached; BREACHED: {[v[0] for v in bad]}')
