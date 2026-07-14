import type { Metadata } from 'next'
import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import { techArticle, faqPage, breadcrumb, answerGraph, type FaqItem } from '@/lib/answer-seo'

const slug = '/use-cases/multi-llm-routing/'
const title = 'Multi-LLM Routing Without Vendor Lock-In — Daena'
const description =
  'Route AI workloads across 9 LLM runtimes with hot-swap that needs no restart, while every call still passes the full governance pipeline. Daena’s model-agnostic routing.'
const h1 = 'How do you route AI workloads across multiple LLMs without vendor lock-in?'
const tldr =
  'Daena routes AI workloads across 9 LLM runtimes with hot-swap that needs no restart and no workflow rewrite, while every routed call still passes the full 10-stage governance pipeline — so switching models never relaxes policy.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: slug },
  keywords: ['multi-LLM routing', 'multi-LLM router', 'LLM routing platform', 'hot-swap LLM', 'avoid LLM vendor lock-in', 'route Claude GPT Gemini', 'multi-model routing'],
  openGraph: {
    title,
    description,
    url: 'https://mas-ai.co/use-cases/multi-llm-routing/',
    type: 'article',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const faq: FaqItem[] = [
  {
    q: 'What is multi-LLM routing?',
    a: 'Multi-LLM routing sends each task to the model that best fits its cost, latency, capability, and policy requirements, instead of hardwiring one provider. Daena routes across 9 runtimes and can switch models without changing agent logic.',
  },
  {
    q: 'Which LLMs can Daena route across?',
    a: 'Nine runtimes: Claude, GPT, Gemini, Grok, Ollama, Groq, OpenRouter, Together, and Perplexity. Ollama enables fully local execution at no API cost.',
  },
  {
    q: 'Can I swap Claude for GPT without breaking my agents?',
    a: 'Yes. Daena hot-swaps runtimes without a restart and without rewiring workflows, because routing and policy live in the control plane rather than in each agent’s code.',
  },
  {
    q: 'Does switching models change governance?',
    a: 'No. Every routed call passes the same 10-stage governance pipeline and four-tier policy regardless of the model underneath, so changing providers never relaxes enforcement.',
  },
  {
    q: 'How does Daena decide which model to use?',
    a: 'Routing can factor in cost, latency, capability tier, and governance requirements per task. The architecture is covered by USPTO provisional patent #63/877,082 (PhiLattice agent topology).',
  },
]

export default function Page() {
  const jsonLd = answerGraph([
    techArticle({ slug, headline: h1, description }),
    faqPage(slug, faq),
    breadcrumb(slug, 'Multi-LLM Routing'),
  ])
  return (
    <AnswerLayout
      eyebrow="Use case"
      h1={h1}
      tldr={tldr}
      proof={['9 LLM runtimes', 'Hot-swap, no restart', 'Governance applies to every model', 'PhiLattice patent-pending']}
      jsonLd={jsonLd}
      related={[
        { href: '/ai-control-plane-for-business', label: 'What is an AI control plane?' },
        { href: '/what-is-daena', label: 'What is Daena?' },
        { href: '/ai-governance-platform', label: 'What is an AI governance platform?' },
        { href: '/use-cases/ai-agent-governance', label: 'How to govern AI agents in production' },
      ]}
    >
      <Section h2="Why route across multiple LLMs">
        <p>
          No single model is best at everything, and committing to one provider is a
          business risk — pricing, availability, and capability all change. Multi-LLM
          routing lets you match each task to the right model and switch when the
          landscape shifts, without re-architecting.
        </p>
      </Section>

      <Section h2="The 9 runtimes">
        <p className="font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
          Claude · GPT · Gemini · Grok · Ollama · Groq · OpenRouter · Together · Perplexity
        </p>
        <p>
          Cloud and local models behind one interface. Ollama covers fully local,
          zero-API-cost execution; the rest cover frontier and specialized models.
        </p>
      </Section>

      <Section h2="Routing and governance together">
        <p>
          The point that matters for a business: routing does not bypass policy. Every
          call, on every model, still traverses the 10-stage governance pipeline and is
          written to the audit log. You get model flexibility without losing oversight.
        </p>
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
