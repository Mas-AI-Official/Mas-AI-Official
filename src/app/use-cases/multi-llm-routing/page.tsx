import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section, Terms } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import { PROVIDER_NAMES } from '@/components/answer/daena-facts'
import { answerGraph, type FaqItem } from '@/lib/answer-seo'
import { pageMetadata } from '@/lib/seo'
import { DAENA } from '@/content/facts'

const path = '/use-cases/multi-llm-routing/'
const title = 'Multi-LLM routing without vendor lock-in'
const description = `Route AI workloads across ${DAENA.providers.display}, cloud and local, while every request still passes the governance check. How Daena separates model choice from policy.`
const h1 = 'How do you route AI workloads across multiple LLMs without vendor lock-in?'
const tldr = `Keep model choice out of your agents and in one routing layer. Daena routes across ${DAENA.providers.display}, and its routing stage comes after the governance check, so changing the model does not skip the check.`

export const metadata = pageMetadata({ title, description, path })

const faq: FaqItem[] = [
  {
    q: 'What is multi-LLM routing?',
    a: `Multi-LLM routing sends each task to the model that fits its cost, capability and policy needs, instead of hardwiring one provider. Daena routes across ${DAENA.providers.display}.`,
  },
  {
    q: 'Which models can Daena route across?',
    a: `${DAENA.providers.display}: ${PROVIDER_NAMES.join(', ')}. Local models run on your own hardware through Ollama or llama.cpp. Keeping a whole deployment local also depends on its connectors, logs and backups.`,
  },
  {
    q: 'Can I swap one provider for another without breaking my agents?',
    a: 'That is the point of a routing layer: routing and policy live in the platform, not in each agent. The details of a migration depend on your prompts and tools, so test the swap on your own workloads before you rely on it.',
  },
  {
    q: 'Does switching models change governance?',
    a: 'No. In governed mode the governance check runs before model routing, so every request is checked whichever model ends up handling it.',
  },
  {
    q: 'How does Daena decide which model to use?',
    a: 'Through three routing modes. Standard picks the best single model. Council sends the task to three or more models and synthesizes one answer. Quintessence pairs experts with models in a matrix. A cost preflight stage runs before routing.',
  },
]

export default function Page() {
  return (
    <AnswerLayout
      crumbs={[
        { name: 'What is Daena', path: '/what-is-daena/' },
        { name: 'Multi-LLM routing', path },
      ]}
      h1={h1}
      tldr={tldr}
      proof={[DAENA.providers.display, 'Cloud and local runtimes', 'Governance check before routing', `Status: ${DAENA.version.display}`]}
      jsonLd={answerGraph(path, h1, description, faq)}
      related={[
        { href: '/ai-control-plane-for-business/', label: 'What is an AI control plane?' },
        { href: '/what-is-daena/', label: 'What is Daena?' },
        { href: '/ai-governance-platform/', label: 'What is an AI governance platform?' },
        { href: '/use-cases/ai-agent-governance/', label: 'How to govern AI agents in production' },
        { href: '/private-ai/', label: 'Private, local and cloud AI for your business' },
      ]}
    >
      <Section h2="Why route across multiple LLMs">
        <p>
          No single model is best at everything, and committing to one provider is a business risk. Pricing,
          availability and capability all change. Routing lets you match each task to a model and change your mind
          later without re-architecting.
        </p>
      </Section>

      <Section h2={`The ${DAENA.providers.display}`}>
        <Terms items={PROVIDER_NAMES} label="Model providers Daena can route to" />
        <p>
          Cloud and local models sit behind one interface. Ollama and llama.cpp cover execution on your own hardware.
          The rest cover hosted models.
        </p>
      </Section>

      <Section h2="Routing and governance together">
        <p>
          The point that matters to a business is that routing does not bypass policy. In governed mode the
          governance check runs first, then cost preflight, then model routing. Model flexibility does not cost you
          oversight.
        </p>
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
