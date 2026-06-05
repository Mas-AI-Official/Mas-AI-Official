import type { Metadata } from 'next'
import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import { techArticle, faqPage, breadcrumb, answerGraph, type FaqItem } from '@/lib/answer-seo'

const slug = '/use-cases/ai-agent-governance'
const title = 'How to Govern AI Agents in Production — Daena'
const description =
  'Enforce governance on AI agents by routing every action through policy before execution. Daena uses a 10-stage pipeline and four-tier risk policy with an immutable audit trail.'
const h1 = 'How do you enforce governance on AI agents in production?'
const tldr =
  'You enforce AI agent governance by checking every action against policy before it runs. Daena does this with a 10-stage pipeline and a four-tier risk policy that escalates from logging to human approval to a hard block, with an immutable audit trail for every action.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: slug },
  keywords: ['AI agent governance', 'govern AI agents in production', 'human approval gates for AI agents', 'AI agent audit trail', 'AI agent oversight', 'govern agents before tool execution'],
  openGraph: { title, description, url: 'https://mas-ai.co/use-cases/ai-agent-governance', type: 'article' },
}

const faq: FaqItem[] = [
  {
    q: 'How do you govern an AI agent before it acts?',
    a: 'Intercept the action and evaluate it against policy before any tool call or side effect. Daena routes every action through SecurityGate, InputValidator, and a GovernanceEngine, then classifies it into a four-tier risk policy before it is allowed to run.',
  },
  {
    q: 'What audit trail should an AI agent create?',
    a: 'A tamper-evident record of each action: what was attempted, which policy tier applied, whether a human approved it, and the outcome. Daena writes this to an immutable AuditLog as the final pipeline stage, enabling compliance review and incident forensics.',
  },
  {
    q: 'When should a human approve an AI agent action?',
    a: 'For high-risk actions. Daena’s four-tier policy runs routine actions automatically (logged), notifies on medium risk, requires human approval (founder-approval gates) on high risk, and blocks critical actions — so humans review only what truly needs it.',
  },
  {
    q: 'Does governance slow agents down?',
    a: 'It adds a policy check, not a bottleneck. Routine actions pass through and are logged with no human in the loop; only higher-risk tiers pause for approval, so the few sensitive actions get oversight while the rest run.',
  },
  {
    q: 'Which industries need AI agent governance most?',
    a: 'Regulated and high-stakes ones — finance, healthcare, legal, and security — where auditability, approvals, and reproducibility are required. Daena was built governance-first for exactly these settings.',
  },
]

export default function Page() {
  const jsonLd = answerGraph([
    techArticle({ slug, headline: h1, description }),
    faqPage(slug, faq),
    breadcrumb(slug, 'AI Agent Governance'),
  ])
  return (
    <AnswerLayout
      eyebrow="Use case"
      h1={h1}
      tldr={tldr}
      proof={['10-stage pipeline', 'Four-tier risk policy', 'Immutable audit log', 'Daena v3.7 in production']}
      jsonLd={jsonLd}
      related={[
        { href: '/ai-governance-platform', label: 'What is an AI governance platform?' },
        { href: '/what-is-daena', label: 'What is Daena?' },
        { href: '/use-cases/multi-llm-routing', label: 'How to route across multiple LLMs' },
        { href: '/ai-control-plane-for-business', label: 'What is an AI control plane?' },
      ]}
    >
      <Section h2="The governance problem">
        <p>
          An autonomous agent that can call tools, move money, or change production data
          is only as safe as the controls around it. The hard questions are operational:
          who authorized this action, what was it allowed to do, and can you reconstruct
          the decision afterward. Governance answers those before the action runs.
        </p>
      </Section>

      <Section h2="How Daena enforces it">
        <p>
          Every action passes the 10-stage pipeline — SecurityGate through AuditLog —
          and is classified into a four-tier risk policy. Routine actions are logged,
          medium-risk notify, high-risk require human approval, and critical actions are
          blocked. The policy is applied identically regardless of which of the 9 LLM
          runtimes generated the action.
        </p>
      </Section>

      <Section h2="What you get">
        <p>
          A replayable audit trail for compliance and incident forensics, human approval
          exactly where risk warrants it, and consistent enforcement across teams and
          models. KYA Mission Control extends this to agent identity — verifying who owns
          an agent and what it may do — at kya.mas-ai.co.
        </p>
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
