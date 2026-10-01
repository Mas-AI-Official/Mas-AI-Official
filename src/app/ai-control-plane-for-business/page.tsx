import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section, Terms } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import { PROVIDER_NAMES } from '@/components/answer/daena-facts'
import { answerGraph, type FaqItem } from '@/lib/answer-seo'
import { pageMetadata } from '@/lib/seo'
import { DAENA } from '@/content/facts'

const path = '/ai-control-plane-for-business/'
const title = 'AI control plane for business'
const description =
  'An AI control plane centralizes model routing, governance, memory and audit across a business’s AI agents. Daena is one, so a company can deploy agents without losing oversight.'
const h1 = 'What is an AI control plane for business?'
const tldr =
  'An AI control plane is the one layer that decides which model runs a task, whether an action is allowed, what the agent remembers and how it is logged. Daena is a control plane for AI agents, so a company can deploy them across teams and still see what they did.'

export const metadata = pageMetadata({ title, description, path })

const faq: FaqItem[] = [
  {
    q: 'What is an AI control plane?',
    a: 'The term comes from networking: the control plane decides and enforces policy while the work runs underneath. An AI control plane centralizes model routing, governance, memory and audit for a company’s agents, and keeps those concerns out of each agent’s own code.',
  },
  {
    q: 'Why do businesses need one?',
    a: 'Once more than one team ships AI agents, you get inconsistent policy, scattered logs and vendor lock-in. A control plane gives one place to enforce governance, route across models and produce an audit trail, so oversight does not depend on every team remembering to add it.',
  },
  {
    q: 'How is a control plane different from an agent framework?',
    a: 'A framework helps developers build agent behavior. A control plane governs and operates those agents in production. They fit together: build with a framework, run and audit through the control plane.',
  },
  {
    q: 'Does a control plane lock me into one model?',
    a: `Not Daena. It separates model choice from policy and routes across ${DAENA.providers.display}, including local runtimes, so you can change providers without rewriting workflows.`,
  },
  {
    q: 'Is Daena ready for production use?',
    a: `Daena is in ${DAENA.version.display}. An earlier build runs on Google Cloud Run, its product page is daena.mas-ai.co, and the source is public under BSL 1.1. Treat it as a reference architecture and a working beta, and ask us how it would fit your setup.`,
  },
]

export default function Page() {
  return (
    <AnswerLayout
      crumbs={[
        { name: 'What is Daena', path: '/what-is-daena/' },
        { name: 'AI control plane for business', path },
      ]}
      h1={h1}
      tldr={tldr}
      proof={[DAENA.providers.display, DAENA.memoryTiers.display, DAENA.connectors.display, `Status: ${DAENA.version.display}`]}
      jsonLd={answerGraph(path, h1, description, faq)}
      related={[
        { href: '/what-is-daena/', label: 'What is Daena?' },
        { href: '/ai-governance-platform/', label: 'What is an AI governance platform?' },
        { href: '/use-cases/multi-llm-routing/', label: 'How to route across multiple LLMs' },
        { href: '/use-cases/ai-agent-governance/', label: 'How to govern AI agents in production' },
        { href: '/private-ai/', label: 'Private, local and cloud AI for your business' },
      ]}
    >
      <Section h2="What a control plane is, and why agents need one">
        <p>
          In networking, the control plane decides where traffic goes while the data plane moves it. Applied to AI,
          the control plane is where you decide which model runs a task, whether an action is allowed, what the
          agent remembers and how it is logged. Without one, every team makes those decisions again on its own and
          governance drifts.
        </p>
      </Section>

      <Section h2="What Daena centralizes">
        <p>
          Four things in one layer. <strong>Routing</strong> across {DAENA.providers.display}.{' '}
          <strong>Governance</strong> through the ten-stage request pipeline and an approval queue for high-risk
          actions. <strong>Memory</strong> in {DAENA.memoryTiers.display}. <strong>Audit</strong> through a record
          written for each request. Agent code stays simple because policy, memory and routing live in the plane.
        </p>
        <Terms items={PROVIDER_NAMES} label="Model providers Daena can route to" />
      </Section>

      <Section h2="Separating model choice from policy">
        <p>
          In governed mode, policy is enforced before the model is chosen, so switching the model does not skip it. The same
          governance check applies whether a task ends up on a hosted model or on a local one. That is what makes a
          multi-vendor setup manageable for a business.
        </p>
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
