// GitHub Pages files (CNAME, .nojekyll) are copied from public/ by the Next.js export, and robots.txt and
// sitemap.xml are app routes. One fix is needed: Next 16 static export writes segment prefetch payloads
// as nested files (out/start/__next.start/__PAGE__.txt) while the client requests the dot-joined name
// (/start/__next.start.__PAGE__.txt), so every <Link> prefetch 404s on a static host. Copy each nested
// payload to its flat name. Idempotent; fails the build if the export has none (the layout changed).
const fs = require('node:fs')
const path = require('node:path')

const OUT = path.join(__dirname, '..', 'out')
let copied = 0

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (!entry.isDirectory()) continue
    if (entry.name.startsWith('__next.')) flatten(dir, full)
    else walk(full)
  }
}

function flatten(routeDir, segDir) {
  const stack = [segDir]
  while (stack.length) {
    const dir = stack.pop()
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        stack.push(full)
        continue
      }
      const flat = path.relative(routeDir, full).split(path.sep).join('.')
      fs.copyFileSync(full, path.join(routeDir, flat))
      copied++
    }
  }
}

if (!fs.existsSync(OUT)) {
  console.error('postbuild: out/ not found')
  process.exit(1)
}
walk(OUT)
// Some environments (the Linux CI export) already write the flat names. Fail only if neither layout exists.
function hasFlat(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) { if (hasFlat(path.join(dir, entry.name))) return true }
    else if (/^__next\..+\.txt$/.test(entry.name)) return true
  }
  return false
}
if (!copied) {
  if (hasFlat(OUT)) {
    console.log('postbuild: export already has flat __next.* prefetch payloads; nothing to flatten')
    process.exit(0)
  }
  console.error('postbuild: no __next.* prefetch payloads found, nested or flat; check the Next export layout')
  process.exit(1)
}
console.log(`postbuild: flattened ${copied} segment prefetch payloads`)
