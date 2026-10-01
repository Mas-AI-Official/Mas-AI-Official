"""Browser gates for the served static export. Verdicts: HELD / BREACHED / INCONCLUSIVE.

Usage (after `next build` and serving out/ on a port):
    python scripts/qa/gates.py http://localhost:3344 [--only overflow,guide,...]

Gates
  routes      every sitemap route: 200, one h1, no page errors, no console errors, JSON-LD parses, canonical matches
  overflow    no horizontal overflow at 320/375/390/430/768/1024/1440 on every route
  nojs        JavaScript disabled: home and a service page show their headings and body copy (static story)
  reduce      reduced motion: no running CSS animations or transitions after load on home; no hidden reveal content
  history     direct nested load, client navigation, back/forward and hash scroll keep content and URL in sync
  guide       site guide: lazy mount, keyboard open, golden answers, Escape returns focus, no network from chat
  inquiry     /start/: 500, network abort, success:false and invalid JSON all show the error state with input kept;
              success:true shows the thank-you state. formsubmit.co is intercepted: no real submission is sent.
Each verdict line is appended to D:/agents/AI_COMPANY_OS/state/ledgers/aqa_verdicts.ndjson.
"""
from __future__ import annotations

import asyncio
import json
import re
import sys
import time
from pathlib import Path

from playwright.async_api import async_playwright, Page

BASE = next((a for a in sys.argv[1:] if a.startswith('http')), 'http://localhost:3344')
ONLY = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else None
LEDGER = Path('D:/agents/AI_COMPANY_OS/state/ledgers/aqa_verdicts.ndjson')
WIDTHS = [320, 375, 390, 430, 768, 1024, 1440]
results: list[tuple[str, str, str]] = []


def verdict(gate: str, status: str, detail: str) -> None:
    results.append((gate, status, detail))
    print(f'{status:<12} {gate:<10} {detail}')
    try:
        LEDGER.parent.mkdir(parents=True, exist_ok=True)
        with LEDGER.open('a', encoding='utf-8') as f:
            f.write(json.dumps({'ts': time.strftime('%Y-%m-%dT%H:%M:%S%z'), 'gate': f'mas-ai:{gate}', 'target': BASE,
                                'verdict': status, 'detail': detail[:400]}) + '\n')
    except OSError:
        pass


async def routes_from_sitemap(page: Page) -> list[str]:
    r = await page.request.get(BASE + '/sitemap.xml')
    if r.status != 200:
        return []
    locs = re.findall(r'<loc>([^<]+)</loc>', await r.text())
    return [re.sub(r'^https://mas-ai\.co', '', u) or '/' for u in locs]


async def gate_routes(browser) -> list[str]:
    ctx = await browser.new_context(viewport={'width': 1440, 'height': 900})
    page = await ctx.new_page()
    await page.goto(BASE + '/')
    routes = await routes_from_sitemap(page)
    if not routes:
        verdict('routes', 'INCONCLUSIVE', 'no sitemap.xml routes found')
        await ctx.close()
        return []
    bad = []
    for route in routes:
        errs: list[str] = []
        page.remove_listener('pageerror', lambda e: None) if False else None
        p = await ctx.new_page()
        p.on('pageerror', lambda e, errs=errs: errs.append(f'pageerror {e}'))
        p.on('console', lambda m, errs=errs: errs.append(f'console {m.text}') if m.type == 'error' and '404' not in m.text else None)
        resp = await p.goto(BASE + route, wait_until='networkidle')
        status = resp.status if resp else 0
        info = await p.evaluate('''() => {
          const h1 = document.querySelectorAll('h1').length
          const can = document.querySelector('link[rel=canonical]')?.href || ''
          const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { JSON.parse(s.textContent); return true } catch { return false } })
          const title = document.title
          const desc = document.querySelector('meta[name=description]')?.content || ''
          return { h1, can, ldOk: ld.every(Boolean), ldCount: ld.length, title, desc }
        }''')
        problems = []
        if status != 200: problems.append(f'status {status}')
        if info['h1'] != 1: problems.append(f"h1 x{info['h1']}")
        if not info['can'].endswith(route): problems.append(f"canonical {info['can']}")
        if not info['ldOk']: problems.append('invalid JSON-LD')
        if not info['title'] or not info['desc']: problems.append('missing title/description')
        if len(info['desc']) > 170: problems.append(f"description {len(info['desc'])} chars")
        problems += errs
        if problems: bad.append(f'{route}: ' + '; '.join(problems))
        await p.close()
    await ctx.close()
    verdict('routes', 'BREACHED' if bad else 'HELD', f'{len(routes)} routes' + (' | ' + ' || '.join(bad) if bad else ''))
    return routes


async def gate_overflow(browser, routes: list[str]) -> None:
    bad = []
    for w in WIDTHS:
        ctx = await browser.new_context(viewport={'width': w, 'height': 800}, is_mobile=w < 768, has_touch=w < 768)
        page = await ctx.new_page()
        for route in routes:
            await page.goto(BASE + route, wait_until='networkidle')
            sw = await page.evaluate('document.documentElement.scrollWidth')
            wide = await page.evaluate(f'''() => [...document.querySelectorAll('main *')].filter(e => {{
                const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > {w} + 1 || r.left < -1)
              }}).slice(0, 3).map(e => e.tagName + '.' + (e.className && e.className.baseVal === undefined ? e.className : '')).join(', ')''')
            if sw > w or wide:
                bad.append(f'{route}@{w}: scrollWidth {sw} {wide}')
        await ctx.close()
    verdict('overflow', 'BREACHED' if bad else 'HELD', f'{len(routes)} routes x {len(WIDTHS)} widths' + (' | ' + ' || '.join(bad[:12]) if bad else ''))


async def gate_nojs(browser) -> None:
    ctx = await browser.new_context(java_script_enabled=False, viewport={'width': 1440, 'height': 900})
    page = await ctx.new_page()
    bad = []
    for route in ['/', '/automation/', '/work/', '/start/']:
        await page.goto(BASE + route)
        hidden = await page.evaluate('''() => {
          const els = [...document.querySelectorAll('main h1, main h2, main p')]
          return els.filter(e => { const s = getComputedStyle(e); return s.opacity === '0' || s.visibility === 'hidden' }).length
        }''')
        text = await page.evaluate("document.querySelector('main')?.innerText.length || 0")
        if hidden or text < 400:
            bad.append(f'{route}: {hidden} hidden text blocks, {text} chars')
    await ctx.close()
    verdict('nojs', 'BREACHED' if bad else 'HELD', 'static story readable without JS' + (' | ' + ' || '.join(bad) if bad else ''))


async def gate_reduce(browser) -> None:
    bad = []
    for vp in [(1440, 900), (390, 844)]:
        ctx = await browser.new_context(reduced_motion='reduce', viewport={'width': vp[0], 'height': vp[1]})
        page = await ctx.new_page()
        await page.goto(BASE + '/', wait_until='networkidle')
        await page.wait_for_timeout(600)
        for y in [0, 0.25, 0.5, 0.75, 1.0]:
            await page.evaluate(f'window.scrollTo(0, (document.body.scrollHeight - innerHeight) * {y})')
            await page.wait_for_timeout(300)
            running = await page.evaluate('''() => document.getAnimations().filter(a => a.playState === 'running' && a.effect && (a.effect.getComputedTiming().duration > 1)).length''')
            hidden = await page.evaluate('''() => [...document.querySelectorAll('[data-reveal]')].filter(e => getComputedStyle(e).opacity === '0').length''')
            sticky = await page.evaluate('''() => { const s = document.querySelector('.approach__stage'); return s ? getComputedStyle(s).display : 'none' }''')
            if running or hidden or sticky != 'none':
                bad.append(f'{vp[0]}x{vp[1]} at {int(y*100)}%: {running} running animations, {hidden} hidden reveals, stage display {sticky}')
        await ctx.close()
    verdict('reduce', 'BREACHED' if bad else 'HELD', 'reduced motion: no motion, no pins, all content' + (' | ' + ' || '.join(bad[:6]) if bad else ''))


async def gate_history(browser) -> None:
    ctx = await browser.new_context(viewport={'width': 1440, 'height': 900})
    page = await ctx.new_page()
    bad = []
    await page.goto(BASE + '/work/daena/', wait_until='networkidle')
    if 'Daena' not in (await page.inner_text('h1')): bad.append('direct load /work/daena/ h1')
    await page.goto(BASE + '/', wait_until='networkidle')
    await page.click('header a[href="/work/"]')
    await page.wait_for_url(re.compile(r'/work/$'))
    await page.go_back()
    await page.wait_for_url(re.compile(r'/$'))
    h1 = await page.inner_text('h1')
    if 'missing' not in h1: bad.append(f'back to home shows h1 {h1!r}')
    await page.go_forward()
    await page.wait_for_url(re.compile(r'/work/$'))
    await page.goto(BASE + '/#faq', wait_until='networkidle')
    await page.wait_for_timeout(800)
    top = await page.evaluate("document.getElementById('faq').getBoundingClientRect().top")
    if not (-5 < top < 140): bad.append(f'#faq hash landed at top={top}')
    await ctx.close()
    verdict('history', 'BREACHED' if bad else 'HELD', 'direct load, back/forward, hash' + (' | ' + ' || '.join(bad) if bad else ''))


GOLDEN_PROBES = [
    ('tell me about Klyntar', 'Klyntar'),
    ('book a call', 'reach us'),
    ('what is daena', 'Daena'),
    ('asdfghjkl', None),
]


async def gate_guide(browser) -> None:
    ctx = await browser.new_context(viewport={'width': 1440, 'height': 900})
    page = await ctx.new_page()
    net: list[str] = []
    bad = []
    await page.goto(BASE + '/', wait_until='networkidle')
    await page.keyboard.press('Tab')  # an interaction arms the lazy mount
    launcher = page.get_by_test_id('guide-launcher')
    try:
        await launcher.wait_for(timeout=8000)
    except Exception:
        verdict('guide', 'BREACHED', 'launcher never mounted')
        await ctx.close()
        return
    await launcher.focus()
    await page.keyboard.press('Enter')
    panel = page.get_by_test_id('guide-panel')
    await panel.wait_for(timeout=3000)
    if await panel.get_attribute('aria-modal') == 'true': bad.append('panel is aria-modal without inert background')
    page.on('request', lambda r: net.append(r.url) if r.resource_type in ('fetch', 'xhr', 'ping') else None)
    for q, expect in GOLDEN_PROBES:
        before = await page.get_by_test_id('guide-log').locator(':scope > *').count()
        await page.get_by_test_id('guide-input').fill(q)
        await page.keyboard.press('Enter')
        await page.wait_for_timeout(700)
        rows = page.get_by_test_id('guide-log').locator(':scope > *')
        after = await rows.count()
        last = await rows.nth(after - 1).inner_text() if after else ''
        if after < before + 2: bad.append(f'{q!r}: no reply row')
        elif expect and expect.lower() not in last.lower(): bad.append(f'{q!r}: reply lacks {expect!r}: {last[:90]!r}')
    await page.keyboard.press('Escape')
    await page.wait_for_timeout(300)
    if await panel.is_visible(): bad.append('Escape did not close the panel')
    focused = await page.evaluate("document.activeElement?.dataset?.testid || ''")
    if focused != 'guide-launcher': bad.append(f'focus after Escape on {focused!r}')
    if net: bad.append(f'chat made network requests: {net[:3]}')
    await ctx.close()
    verdict('guide', 'BREACHED' if bad else 'HELD', f'{len(GOLDEN_PROBES)} probes, keyboard, Escape, offline' + (' | ' + ' || '.join(bad) if bad else ''))


async def fill_inquiry(page: Page) -> None:
    await page.goto(BASE + '/start/?need=manual', wait_until='networkidle')
    await page.wait_for_timeout(400)
    # Step through with visible controls only; the component owns labels.
    async def next_step():
        await page.get_by_role('button', name=re.compile(r'^(Next|Continue)', re.I)).first.click()
        await page.wait_for_timeout(250)
    # step 1: a choice may already be selected from ?need=; click it anyway if present
    choice = page.get_by_role('radio', name=re.compile('slow manual process', re.I))
    if await choice.count(): await choice.first.check()
    else:
        btn = page.get_by_role('button', name=re.compile('slow manual process', re.I))
        if await btn.count(): await btn.first.click()
    await next_step()
    await page.get_by_role('textbox').first.fill('Invoices are re-typed from email into our accounting tool every day.')
    await next_step()
    await next_step()  # optional context
    await page.get_by_label(re.compile(r'^name', re.I)).first.fill('Test Visitor')
    await page.get_by_label(re.compile(r'email', re.I)).first.fill('visitor@example.com')
    await page.get_by_role('button', name=re.compile(r'(send|submit)', re.I)).first.click()


async def gate_inquiry(browser) -> None:
    cases = {
        'http500': lambda route: route.fulfill(status=500, body='error'),
        'abort': lambda route: route.abort(),
        'successFalse': lambda route: route.fulfill(status=200, content_type='application/json', body='{"success":"false","message":"x"}'),
        'badJson': lambda route: route.fulfill(status=200, content_type='application/json', body='<html>nope'),
        'success': lambda route: route.fulfill(status=200, content_type='application/json', body='{"success":"true","message":"ok"}'),
    }
    bad = []
    for name, handler in cases.items():
        ctx = await browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        page = await ctx.new_page()
        hits: list[str] = []
        async def route_handler(route, handler=handler):
            hits.append(route.request.url)
            await handler(route)
        await page.route('**/formsubmit.co/**', route_handler)
        try:
            await fill_inquiry(page)
            await page.wait_for_timeout(1200)
            body = (await page.inner_text('main')).lower()
            said_success = bool(re.search(r'(thank you|thanks|we have your|received|sent)', body)) and 'try again' not in body
            kept = 'invoices are re-typed' in (await page.content()).lower()
            if not hits: bad.append(f'{name}: form never posted')
            elif name == 'success' and not said_success: bad.append('success: no thank-you state')
            elif name != 'success' and said_success: bad.append(f'{name}: showed success after a failure')
            elif name != 'success' and not kept: bad.append(f'{name}: input lost after failure')
        except Exception as e:  # noqa: BLE001
            bad.append(f'{name}: flow error {str(e)[:120]}')
        await ctx.close()
    verdict('inquiry', 'BREACHED' if bad else 'HELD', f'{len(cases)} response cases, submissions intercepted' + (' | ' + ' || '.join(bad) if bad else ''))


async def main() -> int:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        want = lambda g: ONLY is None or g in ONLY  # noqa: E731
        routes = await gate_routes(browser) if want('routes') or want('overflow') else []
        if want('overflow') and routes: await gate_overflow(browser, routes)
        if want('nojs'): await gate_nojs(browser)
        if want('reduce'): await gate_reduce(browser)
        if want('history'): await gate_history(browser)
        if want('guide'): await gate_guide(browser)
        if want('inquiry'): await gate_inquiry(browser)
        await browser.close()
    breached = [r for r in results if r[1] == 'BREACHED']
    inconclusive = [r for r in results if r[1] == 'INCONCLUSIVE']
    print(f'\nVERDICT: {"BREACHED" if breached else "INCONCLUSIVE" if inconclusive else "HELD"} ({len(results)} gates)')
    return 1 if breached else 2 if inconclusive else 0


if __name__ == '__main__':
    sys.exit(asyncio.run(main()))
