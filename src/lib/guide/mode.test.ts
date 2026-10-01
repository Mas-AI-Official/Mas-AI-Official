// Run: node --test src/lib/guide/mode.test.ts
// Pins the original guide mode rule (git tag pre-redesign-2026-09-30, src/components/DaenaGuide.tsx):
// Klyntar (Security Mode) on /security* and /ai-act-readiness*, Daena (AI Guide) everywhere else.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MODES, guideMode } from './mode.ts'

test('security surfaces are Klyntar', () => {
  for (const p of ['/security', '/security/', '/security/scan/', '/ai-act-readiness', '/ai-act-readiness/']) {
    assert.equal(guideMode(p), 'klyntar', p)
  }
})

test('everything else is Daena', () => {
  for (const p of ['/', '/work/', '/services/', '/start/', '/about/', '']) {
    assert.equal(guideMode(p), 'daena', p)
  }
})

test('the match is a prefix from the root, as in the original', () => {
  assert.equal(guideMode('/work/security/'), 'daena')
  assert.equal(guideMode('/services/ai-act-readiness/'), 'daena')
})

test('mode metadata matches the original labels and alt text', () => {
  assert.equal(MODES.daena.name, 'Daena')
  assert.equal(MODES.daena.subtitle, 'AI Guide')
  assert.equal(MODES.daena.alt, 'Daena, AI guide')
  assert.equal(MODES.daena.hover, 'Bring me a problem.')
  assert.equal(MODES.klyntar.name, 'Klyntar')
  assert.equal(MODES.klyntar.subtitle, 'Security Mode')
  assert.equal(MODES.klyntar.alt, 'Klyntar, security mode')
  assert.equal(MODES.klyntar.avatar, '/assets/img/klyntar-avatar.png')
  assert.equal(MODES.klyntar.accent, '#ff4060')
  assert.equal(MODES.klyntar.hover, 'Show me what you run.')
})

test('both avatars point at files that exist', async () => {
  const { existsSync } = await import('node:fs')
  for (const m of Object.values(MODES)) assert.ok(existsSync(`public${m.avatar}`), m.avatar)
})
