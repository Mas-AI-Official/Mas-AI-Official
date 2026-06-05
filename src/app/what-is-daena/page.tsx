import type { Metadata } from 'next'
import AnswerLayout from '@/components/answer/AnswerLayout'
import { Section } from '@/components/answer/Section'
import Faq from '@/components/answer/Faq'
import { techArticle, faqPage, breadcrumb, answerGraph, type FaqItem } from '@/lib/answer-seo'

const slug = '/what-is-daena'
const title = 'What is Daena? Governed AI Control Plane by MAS-AI'
const description =
  'Daena is a governed AI control plane and multi-agent AI company OS from MAS-AI Technologies — multi-LLM routing across 9 runtimes, a 10-stage governance pipeline, auditable memory, and human-approval gates.'
const h1 = 'What is Daena by MAS-AI?'
const tldr =
  'Daena is a governed AI control plane and multi-agent "AI company OS" from MAS-AI Technologies Inc.: it routes work across 9 LLM runtimes while enforcing a 10-stage governance pipeline, auditable memory, and human-approval gates before any agent action executes.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: slug },
  keywords: ['what is Daena', 'Daena AI', 'Daena MAS-AI', 'governed AI control plane', 'AI company OS', 'multi-agent AI platform'],
  openGraph: { title, description, url: 'https://mas-ai.co/what-is-daena', type: 'article' },
}

const faq: FaqItem[] = [
  {
    q: 'What does "governed" mean in Daena?',
    a: 'Governed means every agent action is checked against policy before it runs, not after. Daena routes each action through a 10-stage pipeline and a four-tier risk policy, and writes the decision to an immutable audit log — so governance is structural, not an optional add-on.',
  },
  {
    q: 'What LLMs does Daena support?',
    a: 'Daena routes across 9 runtimes — Claude, GPT, Gemini, Grok, Ollama, Groq, OpenRouter, Together, and Perplexity — and you can hot-swap between them without restarting. The free tier runs entirely locally on Ollama.',
  },
  {
    q: 'Is Daena hosted or self-hosted?',
    a: 'Both. Daena v3.7 runs in production on Google Cloud Run, and it can run fully local on Ollama with governance included. Enterprise deployments support on-prem, SSO, and custom departments.',
  },
  {
    q: 'Who builds Daena?',
    a: 'MAS-AI Technologies Inc., founded by Masoud Masoori and federally incorporated in Ontario, Canada. Daena holds two USPTO provisional patents (PhiLattice and NBMF). Sibling products are Klyntar (security mode) and KYA Mission Control (agent identity).',
  },
  {
    q: 'How do I try Daena?',
    a: 'Visit daena.mas-ai.co for the live platform, or book a 30-minute governed demo at mas-ai.co/book. The free local tier runs on Ollama with no API cost.',
  },
]

export default function Page() {
  const jsonLd = answerGraph([
    techArticle({ slug, headline: h1, description }),
    faqPage(slug, faq),
    breadcrumb(slug, 'What is Daena'),
  ])
  return (
    <AnswerLayout
      eyebrow="Daena"
      h1={h1}
      tldr={tldr}
      proof={['Daena v3.7 in production', '2,956+ tests passing', '2 USPTO provisional patents', 'Federally incorporated, Ontario CA']}
      jsonLd={jsonLd}
      related={[
        { href: '/ai-governance-platform', label: 'What is an AI governance platform?' },
        { href: '/multi-agent-ai-company-os', label: 'What is a multi-agent AI company OS?' },
        { href: '/ai-control-plane-for-business', label: 'What is an AI control plane for business?' },
        { href: '/use-cases/multi-llm-routing', label: 'How to route across multiple LLMs' },
      ]}
    >
      <Section h2="Daena in one paragraph">
        <p>
          Daena coordinates AI agents the way an operating system coordinates programs:
          it routes each task to the right model, enforces policy on every action,
          remembers context across tiers, and records an auditable trail of what
          happened and why. The result is a single control plane for a company&rsquo;s
          AI — instead of a scatter of ungoverned scripts and chatbots.
        </p>
      </Section>

      <Section h2="What Daena includes">
        <p>
          10 departments &times; 6 capabilities (MIND, EYES, HANDS, VOICE, SHIELD,
          MEMORY) = 60 governed agent slots. Three reasoning modes — Standard, Council,
          and Quintessence — for routine through high-stakes decisions. A 5-tier
          Neural-Backed Memory Fabric (Ephemeral, Working, Project, Institutional,
          Founder-Private). And Klyntar, Daena&rsquo;s security mode, screening actions
          against 25+ exploit signatures.
        </p>
      </Section>

      <Section h2="Why it exists">
        <p>
          Single chatbots don&rsquo;t need governance; fleets of autonomous agents that
          spend money, call tools, and touch production systems do. Daena is built for
          the moment a business moves from one assistant to many agents and needs to
          answer: who authorized this action, and can we prove it later.
        </p>
      </Section>

      <Faq items={faq} />
    </AnswerLayout>
  )
}
