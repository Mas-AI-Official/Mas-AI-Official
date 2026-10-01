"""Screen recordings of the homepage story: scroll down through every act (picking a deployment mode on the
way), on to the closing, back up to the hero, then open the guide. Desktop 1440x900 and phone 390x844.
Usage: python scripts/qa/record.py [base_url] [out_dir]. Needs ffmpeg on PATH for the mp4 copies."""
import shutil
import subprocess
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3344'
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else 'qa-video')
OUT.mkdir(parents=True, exist_ok=True)


def glide(page, to_y, px_per_s=520, fps=30):
    """Scroll with wheel steps at a reading pace, like a person with a trackpad."""
    y = page.evaluate('scrollY')
    step = px_per_s / fps * (1 if to_y > y else -1)
    while (to_y - y) * step > 0:
        page.mouse.wheel(0, step)
        page.wait_for_timeout(1000 // fps)
        y = page.evaluate('scrollY')
        if abs(to_y - y) < abs(step):
            break


def block_top(page, sel):
    return page.evaluate(f"document.querySelector('{sel}').getBoundingClientRect().top + scrollY - 64")


with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, (w, h), mobile in (('desktop-1440', (1440, 900), False), ('phone-390', (390, 844), True)):
        ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, is_mobile=mobile, has_touch=mobile,
                                  record_video_dir=str(OUT / 'raw'), record_video_size={'width': w, 'height': h})
        page = ctx.new_page()
        page.goto(BASE + '/', wait_until='networkidle')
        page.mouse.move(w * 0.72, h * 0.5)
        page.wait_for_timeout(8000)  # the hero intro: quiet, friction, the gap found, gold closes the rule
        glide(page, block_top(page, '#deploy'))
        page.wait_for_timeout(900)
        for label in ('Local', 'Cloud', 'Hybrid'):
            page.get_by_role('button', name=label, exact=True).click()
            page.wait_for_timeout(1100)
        glide(page, block_top(page, '#daena'))
        page.wait_for_timeout(1500)
        glide(page, block_top(page, '#start'), px_per_s=1400)
        page.wait_for_timeout(1500)
        glide(page, 0, px_per_s=900)  # back up through every act
        page.wait_for_timeout(1500)
        page.locator('[data-testid="guide-launcher"]').click()
        page.wait_for_timeout(2500)
        video = page.video.path()
        ctx.close()
        dest = OUT / f'{name}.webm'
        shutil.move(video, dest)
        if shutil.which('ffmpeg'):
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(dest), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-movflags', '+faststart', str(OUT / f'{name}.mp4')], check=False)
        print(name, dest)
    browser.close()
