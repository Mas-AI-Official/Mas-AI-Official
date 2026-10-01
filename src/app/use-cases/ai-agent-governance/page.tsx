import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section, Steps } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import { PIPELINE_STAGES } from '@/components/answer/daena-facts'
import { answerGraph, type FaqItem } from '@/lib/answer-seo'
import { pageMetadata } from '@/lib/seo'
import { DAENA } from '@/content/facts'

const path = '/use-cases/ai-agent-governance/'
const title = 'How to govern AI agents in production'
const description =
  'Govern AI agents by checking every action against policy before it runs, sending high-risk actions to a person and keeping a record. How Daena does it with a ten-stage pipeline.'
const h1 = 'How do you enforce governance on AI agents in production?'
const tldr =
  'Check every action against policy before it runs, send the risky ones to a person, and write down what happened. Daena does this with a ten-stage request pipeline, risk classification, an approval queue and an audit record.'

export const metadata = pageMetadata({ title, description, path })

const faq: FaqItem[] = [
  {
    q: 'How do you govern an AI agent before it acts?',
    a: 'Intercept the action and evaluate it against policy before any tool call or side effect. In Daena a request goes through a security gate, intent and risk classification and a governance check before a model is routed or anything is executed.',
  },
  {
    q: 'What audit trail should an AI agent leave?',
    a: 'A record of each request: what was attempted, what risk it was given, whether a person approved it and what the outcome was. In Daena the last pipeline stage persists the result and writes the audit record.',
  },
  {
    q: 'When should a person approve an agent action?',
    a: 'For high-risk actions, meaning anything hard to undo, that spends money or that touches production data. Daena classifies each action by risk and sends high-risk ones to an approval queue, so people review the few actions that need it and not every step.',
  },
  {
    q: 'Does governance slow agents down?',
    a: 'It adds checks, and it adds a wait only where a person has to approve. Daena also offers lighter modes for lower-stakes work: balanced asks for approval only on dangerous operations, and unleashed keeps only data protection. Pick the mode to match the stakes.',
  },
  {
    q: 'Which industries need agent governance most?',
    a: 'Any setting where you must show who authorized an action: finance, healthcare, legal and security work, and anything sold into the EU. For the last case see our EU AI Act readiness page.',
  },
]

export default function Page() {
  return (
    <AnswerLayout
      crumbs={[
        { name: 'What is Daena', path: '/what-is-daena/' },
        { name: 'Governing AI agents', path },
      ]}
      h1={h1}
      tldr={tldr}
      proof={['Ten-stage request pipeline', 'Approval queue for high-risk actions', DAENA.hardLaws.display, `Status: ${DAENA.version.display}`]}
      jsonLd={answerGraph(path, h1, description, faq)}
      related={[
        { href: '/ai-governance-platform/', label: 'What is an AI governance platform?' },
        { href: '/what-is-daena/', label: 'What is Daena?' },
        { href: '/use-cases/multi-llm-routing/', label: 'How to route across multiple LLMs' },
        { href: '/security/', label: 'Security, evaluation and governance for your own build' },
        { href: '/ai-act-readiness/', label: 'EU AI Act readiness' },
      ]}
    >
      <Section h2="The governance problem">
        <p>
          An autonomous agent that can call tools, move money or change production data is only as safe as the
          controls around it. The hard questions are operational: who authorized this action, what was it allowed
          to do, and can you reconstruct the decision afterward. Governance answers those before the action runs.
        </p>
      </Section>

      <Section h2="How Daena enforces it">
        <p>In governed mode, every request passes ten stages in order:</p>
        <Steps items={PIPELINE_STAGES} label="The ten stages of a Daena request" />
        <p>
          The action gets a risk level. High-risk actions go to an approval queue and wait for a person. The mode
          is plan-only by default, and {DAENA.hardLaws.display} are enforced in code. The check does not depend on
          which model generated the action.
        </p>
      </Section>

      <Section h2="What you get">
        <p>
          A replayable record for compliance and incident review, human approval where the risk warrants it, and
          the same enforcement across teams and models. KYA Mission Control, our research project, looks at the
          next question: proving which agent acted and what authority it had. It is pre-alpha, with a public demo at{' '}
          <a href="https://kya.mas-ai.co" rel="noopener">
            kya.mas-ai.co
          </a>
          .
        </p>
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
