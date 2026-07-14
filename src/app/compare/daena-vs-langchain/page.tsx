import type { Metadata } from 'next'
import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import CompareTable from '@/components/answer/CompareTable'
import { techArticle, faqPage, breadcrumb, answerGraph, type FaqItem } from '@/lib/answer-seo'

const slug = '/compare/daena-vs-langchain/'
const title = 'Daena vs LangChain — Governed Control Plane vs Framework'
const description =
  'LangChain is a developer framework for building LLM applications; Daena is a governed control plane for running AI agents in production. An honest, factual comparison.'
const h1 = 'How is Daena different from LangChain?'
const tldr =
  'LangChain is a developer framework for building LLM applications; Daena is a governed control plane for running AI agents in production. You build with LangChain and govern, route, and audit with Daena — they operate at different layers and compose.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: slug },
  keywords: ['Daena vs LangChain', 'LangChain alternative', 'LangChain governance', 'AI governance platform vs LangChain', 'enterprise LangChain alternative'],
  openGraph: {
    title,
    description,
    url: 'https://mas-ai.co/compare/daena-vs-langchain/',
    type: 'article',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const faq: FaqItem[] = [
  {
    q: 'Is Daena a LangChain alternative?',
    a: 'Not exactly — they sit at different layers. LangChain is a framework you build agents with; Daena is a control plane you run and govern agents in. Many teams build with LangChain and operate inside Daena rather than choosing one or the other.',
  },
  {
    q: 'What does LangChain do well?',
    a: 'LangChain has a large ecosystem, broad integrations, and flexible primitives for chaining LLM calls and tools. It is a strong choice for building agent behavior quickly.',
  },
  {
    q: 'What does Daena add that LangChain leaves to the developer?',
    a: 'A mandatory 10-stage governance pipeline, four-tier risk policy with human-approval gates, an immutable audit log per action, multi-LLM routing across 9 runtimes, and a 5-tier memory fabric — all as platform features rather than code you write and maintain yourself.',
  },
  {
    q: 'Can I use LangChain and Daena together?',
    a: 'Yes. Build your agent logic with LangChain (or any framework) and run it under Daena’s control plane to add governance, routing, memory, and audit.',
  },
]

export default function Page() {
  const jsonLd = answerGraph([
    techArticle({ slug, headline: h1, description }),
    faqPage(slug, faq),
    breadcrumb(slug, 'Daena vs LangChain'),
  ])
  return (
    <AnswerLayout
      eyebrow="Compare"
      h1={h1}
      tldr={tldr}
      proof={['Different layers of the stack', 'They compose, not compete', 'Daena v3.7 in production']}
      jsonLd={jsonLd}
      related={[
        { href: '/ai-governance-platform', label: 'What is an AI governance platform?' },
        { href: '/compare/daena-vs-autogen', label: 'How is Daena different from AutoGen?' },
        { href: '/ai-control-plane-for-business', label: 'What is an AI control plane?' },
        { href: '/what-is-daena', label: 'What is Daena?' },
      ]}
    >
      <Section h2="They solve different layers of the stack">
        <p>
          LangChain is a build-time framework: it gives developers primitives to chain
          models, tools, and memory into an application. Daena is a run-time control
          plane: it governs, routes, remembers, and audits agents in production. The
          honest framing is not &ldquo;which is better&rdquo; but &ldquo;which
          layer&rdquo; — and most teams need both.
        </p>
      </Section>

      <Section h2="Side by side">
        <CompareTable
          caption="Daena compared with LangChain across governance, audit, routing, memory, security, and target user"
          head={['Dimension', 'Daena', 'LangChain']}
          rows={[
            ['Layer', 'Run-time governed control plane', 'Build-time application framework'],
            ['Governance', '10-stage pipeline, always-on', 'Implemented by the developer'],
            ['Audit trail', 'Immutable per-action AuditLog', 'Application-level, optional'],
            ['Multi-LLM routing', '9 runtimes, hot-swap, built-in', 'Supported via integrations'],
            ['Memory', '5-tier NBMF (patent-pending)', 'Developer-managed'],
            ['Security screening', 'Klyntar (25+ exploit signatures)', 'Not included'],
            ['Ecosystem', 'Newer, focused', 'Large, broad integrations'],
            ['Primary user', 'Teams operating agents in production', 'Developers building agents'],
          ]}
        />
      </Section>

      <Section h2="When to use which">
        <p>
          Use LangChain (or LangGraph) when you are building and iterating on agent
          behavior. Add Daena when those agents go to production and you need
          consistent governance, model-agnostic routing, shared memory, and an audit
          trail you can show a regulator or a customer.
        </p>
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
