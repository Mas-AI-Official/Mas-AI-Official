"""Pass-4 checks, reported separately from the 50 in pass3.py: text enlargement through 200%, scrolling
both ways, viewport height changes, reduced motion with the deploy picker, the guide with a keyboard open,
and the launcher right after load. Usage: python scripts/qa/pass4.py [base_url] [out_dir]"""
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3344'
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else 'qa-pass4')
OUT.mkdir(parents=True, exist_ok=True)
verdicts = []


def verdict(name, ok, detail):
    state = 'INCONCLUSIVE' if ok is None else ('HELD' if ok else 'BREACHED')
    verdicts.append((name, state, detail))
    print(f'{state:12} {name}: {detail}')


GOTO = """(G) => { const s = document.querySelector('.stage'); const bs = [...s.querySelectorAll(':scope > .stage__block')];
  const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
  const k = Math.min(bs.length - 1, Math.floor(G)), b = bs[k];
  window.scrollTo({top: s.getBoundingClientRect().top + scrollY + b.offsetTop + (G - k) * b.offsetHeight - h, behavior: 'instant'}) }"""

# For each stage block: every readable element (headings, paragraphs, buttons, links) must be fully visible,
# below the header and below the pinned panel (when pinned), at some scroll position. At each block's rest
# position we also record what sits under the panel (obscured) versus below the fold (ordinary).
TEXT_AUDIT = """async () => {
  const s = document.querySelector('.stage'); const flow = s.hasAttribute('data-flow')
  const header = document.querySelector('.site-header').getBoundingClientRect().height
  const sticky = s.querySelector('.stage__sticky')
  const els = [...s.querySelectorAll('.stage__copy :is(h1, h2, p, a, button)')].filter(e => !e.closest('.visually-hidden') && !e.classList.contains('visually-hidden') && e.offsetParent !== null)
  // Desktop pins the canvas beside the copy, not above it: only phones have a panel over the copy.
  const panelFloor = () => flow || innerWidth >= 900 || getComputedStyle(sticky).display === 'none' ? header : Math.max(header, sticky.getBoundingClientRect().bottom + 28)
  const launcher = document.querySelector('[data-testid="guide-launcher"]')
  const lr = launcher ? launcher.getBoundingClientRect() : null
  const ceilingFor = (r) => lr && r.right > lr.left - 4 ? Math.min(innerHeight, lr.top - 4) : innerHeight
  // An element taller than the reading window is readable when its top and its bottom each enter the window
  // (the lines between pass through it while scrolling); a shorter one must be fully inside it once.
  const topSeen = new Set(), bottomSeen = new Set(), whole = new Set()
  const top0 = s.getBoundingClientRect().top + scrollY - header, end = top0 + s.offsetHeight
  for (let y = Math.max(0, top0 - innerHeight); y <= end; y += 24) {
    window.scrollTo({top: y, behavior: 'instant'}); await new Promise(r => requestAnimationFrame(() => r()))
    const floor = panelFloor()
    els.forEach((e, i) => { const r = e.getBoundingClientRect(); if (!r.height || getComputedStyle(e).opacity !== '1') return
      const ceil = ceilingFor(r)
      if (r.top >= floor - 1 && r.bottom <= ceil + 1) whole.add(i)
      if (r.top >= floor - 1 && r.top < ceil) topSeen.add(i)
      if (r.bottom <= ceil + 1 && r.bottom > floor) bottomSeen.add(i) })
  }
  // "Taller than the window" uses the same window the element is read through (floor to its ceiling).
  const never = els.filter((e, i) => { const r = e.getBoundingClientRect(); return !whole.has(i) && !(topSeen.has(i) && bottomSeen.has(i) && r.height > ceilingFor(r) - panelFloor() - 24) })  // 24 = the scroll sampling step.map(e => (e.textContent || '').trim().slice(0, 40))
  const rest = []
  for (const b of s.querySelectorAll(':scope > .stage__block')) {
    window.scrollTo({top: s.getBoundingClientRect().top + scrollY + b.offsetTop - header, behavior: 'instant'}); await new Promise(r => requestAnimationFrame(() => r()))
    const floor = panelFloor()
    const c = b.querySelector('.stage__copy').getBoundingClientRect()
    rest.push({id: b.id, under_panel: Math.max(0, Math.round(floor - c.top)), below_fold: Math.max(0, Math.round(c.bottom - innerHeight))})
  }
  // Desktop: the copy column must end before the canvas begins (its left fade is 40 px wide).
  let overlap = 0
  if (innerWidth >= 900) {
    const cv = s.querySelector('.stage__canvas').getBoundingClientRect()
    overlap = Math.max(0, Math.round(Math.max(...els.map(e => e.getBoundingClientRect().right)) - (cv.left + 40)))
  }
  return {flow, never, rest, overlap, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth}
}"""


def text_case(browser, w, h, scale):
    ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2, is_mobile=w < 768, has_touch=w < 768)
    page = ctx.new_page()
    # The browser's own default-font-size setting (what a visitor changes), so rem, em and em-based media
    # queries all scale, unlike a CSS root override.
    ctx.new_cdp_session(page).send('Page.setFontSizes', {'fontSizes': {'standard': round(16 * scale / 100), 'fixed': round(13 * scale / 100)}})
    page.goto(BASE + '/', wait_until='networkidle')
    page.wait_for_timeout(700)
    r = page.evaluate(TEXT_AUDIT)
    obscured = [x for x in r['rest'] if x['under_panel'] > 0]
    ok = not r['never'] and not obscured and r['overflow'] <= 0 and r['overlap'] <= 0
    mode = 'flow' if r['flow'] else 'pinned'
    verdict(f'{w}x{h} text {scale}%: every line readable, none under the panel', ok,
            f"{mode}; never visible={r['never']}; under panel at rest={obscured}; below fold at rest (ordinary)={[x['id'] + ':' + str(x['below_fold']) for x in r['rest'] if x['below_fold']]}; overflow={r['overflow']}; copy over canvas={r['overlap']}")
    if scale in (130, 200) and w in (375, 390):
        page.evaluate(GOTO, 4)
        page.wait_for_timeout(300)
        page.screenshot(path=str(OUT / f'text-{w}x{h}-{scale}.png'))
    ctx.close()


def mean_diff(a, b):
    from PIL import Image, ImageChops, ImageStat
    d = ImageChops.difference(Image.open(a).convert('L'), Image.open(b).convert('L'))
    return ImageStat.Stat(d).mean[0]


with sync_playwright() as p:
    browser = p.chromium.launch()

    # 1. Text enlargement, including the case that failed in pass 3 (375x667 at 130%).
    for (w, h) in ((375, 667), (390, 844), (320, 568)):
        for scale in (100, 115, 130, 150, 175, 200):
            text_case(browser, w, h, scale)
    for scale in (100, 200):
        text_case(browser, 1440, 900, scale)

    # 2. Scrolling both directions: the same story position looks the same from above and from below.
    for (w, h) in ((1440, 900), (390, 844)):
        ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, is_mobile=w < 768, has_touch=w < 768)
        page = ctx.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(BASE + '/', wait_until='networkidle')
        page.wait_for_timeout(8000)
        diffs = {}
        for G in (1, 2, 3, 4, 5, 6):
            page.evaluate(GOTO, G)
            page.wait_for_timeout(700)
            page.screenshot(path=str(OUT / f'dir-{w}-{G}-down.png'))
        page.evaluate(GOTO, 6.6)
        page.wait_for_timeout(700)
        for G in (6, 5, 4, 3, 2, 1):
            page.evaluate(GOTO, G)
            page.wait_for_timeout(700)
            page.screenshot(path=str(OUT / f'dir-{w}-{G}-up.png'))
            diffs[G] = round(mean_diff(OUT / f'dir-{w}-{G}-down.png', OUT / f'dir-{w}-{G}-up.png'), 2)
        page.evaluate(GOTO, 0)
        page.wait_for_timeout(700)
        state = page.evaluate("[getComputedStyle(document.querySelector('.stage__trace')).opacity, getComputedStyle(document.querySelector('.stage__shot')).opacity]")
        # G 5 runs a live log and moving items, so it gets a looser bound than the settled acts.
        verdict(f'{w} scroll down then up: acts 1 to 6 match from both directions (mean pixel diff < 6, runs < 12)', all(v < (12 if G == 5 else 6) for G, v in diffs.items()) and not errors, f'diff by G {diffs}; errors {errors[:2]}')
        verdict(f'{w} back at the top: trace shown, screenshot hidden', float(state[0]) > 0.9 and float(state[1]) < 0.01, f'trace {state[0]}, shot {state[1]}')
        ctx.close()

    # 3. Viewport height changes on a phone (URL bar, rotation, split screen): no copy under the panel.
    ctx = browser.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(BASE + '/', wait_until='networkidle')
    page.wait_for_timeout(600)
    for h in (844, 700, 560, 480, 844):
        page.set_viewport_size({'width': 390, 'height': h})
        page.wait_for_timeout(500)
        r = page.evaluate(TEXT_AUDIT)
        obscured = [x for x in r['rest'] if x['under_panel'] > 0]
        verdict(f'390x{h} after a height change: no copy under the panel', not obscured and not r['never'], f"{'flow' if r['flow'] else 'pinned'}; under panel {obscured}; never {r['never']}")
    verdict('height changes: no page errors', not errors, '; '.join(errors)[:200] or 'none')
    ctx.close()

    flips = []
    for w in (360, 375, 390):
        ctx = browser.new_context(viewport={'width': w, 'height': 640}, device_scale_factor=1, is_mobile=True, has_touch=True)
        page = ctx.new_page()
        page.goto(BASE + '/', wait_until='networkidle')
        page.wait_for_timeout(500)
        for h in range(560, 700, 2):
            page.set_viewport_size({'width': w, 'height': h})
            n = page.evaluate('''() => new Promise(res => { const s = document.querySelector(".stage"); let n = 0;
              const mo = new MutationObserver(() => n++); mo.observe(s, {attributes: true, attributeFilter: ["data-flow"]});
              setTimeout(() => { mo.disconnect(); res(n) }, 400) })''')
            if n > 1:
                flips.append(f'{w}x{h}:{n}')
        ctx.close()
    verdict('phone heights 560 to 698 px in 2 px steps: pinned/flow never oscillates', not flips, f'oscillating sizes {flips[:8]}' if flips else 'no size toggled more than once')

    for (w, h) in ((1440, 900), (390, 844)):
        ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, is_mobile=w < 768, has_touch=w < 768)
        page = ctx.new_page()
        page.goto(BASE + '/', wait_until='networkidle')
        page.wait_for_timeout(600)
        bad = []
        canvas_sig = "(() => { const c = document.querySelector('.stage__canvas'); const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < x.length; i += 211) h = (h * 31 + x[i]) >>> 0; return h })()"
        for G in (3.7, 4.0, 4.3, 4.5, 4.7):
            page.evaluate(GOTO, G)
            page.wait_for_timeout(400)
            btn = page.get_by_role('button', name='Hybrid', exact=True)
            box = btn.bounding_box()
            if not box or box['y'] < 64 or box['y'] + box['height'] > h:
                continue
            page.get_by_role('button', name='Local', exact=True).click()
            page.wait_for_timeout(450)
            page.evaluate("new Promise(r => requestAnimationFrame(() => r()))")
            a = page.screenshot(clip={'x': 0, 'y': 64, 'width': w, 'height': h - 64})
            btn.click()
            page.wait_for_timeout(450)
            b = page.screenshot(clip={'x': 0, 'y': 64, 'width': w, 'height': h - 64})
            from io import BytesIO
            from PIL import Image, ImageChops, ImageStat
            d = ImageStat.Stat(ImageChops.difference(Image.open(BytesIO(a)).convert('L'), Image.open(BytesIO(b)).convert('L'))).mean[0]
            if d < 0.15:
                bad.append(f'G {G}: diff {d:.3f}')
        verdict(f'{w}: wherever the deploy picker is on screen, a mode change visibly changes the drawing', not bad, '; '.join(bad) or 'every visible position redraws')
        ctx.close()

    # 4. Reduced motion: stills, and the deploy picker redraws its still.
    ctx = browser.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=1, reduced_motion='reduce', is_mobile=True, has_touch=True)
    page = ctx.new_page()
    page.goto(BASE + '/', wait_until='networkidle')
    page.wait_for_timeout(800)
    sig = "(() => { const c = document.querySelector('canvas[data-still=\"4\"]'); const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < x.length; i += 97) h = (h * 31 + x[i]) >>> 0; return h })()"
    before = page.evaluate(sig)
    page.get_by_role('button', name='Hybrid', exact=True).click()
    page.wait_for_timeout(300)
    after = page.evaluate(sig)
    pressed = page.get_by_role('button', name='Hybrid', exact=True).get_attribute('aria-pressed')
    verdict('reduced motion: deploy picker redraws the still and keeps state', before != after and pressed == 'true', f'still hash {before} -> {after}, pressed {pressed}')
    page.screenshot(path=str(OUT / 'reduce-390-deploy-hybrid.png'), full_page=False)
    ctx.close()

    # 5. Guide on a phone with the keyboard open (simulated by shrinking the viewport), then a question.
    ctx = browser.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    page.goto(BASE + '/', wait_until='networkidle')
    launcher = page.locator('[data-testid="guide-launcher"]')
    launcher.wait_for(state='visible', timeout=8000)
    launcher.click()
    panel = page.locator('[data-testid="guide-panel"]')
    panel.wait_for(state='visible', timeout=3000)
    inp = panel.locator('input, textarea').first
    inp.click()
    page.set_viewport_size({'width': 390, 'height': 480})
    page.wait_for_timeout(500)
    box = inp.bounding_box()
    head = panel.locator('text=Daena').first.bounding_box()
    vis = box is not None and box['y'] >= 0 and box['y'] + box['height'] <= 480
    verdict('guide with keyboard open (390x480): input fully on screen', vis, f'input {box}, header {head}')
    inp.fill('what do you build')
    page.keyboard.press('Enter')
    page.wait_for_timeout(1200)
    text = panel.inner_text()
    verdict('guide with keyboard open: greeting unchanged and the frozen answer arrives', "Hi. I'm Daena, the governance side of MAS-AI." in text and 'We build what a business is missing' in text, text[-160:].replace('\n', ' | '))
    page.screenshot(path=str(OUT / 'guide-keyboard-390x480.png'))
    ctx.close()

    # 6. Launcher right after load (mobile lab throttling): time to visible, opens on the first tap.
    for rate in (1, 4):
        ctx = browser.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        page = ctx.new_page()
        cdp = ctx.new_cdp_session(page)
        cdp.send('Emulation.setCPUThrottlingRate', {'rate': rate})
        page.goto(BASE + '/', wait_until='domcontentloaded')
        t0 = page.evaluate('performance.now()')
        page.locator('[data-testid="guide-launcher"]').wait_for(state='visible', timeout=15000)
        t1 = page.evaluate('performance.now()')
        page.locator('[data-testid="guide-launcher"]').click()
        page.locator('[data-testid="guide-panel"]').wait_for(state='visible', timeout=5000)
        t2 = page.evaluate('performance.now()')
        greet = page.locator('[data-testid="guide-panel"]').inner_text()
        nav = page.evaluate("Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd)")
        verdict(f'launcher at {rate}x CPU: visible and opens on first tap with the unchanged greeting', "Hi. I'm Daena, the governance side of MAS-AI." in greet, f'DOMContentLoaded {nav} ms, launcher visible {round(t1)} ms, panel open {round(t2 - t1)} ms after the tap')
        ctx.close()
    browser.close()

bad = [v for v in verdicts if v[1] == 'BREACHED']
print(f'\nADDITIONAL SUMMARY {len(verdicts) - len(bad)}/{len(verdicts)} not breached; BREACHED: {[v[0] for v in bad]}')
(OUT / 'pass4.json').write_text(json.dumps(verdicts, indent=1), encoding='utf-8')
