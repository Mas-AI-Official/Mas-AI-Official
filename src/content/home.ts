/**
 * Homepage copy. Narrative: the seven-act scenario (business, gap, decision, build, runs, proof,
 * invitation) with capabilities and selected work between. Voice: builders, short sentences, no hype,
 * no invented numbers.
 */

/**
 * The homepage scenario: one illustrative operation that evolves across seven acts. Stage one holds the
 * business, the gap and the decision; stage two holds the build, the running system and the proof.
 * The operation drawn is an example, not a client. Numbers only from facts.ts.
 * Three levels of language: short statements, plain operational explanation, engineering detail.
 */
export const STAGE_ONE = {
  hero: {
    eyebrow: 'AI implementation + software delivery',
    title: ['Find the gap.', 'Build the system.'],
    gapWord: 'gap',
    sub: 'We work inside your business, find where the work stalls, then build what should exist next.',
    proof: 'AI built around your business. Deployed on your terms.',
    alt: 'Illustration of an example operation: work moves between five tools, one hand-off is done by hand, and a queue builds up there until it is marked as the gap.',
  },
  gap: {
    title: 'Your business already runs on a system.',
    body: 'We sit with the people doing the work and trace every hand-off until the place where work waits is obvious.',
    close: 'We don’t prescribe AI before we understand the work.',
    alt: 'A trace walks every path in the operation and labels it; the hand-off from the inbox to the spreadsheet is done by hand and marked as the gap.',
  },
  decision: {
    title: 'Then we decide what should exist.',
    body: 'Automate it, connect it, build it, add AI, replace it, or leave it alone. The work picks the tool, and sometimes the right answer is not AI.',
    detail: 'Here: connect the inbox to the spreadsheet and automate the intake. The calendar and invoicing already work, so they stay as they are.',
    alt: 'Six options appear around the gap. Replacing the tools, building a new app and adding AI are rejected; connecting and automating are chosen; the calendar and invoices are left alone.',
  },
} as const

export type DeployMode = 'local' | 'private' | 'cloud' | 'hybrid'

export const STAGE_TWO = {
  build: {
    title: 'Then we close the gap.',
    body: 'AI where it earns its place, software everywhere else. The decision becomes a working system wired into your inbox, your spreadsheet and your calendar. Nothing you rely on gets ripped out.',
    link: { label: 'What we build', href: '/services/' },
    alt: 'The chosen options move into the gap, which becomes a wireframe, then an intake component connected to the inbox and the spreadsheet; the queue drains and the tangled paths straighten into one flow.',
  },
  deploy: {
    title: 'Deployed where your data should live.',
    body: 'Your cloud, your hardware, or both. We choose per system and say what each option supports before you commit.',
    pickLabel: 'Where it runs',
    initial: 'private' as DeployMode,
    modes: [
      { id: 'local', label: 'Local', line: 'Models and applications run on suitable hardware you control, on your premises.' },
      { id: 'private', label: 'Private cloud', line: 'Runs inside your chosen cloud account, under the controls you configure.' },
      { id: 'cloud', label: 'Cloud', line: 'Managed services and model APIs, where your requirements permit them.' },
      { id: 'hybrid', label: 'Hybrid', line: 'Local and cloud parts, with written rules for what may cross between them.' },
    ] as { id: DeployMode; label: string; line: string }[],
    alt: 'A boundary appears around the built system to show where it runs: on your devices, inside your own cloud account, on a public cloud, or split between your devices and the cloud.',
  },
  runs: {
    title: 'Then it runs, and you can watch it run.',
    body: 'Work moves on its own. Uncertain cases stop for a person. Every step is logged, so anyone can check what happened and why.',
    logLabel: 'Live log of the example',
    alt: 'The whole operation runs: every tool shows a working status, one invoice question stops at an approval step for a person, then continues.',
  },
  proof: {
    label: 'MAS-AI product',
    title: 'We don’t just draw this. We build it.',
    caption: 'Daena Brain with demo data. Screenshot, September 2026.',
    imageAlt:
      'Daena Brain view with demo data: the governance core, its six capabilities, ten departments such as Engineering, Finance and Legal and Compliance, their agents and demo tool servers, drawn as a network.',
  },
} as const

export type CapabilityVariant = 'ai' | 'integration' | 'software' | 'agents' | 'websites' | 'private' | 'governance' | 'ongoing'

/** Capabilities: one method, different answers. Each shows the same operation transformed. */
export const CAPABILITIES = {
  title: 'What we build depends on the gap.',
  intro: 'One method, different answers. Pick one to see how the same operation changes.',
  items: [
    { id: 'ai', name: 'AI implementation', line: 'A model where it earns its place: answers from your own documents, drafts a person approves, decisions with a trail.', stack: 'OpenAI, Anthropic, Gemini, Grok or open-weight models · retrieval · document extraction and OCR · evaluation', href: '/services/', linkLabel: 'All services' },
    { id: 'integration', name: 'Automation and integration', line: 'The tools you already pay for, joined through one layer, so work moves between them without anyone re-typing it.', stack: 'APIs, webhooks and MCP · CRM, ERP, accounting and document systems · queues and scheduled jobs', href: '/automation/', linkLabel: 'Automation' },
    { id: 'software', name: 'Custom software', line: 'Internal tools, portals and products for when a spreadsheet or a subscription has run out of road.', stack: 'TypeScript and Python · React, Next.js and FastAPI · sign-on, roles and audit logs', href: '/software/', linkLabel: 'Custom software' },
    { id: 'agents', name: 'AI systems, agents and knowledge', line: 'Agents that act through your tools inside approval gates, with memory and cited knowledge wired in.', stack: 'LangGraph and LangChain · tools through MCP · approvals and durable runs · RAG and GraphRAG', href: '/rag/', linkLabel: 'Knowledge systems' },
    { id: 'websites', name: 'AI websites and digital products', line: 'A website that does work: qualifies, books, answers and starts the workflow, connected to the system behind it.', stack: 'Next.js · forms, booking and answers wired to your systems · readable by search and AI engines', href: '/websites/', linkLabel: 'Websites' },
    { id: 'private', name: 'Private and enterprise AI', line: 'The same system on your devices, your servers or a private cloud, when data cannot leave your control.', stack: 'vLLM, llama.cpp or Ollama on your hardware · AWS, Azure or Google Cloud private networking · hybrid rules', href: '/private-ai/', linkLabel: 'Private AI' },
    { id: 'governance', name: 'Evaluation and governance', line: 'Tests, approval steps and audit trails around the AI you already run, so you can see what it does before it matters.', stack: 'Test sets on your cases · approval steps · audit logs · monitoring and alerts', href: '/security/', linkLabel: 'Security and evaluation' },
    { id: 'ongoing', name: 'Ongoing engineering', line: 'We stay after launch: monitoring, fixes and the next improvement, measured against how the work actually runs.', stack: 'Monitoring and fixes · model, cost and quality reviews · documentation and training', href: '/start/', linkLabel: 'Start a conversation' },
  ] as { id: CapabilityVariant; name: string; line: string; stack: string; href: string; linkLabel: string }[],
}

export const CLOSING = {
  title: 'Bring us the problem.',
  body: 'We will help determine what should actually be built.',
  ask: 'Or ask Daena',
}

export const WORK_SECTION = {
  title: 'Systems we have built.',
  intro: 'The problem first, what we engineered second. Each entry says what it is today: a system we operate, an open-source release, or research.',
}

export const COMPANY_SECTION = {
  title: 'Founder-led from diagnosis through delivery.',
  intro:
    'The person who maps your business is the person who designs and builds the system. No handoff to a team you have not met.',
  principles: [
    { name: 'You own it', line: 'The code, the data and the accounts are yours, as set out in the contract.' },
    { name: 'Scope first', line: 'A fixed scope and price before any build starts.' },
    { name: 'People approve', line: 'AI never takes an irreversible action without a person.' },
    { name: 'Handover', line: 'Documentation and a walkthrough your team can run with.' },
  ],
}

export const START = {
  title: 'Bring us a bottleneck.',
  prompt: 'What are you trying to improve?',
  options: [
    { id: 'response', label: 'Response time to customers' },
    { id: 'manual', label: 'A slow manual process' },
    { id: 'website', label: 'A website that does more' },
    { id: 'software', label: 'Software we cannot buy' },
    { id: 'ai-product', label: 'AI inside our product' },
    { id: 'connect', label: 'Systems that do not talk to each other' },
    { id: 'private-ai', label: 'AI on our own hardware or cloud' },
    { id: 'unsure', label: 'Not sure yet' },
  ],
}

export const FAQ = [
  {
    q: 'Do you only build AI?',
    a: 'No. We build whatever closes the gap: automation, custom software, websites, and AI where it earns its place. Sometimes the right answer is a well-built form and an integration, and we will say so.',
  },
  {
    q: 'We do not know what we need yet. Is that a problem?',
    a: 'That is the normal starting point. The Build Blueprint maps how your business runs and ends in a written plan with a clear build or no-build recommendation.',
  },
  {
    q: 'Can it work with the tools we already use?',
    a: 'Usually, yes. We connect to the systems you already run, such as your CRM, inbox, calendar, spreadsheets and databases, rather than replacing them.',
  },
  {
    q: 'Can our data stay private?',
    a: 'Yes, when the whole system is designed for it. Models can run on your own servers, in your cloud account or in a hybrid setup, and we check every part that could send data out: the model, embeddings, connectors, telemetry, logs and backups. You get a written record of what stays where before you commit.',
  },
  {
    q: 'Can it run on our own hardware?',
    a: 'Often, yes. We can assess the hardware you have, or help you size, source, install and configure new equipment as a scoped piece of work. The right size depends on the model, how many people use it at once, the speed you need, and the cost to run and maintain it. Equipment is bought separately; we do not supply it from stock.',
  },
  {
    q: 'Do we have to use Daena or your other products?',
    a: 'No. Daena, ragX and our other products show what we can build. Your system is built around your tools and your requirements, and nothing ties you to a product of ours.',
  },
  {
    q: 'Who owns the code?',
    a: 'You do, as set out in the contract. Code, data and accounts are yours, and every build ends with documentation and a handover.',
  },
  {
    q: 'Who will I work with?',
    a: 'MAS-AI is founder-led. The founder maps your business, designs the system and leads the build.',
  },
]
