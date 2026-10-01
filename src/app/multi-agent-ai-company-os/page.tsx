import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section, Terms } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import { CAPABILITY_NAMES, DEPARTMENT_NAMES } from '@/components/answer/daena-facts'
import { answerGraph, type FaqItem } from '@/lib/answer-seo'
import { pageMetadata } from '@/lib/seo'
import { DAENA } from '@/content/facts'

const path = '/multi-agent-ai-company-os/'
const title = 'Multi-agent AI company OS'
const description = `A multi-agent AI company OS organizes agents by department, capability, memory and approval level. Daena has ${DAENA.agents.display}, three reasoning modes and ${DAENA.memoryTiers.display}.`
const h1 = 'What is a multi-agent AI company OS?'
const tldr = `A multi-agent AI company OS organizes AI agents the way a company organizes departments. Daena has ${DAENA.agents.display}, three reasoning modes and ${DAENA.memoryTiers.display}, all behind one governed request pipeline.`

export const metadata = pageMetadata({ title, description, path })

const faq: FaqItem[] = [
  {
    q: 'What is an AI company OS?',
    a: `An AI company OS coordinates specialized agents the way a business coordinates departments: it assigns work, enforces policy, shares memory and keeps an audit trail. Daena structures this as ${DAENA.departments.display}, not a flat pool of bots.`,
  },
  {
    q: 'How many agents does Daena have?',
    a: `${DAENA.agents.display}. Daena is not sixty independent agents. It is ten unified department agents, each with specialized capabilities.`,
  },
  {
    q: 'What are the six capabilities?',
    a: 'Mind for reasoning, eyes for perception and input, hands for actions and tools, voice for output and communication, shield for security and memory for recall. Agents are defined by what they can do, not only by which model runs them.',
  },
  {
    q: 'What are the three reasoning modes?',
    a: 'Standard picks the best single model. Council sends a task to three or more models and synthesizes one answer. Quintessence pairs experts with models in a matrix. The governance pipeline audits every mode.',
  },
  {
    q: 'How do agents share context?',
    a: `Through ${DAENA.memoryTiers.display}. Unverified content expires, and permanent tiers need approval, so context lasts at the right scope and does not become a permanent record by accident.`,
  },
  {
    q: 'Does a company OS replace frameworks like CrewAI or AutoGen?',
    a: 'No. Frameworks help you build agent behavior. A company OS runs, routes, remembers and audits agents across an organization. You can use both.',
  },
]

export default function Page() {
  return (
    <AnswerLayout
      crumbs={[
        { name: 'What is Daena', path: '/what-is-daena/' },
        { name: 'Multi-agent AI company OS', path },
      ]}
      h1={h1}
      tldr={tldr}
      proof={[DAENA.departments.display, DAENA.agents.display, '3 reasoning modes', DAENA.memoryTiers.display, `Status: ${DAENA.version.display}`]}
      jsonLd={answerGraph(path, h1, description, faq)}
      related={[
        { href: '/what-is-daena/', label: 'What is Daena?' },
        { href: '/ai-governance-platform/', label: 'What is an AI governance platform?' },
        { href: '/use-cases/multi-llm-routing/', label: 'How to route across multiple LLMs' },
        { href: '/compare/daena-vs-autogen/', label: 'How is Daena different from AutoGen?' },
        { href: '/automation/', label: 'Automate operations in your own business' },
      ]}
    >
      <Section h2="What a company OS means">
        <p>
          A company runs on departments, roles, shared memory and approval chains. A multi-agent AI company OS
          mirrors that. Agents are organized by function, composed from capabilities, given scoped memory and held
          to an approval policy. In Daena the org chart is the architecture.
        </p>
      </Section>

      <Section h2="Departments and capabilities">
        <p>
          Daena has {DAENA.departments.display}, and each one is a single agent with six capabilities. That is{' '}
          <strong>{DAENA.agents.display}</strong>.
        </p>
        <Terms items={DEPARTMENT_NAMES} label="Daena departments" />
        <p>The six capabilities every department draws on:</p>
        <Terms items={CAPABILITY_NAMES} label="Daena capabilities" />
        <p>Every department agent goes through the same governed request pipeline.</p>
      </Section>

      <Section h2="Reasoning that scales with the stakes">
        <p>
          Standard mode handles routine work with the best single model. Council mode asks three or more models and
          synthesizes one answer. Quintessence mode pairs experts with models for the hardest calls. The mode
          changes how much the system deliberates. It does not change whether the request is governed and audited.
        </p>
      </Section>

      <Section h2="Where the idea comes from">
        <p>
          We run MAS-AI on a related internal system: several AI assistants sharing one memory, with deterministic
          checks deciding when work is done. Daena puts the department model into a governed platform. If you want
          something like it built around your own departments, that is the kind of work we do.
        </p>
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
