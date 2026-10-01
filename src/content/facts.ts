/**
 * Single source of truth for every factual claim the site makes.
 *
 * Rules:
 * - Components render numbers, dates, credentials and product facts ONLY from here.
 * - Every fact carries the command or file it came from and the day it was checked.
 * - `publish: false` keeps a fact in the record without rendering it (unverified,
 *   awaiting owner confirmation, or not ours to disclose).
 * - scripts/check-content.mjs fails the build if a component hard-codes a claim
 *   this file is meant to own.
 *
 * Verified 2026-09-30 (audit reports: D:/agents/AI_COMPANY_OS/state/checkpoints/mas-ai-site-rebuild/audit).
 */

export type Fact<T = string | number> = {
  value: T
  /** How the fact is phrased when rendered. */
  display: string
  source: string
  verifiedOn: string
  publish: boolean
  note?: string
}

const V = '2026-09-30'

export const COMPANY = {
  legalName: 'MAS-AI Technologies Inc.',
  shortName: 'MAS-AI',
  founded: '2026-01-25',
  locality: 'Richmond Hill',
  region: 'Ontario',
  country: 'CA',
  countryName: 'Canada',
  email: 'masoud.masoori@mas-ai.co',
  url: 'https://mas-ai.co',
  founder: {
    name: 'Masoud Masoori',
    title: 'Founder and CEO',
    linkedin: 'https://www.linkedin.com/in/masoud-masoori',
    github: 'https://github.com/Masoud-Masoori',
  },
  github: 'https://github.com/Mas-AI-Official',
  booking: 'https://calendly.com/masoud-masoori-mas-ai/30min',
  source: 'D:/Claude-Coworker/companies/Mas-AI/company.md:11-35; src/app/layout.tsx (pre-redesign JSON-LD)',
  verifiedOn: V,
} as const

/** Daena counts are read from code, not from marketing copy. */
export const DAENA = {
  url: 'https://daena.mas-ai.co',
  repo: 'https://github.com/Mas-AI-Official/daena',
  departments: {
    value: 10, display: '10 departments', publish: true, verifiedOn: V,
    source: 'len(DEFAULT_DEPARTMENTS), Daena backend/app/core/constants.py:317',
  },
  agents: {
    value: 10, display: '10 department agents, 6 capabilities each', publish: true, verifiedOn: V,
    source: '10 departments x 6 SubCapability (MIND, EYES, HANDS, VOICE, SHIELD, MEMORY), backend/app/core/constants.py',
    note: 'Daena CLAUDE.md: "NOT 60 independent agents, 10 unified agents with specialized limbs." Never render "60 agents".',
  },
  connectors: {
    value: 116, display: '116 connectors', publish: true, verifiedOn: V,
    source: 'json.load backend/app/config/connector_catalog.json (catalog version 2026-04-29)',
  },
  providers: {
    value: 10, display: '10 model providers', publish: true, verifiedOn: V,
    source: 'len(ModelProvider) backend/app/core/constants.py; 10 adapter classes in services/providers',
  },
  hardLaws: {
    value: 9, display: '9 hard laws', publish: true, verifiedOn: V,
    source: 'len(HARD_LAWS) backend/app/core/hard_laws.py',
  },
  memoryTiers: {
    value: 5, display: '5 memory tiers', publish: true, verifiedOn: V,
    source: 'NBMFTier enum 0-4, backend/app/core/constants.py',
  },
  tests: {
    value: 6729, display: '6,700+ automated tests', publish: false, verifiedOn: V,
    source: 'git archive of public HEAD 5f73273 (Mas-AI-Official/daena), venv_daena pytest --collect-only -q: 6729 collected, 0 collection errors',
    note: 'Collected count on the public commit, reproducible by anyone who clones the repo. Not a pass count: never write "passing". Dirty local tree collects 7218.',
  },
  license: {
    value: 'BSL 1.1', display: 'Source-available under BSL 1.1', publish: true, verifiedOn: V,
    source: 'D:/Ideas/Daena/LICENSE.md; public repo LICENSE.md (change date 2030-03-27 to Apache 2.0)',
  },
  version: {
    value: 'v3.6.0-beta.1', display: 'beta', publish: true, verifiedOn: V,
    source: 'git tag -l in D:/Ideas/Daena (latest tag v3.6.0-beta.1). No v3.7 tag exists.',
  },
} satisfies Record<string, unknown>

/**
 * The entry offer. Terms are an OWNER DECISION: drafted from the Codex sol-review recommendation
 * (PLAN-v1). scripts/check-content.mjs BREACHES while ownerApproved is false, so the site cannot deploy
 * with terms Masoud has not consciously approved.
 */
export const OFFER = {
  name: 'Build Blueprint',
  price: 'CAD 3,500',
  priceValue: 3500,
  currency: 'CAD',
  duration: '7 business days',
  credit: 'CAD 1,750 of the fee is credited toward a build over CAD 25,000 that starts within 30 days.',
  ownerApproved: false,
  source: 'Draft terms, Codex gpt-5.6-sol review 2026-09-30 (handoff mas-ai-site-rebuild/001). Pending owner approval.',
} as const

export type Patent = {
  number: string
  title: string
  kind: string
  filed: string
  publish: boolean
  source: string
  note?: string
}

export const PATENTS: Patent[] = [
  {
    number: '64/020,421',
    title: 'Neural-Backed Memory Fabric (NBMF)',
    kind: 'US provisional patent application',
    filed: '2026-03-29',
    publish: true,
    source: 'USPTO payment receipt PDF, D:/Ideas/Daena/patent/final - NBMF-EDNA-TLM',
  },
  {
    number: '63/877,082',
    title: 'PhiLattice agent topology',
    kind: 'US provisional patent application',
    filed: '2025-09-06',
    publish: false,
    source: 'D:/Ideas/legal Patent/01_Priority_Evidence/PRIORITY_DATES_SUMMARY.md',
    note: 'Twelve-month conversion deadline 2026-09-08. No non-provisional or PCT filing evidence found on 2026-09-30. Hidden until the owner or counsel confirms status.',
  },
]

export type Program = { name: string; detail: string; publish: boolean; source: string; note?: string }

export const PROGRAMS: Program[] = [
  {
    name: 'Google for Startups Cloud Program',
    detail: 'Cloud credits',
    publish: true,
    source: 'D:/Claude-Coworker/memory.md:346 (GFS Cloud Program credit, expires 2027-10-02)',
  },
  {
    name: 'Microsoft for Startups',
    detail: 'Azure credits',
    publish: true,
    source: 'D:/Claude-Coworker/memory.md:402; companies/Mas-AI/grants.md:86-92 (approved 2026-03-13)',
  },
  {
    name: 'Toronto Starts',
    detail: 'Member',
    publish: false,
    source: 'Only a draft profile exists (pitch/TORONTO_STARTS_PROFILE_2026-04-17.md)',
    note: 'Unsupported. Do not publish.',
  },
]

/** Public open-source and source-available repositories we can link to safely. */
export const REPOS = {
  daena: 'https://github.com/Mas-AI-Official/daena',
  switchboard: 'https://github.com/Mas-AI-Official/mcp-switchboard',
  mergeloop: 'https://github.com/Mas-AI-Official/MergeLoop',
} as const

/** Every published Daena fact, for audits and the llms.txt generator. */
export const PUBLISHED_FACTS: Fact[] = Object.values(DAENA).filter(
  (f): f is Fact & typeof f => typeof f === 'object' && f !== null && 'publish' in f && Boolean((f as Fact).publish),
) as Fact[]
