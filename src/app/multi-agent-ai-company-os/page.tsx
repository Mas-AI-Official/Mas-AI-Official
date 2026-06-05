import type { Metadata } from 'next'
import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import { techArticle, faqPage, breadcrumb, answerGraph, type FaqItem } from '@/lib/answer-seo'

const slug = '/multi-agent-ai-company-os'
const title = 'Multi-Agent AI Company OS — Daena by MAS-AI'
const description =
  'A multi-agent AI company OS organizes specialized agents by department, capability, memory, and approval level. Daena maps 10 departments into 60 governed agent slots with three reasoning modes.'
const h1 = 'What is a multi-agent AI company OS?'
const tldr =
  'Daena is a multi-agent AI company OS that organizes 60 governed agent slots across 10 departments and 6 capability types (MIND, EYES, HANDS, VOICE, SHIELD, MEMORY), with three reasoning modes and a shared, auditable 5-tier memory fabric.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: slug },
  keywords: ['AI company OS', 'multi-agent AI company OS', 'multi-agent orchestration', 'AI departments', 'agent capabilities', 'governed multi-agent platform'],
  openGraph: { title, description, url: 'https://mas-ai.co/multi-agent-ai-company-os', type: 'article' },
}

const faq: FaqItem[] = [
  {
    q: 'What is an AI company OS?',
    a: 'An AI company OS coordinates many specialized agents the way a business coordinates departments — assigning work, enforcing policy, sharing memory, and keeping an audit trail. Daena structures this as 10 departments and 60 governed agent slots rather than a flat pool of bots.',
  },
  {
    q: 'What are the 6 agent capabilities?',
    a: 'Each agent is composed from six capability types: MIND (reasoning), EYES (perception/input), HANDS (actions/tools), VOICE (output/communication), SHIELD (security), and MEMORY. Agents are defined by capability, not just by which model they use.',
  },
  {
    q: 'What are Daena’s three reasoning modes?',
    a: 'Standard for routine work, Council for multi-model synthesis on harder problems, and Quintessence for the highest-stakes decisions. Higher modes engage more agents and more deliberation, which the governance pipeline still audits.',
  },
  {
    q: 'How do agents share context across the company?',
    a: 'Through a 5-tier Neural-Backed Memory Fabric — Ephemeral, Working, Project, Institutional, and Founder-Private — with trust-gated promotion between tiers, so the right context persists at the right scope without leaking across tenants.',
  },
  {
    q: 'Does a company OS replace frameworks like CrewAI or AutoGen?',
    a: 'No — it sits above them. Frameworks help you build agent behaviors; a company OS like Daena governs, routes, remembers, and audits them across the whole organization. You can build with a framework and run inside Daena.',
  },
]

export default function Page() {
  const jsonLd = answerGraph([
    techArticle({ slug, headline: h1, description }),
    faqPage(slug, faq),
    breadcrumb(slug, 'Multi-Agent AI Company OS'),
  ])
  return (
    <AnswerLayout
      eyebrow="AI Company OS"
      h1={h1}
      tldr={tldr}
      proof={['10 departments × 6 capabilities = 60 slots', '3 reasoning modes', '5-tier memory fabric', 'Daena v3.7 in production']}
      jsonLd={jsonLd}
      related={[
        { href: '/what-is-daena', label: 'What is Daena?' },
        { href: '/ai-governance-platform', label: 'What is an AI governance platform?' },
        { href: '/use-cases/multi-llm-routing', label: 'How to route across multiple LLMs' },
        { href: '/compare/daena-vs-autogen', label: 'How is Daena different from AutoGen?' },
      ]}
    >
      <Section h2="What a “company OS” means">
        <p>
          A company runs on departments, roles, shared memory, and approval chains. A
          multi-agent AI company OS mirrors that: agents are organized by function,
          composed from capabilities, given scoped memory, and held to an approval
          policy. Daena makes the org chart the architecture.
        </p>
      </Section>

      <Section h2="10 departments × 6 capabilities = 60 governed slots">
        <p>
          Departments map to real business functions (Engineering, Product, Marketing,
          Sales, Finance, Operations, Research, Legal &amp; Compliance, Skill
          Governance, Security Operations). Each department draws on six capability
          types — MIND, EYES, HANDS, VOICE, SHIELD, MEMORY — for 60 governed agent
          slots in total. Every slot inherits the same 10-stage governance pipeline.
        </p>
      </Section>

      <Section h2="Reasoning that scales with the stakes">
        <p>
          Standard mode handles routine tasks. Council mode runs a multi-model
          deliberation for harder calls. Quintessence mode is reserved for the highest
          stakes. The mode changes how much the system deliberates — it does not change
          whether the action is governed and audited.
        </p>
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
