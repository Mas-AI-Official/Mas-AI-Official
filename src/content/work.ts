/**
 * Proof. Every statement traces to the 2026-09-30 audit dossiers
 * (D:/agents/AI_COMPANY_OS/state/checkpoints/mas-ai-site-rebuild/audit/04, 05, 06).
 * Rules (PLAN-v1): no client work without written consent, no test or adoption numbers,
 * no numbers outside src/content/facts.ts, honest current state on every entry.
 */
import { DAENA, REPOS } from './facts'

export type WorkLabel = 'System we operate' | 'Open source' | 'R&D' | 'Website we shipped'

/**
 * A = featured systems (full case study, problem first), B = index of what MAS-AI built, C = lab (experiments).
 * Tier is a presentation decision, not a quality score. Justifications: audit 04 (case-study score, status,
 * adoption evidence) and the label. The WORK array is ordered by tier, then by the order shown on the page.
 */
export type WorkTier = 'A' | 'B' | 'C'

export type WorkItem = {
  slug: string
  name: string
  label: WorkLabel
  tier: WorkTier
  /** One line: what it is, in plain language. */
  line: string
  /** Families and practices this proves (service slugs). */
  proves: string[]
  /**
   * Case pages render five sections in this order:
   * problem -> "The problem"; insight + built (+ image) -> "What we engineered"; connected -> "How it connected";
   * engineering -> "What technology was appropriate"; state -> "Where it stands" (current state, stated as it is; not an outcome claim).
   * A section with no supported content is omitted, never invented.
   */
  caseStudy?: {
    problem: string
    insight: string
    built: string[]
    /** How it joins other systems, tools and people. Optional. */
    connected?: string[]
    /** The technology that fit the problem. Never a headline. Optional. */
    engineering?: string[]
    state: string
  }
  links?: { label: string; href: string }[]
  image?: { src: string; srcSmall?: string; width: number; height: number; alt: string }
}

export const WORK: WorkItem[] = [
  /* ---------- Tier A: featured systems ---------- */
  {
    slug: 'daena',
    name: 'Daena',
    label: 'System we operate',
    tier: 'A',
    line: 'A governed multi-agent platform: AI departments that plan and act inside approval gates and an audit trail.',
    proves: ['automation', 'software', 'security', 'private-ai'],
    caseStudy: {
      problem:
        'Agent frameworks make it easy to let a model act. They make it hard to know what it did, why, on whose authority, and to stop it before an irreversible step.',
      insight:
        'Governance has to sit inside the execution path, not beside it. Every request should pass the same staged pipeline, and the risky ones should wait for a person.',
      built: [
        `${DAENA.agents.display}: mind, eyes, hands, voice, shield and memory.`,
        'A ten-stage request pipeline: security gate, session, intent and risk, governance check, cost preflight, model routing, memory recall, request build, streaming, then persist and audit.',
        'Two action modes: plan-only by default, and execution that goes through the security gate and an approval queue for high-risk actions.',
        `Tiered memory (${DAENA.memoryTiers.display}) where unverified content expires and permanent tiers need approval.`,
        'Klyntar, the security layer: scan workflow, evidence checkpoints, a gate that rejects any serious finding without an evidence chain, and a supply-chain scanner.',
      ],
      connected: [
        `Routing across ${DAENA.providers.display}, with local and cloud runtimes as options, and ${DAENA.connectors.display} in the catalog.`,
      ],
      engineering: [
        'Python and FastAPI (async), SQLAlchemy 2, Pydantic v2; React and TypeScript front end.',
        `${DAENA.hardLaws.display} enforced in code; tenant isolation at the database layer.`,
        'Multi-tenant by design; an earlier build runs on Google Cloud Run.',
        `${DAENA.license.display}, public on GitHub.`,
      ],
      state: 'Beta, with access on request at daena.mas-ai.co. It is the reference architecture we draw on for governed agent builds.',
    },
    links: [
      { label: 'daena.mas-ai.co', href: DAENA.url },
      { label: 'Source on GitHub', href: REPOS.daena },
      { label: 'What is Daena', href: '/what-is-daena/' },
    ],
    image: {
      src: '/work/daena-brain-demo-1600.webp',
      srcSmall: '/work/daena-brain-demo-960.webp',
      width: 1600,
      height: 913,
      alt: 'Daena Brain view with demo data: the governance core, its six capabilities, ten departments such as Engineering, Finance and Legal and Compliance, their agents and demo tool servers, drawn as a network.',
    },
  },
  {
    slug: 'ragx',
    name: 'ragX',
    label: 'System we operate',
    tier: 'A',
    line: 'Our retrieval engine: answers from our own documents with citations, and a verifier that makes it abstain when the sources do not support a claim.',
    proves: ['automation', 'rag', 'private-ai'],
    caseStudy: {
      problem:
        'A retrieval system that always answers will sometimes answer from nothing. For internal knowledge, a confident wrong answer costs more than no answer.',
      insight:
        'Make abstaining a first-class result. Retrieve broadly, rerank, then check every claim against the retrieved text before it is shown.',
      built: [
        'Hybrid retrieval: dense vectors and keyword search fused by reciprocal rank fusion, then a reranker.',
        'A critic pass on a local model, and a natural-language-inference verifier that must entail each claim or the answer abstains with a reason.',
        'Indexing and evaluation jobs for the collections our tools use.',
      ],
      connected: [
        'One service with three front doors: an HTTP API, a command line and an MCP server.',
        'Our coding agents query it through a prompt hook before they answer questions about our own systems.',
      ],
      engineering: ['Python; runs locally on our own hardware with a local model for the critic step.'],
      state: 'Internal and in daily use. Not offered as a hosted product; the same architecture is what we build for clients who need answers from their own documents.',
    },
    links: [{ label: 'Knowledge systems and RAG', href: '/rag/' }],
  },
  {
    slug: 'mcp-switchboard',
    name: 'MCP Switchboard',
    label: 'Open source',
    tier: 'A',
    line: 'One governed endpoint that brings many MCP tool servers to Claude and ChatGPT, with an encrypted vault, per-tool policy, approvals and an audit log.',
    proves: ['automation', 'security', 'software'],
    caseStudy: {
      problem:
        'Connecting AI assistants to business tools means one configuration per tool per assistant, secrets scattered in config files, and no record of what the assistant did.',
      insight:
        'Put one switchboard in the middle: every tool behind one local endpoint, with its own permissions, and every call written down.',
      built: [
        'A local aggregator that re-exposes many MCP servers through one endpoint.',
        'An AES-256-GCM vault, per-tool on or off and read, write or full policies, an approval gate and an audit log.',
        'Local OAuth for common providers and a generator that turns an OpenAPI spec into an MCP server.',
      ],
      connected: ['A dashboard, a command line and one-command install into several AI clients.'],
      engineering: ['TypeScript on Node.', 'Checked by a suite of verification scripts rather than screenshots.'],
      state: 'Working alpha, released as v0.1.0 under Apache-2.0.',
    },
    links: [{ label: 'Source on GitHub', href: REPOS.switchboard }],
  },

  {
    slug: 'product-sites',
    name: 'Our product websites',
    label: 'Website we shipped',
    tier: 'A',
    line: 'mas-ai.co, daena.mas-ai.co and kya.mas-ai.co: designed, written, built and deployed in-house.',
    proves: ['websites', 'software'],
    caseStudy: {
      problem:
        'A technical offer is hard to judge from a page of claims. A buyer who is not an engineer needs to see the work happen, and a site that only describes it leaves the first step to email.',
      insight: 'Treat the website as part of the system: explain by showing one operation change, and let the visitor start the work on the page.',
      built: [
        'mas-ai.co: one example operation drawn live and changed act by act, a guided intake at /start/ and an on-site guide.',
        'daena.mas-ai.co and kya.mas-ai.co: the product sites for Daena and KYA.',
      ],
      connected: ['The intake sends an inquiry to the team, and falls back to a prepared email when sending fails.'],
      engineering: [
        'Static pages on GitHub Pages: nothing to run or patch on a server.',
        'A canvas drawing with a still frame for every act when a visitor prefers reduced motion.',
      ],
      state: 'All three sites are live.',
    },
    links: [
      { label: 'daena.mas-ai.co', href: DAENA.url },
      { label: 'kya.mas-ai.co', href: 'https://kya.mas-ai.co' },
    ],
  },

  /* ---------- Tier B: built by MAS-AI, index ---------- */
  {
    slug: 'ai-company-os',
    name: 'AI Company OS',
    label: 'System we operate',
    tier: 'B',
    line: 'The operating layer we run MAS-AI on: several AI coding agents sharing one memory, computed routing and deterministic checks.',
    proves: ['automation', 'security'],
    caseStudy: {
      problem:
        'Using several AI assistants at once creates the same problems as a team with no shared notes: duplicated work, lost decisions and nobody checking the result.',
      insight:
        'Treat agents like colleagues. Give them one append-only record of decisions, route each task by measured availability instead of memory, and let deterministic checks, not the model, decide when work is done.',
      built: [
        'A router that probes each model lane for real and sends work to the cheapest lane that can do it well.',
        'Verifiers that return held, breached or inconclusive, so a task is done when a check says so.',
      ],
      connected: [
        'An append-only shared memory log that every agent reads at the start of a session and writes at the end.',
        'Handoff packets that carry the problem, evidence and proposal between agents, never raw transcripts.',
      ],
      engineering: ['Python tooling, hooks into each assistant, scheduled jobs and ledgers for every verdict.'],
      state: 'Internal, used every day. It is how a founder-led company runs research, engineering and review in parallel. This website was planned through it: two independent AI reviewers critiqued the plan before any code was written.',
    },
  },
  {
    slug: 'mergeloop',
    name: 'MergeLoop',
    label: 'Open source',
    tier: 'B',
    line: 'A model council: one task sent to several AI workers, one synthesized answer back.',
    proves: ['automation'],
    links: [{ label: 'Source on GitHub', href: REPOS.mergeloop }],
  },

  /* ---------- Tier C: lab, experiments ---------- */
  {
    slug: 'kya-mission-control',
    name: 'KYA Mission Control',
    label: 'R&D',
    tier: 'C',
    line: 'A trust layer for AI agents on missions: passports, bounded authority, budget stops and signed receipts anyone can verify offline.',
    proves: ['security', 'software'],
    caseStudy: {
      problem:
        'When an AI agent acts on the web or spends money, the other side has no way to know who sent it, what it may do, or to prove afterwards what happened.',
      insight: 'Borrow from border control: identity documents, scoped permissions and a receipt for every crossing.',
      built: [
        'A mission state machine with agent passports and child agents that inherit bounded authority.',
        'Budget hard stops and signed receipts with an offline verifier.',
        'An interactive Mission Lab that walks through admission, blocking and escalation scenarios.',
      ],
      connected: ['Standard HTTP message signatures (RFC 9421) in Python and TypeScript.'],
      engineering: ['Python and TypeScript monorepo.'],
      state: 'Pre-alpha research. The Mission Lab demo is public; the code is not yet released.',
    },
    links: [
      { label: 'kya.mas-ai.co', href: 'https://kya.mas-ai.co' },
      { label: 'Mission Lab demo', href: 'https://kya-mission-lab-szw3mq5rma-nn.a.run.app/console/' },
    ],
    image: {
      src: '/work/kya-mission-lab-1600.webp',
      srcSmall: '/work/kya-mission-lab-960.webp',
      width: 1600,
      height: 1000,
      alt: 'KYA Mission Lab: a list of agent scenarios such as a verified agent admitted, an agent with no passport blocked, and a budget overrun sent to a human checkpoint.',
    },
  },
]

export const CASE_STUDIES = WORK.filter((w) => w.caseStudy)

export function workFor(serviceSlug: string): WorkItem[] {
  return WORK.filter((w) => w.proves.includes(serviceSlug))
}

export function workByTier(tier: WorkTier): WorkItem[] {
  return WORK.filter((w) => w.tier === tier)
}

/** Tier A, in display order. The homepage consumes this. */
export function featuredWork(): WorkItem[] {
  return workByTier('A')
}
