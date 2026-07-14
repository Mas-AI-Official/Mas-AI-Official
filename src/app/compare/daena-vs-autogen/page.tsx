import type { Metadata } from 'next'
import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import CompareTable from '@/components/answer/CompareTable'
import { techArticle, faqPage, breadcrumb, answerGraph, type FaqItem } from '@/lib/answer-seo'

const slug = '/compare/daena-vs-autogen/'
const title = 'Daena vs AutoGen — Governed Control Plane vs Agent Framework'
const description =
  'AutoGen is a Microsoft framework for multi-agent conversation patterns; Daena is a governed control plane that adds approval gates, audit logging, multi-LLM routing, and a memory fabric for production.'
const h1 = 'How is Daena different from AutoGen?'
const tldr =
  'AutoGen is a Microsoft framework for multi-agent conversation patterns; Daena is a governed control plane that adds approval gates, an immutable audit log, multi-LLM routing across 9 runtimes, and a memory fabric for production deployment.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: slug },
  keywords: ['Daena vs AutoGen', 'AutoGen alternative', 'AutoGen governance', 'AutoGen audit logs', 'enterprise multi-agent governance', 'Microsoft AutoGen alternative'],
  openGraph: {
    title,
    description,
    url: 'https://mas-ai.co/compare/daena-vs-autogen/',
    type: 'article',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const faq: FaqItem[] = [
  {
    q: 'Is Daena an AutoGen alternative?',
    a: 'They overlap but aim at different goals. AutoGen is a framework for multi-agent conversation and collaboration patterns; Daena is a governed control plane for operating agents in production with policy, audit, routing, and memory. You can build agents in AutoGen and run them under Daena.',
  },
  {
    q: 'What is AutoGen good at?',
    a: 'AutoGen, from Microsoft Research, is strong for multi-agent conversation patterns and rapid research and prototyping of agents that talk to each other.',
  },
  {
    q: 'What does Daena add for production use?',
    a: 'A mandatory 10-stage governance pipeline, four-tier risk policy with human-approval gates, an immutable audit log, hot-swap routing across 9 LLM runtimes, a 5-tier memory fabric, and Klyntar security screening — the operational concerns frameworks leave to you.',
  },
  {
    q: 'Does Daena lock me into one model like a vendor framework might?',
    a: 'No. Daena is model-agnostic and routes across 9 runtimes including local Ollama, so you are not tied to any single provider.',
  },
]

export default function Page() {
  const jsonLd = answerGraph([
    techArticle({ slug, headline: h1, description }),
    faqPage(slug, faq),
    breadcrumb(slug, 'Daena vs AutoGen'),
  ])
  return (
    <AnswerLayout
      eyebrow="Compare"
      h1={h1}
      tldr={tldr}
      proof={['Framework vs control plane', 'Model-agnostic (9 runtimes)', 'Daena v3.7 in production']}
      jsonLd={jsonLd}
      related={[
        { href: '/ai-governance-platform', label: 'What is an AI governance platform?' },
        { href: '/compare/daena-vs-langchain', label: 'How is Daena different from LangChain?' },
        { href: '/multi-agent-ai-company-os', label: 'What is a multi-agent AI company OS?' },
        { href: '/use-cases/ai-agent-governance', label: 'How to govern AI agents in production' },
      ]}
    >
      <Section h2="Conversation framework vs governed operations">
        <p>
          AutoGen focuses on how agents collaborate — the conversation patterns between
          them. Daena focuses on how agents are governed and operated — what each one is
          allowed to do, on which model, with what memory, and with what audit trail.
          Both can be true at once: AutoGen for the pattern, Daena for the control.
        </p>
      </Section>

      <Section h2="Side by side">
        <CompareTable
          caption="Daena compared with AutoGen across governance, audit, routing, memory, security, and target use"
          head={['Dimension', 'Daena', 'AutoGen']}
          rows={[
            ['Primary goal', 'Govern + operate agents in production', 'Multi-agent conversation patterns'],
            ['Governance', '10-stage pipeline, four-tier policy', 'Not included natively'],
            ['Audit trail', 'Immutable per-action AuditLog', 'Application-level'],
            ['Multi-LLM routing', '9 runtimes, hot-swap', 'Configurable per model'],
            ['Memory', '5-tier NBMF (patent-pending)', 'Conversation-buffer based'],
            ['Security screening', 'Klyntar, zero-false-positive gate', 'Not included'],
            ['Strength', 'Production governance + operations', 'Research, prototyping, agent dialogue'],
          ]}
        />
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
