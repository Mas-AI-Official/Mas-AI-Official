/**
 * Service page content. One typed record per page, rendered by components/services/ServicePage.tsx.
 * Every page answers, in order: the problems (in the buyer's words), what we build, what you receive,
 * whether it connects to what you already use, where it can run, proof, questions.
 *
 * Rules (PLAN-v1): numbers only from facts.ts, no client work (not even anonymized), no prices,
 * no dates or fines for the EU AI Act, no guarantees. Proof items come from work.ts.
 */
import { DAENA, OFFER } from './facts'
import { DEPTH, FAMILIES, PRACTICES, type ServiceLink } from './site'

export type ModeId = 'device' | 'onprem' | 'private' | 'hybrid' | 'cloud'
export type Fit = 'fits' | 'limits' | 'no'

export const MODES: { id: ModeId; name: string }[] = [
  { id: 'device', name: 'On your devices' },
  { id: 'onprem', name: 'On your servers' },
  { id: 'private', name: 'Private cloud' },
  { id: 'hybrid', name: 'Hybrid' },
  { id: 'cloud', name: 'Cloud' },
]

export const FIT_LABEL: Record<Fit, string> = {
  fits: 'Fits',
  limits: 'Fits, with limits',
  no: 'Not a fit',
}

export type Item = { name: string; line: string }

export type ServiceContent = {
  slug: string
  path: string
  /** Name used in breadcrumbs and JSON-LD. */
  name: string
  meta: { title: string; description: string }
  serviceType: string
  h1: string
  lead: string
  problems: { title: string; intro?: string; items: { said: string; means: string }[] }
  build: { title: string; intro?: string; items: Item[] }
  /** Optional callout under the build list (what it is not, method statements). */
  callout?: { title: string; body: string }
  /** Optional stepped feature (websites: three stages). */
  stages?: { title: string; intro: string; steps: Item[]; note?: string }
  receive: { title: string; intro?: string; items: string[]; handoverTitle: string; handover: string }
  connects: { title: string; intro: string; chips: string[]; note: string }
  runs: { title: string; intro: string; modes: Record<ModeId, { fit: Fit; note: string }>; note?: string }
  /**
   * Optional technical depth under the buyer-facing sections: the technology we choose from, by role. Names are
   * supporting detail for technical readers; the choice is made per engagement, so nothing here is a default.
   */
  stack?: { title: string; intro: string; groups: { name: string; line: string }[]; note?: string }
  /** Optional explainer sections after "where it can run" (private AI: hardware, offline operation). */
  extras?: { id: string; title: string; intro: string; items: Item[]; note?: string }[]
  proof: {
    title: string
    intro: string
    /** Service slug whose work items are shown (defaults to this page's slug). */
    source?: string
    /** Work slugs in display order; the first is the lead. */
    order?: string[]
    /** Why each item matters on this page (one sentence). */
    why: Record<string, string>
  }
  faq: { q: string; a: string }[]
  related: string[]
  cta: { title: string; line: string }
}

const CTA_LINE = 'We start with the problem, then tell you whether it is worth building.'

/* ------------------------------------------------------------------ automation */

const automation: ServiceContent = {
  slug: 'automation',
  path: '/automation/',
  name: 'Automate operations',
  meta: {
    title: 'AI automation services for business operations',
    description:
      'Workflow automation, AI agents with approval steps, multi-agent systems, knowledge assistants and MCP connectors. Built by a founder-led studio in Ontario and shipped to production.',
  },
  serviceType: 'AI automation',
  h1: 'AI automation that ships to production',
  lead: 'We take the work your team repeats every day and build the automation that does it. It connects to your tools, it is tested on your real cases, and a person approves anything that matters.',
  problems: {
    title: 'What people tell us before we start',
    items: [
      {
        said: 'New enquiries sit in the inbox until someone has time.',
        means:
          'We build an intake flow that reads the enquiry, asks for what is missing, drafts the reply and books the call. You approve what goes out until you trust it.',
      },
      {
        said: 'We copy the same information between four systems.',
        means: 'A workflow moves it once, checks that both sides match, and sends exceptions to a named person.',
      },
      {
        said: 'Our best people spend the week on admin.',
        means:
          'Agents take the first pass on triage, drafting and lookups. People keep the judgement calls and see what the agent did.',
      },
      {
        said: 'We tried an AI tool and cannot tell what it did.',
        means: 'Every run is logged: the input, the steps, the tools it called, the output and who approved it. A decision can be replayed.',
      },
      {
        said: 'Only one person knows how this process works.',
        means: 'We map it, write it down and build it so the process survives that person going on holiday.',
      },
    ],
  },
  build: {
    title: 'What we build',
    intro: 'Six kinds of system. Most projects are one or two of them, joined to what you already run.',
    items: [
      {
        name: 'Workflow automation',
        line: 'Scheduled and event-driven jobs that move data, produce documents and start the next step. Failures retry, then alert a person.',
      },
      {
        name: 'AI agents with approval steps',
        line: 'Agents that read, decide and act inside limits you set. Actions that spend money, send messages or change records wait for a person.',
      },
      {
        name: 'Multi-agent systems',
        line: 'Several specialised agents that hand work to each other, for jobs too large for one prompt. We build this only when a simpler design would not do.',
      },
      {
        name: 'Knowledge assistants',
        line: 'Assistants that answer from your own documents and show the source. The depth is on the knowledge systems page.',
      },
      {
        name: 'Connectors and MCP servers',
        line: 'The layer that lets an AI assistant use your tools safely: read a record, create a ticket, update a sheet, each with its own permission.',
      },
      {
        name: 'Voice, where it fits',
        line: 'Phone and voice assistants for booking and simple triage, when callers would rather talk than type. It is not the right answer for every business, and we say so.',
      },
    ],
  },
  receive: {
    title: 'What you receive',
    items: [
      'The working system, deployed in your environment, with the source code in a repository you own.',
      'A written map of the workflow before and after, so you can see what changed.',
      'Test cases built from your real examples, and the results of running them.',
      'A runbook: how to monitor it, what the alerts mean, how to pause it and how to roll back.',
      'Approval rules in plain language, and a log of every action taken under them.',
      'A handover session for the people who will run it.',
    ],
    handoverTitle: 'You own it',
    handover:
      'The code, the data and the accounts are yours, as set out in the contract. If you later want someone else to run it, the documentation is enough for them to start.',
  },
  connects: {
    title: 'Does it connect to what we already use?',
    intro:
      'Usually, yes. Most automation work is the join between systems you already run, so we build against what you have instead of asking you to switch.',
    chips: [
      'Email and calendar',
      'CRM',
      'Spreadsheets',
      'Databases',
      'Accounting tools',
      'Help desk and ticketing',
      'Chat tools',
      'Document stores',
      'Internal APIs',
      'MCP servers',
    ],
    note: `We connect through a tool's official API. Where a tool has no usable API, we say so at the start and propose the least fragile alternative. Our own platform catalogs ${DAENA.connectors.display}. For a client build we implement only the ones your workflow needs.`,
  },
  runs: {
    title: 'Where it can run',
    intro: 'Automation runs wherever its data and its model can run. The mode changes what you get, and what you give up.',
    modes: {
      device: {
        fit: 'limits',
        note: 'Single-user assistants and drafting on a laptop or workstation, with small open-weight models. Shared or heavy workflows need a server.',
      },
      onprem: {
        fit: 'fits',
        note: 'Behind your firewall with open-weight models sized to your hardware. On some tasks quality is below the largest cloud models, so we test on your cases first.',
      },
      private: {
        fit: 'fits',
        note: 'In your own cloud account with your keys and network rules. Models run there, or are called under your own provider agreement.',
      },
      hybrid: {
        fit: 'fits',
        note: 'Sensitive steps run locally and heavy steps use a cloud model. The routing rule is written down and every routed call is logged.',
      },
      cloud: {
        fit: 'fits',
        note: 'The quickest to start. Data goes to the model provider under its terms, so it suits work that is not sensitive.',
      },
    },
    note: 'Not every model or feature is available in every mode. We say which before you commit.',
  },
  stack: {
    title: 'How it is built',
    intro: 'For technical readers: what we choose from. The choice is made per system, from your data, your constraints and your workload.',
    groups: [
      { name: 'Workflows', line: 'LangGraph for long-running workflows that save their progress, pause for a person and resume after a failure; plain code and queues when that is simpler.' },
      { name: 'Models', line: 'OpenAI, Anthropic, Google Gemini or xAI Grok models through their SDKs, or open-weight models you host, chosen per step.' },
      { name: 'Connections', line: 'APIs, webhooks, MCP servers and databases, and your CRM, ERP, accounting and document systems.' },
      { name: 'Documents', line: 'Document processing, OCR and structured extraction into the fields your systems expect.' },
      { name: 'Controls', line: 'Approval steps, audit logs and test sets agreed with you, rerun on every change.' },
    ],
  },
  proof: {
    title: 'Systems we run ourselves',
    intro: 'We name clients only with their written permission. What we can show is what we build, operate and use every day. It is the same set of patterns we build for you.',
    order: ['daena', 'mcp-switchboard', 'ragx', 'ai-company-os', 'mergeloop'],
    why: {
      daena: 'Agents that plan and act inside approval gates, with every decision on the record.',
      'mcp-switchboard': 'The connector layer: many tools behind one endpoint, with per-tool policy, approvals and an audit log.',
      ragx: 'The knowledge assistant pattern: answers from documents, and a refusal when the source is missing.',
      'ai-company-os': 'Automation applied to our own company: shared memory, computed routing and checks that decide when work is done.',
      mergeloop: 'Multi-agent work in its simplest form: several workers, one synthesized answer.',
    },
  },
  faq: [
    {
      q: 'Which tasks are worth automating?',
      a: `Work that is repeated, follows rules and is slow only because it waits for a person to move it along. Work that needs judgement about people, money or safety is usually better assisted than automated. The ${OFFER.name} ranks your candidates and says where automation is not worth it.`,
    },
    {
      q: 'Will the AI act without anyone checking?',
      a: 'Only where you decide it can. We set approval steps by risk. Reading and drafting run freely. Sending, spending and changing records wait for a person. You can loosen a step later, once the log shows it behaves.',
    },
    {
      q: 'How do you know the automation works?',
      a: 'We test it against real examples from your business before launch and keep those tests running after. If output quality drops, you see it in the results, not in a customer complaint.',
    },
    {
      q: 'What happens when the AI is wrong?',
      a: 'The system is designed for it. Low-confidence cases go to a person, every run is logged so the cause can be found, and a failed step alerts a named owner instead of failing silently.',
    },
    {
      q: 'Who sees our data?',
      a: 'It depends on where the system runs. On your own servers, only you. With a cloud model, the provider terms apply, and we set the provider data-retention options with you before the build starts.',
    },
    {
      q: 'How long does an automation take to build?',
      a: 'It depends on the systems involved, so we do not quote a general number. The first step ends in a written scope and a cost range for your case.',
    },
  ],
  related: ['rag', 'security', 'private-ai'],
  cta: { title: 'Bring us the repeated work.', line: CTA_LINE },
}

/* ------------------------------------------------------------------ software */

const software: ServiceContent = {
  slug: 'software',
  path: '/software/',
  name: 'Build software',
  meta: {
    title: 'Custom software development for business',
    description:
      'Custom web applications, internal tools, SaaS and product engineering, Python and FastAPI APIs, and AI inside existing software. Built around how you work, connected to what you run.',
  },
  serviceType: 'Custom software development',
  h1: 'Custom software, built around how you work',
  lead: 'When a product on the shelf almost fits, the gap costs you every day. We build the web app, internal tool or API that fits your process, and connect it to the systems around it.',
  problems: {
    title: 'When custom software is the right answer',
    items: [
      {
        said: 'We run the business on spreadsheets and they are breaking.',
        means: 'An internal tool with the same logic, proper access control, a history of changes and reports that come from live data.',
      },
      {
        said: 'No product on the market does exactly this.',
        means: 'We build the specific thing and only the specific thing, so you do not pay for a platform you will not use.',
      },
      {
        said: 'Our systems do not talk to each other.',
        means: 'An integration layer of APIs and scheduled sync, with checks that flag records that do not match.',
      },
      {
        said: 'We want AI in our product but do not know where it belongs.',
        means: 'We add it at the points where it removes work, behind an interface your users already understand, with evaluation so you can see that it works.',
      },
      {
        said: 'We are launching a product and need it engineered, not prototyped.',
        means: 'Product engineering from data model to deployment. Multi-tenant if you need it, tested, and deployable by your own team.',
      },
    ],
  },
  build: {
    title: 'What we build',
    intro: 'Six kinds of work, from a single internal tool to a full product.',
    items: [
      {
        name: 'Custom web applications',
        line: 'Applications your customers or staff use in the browser: accounts, roles, workflows and payments where they are needed.',
      },
      {
        name: 'Internal tools and dashboards',
        line: 'Replace the spreadsheet with forms, approvals, reports and dashboards over your live data.',
      },
      {
        name: 'SaaS and product engineering',
        line: 'From data model to launch: multi-tenant architecture, billing hooks, admin, monitoring and the deploy pipeline.',
      },
      {
        name: 'Python and FastAPI APIs',
        line: 'Backends and APIs, asynchronous where it helps, typed and documented so other systems can rely on them.',
      },
      {
        name: 'AI inside existing software',
        line: 'Search, drafting, classification or an assistant added to a product you already run, with evaluation and a fallback for when the model is unsure.',
      },
      {
        name: 'Integration layers',
        line: 'Connectors and sync jobs between your CRM, accounting, inbox and database, with retries and mismatch alerts.',
      },
    ],
  },
  receive: {
    title: 'What you receive',
    items: [
      'Source code in a repository you own, with the commit history.',
      'Automated tests and a written description of what they cover.',
      'Deployment scripts and environment setup, so a new environment can be created from the repository.',
      'Architecture notes: what each part does and why it was built that way.',
      'A runbook for running, monitoring and updating the system.',
      'A handover walkthrough for your team or your next developer.',
    ],
    handoverTitle: 'No lock-in',
    handover:
      'The code, the data and the hosting accounts are yours. Our default stack is mainstream on purpose: Python and FastAPI, TypeScript and React, and SQL databases. You can hire for it.',
  },
  connects: {
    title: 'Does it connect to what we already use?',
    intro: 'Yes. Nearly every custom system we build sits beside existing ones, so integration is part of the design from the first week.',
    chips: [
      'Your database',
      'CRM',
      'Accounting',
      'Email and calendar',
      'Single sign-on',
      'Payment providers',
      'Third-party APIs',
      'Webhooks',
      'File exports from legacy systems',
    ],
    note: 'Where a system exposes only exports or a screen and no API, we say what that costs in reliability before we build on it.',
  },
  runs: {
    title: 'Where it can run',
    intro: 'Most software can run anywhere. What changes is who operates it and how it scales.',
    modes: {
      device: {
        fit: 'limits',
        note: 'Desktop or local-first tools for one user or one office. Multi-user software with shared data needs a server.',
      },
      onprem: { fit: 'fits', note: 'On your servers or virtual machines, packaged in containers and documented for your IT team.' },
      private: { fit: 'fits', note: 'In your own cloud account, so billing, access and data residency stay yours.' },
      hybrid: {
        fit: 'fits',
        note: 'Core system in one place and specific services in another, for example a local database with a cloud email service.',
      },
      cloud: { fit: 'fits', note: 'The default for most products: managed hosting, quick to scale, standard monitoring.' },
    },
  },
  stack: {
    title: 'How it is built',
    intro: 'For technical readers: what we choose from. The choice is made per system, from your data, your constraints and your workload.',
    groups: [
      { name: 'Applications', line: 'Web apps, portals, internal tools and APIs in TypeScript and Python, with React, Next.js and FastAPI.' },
      { name: 'Data', line: 'Postgres, SQLite and the databases you already run, with vector search where retrieval needs it.' },
      { name: 'Access', line: 'Sign-on through your identity provider, roles and permissions, and audit logs.' },
      { name: 'Hosting', line: 'AWS, Microsoft Azure or Google Cloud, or your own servers, with the infrastructure written as code where your setup allows.' },
      { name: 'Quality', line: 'Automated tests, type checks and release checks before anything ships.' },
    ],
  },
  proof: {
    title: 'Software we build and run ourselves',
    intro: 'We name clients only with their written permission. These are products we built and operate, at different stages of maturity.',
    order: ['daena', 'mcp-switchboard', 'kya-mission-control'],
    why: {
      daena: 'A multi-tenant Python and FastAPI platform with a React front end, in beta.',
      'mcp-switchboard': 'A TypeScript product released as open source: dashboard, command line, encrypted vault and audit log.',
      'kya-mission-control': 'Research stage: signed receipts, an offline verifier and an interactive demo, in Python and TypeScript.',
    },
  },
  faq: [
    {
      q: 'Should we buy software or build it?',
      a: 'Buy when a product covers most of the process and you can live with the rest. Build when the process is your advantage, when no product fits, or when the glue between products costs more than the software would. We tell you which it is, including when the answer is to buy.',
    },
    {
      q: 'Do we own the code?',
      a: 'Yes. The code, the data and the accounts are yours, as set out in the contract. The handover includes documentation so another developer can take it on.',
    },
    {
      q: 'What technology do you use?',
      a: 'Python and FastAPI for backends, TypeScript and React for front ends, SQL databases and containers for deployment. Where you already have a stack, we follow it.',
    },
    {
      q: 'Can you work with our existing developers?',
      a: 'Yes. We work in your repository, follow your conventions and hand over in a form your team can maintain. If you have no developers, we write it so the next person you hire can maintain it.',
    },
    {
      q: 'How do you keep scope under control?',
      a: 'We agree a scope in writing before the build. A change is priced before it is made, so the price does not drift quietly.',
    },
    {
      q: 'Can you add AI to software we already run?',
      a: 'Yes. We add it where it removes work, keep it behind the interface your users know, and test its output against real examples. If it is not accurate enough for the job, we tell you and do not ship it.',
    },
  ],
  related: ['automation', 'websites', 'security'],
  cta: { title: 'Bring us the software you cannot buy.', line: CTA_LINE },
}

/* ------------------------------------------------------------------ websites */

const websites: ServiceContent = {
  slug: 'websites',
  path: '/websites/',
  name: 'Build websites',
  meta: {
    title: 'Website development that books, qualifies and answers',
    description:
      'Websites connected to your calendar, CRM and inbox: booking, lead systems, client portals and an AI concierge. Fast, accessible and findable, built and deployed by a founder-led studio.',
  },
  serviceType: 'Website development',
  h1: 'Websites that do work, not just explain it',
  lead: 'A website should book the call, qualify the enquiry and answer the common question, connected to your calendar, CRM and inbox. We design it, build it, connect it and deploy it.',
  problems: {
    title: 'What a website is failing to do',
    items: [
      {
        said: 'People visit and nothing happens.',
        means: 'Clear paths to one action: book, request a quote, ask. Each one lands in your calendar or CRM, not in an inbox someone forgets.',
      },
      {
        said: 'We retype every enquiry into another system.',
        means: 'Forms and booking write straight to the tools you use, with a confirmation and a follow-up.',
      },
      {
        said: 'The same questions arrive every week.',
        means: 'A concierge that answers from your own content, names the page it used and hands over to you when it is unsure.',
      },
      {
        said: 'The site is slow and search engines do not like it.',
        means: 'Performance and search are built in from the start: fast pages, structured data and sensible URLs, measured before launch.',
      },
      {
        said: 'Some visitors cannot use it.',
        means: 'Accessibility built in: semantic structure, keyboard use and contrast, tested with real tools instead of an overlay.',
      },
    ],
  },
  build: {
    title: 'What we build',
    intro: 'A site is a set of jobs. We build the ones your business needs and skip the rest.',
    items: [
      {
        name: 'Marketing sites built to perform',
        line: 'Fast, accessible and findable, with the copy written alongside the design so the two agree.',
      },
      {
        name: 'Booking and intake systems',
        line: 'Appointment booking, intake forms and lead capture wired to your calendar, CRM and inbox.',
      },
      {
        name: 'Client and customer portals',
        line: 'Logins, documents, status and messages for the people you serve.',
      },
      {
        name: 'AI concierge and site search',
        line: 'Answers from your own content with sources shown, and a handoff to a person when it is not sure.',
      },
      {
        name: 'Search and performance',
        line: 'Structured data, sensible URLs, image and script budgets, measured on the final build.',
      },
      {
        name: 'Accessibility and deployment',
        line: 'Keyboard, screen reader and contrast testing, then deployment with monitoring and a way to roll back.',
      },
    ],
  },
  callout: {
    title: 'Regulated professions',
    body: 'For regulated professions we trace every published claim to its public source before launch. The rules on what a practice may say about itself are specific, so each claim is something to source, not something to write.',
  },
  stages: {
    title: 'Three stages. Start where you are.',
    intro: 'Most sites stop at the first stage. The next two are where a site begins doing work.',
    steps: [
      { name: 'Brochure', line: 'Explains who you are and what you do, quickly and accessibly. Every enquiry still needs a person to handle it.' },
      { name: 'Connected', line: 'Booking, forms and payments feed your calendar, CRM and inbox. Nobody retypes a lead.' },
      {
        name: 'Intelligent',
        line: 'An assistant grounded in your own content answers questions, qualifies enquiries and passes the right ones to you.',
      },
    ],
    note: 'Each stage stands alone. You do not need the last one to benefit from the second.',
  },
  receive: {
    title: 'What you receive',
    items: [
      'The finished site, deployed on hosting you own, with the source in your repository.',
      'A way to edit content that you agree at the start: an editing interface, content files or our changes.',
      'Booking and forms tested end to end, including the failure cases.',
      'Performance and accessibility results measured on the final build.',
      'Analytics only if you want them, chosen to respect your visitors.',
      'A handover note: what to update, how, and how often.',
    ],
    handoverTitle: 'You own it',
    handover: 'The domain, the hosting account, the code and the content are yours. Nothing is held on our accounts.',
  },
  connects: {
    title: 'Does it connect to what we already use?',
    intro: 'Yes. A website that stands alone is the exception. Connecting it is most of the value.',
    chips: [
      'Calendars and booking',
      'CRM',
      'Email and newsletter tools',
      'Payment providers',
      'Analytics',
      'Existing CMS or content files',
      'Login and identity',
      'Help desk',
    ],
    note: 'If a tool cannot be reached by an API, we say so up front and suggest the least fragile route.',
  },
  runs: {
    title: 'Where it can run',
    intro: 'A public website is hosted somewhere public. The question is what sits behind it.',
    modes: {
      device: { fit: 'no', note: 'A public site is not hosted on a laptop. Editing tools and a preview can run locally.' },
      onprem: { fit: 'fits', note: 'Static or server-rendered sites on your own servers, if your policy requires it.' },
      private: { fit: 'fits', note: 'In your own cloud account, behind your CDN and access rules.' },
      hybrid: {
        fit: 'limits',
        note: 'The public site is hosted publicly. A concierge or portal can call a model or data store that stays private. We design that boundary explicitly.',
      },
      cloud: { fit: 'fits', note: 'Static hosting on a CDN is fast, inexpensive and the default for most sites.' },
    },
  },
  stack: {
    title: 'How it is built',
    intro: 'For technical readers: what we choose from. The choice is made per system, from your data, your constraints and your workload.',
    groups: [
      { name: 'Build', line: 'Next.js and React, static where possible, accessible and fast on phones.' },
      { name: 'Doing work', line: 'Forms, booking, answers from your own content and hand-offs to a person, wired to your CRM, calendar and inbox.' },
      { name: 'Content', line: 'Structure and copy that search engines and AI answer engines can read.' },
      { name: 'Measurement', line: 'Analytics you own, measured against what the site is for.' },
    ],
  },
  proof: {
    title: 'Sites we have shipped',
    intro: "We have built three client websites: a medical clinic's live site, a health company's design preview and a wellness practice's site in progress. We name clients only with their written permission, so the sites we can show here are our own.",
    order: ['product-sites'],
    why: {
      'product-sites': 'Designed, written, built and deployed by the same people who would build yours.',
    },
  },
  faq: [
    {
      q: 'Can you rebuild our current website?',
      a: 'Yes. We start from what the site is meant to do, keep the content and addresses that earn traffic, and redirect or replace the rest so you do not lose search visibility.',
    },
    {
      q: 'Do we need AI on our website?',
      a: 'Usually not at first. A fast, clear site with booking that reaches your calendar solves most problems. We add an assistant when there is a repeated question load or an enquiry-qualifying job for it, and when your content is good enough to ground it.',
    },
    {
      q: 'Will the site be found on Google?',
      a: 'We build the foundations that are in our control: structure, speed, structured data, sensible URLs and clear content. Rankings depend on more than the build, and nobody can honestly guarantee a position.',
    },
    {
      q: 'Who edits the content afterwards?',
      a: 'You decide at the start. Options include a simple editing interface, content files your team edits, or having us make the changes. We write down which before the build begins.',
    },
    {
      q: 'Can it work for a regulated practice?',
      a: 'Yes. For regulated professions we trace every published claim to its public source before launch, and we leave out features your regulator advertising rules do not allow. Mention it in your first message.',
    },
    {
      q: 'Where will the site be hosted?',
      a: 'Wherever suits you. Static hosting on a CDN is the default for most sites. The accounts, the domain and the billing are yours.',
    },
  ],
  related: ['software', 'automation', 'rag'],
  cta: { title: 'Bring us the website that should be working harder.', line: CTA_LINE },
}

/* ------------------------------------------------------------------ private ai */

const privateAi: ServiceContent = {
  slug: 'private-ai',
  path: '/private-ai/',
  name: 'Private, local and cloud AI',
  meta: {
    title: 'Private, local and cloud AI deployment',
    description:
      'On-device, on-premises, private cloud, hybrid and cloud AI deployment. Open-weight models sized to your hardware, with production hardening, monitoring and evaluation.',
  },
  serviceType: 'Private and local AI deployment',
  h1: 'Private, local and cloud AI deployment',
  lead: 'The question is not whether to use AI. It is where the model runs and who sees your data. We choose the mode for each system, build it and harden it for production.',
  problems: {
    title: 'Why people ask for this',
    items: [
      {
        said: 'We cannot paste client data into a public AI tool.',
        means: 'The same workflow running on a model you control, with every connector, log and backup checked so the data stays inside your boundary.',
      },
      {
        said: 'Legal and IT have both said no.',
        means: 'A written data-flow diagram that shows what goes where, so the decision rests on facts.',
      },
      {
        said: 'We tried a local model and it was too slow or too weak.',
        means: 'We size the model to the hardware and the job, then measure it on your own examples before you buy anything.',
      },
      {
        said: 'We do not want to depend on one provider.',
        means: 'Model routing that lets a provider be swapped, with the choice logged.',
      },
      {
        said: 'The cloud bill is unpredictable.',
        means: 'We measure the cost per task in each mode, so the choice between local and cloud rests on numbers.',
      },
    ],
  },
  build: {
    title: 'What we build',
    intro: 'Deployment is the product here. The model is a part we choose to fit it.',
    items: [
      { name: 'On-device deployments', line: 'Models running on laptops and workstations, for sensitive drafting and offline work.' },
      { name: 'On-premises servers', line: 'Open-weight models sized to your GPUs or CPUs, served behind your firewall.' },
      { name: 'Private cloud', line: 'Deployments in your cloud account, with your keys, network rules and logging.' },
      {
        name: 'Hybrid routing',
        line: 'Sensitive steps stay local. Heavy or public-data steps use cloud models. The rule is written down and every routed call is logged.',
      },
      {
        name: 'Model selection and sizing',
        line: 'An open-weight model chosen to fit your hardware and your task, tested on your examples.',
      },
      {
        name: 'Production hardening',
        line: 'Serving, queuing, monitoring, alerts, evaluation and rollback, so it keeps running after the demo.',
      },
    ],
  },
  receive: {
    title: 'What you receive',
    items: [
      'The deployed system, with the infrastructure described as code where your environment allows.',
      'A data-flow diagram: what stays where, and what leaves.',
      'Benchmark results on your own examples for each model we considered.',
      'Dashboards and alerts for latency, errors and cost.',
      'A runbook covering updates, model swaps, rollback and failure.',
      'A handover session for whoever operates it.',
    ],
    handoverTitle: 'You own it',
    handover:
      'You own the infrastructure, the models you run and the data. Open-weight models are used under their published licences, and we check that the licence fits your use before we recommend one.',
  },
  connects: {
    title: 'Does it connect to what we already use?',
    intro: 'Yes. A private model is only useful when it reaches your documents, your tools and your users.',
    chips: [
      'Document stores',
      'Databases',
      'Identity and single sign-on',
      'Internal APIs',
      'Existing cloud accounts',
      'Monitoring tools',
      'Ticketing',
      'MCP servers',
    ],
    note: 'We work inside your network and identity setup instead of asking for exceptions to it.',
  },
  runs: {
    title: 'Where it can run',
    intro: 'This is the page where the answer differs most by mode. Here is the honest version of each.',
    modes: {
      device: {
        fit: 'limits',
        note: 'Small open-weight models on a laptop or workstation. Good for drafting and private lookups. Quality and speed depend on the machine, and long or complex tasks may be out of reach.',
      },
      onprem: {
        fit: 'fits',
        note: 'Larger open-weight models on servers you control. You carry the hardware, the patching and the capacity planning.',
      },
      private: {
        fit: 'fits',
        note: 'Rented GPUs or managed model services inside your own cloud account. Data stays in your tenancy. Check what a managed service retains under its terms.',
      },
      hybrid: {
        fit: 'fits',
        note: 'The usual answer for mixed data. It needs a clear rule for which step goes where, and we build the rule and its log.',
      },
      cloud: {
        fit: 'fits',
        note: 'The largest models and scale on demand. Data goes to the provider under its terms, so it is not for your most sensitive material.',
      },
    },
    note: 'Not every model or feature is available in every mode. Some capabilities, such as the very largest models, are cloud only. We say which before you commit.',
  },
  stack: {
    title: 'How it is built',
    intro: 'For technical readers: what we choose from. The choice is made per system, from your data, your constraints and your workload.',
    groups: [
      { name: 'Open-weight models', line: 'Families such as gpt-oss, Qwen, Mistral, Gemma, DeepSeek, Phi and Llama, each checked against its licence. Open-weight does not mean unrestricted: some licences depend on company size or on reselling access.' },
      { name: 'Serving', line: 'vLLM, llama.cpp or Ollama on your hardware: NVIDIA, AMD or Apple GPUs, or a CPU for small workloads.' },
      { name: 'Private cloud', line: 'Amazon Bedrock with private VPC endpoints, Microsoft Azure AI Foundry with private endpoints, or Google Cloud with VPC Service Controls.' },
      { name: 'Cloud models', line: 'OpenAI, Anthropic, Google Gemini or xAI Grok models on paid tiers, with each provider’s training, retention and processing-location terms confirmed in writing.' },
      { name: 'Fast inference', line: 'Groq, the inference provider that runs open-weight models on its own chips. Not to be confused with Grok, the model family from xAI.' },
      { name: 'Routing and caching', line: 'Rules handle what can be written down, caches handle repeats, and larger models handle only what needs them.' },
    ],
    note: 'Model names and versions change quickly, so proposals name the exact model, version and licence.',
  },
  extras: [
    {
      id: 'hardware',
      title: 'Running it on your own hardware',
      intro: 'Hardware is a scoped part of the work, separate from the equipment itself. We do not hold stock, and equipment is bought separately.',
      items: [
        { name: 'Assess what you have', line: 'We check whether your servers, workstations or GPUs can run the model you need at the speed you need, before anything is bought.' },
        { name: 'Size it from the workload', line: 'The model’s size and how far it is compressed set the memory it needs; how many people use it at once and how long their documents are add to that. We size from your model, your users and your response-time goal, then test.' },
        { name: 'Count the running cost', line: 'Local hardware swaps per-use fees for equipment, power, cooling, storage and upkeep. You get an itemized estimate for your case, next to the cloud option for the same work.' },
        { name: 'Source, install and configure', line: 'If new equipment is needed, we help you specify it and buy it from your supplier, then install and configure the serving stack and test it under your load.' },
      ],
      note: 'Small teams or low-volume jobs can often run a smaller compressed model on a workstation GPU, or even a CPU. We test your workload before recommending anything.',
    },
    {
      id: 'offline',
      title: 'Offline and isolated operation',
      intro: 'A local model alone does not keep data local. For systems that must run offline or isolated, we verify the whole system, not just the model.',
      items: [
        { name: 'Models, embeddings and tokenizers', line: 'Every model file is staged in advance and the libraries are set to offline mode, so nothing is downloaded while the system runs.' },
        { name: 'Connectors and outside calls', line: 'Every connector, tool and integration is listed with where its traffic goes. In an isolated deployment, only local or on-network ones are enabled.' },
        { name: 'Telemetry and tracing', line: 'Some inference servers and libraries send anonymous usage data by default. We switch it off, and hosted tracing services stay off.' },
        { name: 'Logs, caches and backups', line: 'We decide with you what is logged, how long it is kept and where backups live, and keep those stores inside your boundary.' },
        { name: 'Proven by test', line: 'Settings are not proof. We run the deployment with outside network access blocked and show you the results, including any attempted outside connection.' },
      ],
      note: 'Privacy statements are made per system, from the architecture we built and the controls we verified, and written into the handover.',
    },
  ],
  proof: {
    title: 'Systems we run ourselves',
    intro: 'We name clients only with their written permission. Two systems we operate show the pattern.',
    order: ['daena', 'ragx'],
    why: {
      daena: 'Routes across model providers with local and cloud runtimes as options, and keeps the routing on the record.',
      ragx: 'Runs on our own hardware, with a local model for the critic step.',
    },
  },
  faq: [
    {
      q: 'Is a local model as good as the best cloud models?',
      a: 'For some tasks it is close enough. For others it is not. The very largest models are cloud only. We test open-weight models on your examples and tell you where the gap matters.',
    },
    {
      q: 'What hardware do we need?',
      a: 'It depends on the model, how many people use it at once and the response time you need. We can assess what you have, or size, source and set up new equipment as a scoped piece of work; the equipment is bought separately. An existing workstation is often enough to test.',
    },
    {
      q: 'Does private cloud mean the data never leaves us?',
      a: 'It means the data stays in your cloud account, under your keys and network rules. If a managed model service is involved, that provider retention terms still apply, so we read them with you.',
    },
    {
      q: 'Can we start in the cloud and move later?',
      a: 'Yes, and it is a common path. We design the system so the model call is a swappable part, which makes a later move to local or private a much smaller job than a rebuild.',
    },
    {
      q: 'How do you keep a local model reliable?',
      a: 'The same way as any production system: serving, queuing, monitoring and evaluation. We track quality against your examples so a model update cannot quietly make it worse.',
    },
    {
      q: 'Do you train or fine-tune models?',
      a: `Not by default. Most business problems are solved by retrieval, prompting and evaluation on an existing model. If a fine-tune would clearly help, the ${OFFER.name} says so.`,
    },
  ],
  related: ['rag', 'security', 'automation'],
  cta: { title: 'Bring us the data that cannot leave.', line: CTA_LINE },
}

/* ------------------------------------------------------------------ security */

const security: ServiceContent = {
  slug: 'security',
  path: '/security/',
  name: 'Security, evaluation and governance',
  meta: {
    title: 'Security, evaluation and governance for AI systems',
    description:
      'Security reviews of applications and AI features, evaluation against real examples, audit trails, human approval, least privilege and secrets handling. Controls that keep a person in charge.',
  },
  serviceType: 'AI security and governance',
  h1: 'Security, evaluation and governance for AI systems',
  lead: 'AI features add new ways for things to go wrong: a prompt that leaks, a tool that can do too much, an answer nobody can trace. We review, test and build the controls that keep a person in charge.',
  problems: {
    title: 'What worries people',
    items: [
      {
        said: 'We are shipping an AI feature and nobody has reviewed it.',
        means: 'A security review of the feature and the application around it: inputs, outputs, tools, secrets and data paths.',
      },
      {
        said: 'How do we know the AI is giving good answers?',
        means: 'An evaluation set built from your real cases, run before launch and after every change.',
      },
      {
        said: 'If it does something wrong, can we find out why?',
        means: 'Audit trails: what was asked, what the system did, which tool it used and who approved it.',
      },
      {
        said: 'Can the agent do more than it should?',
        means: 'Least-privilege access per tool and per role, with approval on anything that cannot be undone.',
      },
      {
        said: 'Our keys are sitting in config files.',
        means: 'Secrets moved into a vault, scoped, rotated and kept out of prompts and logs.',
      },
    ],
  },
  build: {
    title: 'What we do',
    intro: 'Six pieces of work. You can take one, or all of them as part of a build.',
    items: [
      {
        name: 'Security reviews of apps and AI features',
        line: 'A threat model and review of prompts, tools, data flows, authentication and dependencies. Findings are ranked and fixes proposed.',
      },
      {
        name: 'Evaluation against real examples',
        line: 'Test sets drawn from your cases, scored for accuracy and for correct refusal, and rerun on every change.',
      },
      {
        name: 'Audit trails and traceability',
        line: 'Structured logs of each request, tool call and decision, retained under rules you set.',
      },
      {
        name: 'Human approval steps',
        line: 'Approval queues for actions that spend money, send messages or change records, each with a named owner.',
      },
      {
        name: 'Least privilege',
        line: 'Narrow permissions per tool, per agent and per user, so a mistake or a misuse has a small reach.',
      },
      {
        name: 'Secrets handling',
        line: 'Vaulted credentials, scoped tokens, rotation and redaction, so secrets do not travel in prompts or logs.',
      },
    ],
  },
  callout: {
    title: 'What a review can and cannot say',
    body: 'We do not sell guarantees. A review lowers risk and shows what remains. It does not prove that a system is safe. We work only on systems you own or are authorised to test, and we agree the scope in writing first.',
  },
  receive: {
    title: 'What you receive',
    items: [
      'A written report: scope, method, findings ranked by impact and what to fix first.',
      'Fixes for the findings inside our scope, or precise change instructions for your developers.',
      'The evaluation set and the scripts to rerun it.',
      'An audit-log design and, where we build it, the implementation.',
      'Approval and permission rules written in plain language.',
      'A retest of the fixed findings.',
    ],
    handoverTitle: 'You keep the tooling',
    handover: 'You keep the report, the tests and the tooling. The point is that your team can rerun the checks without us.',
  },
  connects: {
    title: 'Does it connect to what we already use?',
    intro: 'Yes. Controls only get used when they sit inside your existing flow, so we build them into it.',
    chips: [
      'Identity provider and single sign-on',
      'Secret managers',
      'Logging and monitoring',
      'CI pipelines',
      'Ticketing for findings',
      'Code repositories',
      'Cloud accounts',
    ],
    note: 'We work from access you grant, scoped to the systems in scope. Nothing outside that scope is touched.',
  },
  runs: {
    title: 'Where it applies',
    intro: 'Reviews and controls follow the system wherever it runs. What changes is who owns each risk.',
    modes: {
      device: {
        fit: 'limits',
        note: 'Data stays on the machine, which removes the risk of transit. Logging and approval need a plan, because there is no central server to hold them.',
      },
      onprem: { fit: 'fits', note: 'You own patching, network rules and log retention. We review the deployment and the model-serving layer with you.' },
      private: {
        fit: 'fits',
        note: 'Identity, keys and network segmentation live in your account. We review the configuration as well as the code.',
      },
      hybrid: {
        fit: 'fits',
        note: 'The boundary between local and cloud is the main risk. We check what crosses it and that each crossing is logged.',
      },
      cloud: {
        fit: 'fits',
        note: 'Provider terms, retention settings and shared-responsibility limits matter most. We read them with you and record what is assumed.',
      },
    },
  },
  stack: {
    title: 'How it is built',
    intro: 'For technical readers: what we choose from. The choice is made per system, from your data, your constraints and your workload.',
    groups: [
      { name: 'Evaluation', line: 'Test sets, adversarial prompts and regression checks around the AI you run.' },
      { name: 'Controls', line: 'Approval steps, least-privilege access for AI components, and secrets in a managed vault.' },
      { name: 'Records', line: 'Audit logs and traces of what each AI component did and on whose authority.' },
      { name: 'Monitoring', line: 'Alerts on failures, cost and quality drift, with a rehearsed rollback.' },
    ],
  },
  proof: {
    title: 'Governance we build into our own systems',
    intro: 'We name clients only with their written permission. These are systems we run, and the controls are part of how they work.',
    order: ['daena', 'mcp-switchboard', 'ai-company-os', 'kya-mission-control'],
    why: {
      daena:
        'Klyntar, the security layer inside Daena: a scan workflow, evidence checkpoints and a gate that rejects a serious finding with no evidence chain.',
      'mcp-switchboard': 'An encrypted vault, per-tool policy, an approval gate and an audit log for AI access to your tools.',
      'ai-company-os': 'Deterministic checks decide when work is done, and every verdict is logged.',
      'kya-mission-control': 'Research: bounded authority, budget stops and signed receipts that anyone can verify offline.',
    },
  },
  faq: [
    {
      q: 'What does a security review of an AI feature cover?',
      a: 'The feature and what surrounds it: how input reaches the model, what the model can call, what it can return, where secrets and data live, and how access is checked. AI-specific issues such as prompt injection sit alongside ordinary application security.',
    },
    {
      q: 'Can you guarantee the system is secure?',
      a: 'No, and be wary of anyone who says yes. A review lowers risk and shows what remains, and the retest confirms the fixes. It is not a proof.',
    },
    {
      q: 'How do you evaluate AI output?',
      a: 'We collect real cases from your work, agree what a good answer looks like, and score the system against them, including cases where the right behaviour is to refuse or hand off. The set is rerun on every change.',
    },
    {
      q: 'Where do people stay in the loop?',
      a: 'Wherever an action is hard to undo: spending, sending, deleting, changing a record of truth. We set the approval rule by risk and log each approval.',
    },
    {
      q: 'Can you work with our security team?',
      a: 'Yes, and it goes better that way. We share scope, method and findings with them, and write the report so that it can go into your risk process.',
    },
    {
      q: 'Do you help with compliance?',
      a: 'We help produce the technical evidence that compliance work asks for: logging, oversight and documentation. We are not a law firm and we do not give legal advice. For the EU AI Act, see the readiness page.',
    },
  ],
  related: ['ai-act-readiness', 'private-ai', 'automation'],
  cta: { title: 'Bring us the system you want checked.', line: CTA_LINE },
}

/* ------------------------------------------------------------------ rag */

const rag: ServiceContent = {
  slug: 'rag',
  path: '/rag/',
  name: 'Knowledge systems and RAG',
  meta: {
    title: 'RAG and knowledge systems for company documents',
    description:
      'Answers from your own documents with citations, and a refusal when the source is missing. Retrieval-augmented generation with evaluation and a private deployment option.',
  },
  serviceType: 'Retrieval-augmented generation development',
  h1: 'RAG and knowledge systems for your own documents',
  lead: 'Ask a question and get an answer from your own documents, with the source shown. When the documents do not say, the system says so instead of guessing.',
  problems: {
    title: 'What people are trying to fix',
    items: [
      {
        said: 'Nobody can find anything in our shared drive.',
        means: 'Search that understands the question, not only the words, and shows the passage it found.',
      },
      {
        said: 'New staff ask the same people the same things.',
        means: 'An assistant that answers from your handbook and procedures, with the page cited.',
      },
      {
        said: 'A chatbot made something up about our product.',
        means: 'Answers limited to your approved sources. When the source is missing, the system abstains and says what it could not find.',
      },
      {
        said: 'Our documents are confidential.',
        means: 'A private deployment where indexing, search and the model run in your own environment.',
      },
      {
        said: 'Our answers are out of date in three places.',
        means: 'Indexing that follows your documents, so a corrected page corrects the answers.',
      },
    ],
  },
  build: {
    title: 'What we build',
    intro: 'A knowledge system is more than a chatbot on top of a folder. These are the parts.',
    items: [
      {
        name: 'Grounded question answering',
        line: 'Answers written only from retrieved passages, each with a citation to the exact source.',
      },
      {
        name: 'Abstain when the source is missing',
        line: 'A check that every claim is supported by the retrieved text. If it is not, the answer is a refusal with a reason.',
      },
      {
        name: 'Search over documents, tickets and data',
        line: 'Hybrid retrieval that combines meaning-based and keyword search, then reranks the results.',
      },
      {
        name: 'Ingestion and indexing',
        line: 'Pipelines for PDFs, office files, wikis, tickets and databases, with updates and deletions handled.',
      },
      {
        name: 'Access control',
        line: 'People retrieve only what they are allowed to read.',
      },
      {
        name: 'Evaluation and monitoring',
        line: 'A question set from your real use, scored for correct answers, correct refusals and correct citations.',
      },
    ],
  },
  callout: {
    title: 'What RAG cannot do',
    body: 'It cannot answer from documents you do not have, and it inherits the errors in the documents you do. Part of the job is showing you where your documents contradict each other or run out.',
  },
  receive: {
    title: 'What you receive',
    items: [
      'The working assistant, in your environment, with a search interface or an API.',
      'The ingestion pipeline and the schedule that keeps the index current.',
      'An evaluation set of your questions, with scores and the failures listed.',
      'A record of sources: what is indexed, what is not, and why.',
      'Monitoring for unanswered questions, so you can see the gaps in your documents.',
      'A handover session for whoever maintains the content.',
    ],
    handoverTitle: 'You own it',
    handover: 'You own the index, the code and the evaluation set. When your documents change, the pipeline follows them.',
  },
  connects: {
    title: 'Does it connect to what we already use?',
    intro: 'Yes. The value is in reaching the places your knowledge already lives.',
    chips: [
      'File shares and drives',
      'Wikis and knowledge bases',
      'Help desk and ticketing',
      'Email archives',
      'Databases',
      'PDFs and scans',
      'Intranet and chat tools',
      'Identity, for permissions',
    ],
    note: 'Scanned documents need text extraction first, and the quality depends on the scan. We check a sample early so you know before we build.',
  },
  runs: {
    title: 'Where it can run',
    intro: 'The whole pipeline can run privately. The trade-off is model size, so we test on your questions first.',
    modes: {
      device: {
        fit: 'limits',
        note: 'A single-user assistant over a folder of files, with a small model. Fine for personal or small-team use, not for a shared collection with permissions.',
      },
      onprem: {
        fit: 'fits',
        note: 'Embeddings, search, reranking and the answering model all run on your servers. Answer quality depends on model size.',
      },
      private: { fit: 'fits', note: 'The same pipeline in your cloud account, with your keys and network rules.' },
      hybrid: {
        fit: 'fits',
        note: 'Retrieval stays local. Only the retrieved passages go to a cloud model, if you allow it, and the passages sent are logged.',
      },
      cloud: { fit: 'fits', note: 'The fastest to build. Documents and questions go to managed services under their terms.' },
    },
    note: 'Not every model or feature is available in every mode. We say which before you commit.',
  },
  stack: {
    title: 'How it is built',
    intro: 'For technical readers: what we choose from. The choice is made per system, from your data, your constraints and your workload.',
    groups: [
      { name: 'Retrieval', line: 'Search across your documents with citations, combining keyword and vector search, and GraphRAG where the relationships between people, products and cases matter.' },
      { name: 'Documents', line: 'Parsing, OCR and structured extraction for PDFs, scans, spreadsheets and email.' },
      { name: 'Agents and tools', line: 'LangGraph and LangChain, tools through MCP, and an approval step before any action.' },
      { name: 'Evaluation', line: 'Test sets of real questions with known answers, rerun on every change, and answers that abstain when the sources do not support them.' },
      { name: 'Cost and speed', line: 'Caching, routing between smaller and larger models, and provider prompt caching where it applies.' },
    ],
  },
  proof: {
    title: 'The engine we run ourselves',
    intro: 'We name clients only with their written permission. ragX is the retrieval engine we operate for our own tools.',
    order: ['ragx'],
    why: {
      ragx: 'Hybrid retrieval, reranking and a verifier that makes it abstain. It runs locally, with a local model for the critic step.',
    },
  },
  faq: [
    {
      q: 'What is RAG?',
      a: 'Retrieval-augmented generation. The system first finds the relevant passages in your documents, then a model writes an answer from those passages only. The retrieval step is what ties the answer to your sources.',
    },
    {
      q: 'How do you stop it making things up?',
      a: 'Two ways. Answers are limited to retrieved passages, and a verification step checks that each claim is supported by them. If not, the system abstains. This lowers the rate of unsupported answers. It does not make errors impossible, so we measure it on your questions.',
    },
    {
      q: 'Can it run without sending our documents to a cloud?',
      a: 'Yes. Indexing, retrieval and the model can all run on your servers or in your private cloud. The trade-off is model size, which we test with you.',
    },
    {
      q: 'How many documents can it handle?',
      a: 'Size is rarely the limit. Document quality is. We test on a sample first and show you what the system does with your real files.',
    },
    {
      q: 'What happens when documents change?',
      a: 'The pipeline reindexes changed files on a schedule you set and removes deleted ones, so the answers follow your documents.',
    },
    {
      q: 'How do we know it works?',
      a: 'We build a question set from your real use and score answers, citations and refusals before launch. The same set runs after every change.',
    },
  ],
  related: ['private-ai', 'automation', 'security'],
  cta: { title: 'Bring us the documents nobody can search.', line: CTA_LINE },
}

/* ------------------------------------------------------------------ ai act */

const aiAct: ServiceContent = {
  slug: 'ai-act-readiness',
  path: '/ai-act-readiness/',
  name: 'EU AI Act readiness',
  meta: {
    title: 'EU AI Act readiness for AI systems',
    description:
      'Risk classification, technical documentation, logging and traceability, human oversight and transparency for AI systems that reach the EU. Engineering work, alongside your counsel.',
  },
  serviceType: 'EU AI Act readiness',
  h1: 'EU AI Act readiness for AI systems',
  lead: 'If an AI system you build or sell reaches people in the EU, the AI Act may apply to it. We work out which obligations apply and build the technical evidence they ask for.',
  problems: {
    title: 'Questions we hear',
    items: [
      {
        said: 'Does the Act even apply to us?',
        means:
          'A written classification of each AI system: what it does, who it affects and which category the text places it in. Your counsel confirms the legal reading.',
      },
      {
        said: 'We do not know what documentation is expected.',
        means: 'Technical documentation drafted from your actual system: purpose, data, design, testing and limits.',
      },
      {
        said: 'We cannot show what the system did last month.',
        means: 'Logging and traceability built in, so events can be reconstructed and reviewed.',
      },
      {
        said: 'Who is responsible when the AI decides?',
        means: 'Human oversight designed into the workflow: who can review, who can override and who can stop it.',
      },
      {
        said: 'Do our users know they are dealing with AI?',
        means: 'Transparency notices and interface changes where the Act expects people to be told.',
      },
    ],
  },
  build: {
    title: 'The work, in six parts',
    intro: 'Five areas the Act cares about, and a plan to close the gaps between them and where you are now.',
    items: [
      {
        name: 'Risk classification',
        line: 'Sorting each system into the categories of the Act from its purpose and use, with the reasoning written down.',
      },
      {
        name: 'Technical documentation',
        line: 'Drafting system documentation from the code, the data and the tests, in a form an auditor can read.',
      },
      {
        name: 'Logging and traceability',
        line: 'Designing and building the event logs that let a decision be reconstructed and reviewed.',
      },
      {
        name: 'Human oversight',
        line: 'Approval, override and stop controls, with named roles and evidence that they are used.',
      },
      {
        name: 'Transparency to users',
        line: 'Notices and interface changes that tell people when they are dealing with AI or AI-generated content.',
      },
      {
        name: 'Gap analysis and work plan',
        line: 'What is done, what is missing and in what order to close it, ranked by what matters most.',
      },
    ],
  },
  callout: {
    title: 'What this is, and what it is not',
    body: 'We are engineers, not a law firm, and we do not certify compliance. We work from the current text of the Regulation as published in the Official Journal and from your counsel reading of it. The obligations phase in over several years and the guidance around them is still developing, so we date every deliverable to the text we worked from.',
  },
  receive: {
    title: 'What you receive',
    items: [
      'A classification memo for each system, with the reasoning and the text it rests on.',
      'A gap analysis against the obligations that apply, ranked.',
      'Draft technical documentation, ready for your counsel and auditors to review.',
      'A logging and traceability design and, where we build the system, the implementation.',
      'Oversight and transparency changes, specified or built into the system.',
      'A dated statement of the text we worked from, so you know what to recheck as it evolves.',
    ],
    handoverTitle: 'Your counsel decides',
    handover:
      'Your counsel and your team own the conclusions. We deliver the technical evidence and the system changes, and we say plainly where the reading is a legal question.',
  },
  connects: {
    title: 'Does it connect to what we already use?',
    intro: 'Yes. The work fits into how you already build and document software, so it does not become a parallel process.',
    chips: [
      'Your development process',
      'Change management and ticketing',
      'Existing quality and risk documents',
      'Logging and monitoring',
      'Identity and roles',
      'Counsel and compliance staff',
    ],
    note: 'We write the documentation in the formats your team already keeps, so it can be maintained after we leave.',
  },
  runs: {
    title: 'Where it applies',
    intro: 'The obligations attach to the system and how it is used, not to where it is hosted. Hosting still changes how you meet them.',
    modes: {
      device: {
        fit: 'limits',
        note: 'Logs live on devices you may not control. We design how records are collected and kept.',
      },
      onprem: { fit: 'fits', note: 'You control retention and access to logs. You also carry the duty to keep them.' },
      private: { fit: 'fits', note: 'Logging, access control and retention sit in your tenancy, which makes evidence easier to hold.' },
      hybrid: { fit: 'fits', note: 'Records must cover both sides of the boundary, so the trace stays whole across it.' },
      cloud: {
        fit: 'fits',
        note: 'Ask the provider what it documents and logs. Its documentation can help yours, but it does not replace it.',
      },
    },
  },
  proof: {
    title: 'The engineering this rests on',
    intro: 'We have not published an EU AI Act engagement, and we do not publish client work. What we can show is the governance engineering this work relies on, in systems we run.',
    source: 'security',
    order: ['daena', 'mcp-switchboard'],
    why: {
      daena: 'Approval gates, an audit trail and evidence chains: the raw material for oversight and traceability.',
      'mcp-switchboard': 'An audit log and an approval gate on every tool call an AI assistant makes.',
    },
  },
  faq: [
    {
      q: 'Does the EU AI Act apply to a company in Canada?',
      a: 'It can. The Act looks at whether an AI system is placed on the EU market or its output is used in the EU, not where the company is based. Whether it applies to you is a legal question for your counsel. We prepare the technical side either way.',
    },
    {
      q: 'When do the obligations start?',
      a: 'They phase in over several years, and different parts apply at different times. We do not quote dates on this page, because they can change with amendments and guidance. We work from the current Official Journal text and confirm the timing with your counsel for each system.',
    },
    {
      q: 'Is our system high risk?',
      a: 'That depends on its purpose and the setting where it is used, not on the technology. Classification is the first thing we do, in writing, with the reasoning shown. Your counsel confirms it.',
    },
    {
      q: 'Can you certify us as compliant?',
      a: 'No. We are not a notified body or a law firm. We produce technical documentation, logging, oversight and transparency work, and a gap analysis that your counsel and auditors can review.',
    },
    {
      q: 'What does it cost?',
      a: 'We do not publish a fixed price, because the work depends on how many systems you have and how they are built. A short scoping step ends in a scope and a cost range for your case.',
    },
    {
      q: 'How does this relate to security work?',
      a: 'Closely. Several obligations rest on the same controls: logging, access, oversight and testing. The security, evaluation and governance page describes those controls.',
    },
  ],
  related: ['security', 'private-ai', 'automation'],
  cta: { title: 'Bring us the AI system you need to classify.', line: CTA_LINE },
}

export const SERVICES: Record<string, ServiceContent> = {
  automation,
  software,
  websites,
  'private-ai': privateAi,
  security,
  rag,
  'ai-act-readiness': aiAct,
}

const ALL_LINKS: ServiceLink[] = [...FAMILIES, ...PRACTICES, ...DEPTH]

export function linkFor(slug: string): ServiceLink {
  const found = ALL_LINKS.find((l) => l.slug === slug)
  if (!found) throw new Error(`No service link for slug "${slug}"`)
  return found
}

/* ------------------------------------------------------------------ hub */

export const HUB = {
  meta: {
    title: 'Services: AI automation, custom software and websites',
    description:
      'Three kinds of work: automate operations, build software, build websites. Two practices run through all of them: private, local and cloud AI, and security, evaluation and governance.',
  },
  h1: 'What we build, and how we build it.',
  lead: 'Three kinds of work, two practices that run through all of them, and two depth areas for specific questions.',
  families: {
    title: 'Three kinds of work',
    intro: 'Start with the one closest to your problem. Most projects touch more than one, and we build them as one system.',
  },
  how: {
    title: 'How we build',
    intro: 'Two practices run through every project. Each also stands on its own when that is what you need.',
  },
  depth: {
    title: 'Where buyers arrive with a specific question',
    intro: 'Two areas with their own questions, their own constraints and their own pages.',
  },
  delivery: {
    title: 'How we deliver',
    intro: 'What a production AI system needs beyond the model. We plan each of these with you before the build starts.',
    items: [
      { name: 'Workflow and data first', line: 'We start with the work: who does it, what a good result looks like, and whether the data behind it is complete, current and permissioned. If the data is not ready, we say so and scope that first.' },
      { name: 'Existing systems stay', line: 'We connect your current and older systems through a thin adapter instead of rewriting them, with rate limits and health checks. When a system is down, work queues visibly instead of guessing.' },
      { name: 'Identity and permissions', line: 'AI parts run under their own identity with only the access a task needs, and respect each user’s existing permissions through your sign-on and roles. We review access with your IT team.' },
      { name: 'People approve', line: 'We agree which actions run on their own, which need a named approver, and who a case escalates to if nobody responds. Every approval is logged.' },
      { name: 'Tested, monitored, auditable', line: 'A test set agreed with you before go-live and rerun on every change, traces and logs of what the system did, and failure paths tested on purpose.' },
      { name: 'Secrets and boundaries', line: 'Credentials in a managed secrets store, network access limited to what each part needs, and only the data a task needs sent to a model. Provider terms on training, retention and location are checked against your requirements.' },
      { name: 'Speed, quality and cost', line: 'Latency, quality and running-cost targets set up front and tested on your workload. We pick the smallest model that meets the bar and show you the running cost before we build.' },
      { name: 'Staged rollout and rollback', line: 'Releases start with a small group or alongside the current process. Prompts, models and data indexes are versioned together, and rollback is rehearsed, not assumed.' },
      { name: 'Training and handover', line: 'We scope a handover into every project: runbooks, a written description of what each AI part may do, and hands-on training for the people who run it, so your team does not depend on us.' },
      { name: 'Yours to keep', line: 'By default, code, prompts, test sets and configuration live in your repositories, documented so another team could take over, with ownership set out in the contract. Support after launch is optional and agreed in writing.' },
      { name: 'Success in numbers', line: 'Before we build, we agree what success means, such as time saved, error rate or cost per case, and measure today’s baseline. The same numbers decide go-live.' },
    ],
    note: 'These are design practices, not certifications. We do not claim compliance with a standard on your behalf; we document what we built so your auditors and IT team can check it.',
    faq: [
      { q: 'Will it work with our single sign-on and roles?', a: 'We design for it. AI parts get their own identity with only the access they need, and people see only what their existing permissions allow.' },
      { q: 'What happens when the AI is unsure or wrong?', a: 'Uncertain cases stop for a person, under rules agreed with you. Every action is logged, test sets catch regressions before a release, and the previous version stays ready to switch back to.' },
      { q: 'Can our own team take it over?', a: 'Yes. Code, prompts, test sets and configuration are in your repositories with runbooks, and handover includes training. Ongoing support is optional.' },
      { q: 'How do we know it worked?', a: 'We agree the numbers before the build, measure today’s baseline, and report against the same numbers after go-live.' },
    ],
  },
  blueprint: {
    title: 'Not sure which one fits?',
    body: `The ${OFFER.name} is the first step when the problem is clear and the answer is not. It maps how the work runs today and ends in a build plan or a clear no.`,
    deliverables: [
      'A map of how the work runs today',
      'Opportunities, ranked',
      'The architecture we would use',
      'Constraints: data, security, budget',
      'Scope and a cost range',
      'A build or no-build recommendation',
    ],
  },
  cta: { title: 'Bring us the problem.', line: CTA_LINE },
}
