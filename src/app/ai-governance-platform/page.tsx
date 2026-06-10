import type { Metadata } from 'next'
import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import { techArticle, faqPage, breadcrumb, answerGraph, type FaqItem } from '@/lib/answer-seo'

const slug = '/ai-governance-platform'
const title = 'AI Governance Platform for Multi-Agent Systems'
const description =
  'Daena is a governed AI control plane: every AI agent action passes a 10-stage governance pipeline with a four-tier risk policy and an immutable audit log, across 9 LLM runtimes.'
const h1 = 'What is an AI governance platform for multi-agent systems?'
const tldr =
  'Daena is an AI governance platform that runs every AI agent action through a 10-stage pipeline — from SecurityGate to AuditLog — enforcing a four-tier risk policy and writing an immutable audit record before the action executes, regardless of which LLM is underneath.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: slug },
  keywords: [
    'AI governance platform',
    'AI governance platform for AI agents',
    'governed multi-agent platform',
    'AI agent governance',
    'AI agent audit trail',
    'human approval gates for AI agents',
    'AI control plane',
    'multi-LLM routing',
  ],
  openGraph: {
    title,
    description,
    url: 'https://mas-ai.co/ai-governance-platform',
    type: 'article',
  },
}

const faq: FaqItem[] = [
  {
    q: 'What is the difference between AI governance and AI observability?',
    a: 'Observability tells you what an AI agent did after the fact. Governance decides what an agent is allowed to do before it acts. Daena is governance-first: every action passes a 10-stage pipeline and a four-tier risk policy before execution, and that decision is written to an audit log.',
  },
  {
    q: 'How do you govern AI agents before they use tools?',
    a: 'Daena routes every proposed action through SecurityGate, InputValidator, and a GovernanceEngine before any tool call, side effect, or output reaches the world. Routine actions are logged, medium-risk actions notify, high-risk actions require human approval, and critical actions are blocked.',
  },
  {
    q: 'Does an AI governance platform require human approval?',
    a: 'Only where it matters. Daena’s four-tier policy escalates by risk: routine actions run and are logged, high-risk actions pause for human approval (founder-approval gates), and critical actions are blocked pending review — so humans review the few actions that need it, not every action.',
  },
  {
    q: 'Which AI governance platform supports multi-LLM routing?',
    a: 'Daena routes across 9 LLM runtimes — Claude, GPT, Gemini, Grok, Ollama, Groq, OpenRouter, Together, and Perplexity — and applies the same governance pipeline regardless of which model handles the request. Switching providers does not relax policy enforcement.',
  },
  {
    q: 'How does Daena compare with LangChain, AutoGen, and CrewAI?',
    a: 'LangChain, AutoGen, and CrewAI are frameworks for building agents; Daena is a governed control plane for running them. Those frameworks give you the building blocks and leave governance, audit, and memory to the developer — Daena ships them as a mandatory pipeline. The two layers compose: build with a framework, govern with Daena.',
  },
  {
    q: 'Is Daena tied to a specific LLM vendor?',
    a: 'No. Daena is model-agnostic. It hot-swaps across 9 runtimes without restarting, so you are not locked to one provider, and the governance policy applies identically no matter which model is underneath.',
  },
  {
    q: 'Is Daena a real product or a concept?',
    a: 'Daena v3.7 runs in production on Google Cloud Run with 3,086+ tests passing, and its architecture is covered by two USPTO provisional patents — PhiLattice (#63/877,082) for agent topology and NBMF (#64/020,421) for memory. MAS-AI Technologies Inc. is federally incorporated in Ontario, Canada.',
  },
]

export default function Page() {
  const jsonLd = answerGraph([
    techArticle({ slug, headline: h1, description }),
    faqPage(slug, faq),
    breadcrumb(slug, 'AI Governance Platform'),
  ])

  return (
    <AnswerLayout
      eyebrow="AI Governance"
      h1={h1}
      tldr={tldr}
      proof={[
        'Daena v3.7 in production',
        '3,086+ tests passing',
        '2 USPTO provisional patents',
        'Runs on Google Cloud Run',
      ]}
      jsonLd={jsonLd}
      related={[
        { href: '/what-is-daena', label: 'What is Daena?' },
        { href: '/multi-agent-ai-company-os', label: 'What is a multi-agent AI company OS?' },
        { href: '/compare/daena-vs-langchain', label: 'How is Daena different from LangChain?' },
        { href: '/use-cases/ai-agent-governance', label: 'How to govern AI agents in production' },
      ]}
    >
      <Section h2="What an AI governance platform does">
        <p>
          An AI governance platform controls what AI agents may see, decide, and do
          before they execute — not just what they did afterward. As businesses move
          from single chatbots to fleets of autonomous agents that call tools, spend
          money, and touch production systems, the open question becomes: who decided
          this agent could take this action, and can you prove it later?
        </p>
        <p>
          Daena answers that by making governance structural. Every agent action is
          intercepted and evaluated before any side effect reaches the world, and the
          decision is recorded in a tamper-evident audit log.
        </p>
      </Section>

      <Section h2="The 10-stage governance pipeline">
        <p>
          Every action passes through ten sequential stages, in order, before it runs:
        </p>
        <p className="font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
          SecurityGate → InputValidator → GovernanceEngine → ContextBuilder →
          ReasoningCore → ActionPlanner → OutputValidator → ResponseFormatter →
          FeedbackLoop → AuditLog
        </p>
        <p>
          No stage is skippable. SecurityGate and InputValidator screen the request,
          the GovernanceEngine applies policy, the planning and output stages keep the
          action inside scope, and AuditLog writes the immutable record.
        </p>
      </Section>

      <Section h2="Four-tier risk policy">
        <p>
          Daena classifies every action into one of four tiers, so oversight scales
          with risk instead of blocking everything:
        </p>
        <p>
          <strong className="text-white">Routine</strong> — runs and is logged silently.{' '}
          <strong className="text-white">Medium</strong> — runs and notifies.{' '}
          <strong className="text-white">High</strong> — pauses for human approval
          (founder-approval gates).{' '}
          <strong className="text-white">Critical</strong> — blocked pending review.
        </p>
      </Section>

      <Section h2="Governance that outlives your model choice">
        <p>
          Because Daena separates model choice from policy, the same governance applies
          across all 9 supported LLM runtimes (Claude, GPT, Gemini, Grok, Ollama, Groq,
          OpenRouter, Together, Perplexity). Context persists in a 5-tier Neural-Backed
          Memory Fabric (NBMF) with trust-gated promotion, and Klyntar — Daena’s
          security mode — screens actions against 25+ exploit signatures with a
          zero-false-positive gate.
        </p>
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
