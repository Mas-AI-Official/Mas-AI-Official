/**
 * Site structure: navigation, the single contact CTA, service families and practices.
 * One label per intent across the whole site (taste 4.5): contact intent = CTA.label.
 */

export const CTA = {
  label: 'Bring us a bottleneck',
  href: '/start/',
} as const

export const WORK_CTA = { label: 'See the work', href: '/work/' } as const

export type ServiceLink = {
  slug: string
  href: string
  name: string
  /** One line, plain business language. */
  line: string
}

/** Three families: what we build (homepage + nav). */
export const FAMILIES: ServiceLink[] = [
  {
    slug: 'automation',
    href: '/automation/',
    name: 'Automate operations',
    line: 'Workflow automation, AI agents and knowledge assistants that take repeated work off your team.',
  },
  {
    slug: 'software',
    href: '/software/',
    name: 'Build software',
    line: 'Custom web apps, internal tools, SaaS products and the APIs that connect them.',
  },
  {
    slug: 'websites',
    href: '/websites/',
    name: 'Build websites',
    line: 'Websites that book, qualify, answer and connect to the rest of your business.',
  },
]

/** How we build: practices that run through every project. */
export const PRACTICES: ServiceLink[] = [
  {
    slug: 'private-ai',
    href: '/private-ai/',
    name: 'Private, local and cloud AI',
    line: 'Run AI on your devices, your servers, a private cloud or the public cloud, chosen per project.',
  },
  {
    slug: 'security',
    href: '/security/',
    name: 'Security, evaluation and governance',
    line: 'Security reviews, evaluation, audit trails and human approval where an action matters.',
  },
]

/** Depth pages that serve a specific search intent. */
export const DEPTH: ServiceLink[] = [
  {
    slug: 'rag',
    href: '/rag/',
    name: 'Knowledge systems and RAG',
    line: 'Answers grounded in your own documents, with citations and a refusal when the source is missing.',
  },
  {
    slug: 'ai-act-readiness',
    href: '/ai-act-readiness/',
    name: 'EU AI Act readiness',
    line: 'Classification, documentation, logging and human oversight for AI systems sold into the EU.',
  },
]

export const NAV = [
  { label: 'Services', href: '/services/', menu: true },
  { label: 'Work', href: '/work/' },
  { label: 'Daena', href: '/what-is-daena/' },
  { label: 'Company', href: '/company/' },
] as const

export const FOOTER = [
  {
    title: 'Services',
    links: [...FAMILIES, ...PRACTICES, ...DEPTH].map((s) => ({ label: s.name, href: s.href })),
  },
  {
    title: 'Work',
    links: [
      { label: 'All work', href: '/work/' },
      { label: 'Daena', href: '/work/daena/' },
      { label: 'ragX', href: '/work/ragx/' },
      { label: 'MCP Switchboard', href: '/work/mcp-switchboard/' },
    ],
  },
  {
    title: 'Daena',
    links: [
      { label: 'What is Daena', href: '/what-is-daena/' },
      { label: 'AI governance platform', href: '/ai-governance-platform/' },
      { label: 'AI control plane', href: '/ai-control-plane-for-business/' },
      { label: 'Multi-agent company OS', href: '/multi-agent-ai-company-os/' },
      { label: 'Governing AI agents', href: '/use-cases/ai-agent-governance/' },
      { label: 'Multi-LLM routing', href: '/use-cases/multi-llm-routing/' },
      { label: 'Daena vs LangChain', href: '/compare/daena-vs-langchain/' },
      { label: 'Daena vs AutoGen', href: '/compare/daena-vs-autogen/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/company/' },
      { label: 'Build Blueprint', href: '/blueprint/' },
      { label: CTA.label, href: CTA.href },
      { label: 'Privacy', href: '/privacy/' },
    ],
  },
] as const
