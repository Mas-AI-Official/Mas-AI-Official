import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section, Steps, Terms } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import { PIPELINE_STAGES, PROVIDER_NAMES } from '@/components/answer/daena-facts'
import { answerGraph, type FaqItem } from '@/lib/answer-seo'
import { pageMetadata } from '@/lib/seo'
import { DAENA } from '@/content/facts'

const path = '/ai-governance-platform/'
const title = 'AI governance platform for multi-agent systems'
const description = `Daena is a governed AI control plane: in governed mode every agent request passes a ten-stage pipeline with risk classification, an approval queue for high-risk actions and an audit trail, across ${DAENA.providers.display}.`
const h1 = 'What is an AI governance platform for multi-agent systems?'
const tldr =
  'An AI governance platform decides what AI agents may do before they act, and keeps a record of what they did. Daena does this inside the request path: a ten-stage pipeline, risk classification, an approval queue for high-risk actions and an audit trail.'

export const metadata = pageMetadata({ title, description, path })

const faq: FaqItem[] = [
  {
    q: 'What is the difference between AI governance and AI observability?',
    a: 'Observability tells you what an agent did after the fact. Governance decides what an agent may do before it acts. Daena is governance-first: in governed mode a request is checked and classified by risk before any action runs, and the decision is written to an audit trail.',
  },
  {
    q: 'How do you govern AI agents before they use tools?',
    a: 'Put the check in the execution path. In Daena a request goes through a security gate, intent and risk classification and a governance check before the model is routed and anything is built or executed. Plan-only is the default action mode, and execution goes through the security gate and an approval queue for high-risk actions.',
  },
  {
    q: 'Does an AI governance platform require human approval?',
    a: 'Only where it matters. Daena classifies each action by risk. High-risk actions wait in an approval queue for a person. Lower-risk actions do not need a human on every step.',
  },
  {
    q: 'Which governance platform supports multi-LLM routing?',
    a: `Daena routes across ${DAENA.providers.display}: ${PROVIDER_NAMES.join(', ')}. The routing stage sits after the governance check, so changing the model does not skip the check.`,
  },
  {
    q: 'How does Daena compare with LangChain, AutoGen and CrewAI?',
    a: 'Those are frameworks for building agents. Daena is a governed platform for running them, with governance, memory and audit built into the request path. The two layers can be combined: build behavior with a framework, and run it under a control plane.',
  },
  {
    q: 'Is Daena tied to one model vendor?',
    a: `No. Routing is separate from policy, and Daena supports ${DAENA.providers.display}, including local runtimes.`,
  },
  {
    q: 'Is Daena a real product or a concept?',
    a: `It is a working system in ${DAENA.version.display}, and an earlier build runs on Google Cloud Run. The source is public under BSL 1.1 on GitHub, so you can read what it does.`,
  },
]

export default function Page() {
  return (
    <AnswerLayout
      crumbs={[
        { name: 'What is Daena', path: '/what-is-daena/' },
        { name: 'AI governance platform', path },
      ]}
      h1={h1}
      tldr={tldr}
      proof={[
        'Ten-stage request pipeline',
        DAENA.hardLaws.display,
        DAENA.providers.display,
        DAENA.license.display,
        `Status: ${DAENA.version.display}`,
      ]}
      jsonLd={answerGraph(path, h1, description, faq)}
      related={[
        { href: '/what-is-daena/', label: 'What is Daena?' },
        { href: '/multi-agent-ai-company-os/', label: 'What is a multi-agent AI company OS?' },
        { href: '/compare/daena-vs-langchain/', label: 'How is Daena different from LangChain?' },
        { href: '/use-cases/ai-agent-governance/', label: 'How to govern AI agents in production' },
        { href: '/security/', label: 'Security, evaluation and governance for your own build' },
      ]}
    >
      <Section h2="What an AI governance platform does">
        <p>
          It controls what AI agents may see, decide and do before they execute, not only what they did
          afterward. When a business moves from one chatbot to a fleet of agents that call tools, spend money and
          touch production systems, the open question is: who decided this agent could take this action, and can
          you prove it later?
        </p>
        <p>
          Daena answers that by putting governance inside the execution path. The check happens before the action,
          and the decision is recorded.
        </p>
      </Section>

      <Section h2="The ten-stage request pipeline">
        <p>In governed mode every request passes these stages, in order:</p>
        <Steps items={PIPELINE_STAGES} label="The ten stages of a Daena request" />
        <p>
          The security gate screens the request. Intent and risk classify it. The governance check applies policy.
          Only then does routing pick a model and memory recall add context. The last stage persists the result and
          writes the audit record.
        </p>
      </Section>

      <Section h2="Risk, approval and modes">
        <p>
          Each action gets a risk level. High-risk actions do not run on their own: they go to an approval queue
          and wait for a person. Action mode is plan-only by default.
        </p>
        <p>
          Daena has three governance modes. <strong>Governed</strong> runs the full pipeline with all{' '}
          {DAENA.hardLaws.display}. <strong>Balanced</strong> runs a lighter path and asks for approval only on
          dangerous operations. <strong>Unleashed</strong> skips the governance pipeline and keeps only data
          protection. The governed mode is the one meant for business use.
        </p>
      </Section>

      <Section h2="Governance that outlives your model choice">
        <p>
          Policy and model choice are separate. The same governance check applies whichever provider handles the
          request.
        </p>
        <Terms items={PROVIDER_NAMES} label="Model providers Daena can route to" />
        <p>
          Context persists in {DAENA.memoryTiers.display}, where unverified content expires and permanent tiers need
          approval. Klyntar, Daena&rsquo;s security layer, runs scans with evidence checkpoints and rejects serious
          findings that have no evidence chain.
        </p>
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
