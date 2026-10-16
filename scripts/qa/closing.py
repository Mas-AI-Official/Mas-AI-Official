"""Closing drawing timing on the home page, in Chromium, WebKit and Firefox, phone to large desktop.
Per engine and viewport:
  1. entering (10% of the drawing on screen): it is still drawing, not pre-drawn (--p under 0.5, the mark not shown,
     the lines mostly undrawn: their dash offset over 0.5);
  2. fully in view (its bottom at the bottom of the screen): the system is complete, the M formed (--p 1, the core and
     the mark at full opacity, the lines and the gold ends fully drawn);
An offset the script cannot read is a failure, not a pass (Chromium reports "calc(0.85px)", WebKit "0.85px").
  3. scrolled on to mid-screen: it stays complete;
  4. reduced motion: drawn at once, already complete while entering.
Owner notes: 2026-10-14 "they should already make the M" (it finished only near mid-screen); 2026-10-15 checked on a
phone that the M is formed as the drawing comes into view.
Usage: python scripts/qa/closing.py [--base http://localhost:3344]"""
import argparse

from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('--base', default='http://localhost:3344')
A = ap.parse_args()

VIEWPORTS = [(390, 844, True), (375, 667, True), (320, 568, True), (768, 1024, True), (1280, 720, False), (1440, 900, False),
             (1920, 1080, False)]
# Put the drawing where `where` says, then read what is on screen.
PLACE = """(where) => { const s = document.querySelector('.closing__svg'), r = s.getBoundingClientRect(), vh = innerHeight
  const top = where === 'enter' ? vh - 0.1 * r.height : where === 'full' ? vh - r.height - 1 : vh / 2 - r.height / 2
  window.scrollTo({top: r.top + scrollY - top, behavior: 'instant'}) }"""
READ = """() => { const num = (v) => { const m = /-?[0-9.]+/.exec(v); return m ? parseFloat(m[0]) : NaN }
  const s = document.querySelector('.closing__svg'), r = s.getBoundingClientRect(), cs = (q) => getComputedStyle(document.querySelector(q))
  return {p: parseFloat(getComputedStyle(s).getPropertyValue('--p')), mark: parseFloat(cs('.closing__mark').opacity), core: parseFloat(cs('.closing__core').opacity),
    path: Math.max(...[...document.querySelectorAll('.closing__path')].map(e => num(getComputedStyle(e).strokeDashoffset))),
    end: Math.max(...[...document.querySelectorAll('.closing__end')].map(e => num(getComputedStyle(e).strokeDashoffset))),
    top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight} }"""

problems = []


def bad(msg):
    problems.append(msg)
    print('BREACHED', msg)


with sync_playwright() as pw:
    for engine in ('chromium', 'webkit', 'firefox'):
        browser = getattr(pw, engine).launch()
        for w, h, touch in VIEWPORTS:
            for motion in ('no-preference', 'reduce'):
                opts = {'viewport': {'width': w, 'height': h}, 'has_touch': touch, 'reduced_motion': motion}
                if touch and engine != 'firefox':
                    opts['is_mobile'] = True
                ctx = browser.new_context(**opts)
                page = ctx.new_page()
                tag = f'{engine} {w}x{h}{" reduced" if motion == "reduce" else ""}'
                page.goto(A.base + '/', wait_until='load', timeout=45000)
                page.wait_for_timeout(800)
                got = {}
                for where in ('enter', 'full', 'mid'):
                    page.evaluate(PLACE, where)
                    page.wait_for_timeout(250)
                    got[where] = page.evaluate(READ)
                e, f, m = got['enter'], got['full'], got['mid']
                if motion == 'reduce':
                    if e['mark'] < 0.99 or e['p'] < 0.99:
                        bad(f"{tag}: not drawn at once while entering: {e}")
                else:
                    if any(v != v for v in (e['path'], e['end'], f['path'], f['end'])):  # NaN
                        bad(f"{tag}: could not read a dash offset: enter {e} full {f}")
                    if e['p'] >= 0.5 or e['mark'] > 0.01 or not e['path'] > 0.5:
                        bad(f"{tag}: already drawn while only entering (should still be drawing): {e}")
                    if f['p'] < 0.99 or f['mark'] < 0.99 or f['core'] < 0.99 or not f['end'] < 0.01 or not f['path'] < 0.01:
                        bad(f"{tag}: the M is not complete when the drawing is fully in view: {f}")
                    if m['p'] < 0.99 or m['mark'] < 0.99:
                        bad(f"{tag}: not complete at mid-screen: {m}")
                print(f"{tag}: enter p={e['p']} lines={e['path']} mark={e['mark']} | full p={f['p']} lines={f['path']} ends={f['end']} mark={f['mark']} | mid p={m['p']}")
                ctx.close()
        browser.close()

print('VERDICT', 'HELD' if not problems else f'BREACHED ({len(problems)})')
