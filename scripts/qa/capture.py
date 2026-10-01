"""Section-by-section screenshots of a served export, for design review.

Usage: python scripts/qa/capture.py [base_url] [out_dir] [--path /] [--vp 1440x900,390x844] [--reduce]
Each section with an id under <main> is scrolled to the top, then captured at the viewport size.
Also prints page errors and console errors, which count as a failed capture.
"""
import asyncio
import sys
from pathlib import Path

from playwright.async_api import async_playwright

args = [a for a in sys.argv[1:] if not a.startswith('--')]
BASE = args[0] if args else 'http://localhost:3344'
OUT = Path(args[1] if len(args) > 1 else 'qa-shots')
PATH = sys.argv[sys.argv.index('--path') + 1] if '--path' in sys.argv else '/'
VPS = sys.argv[sys.argv.index('--vp') + 1] if '--vp' in sys.argv else '1440x900,390x844'
REDUCE = '--reduce' in sys.argv


async def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    errors: list[str] = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for vp in VPS.split(','):
            w, h = (int(x) for x in vp.split('x'))
            ctx = await browser.new_context(
                viewport={'width': w, 'height': h},
                device_scale_factor=1,
                reduced_motion='reduce' if REDUCE else 'no-preference',
                has_touch=w < 768,
                is_mobile=w < 768,
            )
            page = await ctx.new_page()
            page.on('pageerror', lambda e: errors.append(f'pageerror {e}'))
            page.on('console', lambda m: errors.append(f'console.{m.type} {m.text}') if m.type == 'error' else None)
            await page.goto(BASE + PATH, wait_until='networkidle')
            await page.wait_for_timeout(2600)
            tag = PATH.strip('/').replace('/', '_') or 'home'
            await page.screenshot(path=str(OUT / f'{tag}-{vp}-00-top.png'))
            ids = await page.eval_on_selector_all('main section[id], main [data-shot]', 'els => els.map(e => e.id || e.dataset.shot)')
            for i, sid in enumerate(ids, 1):
                await page.evaluate(
                    '(id) => { const el = document.getElementById(id) || document.querySelector(`[data-shot="${id}"]`); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 64) }',
                    sid,
                )
                await page.wait_for_timeout(900)
                await page.screenshot(path=str(OUT / f'{tag}-{vp}-{i:02d}-{sid}.png'))
            sw = await page.evaluate('document.documentElement.scrollWidth')
            if sw > w:
                errors.append(f'horizontal overflow at {vp}: scrollWidth {sw} > {w}')
            await ctx.close()
        await browser.close()
    for e in errors:
        print('ERROR', e)
    print(f'captured into {OUT}; errors: {len(errors)}')
    return 1 if errors else 0


sys.exit(asyncio.run(main()))
