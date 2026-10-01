#!/usr/bin/env node
// Content gate. Exit 0 HELD, 1 BREACHED.
// 1. No em dash (U+2014) or en dash (U+2013) in source or shipped text.
// 2. No stale or unverified claims (each pattern names the audit finding that banned it).
// 3. Components must not hard-code Daena counts; they come from src/content/facts.ts.
// Usage: node scripts/check-content.mjs [--out]   (--out also scans the built out/ HTML)
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'

const ROOT = process.cwd()
const scanOut = process.argv.includes('--out')
const TEXT_EXT = new Set(['.ts', '.tsx', '.css', '.mjs', '.js', '.md', '.txt', '.xml', '.json', '.html'])
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'out', '_originals', '_orig_backup', 'docs', 'outbound', 'legal', 'assets'])

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(p, files)
    } else if (TEXT_EXT.has(extname(name))) files.push(p)
  }
  return files
}

const targets = [...walk(join(ROOT, 'src')), ...walk(join(ROOT, 'public'))]
if (scanOut) {
  const out = join(ROOT, 'out')
  const walkOut = (d, acc = []) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n)
      const s = statSync(p)
      if (s.isDirectory()) { if (n !== '_next' && n !== '_originals' && n !== '_orig_backup' && n !== 'assets') walkOut(p, acc) }
      else if (['.html', '.txt', '.xml'].includes(extname(n))) acc.push(p)
    }
    return acc
  }
  targets.push(...walkOut(out))
}

// Files that legitimately contain the banned strings (the rule definitions themselves).
const ALLOW = new Set(['scripts/check-content.mjs', 'src/content/facts.ts'].map((p) => p.replace(/\//g, '\\')))
const isAllowed = (rel) => ALLOW.has(rel) || ALLOW.has(rel.replace(/\\/g, '/')) || rel.replace(/\\/g, '/').endsWith('.test.ts')

const BANNED = [
  { re: /—/, why: 'em dash (house rule, taste 9.G)' },
  { re: /–/, why: 'en dash used as separator (taste 9.G)' },
  { re: /3,?086/, why: 'stale Daena test count (audit 06: 7,218 collected)' },
  { re: /1,?764 tests|2,?880|2,?956 tests/i, why: 'stale Daena test count' },
  { re: /\bv3\.7\b/i, why: 'no v3.7 tag exists (audit 06)' },
  { re: /patent[- ]pending/i, why: 'PhiLattice conversion unverified; say "US provisional patent application" for NBMF only' },
  { re: /Toronto Starts/i, why: 'unsupported program membership (audit 06)' },
  { re: /Bugcrowd/i, why: 'unverified credential with open TODO (audit 01)' },
  { re: /Mythos/i, why: 'unsupported comparison to a third-party benchmark' },
  { re: /contentops-core/i, why: 'P0: public repo tracks cookie and account files; never link it' },
  { re: /days? before the EU AI Act/i, why: 'false countdown (UCPD Annex I point 7)' },
  { re: /\bAGI\b/, why: 'unsupported claim' },
  { re: /\b60 (specialized |AI )?agents\b/i, why: 'Daena is 10 department agents with 6 capabilities each, not 60 agents (Daena CLAUDE.md)' },
  { re: /\b48 (specialized )?agents\b/i, why: 'stale agent count (investors.html)' },
  { re: /Consensus Hong Kong/i, why: 'conference pass listed as an award (audit 01)' },
  { re: /medical diagnos/i, why: 'Med Smart diagnosis claim unsupported (audit 05)' },
  // UNRESOLVED owner decisions (claims record section 4). Proposed replacements: checkpoint pass6/CHATBOT-PROPOSAL.md.
  { re: /\$18k|\$12\.5k|free 2-hour recon/i, why: 'unapproved price or offer (owner decision)' },
  { re: /Perplexity for Startups|Azure for Startups/i, why: 'program membership without a primary record (owner decision)' },
  { re: /Production-deployed on GCP/i, why: 'only an earlier Daena build runs on Cloud Run (owner decision)' },
]

// Daena counts may only be rendered through facts.ts. Flags literal phrases in components/pages.
const HARDCODED_COUNT = /\b(10 departments|60 agents|116 connectors|10 model providers|9 hard laws|5 memory tiers|[67],[07]00\+ (automated )?tests)\b/i

// The frozen site guide's keyword lists only match what a visitor types and are never rendered, so a banned
// word there (a visitor asking about it) is not published copy. Answers in the same file are still scanned.
const GUIDE_KEYWORDS = { file: 'src/lib/guide/legacy.ts', line: /^\s*keywords:\s*\[/ }

let breaches = 0
for (const file of targets) {
  const rel = relative(ROOT, file)
  if (isAllowed(rel)) continue
  const text = readFileSync(file, 'utf8')
  const lines = text.split(/\r?\n/)
  const keywordFile = rel.split('\\').join('/') === GUIDE_KEYWORDS.file
  lines.forEach((line, i) => {
    for (const b of BANNED) {
      if (keywordFile && GUIDE_KEYWORDS.line.test(line)) continue
      if (b.re.test(line)) {
        breaches++
        console.log(`BREACHED ${rel}:${i + 1} ${b.why}: ${line.trim().slice(0, 140)}`)
      }
    }
    if (/^src[\\/](components|app)[\\/]/.test(rel) && HARDCODED_COUNT.test(line)) {
      breaches++
      console.log(`BREACHED ${rel}:${i + 1} hard-coded Daena count, render it from src/content/facts.ts: ${line.trim().slice(0, 140)}`)
    }
  })
}

// Owner decisions that must be flipped consciously before deploy.
const facts = readFileSync(join(ROOT, 'src/content/facts.ts'), 'utf8')
if (/ownerApproved:\s*false/.test(facts)) {
  breaches++
  console.log('BREACHED src/content/facts.ts OFFER.ownerApproved is false: Build Blueprint price and terms need owner approval before deploy')
}
console.log(`content gate: ${targets.length} files scanned, ${breaches} breach(es)`)
console.log(breaches ? 'VERDICT: BREACHED' : 'VERDICT: HELD')
process.exit(breaches ? 1 : 0)
