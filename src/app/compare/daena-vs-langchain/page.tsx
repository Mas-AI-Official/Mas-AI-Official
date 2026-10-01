import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section, Sources } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import CompareTable from '@/components/answer/CompareTable'
import { answerGraph, type FaqItem } from '@/lib/answer-seo'
import { pageMetadata } from '@/lib/seo'
import { DAENA } from '@/content/facts'

const path = '/compare/daena-vs-langchain/'
const title = 'Daena vs LangChain: control plane or framework'
const description =
  'LangChain is a framework for building agents. Daena is a governed platform for running them. A factual comparison, with sources for what we say about LangChain.'
const h1 = 'How is Daena different from LangChain?'
const tldr =
  'LangChain is a framework for building LLM applications and agents. Daena is a governed platform for running agents, with approval, memory and audit built into the request path. They sit at different layers of the stack.'

export const metadata = pageMetadata({ title, description, path })

const faq: FaqItem[] = [
  {
    q: 'Is Daena a LangChain alternative?',
    a: 'Not exactly. LangChain is a framework you build agents with. Daena is a platform you run and govern agents in. Some teams will pick one, and others will build with a framework and operate under a control plane.',
  },
  {
    q: 'What does LangChain do well?',
    a: 'It is an MIT-licensed framework with a wide ecosystem of integrations for models, tools and toolkits. LangGraph handles agent orchestration, including pausing a run for human input, and LangSmith covers evals and observability. For building agent behavior quickly it is a strong choice.',
  },
  {
    q: 'What does Daena add that LangChain leaves to the developer?',
    a: `A fixed ten-stage request pipeline, risk classification, an approval queue for high-risk actions, an audit record for each request, routing across ${DAENA.providers.display} and ${DAENA.memoryTiers.display}. These are platform features rather than code you write and maintain. The trade-off: Daena is a ${DAENA.version.display} product with a much smaller ecosystem.`,
  },
  {
    q: 'Can I use LangChain and Daena together?',
    a: 'In principle yes: agent logic written with any framework can sit behind a governed platform. We have not published a packaged integration, so treat that as an architecture option to scope, not a shipped feature.',
  },
]

export default function Page() {
  return (
    <AnswerLayout
      crumbs={[
        { name: 'What is Daena', path: '/what-is-daena/' },
        { name: 'Daena vs LangChain', path },
      ]}
      h1={h1}
      tldr={tldr}
      proof={['Different layers of the stack', `Daena: ${DAENA.license.display}`, 'LangChain: MIT license', `Daena status: ${DAENA.version.display}`]}
      jsonLd={answerGraph(path, h1, description, faq)}
      related={[
        { href: '/ai-governance-platform/', label: 'What is an AI governance platform?' },
        { href: '/compare/daena-vs-autogen/', label: 'How is Daena different from AutoGen?' },
        { href: '/ai-control-plane-for-business/', label: 'What is an AI control plane?' },
        { href: '/what-is-daena/', label: 'What is Daena?' },
      ]}
    >
      <Section h2="They solve different layers">
        <p>
          LangChain is a build-time framework. It gives developers building blocks to connect models, tools and
          memory into an application. Daena is a run-time platform. It governs, routes, remembers and audits
          agents while they work. The useful question is not which is better. It is which layer you are missing.
        </p>
      </Section>

      <Section h2="Side by side">
        <CompareTable
          caption="Daena compared with LangChain: layer, main job, approvals, model choice, license and maturity"
          head={['Dimension', 'Daena', 'LangChain']}
          rows={[
            ['Layer', 'Run-time governed platform', 'Build-time agent framework'],
            ['Main job', 'Run agents with governance in the request path', 'Build agent behavior'],
            [
              'Human approval',
              'Approval queue for high-risk actions, part of the pipeline',
              'LangGraph interrupts pause a run for external input; you decide where',
            ],
            ['Model choice', `Routing across ${DAENA.providers.display}`, 'Integrations for chat and embedding models'],
            ['Observability', 'Audit record for each request', 'LangSmith for evals and observability'],
            ['License', DAENA.license.display, 'MIT'],
            ['Ecosystem and maturity', `One product, ${DAENA.version.display}`, 'Broad integration ecosystem'],
          ]}
        />
      </Section>

      <Section h2="When to use which">
        <p>
          Use LangChain, or LangGraph, when you are building and iterating on agent behavior and want the widest
          set of integrations. Look at Daena when agents are going to run against real systems and you want
          governance, routing, memory and an audit trail as built-in parts of the platform, and you accept a
          smaller ecosystem and a beta.
        </p>
        <p>
          If you are deciding between building on a framework and adopting a platform, that is a scoping question.
          It is the first thing a Build Blueprint settles.
        </p>
      </Section>

      <Sources
        items={[
          { label: 'LangChain repository README', href: 'https://github.com/langchain-ai/langchain' },
          { label: 'LangGraph documentation: interrupts', href: 'https://docs.langchain.com/oss/python/langgraph/interrupts' },
        ]}
      />

      <Faq items={faq} />
    </AnswerLayout>
  )
}
