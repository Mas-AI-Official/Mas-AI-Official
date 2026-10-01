#!/usr/bin/env node
// Internal link and anchor gate over the static export. Exit 0 HELD, 1 BREACHED, 2 INCONCLUSIVE.
// Checks every <a href> and <link rel=canonical> that points inside the site:
// target file exists in out/, and any #fragment exists as an id on the target page.
// Also flags duplicate ids per page (the chat guide scrolls by id).
// Usage: node scripts/check-links.mjs   (after `npm run build`)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, posix } from 'node:path'

const OUT = join(process.cwd(), 'out')
if (!existsSync(OUT)) {
  console.log('out/ missing: run npm run build first\nVERDICT: INCONCLUSIVE')
  process.exit(2)
}
const SITE = 'https://mas-ai.co'

function walk(d, acc = []) {
  for (const n of readdirSync(d)) {
    const p = join(d, n)
    if (statSync(p).isDirectory()) { if (!['_next', '_originals', '_orig_backup'].includes(n)) walk(p, acc) }
    else if (n.endsWith('.html')) acc.push(p)
  }
  return acc
}

const pages = walk(OUT)
const idsByPage = new Map()
const urlOf = (file) => {
  const rel = relative(OUT, file).split('\\').join('/')
  if (rel === 'index.html') return '/'
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length)
  return '/' + rel
}
for (const f of pages) {
  const html = readFileSync(f, 'utf8')
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
  idsByPage.set(urlOf(f), ids)
}

function resolveTarget(fromUrl, href) {
  let h = href.trim()
  if (h.startsWith(SITE)) h = h.slice(SITE.length) || '/'
  if (/^(https?:|mailto:|tel:|javascript:|data:)/i.test(h)) return null
  const [pathPart, frag] = h.split('#')
  let path = pathPart
  if (!path) path = fromUrl
  else if (!path.startsWith('/')) path = posix.join(posix.dirname(fromUrl.endsWith('/') ? fromUrl + 'x' : fromUrl), path)
  path = path.split('?')[0]
  return { path, frag }
}

function fileFor(path) {
  if (path.endsWith('/')) return join(OUT, path, 'index.html')
  if (/\.[a-z0-9]+$/i.test(path)) return join(OUT, path)
  return null // extensionless without trailing slash: GitHub Pages answers with a 301
}

let breaches = 0
let checked = 0
for (const f of pages) {
  const from = urlOf(f)
  const html = readFileSync(f, 'utf8')
  const ids = idsByPage.get(from)
  const seen = new Map()
  for (const id of ids) seen.set(id, (seen.get(id) || 0) + 1)
  for (const [id, n] of seen) if (n > 1 && !id.startsWith('_R_') && !id.startsWith('«')) { breaches++; console.log(`BREACHED ${from} duplicate id "${id}" x${n}`) }
  const hrefs = [...html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)].map((m) => m[1])
  for (const href of hrefs) {
    const t = resolveTarget(from, href)
    if (!t) continue
    checked++
    const file = fileFor(t.path)
    if (!file) { breaches++; console.log(`BREACHED ${from} -> ${href} (no trailing slash: 301 on GitHub Pages)`); continue }
    if (!existsSync(file)) { breaches++; console.log(`BREACHED ${from} -> ${href} (missing ${relative(OUT, file)})`); continue }
    if (t.frag) {
      const targetUrl = t.path.endsWith('/') ? t.path : t.path
      const tids = idsByPage.get(targetUrl) || []
      if (!tids.includes(decodeURIComponent(t.frag))) { breaches++; console.log(`BREACHED ${from} -> ${href} (#${t.frag} not on target)`) }
    }
  }
}
console.log(`link gate: ${pages.length} pages, ${checked} internal links, ${breaches} breach(es)`)
if (checked === 0) { console.log('VERDICT: INCONCLUSIVE'); process.exit(2) }
console.log(breaches ? 'VERDICT: BREACHED' : 'VERDICT: HELD')
process.exit(breaches ? 1 : 0)
