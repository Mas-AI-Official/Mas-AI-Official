import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section, Sources } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import CompareTable from '@/components/answer/CompareTable'
import { answerGraph, type FaqItem } from '@/lib/answer-seo'
import { pageMetadata } from '@/lib/seo'
import { DAENA } from '@/content/facts'

const path = '/compare/daena-vs-autogen/'
const title = 'Daena vs AutoGen: control plane or framework'
const description =
  'AutoGen is a Microsoft framework for multi-agent applications, now in maintenance mode. Daena is a governed platform for running agents. A factual comparison with sources.'
const h1 = 'How is Daena different from AutoGen?'
const tldr =
  'AutoGen is a Microsoft open-source framework for building multi-agent applications. Its repository now says it is in maintenance mode and points new users to Microsoft Agent Framework. Daena is a governed platform for running agents, with approval, memory and audit built into the request path.'

export const metadata = pageMetadata({ title, description, path })

const faq: FaqItem[] = [
  {
    q: 'Is Daena an AutoGen alternative?',
    a: 'They aim at different goals. AutoGen is a framework for multi-agent conversation and collaboration patterns. Daena is a governed platform for operating agents with policy, audit, routing and memory. Different layers, so they are not a like-for-like swap.',
  },
  {
    q: 'What is the status of AutoGen?',
    a: 'The AutoGen repository README says AutoGen is in maintenance mode, will not receive new features or enhancements and is community managed going forward. It tells new users to start with Microsoft Agent Framework. Check the repository for the current notice before you decide.',
  },
  {
    q: 'What is AutoGen good at?',
    a: 'Multi-agent conversation patterns, and prototyping agents that talk to each other. Microsoft now points new projects to Microsoft Agent Framework instead.',
  },
  {
    q: 'What does Daena add for production use?',
    a: `A fixed ten-stage request pipeline, risk classification, an approval queue for high-risk actions, an audit record for each request, routing across ${DAENA.providers.display} and ${DAENA.memoryTiers.display}. The trade-off: Daena is a ${DAENA.version.display} product with a small ecosystem.`,
  },
  {
    q: 'Does Daena lock me into one model?',
    a: `No. Daena routes across ${DAENA.providers.display}, including local runtimes, so it is not tied to a single provider.`,
  },
]

export default function Page() {
  return (
    <AnswerLayout
      crumbs={[
        { name: 'What is Daena', path: '/what-is-daena/' },
        { name: 'Daena vs AutoGen', path },
      ]}
      h1={h1}
      tldr={tldr}
      proof={['Framework vs platform', `Daena: ${DAENA.license.display}`, `Daena status: ${DAENA.version.display}`]}
      jsonLd={answerGraph(path, h1, description, faq)}
      related={[
        { href: '/ai-governance-platform/', label: 'What is an AI governance platform?' },
        { href: '/compare/daena-vs-langchain/', label: 'How is Daena different from LangChain?' },
        { href: '/multi-agent-ai-company-os/', label: 'What is a multi-agent AI company OS?' },
        { href: '/use-cases/ai-agent-governance/', label: 'How to govern AI agents in production' },
      ]}
    >
      <Section h2="Conversation framework or governed operations">
        <p>
          AutoGen focuses on how agents collaborate: the conversation patterns between them. Daena focuses on how
          agents are governed and operated: what each one may do, on which model, with what memory and what audit
          trail. They answer different questions.
        </p>
      </Section>

      <Section h2="Side by side">
        <CompareTable
          caption="Daena compared with AutoGen: goal, project status and license"
          head={['Dimension', 'Daena', 'AutoGen']}
          rows={[
            ['Main goal', 'Run agents with governance in the request path', 'Build multi-agent applications'],
            ['Project status', `${DAENA.version.display}; product page daena.mas-ai.co`, 'Maintenance mode, community managed, per its README'],
            ['License', DAENA.license.display, 'Open source, see the repository'],
          ]}
        />
      </Section>

      <Section h2="What this means if you use AutoGen today">
        <p>
          AutoGen&rsquo;s own README recommends Microsoft Agent Framework for new users and offers a migration
          guide for existing ones. If you run AutoGen agents in production, the useful next step is a plan for
          where they run and who approves their actions, whichever framework they end up on. That is a
          governance question, and it is the kind of scoping a Build Blueprint covers.
        </p>
      </Section>

      <Sources
        items={[
          { label: 'AutoGen repository README, checked 2026-09-30', href: 'https://github.com/microsoft/autogen' },
        ]}
      />

      <Faq items={faq} />
    </AnswerLayout>
  )
}
