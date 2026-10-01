import Link from 'next/link'
import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section, Steps, Terms } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import { DEPARTMENT_NAMES, PIPELINE_STAGES, PROVIDER_NAMES } from '@/components/answer/daena-facts'
import { answerGraph, type FaqItem } from '@/lib/answer-seo'
import { pageMetadata } from '@/lib/seo'
import { DAENA, PATENTS } from '@/content/facts'

const path = '/what-is-daena/'
const title = 'What is Daena? A governed AI control plane'
const description = `Daena is a governed multi-agent platform from MAS-AI: AI departments that plan and act inside approval gates and an audit trail, with routing across ${DAENA.providers.display}.`
const h1 = 'What is Daena by MAS-AI?'
const tldr = `Daena is a governed multi-agent platform from MAS-AI Technologies. It gives a company AI departments that plan and act inside approval gates and an audit trail, and it routes work across ${DAENA.providers.display}.`

export const metadata = pageMetadata({ title, description, path })

const nbmf = PATENTS.find((p) => p.publish)

const faq: FaqItem[] = [
  {
    q: 'What does governed mean in Daena?',
    a: 'In governed mode every request passes the same ten-stage pipeline: a security gate, intent and risk classification, a governance check, cost preflight, model routing, memory recall and, at the end, persistence and an audit record. High-risk actions wait in an approval queue for a person. Governance sits in the execution path, not beside it.',
  },
  {
    q: 'Which models does Daena use?',
    a: `Daena routes across ${DAENA.providers.display}: ${PROVIDER_NAMES.join(', ')}. Local models run on your own hardware through Ollama or llama.cpp. Whether a whole deployment stays local also depends on its connectors, logs and backups, which we check per deployment.`,
  },
  {
    q: 'Is Daena hosted or self-hosted?',
    a: `Both are possible. Daena is in beta, and an earlier build of it runs on Google Cloud Run. The source is public on GitHub under BSL 1.1, and it can use local models through Ollama or llama.cpp.`,
  },
  {
    q: 'Who builds Daena?',
    a: `MAS-AI Technologies Inc., a founder-led company in Richmond Hill, Ontario, founded by Masoud Masoori. Klyntar, the security-scan layer, is part of Daena. KYA Mission Control, a separate research project on agent identity, lives at kya.mas-ai.co.`,
  },
  {
    q: 'How do I try Daena?',
    a: 'Open daena.mas-ai.co for the live beta. If you want a governed agent system built for your own business, use the Bring us a bottleneck form on mas-ai.co and describe what you want to fix.',
  },
]

export default function Page() {
  return (
    <AnswerLayout
      crumbs={[{ name: 'What is Daena', path }]}
      h1={h1}
      tldr={tldr}
      proof={[
        DAENA.agents.display,
        DAENA.providers.display,
        DAENA.connectors.display,
        DAENA.hardLaws.display,
        DAENA.license.display,
        `Status: ${DAENA.version.display}`,
      ]}
      jsonLd={answerGraph(path, h1, description, faq)}
      related={[
        { href: '/ai-governance-platform/', label: 'What is an AI governance platform?' },
        { href: '/multi-agent-ai-company-os/', label: 'What is a multi-agent AI company OS?' },
        { href: '/ai-control-plane-for-business/', label: 'What is an AI control plane for business?' },
        { href: '/use-cases/multi-llm-routing/', label: 'How to route across multiple LLMs' },
        { href: '/work/daena/', label: 'Daena as a case study' },
      ]}
    >
      <Section h2="Daena in one paragraph">
        <p>
          Daena coordinates AI agents the way an operating system coordinates programs. It routes each task to a
          model, checks policy before an action runs, remembers context in tiers, and records what happened and
          why. The result is one control plane for a company&rsquo;s AI, instead of a scatter of scripts and
          chatbots that nobody can audit.
        </p>
      </Section>

      <Section h2="What every request goes through">
        <p>
          In governed mode a request passes ten stages in order. Daena also has lighter governance modes for
          cases where less oversight is acceptable. The governed path is the one built for business use.
        </p>
        <Steps items={PIPELINE_STAGES} label="The ten stages of a Daena request" />
      </Section>

      <Section h2="What Daena includes">
        <p>
          <strong>{DAENA.agents.display}.</strong> Each of the {DAENA.departments.display} maps to a business
          function. The six capabilities are mind, eyes, hands, voice, shield and memory.
        </p>
        <Terms items={DEPARTMENT_NAMES} label="Daena departments" />
        <p>
          <strong>Three reasoning modes.</strong> Standard picks the best single model. Council sends the task to
          three or more models and synthesizes one answer. Quintessence pairs experts with models in a matrix for
          the hardest calls.
        </p>
        <p>
          <strong>{DAENA.memoryTiers.display}.</strong> Unverified content expires. Permanent tiers need approval.
        </p>
        <p>
          <strong>{DAENA.hardLaws.display}</strong> enforced in code, and <strong>{DAENA.connectors.display}</strong>{' '}
          in the connector catalog. Klyntar, the security layer, runs scans with evidence checkpoints and rejects
          serious findings that come without an evidence chain.
        </p>
      </Section>

      <Section h2="Where Daena stands today">
        <p>
          Daena is in {DAENA.version.display}, live at{' '}
          <a href={DAENA.url} rel="noopener">
            daena.mas-ai.co
          </a>
          . {DAENA.license.display}, with the code on{' '}
          <a href={DAENA.repo} rel="noopener">
            GitHub
          </a>
          . It is the reference architecture we draw on when we build governed agent systems for other companies.
          {nbmf ? ` Its memory design is covered by ${nbmf.kind} ${nbmf.number}.` : ''}
        </p>
        <p>
          Read the full write-up in the{' '}
          <Link href="/work/daena/">Daena case study</Link>.
        </p>
      </Section>

      <Section h2="Why it exists">
        <p>
          One chatbot does not need governance. A fleet of agents that call tools, spend money and touch
          production systems does. Daena is built for the moment a business goes from one assistant to many
          agents and has to answer two questions: who authorized this action, and can we prove it later.
        </p>
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
