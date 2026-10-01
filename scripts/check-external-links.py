"""External link check for the static export: every https link must answer a logged-out visitor.
The internal link gate (check-links.mjs) cannot see a link to a private repo or a dead demo; this can.
Usage: python scripts/check-external-links.py   (after npm run build). Prints VERDICT HELD or BREACHED.
LinkedIn answers 999 to bots and Calendly may rate-limit, so those two codes are reported, not failed."""
import collections
import glob
import re
import subprocess
import sys

SOFT = {'999', '429'}
links = collections.defaultdict(set)
for f in glob.glob('out/**/*.html', recursive=True):
    f = f.replace(chr(92), '/')
    if '/_orig' in f:
        continue
    html = open(f, encoding='utf-8', errors='ignore').read()
    for u in re.findall(r'href="(https?://[^"#]+)"', html):
        if 'fonts.g' in u or 'schema.org' in u:
            continue
        links[u].add(f[len('out/'):])

bad = 0
for u in sorted(links):
    r = subprocess.run(['curl', '-s', '-o', '/dev/null', '-L', '-A', 'Mozilla/5.0', '--max-time', '20', '-w', '%{http_code}', u],
                       capture_output=True, text=True)
    code = r.stdout.strip() or 'ERR'
    ok = code.startswith('2') or code.startswith('3') or code in SOFT
    if not ok:
        bad += 1
    pages = sorted(links[u])
    print(f"{'ok ' if ok else 'BAD'} {code} {u}  ({len(pages)} pages, e.g. {pages[0]})")
print('VERDICT', 'HELD' if not bad else f'BREACHED ({bad})')
sys.exit(1 if bad else 0)
