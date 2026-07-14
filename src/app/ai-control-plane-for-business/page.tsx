import type { Metadata } from 'next'
import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import { techArticle, faqPage, breadcrumb, answerGraph, type FaqItem } from '@/lib/answer-seo'

const slug = '/ai-control-plane-for-business/'
const title = 'AI Control Plane for Business — Daena by MAS-AI'
const description =
  'An AI control plane centralizes LLM routing, governance, memory, and audit logging across a business’s AI agents. Daena lets companies deploy agents without losing oversight or reproducibility.'
const h1 = 'What is an AI control plane for business?'
const tldr =
  'Daena is an AI control plane for business that centralizes LLM routing, governance enforcement, memory, and audit logging — so a company can deploy AI agents across teams without losing oversight or reproducibility.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: slug },
  keywords: ['AI control plane', 'AI control plane for business', 'enterprise AI orchestration', 'AI governance', 'multi-LLM control plane', 'AI agent oversight'],
  openGraph: {
    title,
    description,
    url: 'https://mas-ai.co/ai-control-plane-for-business/',
    type: 'article',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const faq: FaqItem[] = [
  {
    q: 'What is an AI control plane?',
    a: 'Borrowing the term from networking, a control plane is the layer that decides and enforces policy while the work runs underneath. An AI control plane centralizes model routing, governance, memory, and audit for a company’s agents, separating those concerns from the agent logic itself.',
  },
  {
    q: 'Why do businesses need an AI control plane?',
    a: 'Once more than one team is shipping AI agents, you get inconsistent policy, scattered logs, and vendor lock-in. A control plane like Daena gives one place to enforce governance, route across models, and produce an audit trail — so oversight does not depend on each team remembering to add it.',
  },
  {
    q: 'How is a control plane different from an agent framework?',
    a: 'A framework helps developers build agent behavior; a control plane governs and operates those agents in production. Daena composes with frameworks: you build with the framework and run, route, and audit through the control plane.',
  },
  {
    q: 'Does the control plane lock me into one LLM?',
    a: 'No. Daena separates model choice from policy and routes across 9 runtimes with hot-swap, so you can change providers without rewriting workflows or relaxing governance.',
  },
  {
    q: 'Is Daena production-ready?',
    a: 'Daena v3.7 runs in production on Google Cloud Run with 3,086+ tests passing, and its architecture is covered by two USPTO provisional patents.',
  },
]

export default function Page() {
  const jsonLd = answerGraph([
    techArticle({ slug, headline: h1, description }),
    faqPage(slug, faq),
    breadcrumb(slug, 'AI Control Plane for Business'),
  ])
  return (
    <AnswerLayout
      eyebrow="AI Control Plane"
      h1={h1}
      tldr={tldr}
      proof={['Daena v3.7 in production', '9 LLM runtimes, hot-swap', '3,086+ tests passing', 'Runs on Google Cloud Run']}
      jsonLd={jsonLd}
      related={[
        { href: '/what-is-daena', label: 'What is Daena?' },
        { href: '/ai-governance-platform', label: 'What is an AI governance platform?' },
        { href: '/use-cases/multi-llm-routing', label: 'How to route across multiple LLMs' },
        { href: '/use-cases/ai-agent-governance', label: 'How to govern AI agents in production' },
      ]}
    >
      <Section h2="What a control plane is — and why agents need one">
        <p>
          In networking, the control plane decides where traffic goes while the data
          plane moves it. Applied to AI, the control plane is where you decide which
          model runs a task, whether an action is allowed, what the agent remembers,
          and how it is logged. Without one, every team re-invents those decisions and
          governance drifts.
        </p>
      </Section>

      <Section h2="What Daena centralizes">
        <p>
          Four things, in one layer: <strong className="text-white">routing</strong>{' '}
          across 9 LLM runtimes; <strong className="text-white">governance</strong> via
          the 10-stage pipeline and four-tier risk policy;{' '}
          <strong className="text-white">memory</strong> via the 5-tier NBMF; and{' '}
          <strong className="text-white">audit</strong> via an immutable per-action log.
          Agent code stays simple because policy, memory, and routing live in the plane.
        </p>
      </Section>

      <Section h2="Separating model choice from policy">
        <p>
          Because policy is enforced in the control plane, switching the underlying
          model never relaxes it. The same governance applies whether a task runs on
          Claude, GPT, Gemini, or a local Ollama model — which is what makes
          multi-vendor AI safe to operate at a business.
        </p>
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
