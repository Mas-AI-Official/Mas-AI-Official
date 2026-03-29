import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://mas-ai.co'),
  title: {
    default: 'MAS-AI Technologies | Governed AI Systems & Enterprise Deployment',
    template: '%s | MAS-AI',
  },
  description: 'MAS-AI Technologies builds governed AI systems for enterprises. Our flagship platform Daena provides multi-agent orchestration with auditable memory and traceable decisions. Two patent-pending architectures.',
  keywords: ['MAS-AI', 'governed AI', 'AI governance platform', 'enterprise AI deployment', 'AI agent governance', 'auditable AI agents', 'Daena', 'multi-agent orchestration', 'AI company OS', 'PhiLattice Architecture', 'NBMF', 'enterprise AI consulting'],
  authors: [{ name: 'MAS-AI Technologies Inc.' }],
  creator: 'MAS-AI Technologies Inc.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mas-ai.co',
    siteName: 'MAS-AI Technologies',
    title: 'MAS-AI | Governance-First AI Agent Platform',
    description: 'Daena is the AI company OS where every agent is governed, every decision is traced, and every action is auditable.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAS-AI | Governance-First AI Agent Platform',
    description: 'Governed multi-agent AI orchestration with auditable memory and traceable decisions.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'MAS-AI Technologies Inc.',
      alternateName: 'MAS-AI',
      legalName: 'MAS-AI Technologies Inc.',
      url: 'https://mas-ai.co',
      logo: 'https://mas-ai.co/Mas-ai Logo.png',
      description: 'MAS-AI Technologies Inc. builds Daena, a governance-first AI agent orchestration platform with a 10-stage governed execution pipeline, patent-pending PhiLattice Architecture, and Neural-Backed Memory Fabric.',
      foundingDate: '2026-01-25',
      foundingLocation: { '@type': 'Place', name: 'Richmond Hill, Ontario, Canada', address: { '@type': 'PostalAddress', addressLocality: 'Richmond Hill', addressRegion: 'Ontario', addressCountry: 'CA' } },
      address: { '@type': 'PostalAddress', streetAddress: '30 Normandy Crescent', addressLocality: 'Richmond Hill', addressRegion: 'Ontario', addressCountry: 'CA', postalCode: 'L4C 8L8' },
      founders: [{ '@type': 'Person', name: 'Masoud Masoori', jobTitle: 'Founder & CEO', url: 'https://www.linkedin.com/in/masoud-masoori/', sameAs: ['https://www.linkedin.com/in/masoud-masoori/', 'https://github.com/Mas-AI-Official'] }],
      sameAs: ['https://github.com/Mas-AI-Official', 'https://www.linkedin.com/in/masoud-masoori', 'https://daena.mas-ai.co'],
      contactPoint: [{ '@type': 'ContactPoint', contactType: 'Sales', email: 'masoud.masoori@mas-ai.co', availableLanguage: ['English', 'Persian'] }],
      memberOf: { '@type': 'Organization', name: 'Google for Startups Cloud Program' },
      numberOfEmployees: { '@type': 'QuantitativeValue', value: 1 },
      knowsAbout: ['Artificial Intelligence', 'AI Governance', 'Multi-Agent Systems', 'Natural Language Processing', 'Enterprise AI', 'PhiLattice Architecture', 'Neural-Backed Memory Fabric'],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Daena by MAS-AI',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Cloud, Self-hosted',
      description: 'Governance-first AI agent orchestration platform. 60 agents across 10 departments, 9 AI providers, 1,328 tests passing. Free to run locally with Ollama. Patent-pending PhiLattice Architecture and NBMF.',
      url: 'https://daena.mas-ai.co',
      featureList: 'Multi-agent orchestration, AI governance, Auditable memory, PhiLattice topology, Neural-Backed Memory Fabric, 10-stage pipeline, Expert council synthesis',
      offers: { '@type': 'Offer', availability: 'https://schema.org/InStock', price: '0', priceCurrency: 'USD', description: 'Free tier available now. Run locally with Ollama at zero cost.' },
      creator: { '@type': 'Organization', name: 'MAS-AI Technologies Inc.' },
    },
    {
      '@type': 'WebSite',
      name: 'MAS-AI Technologies',
      url: 'https://mas-ai.co',
      description: 'Official website of MAS-AI Technologies Inc., builders of the Daena governance-first AI platform.',
      inLanguage: 'en-US',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'MAS-AI', item: 'https://mas-ai.co/' },
        { '@type': 'ListItem', position: 2, name: 'Daena Platform', item: 'https://daena.mas-ai.co/' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is MAS-AI?', acceptedAnswer: { '@type': 'Answer', text: 'MAS-AI Technologies Inc. is a Canadian AI company building Daena, a governance-first multi-agent AI orchestration platform with two patent-pending architectures (PhiLattice and NBMF). Founded January 2026 in Ontario, Canada.' } },
        { '@type': 'Question', name: 'What is Daena?', acceptedAnswer: { '@type': 'Answer', text: 'Daena is a governance-first AI agent orchestration platform that coordinates 60 AI agents across 10 departments with 9 AI providers. Free to run locally with Ollama. Every action passes through a 10-stage governed execution pipeline. 1,328 tests passing.' } },
        { '@type': 'Question', name: 'What is PhiLattice Architecture?', acceptedAnswer: { '@type': 'Answer', text: 'PhiLattice is a patent-pending architecture combining Fibonacci spiral scaling for optimal agent placement with honeycomb departmental structure for governed multi-agent collaboration.' } },
        { '@type': 'Question', name: 'What is NBMF?', acceptedAnswer: { '@type': 'Answer', text: 'Neural-Backed Memory Fabric (NBMF) is a patent-pending 5-tier memory system. Hallucinations auto-expire and only verified knowledge persists across tiers from ephemeral working memory to founder-private encrypted storage.' } },
        { '@type': 'Question', name: 'How is Daena different from other AI platforms?', acceptedAnswer: { '@type': 'Answer', text: 'Daena is governance-first, not governance-bolted-on. Unlike platforms that add security as a wrapper, Daena builds governance into every layer. Every agent action is auditable, every decision is traceable, and users have a visible governance control spectrum.' } },
        { '@type': 'Question', name: 'Where is MAS-AI located?', acceptedAnswer: { '@type': 'Answer', text: 'MAS-AI Technologies Inc. is incorporated in Ontario, Canada (January 25, 2026), headquartered in Richmond Hill, Ontario. Founded by Masoud Masoori.' } },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48 64x64" />
        <link rel="icon" type="image/png" href="/Mas-ai Logo.png" sizes="1024x1024" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0b0b14" />
        <meta name="geo.region" content="CA-ON" />
        <meta name="geo.placename" content="Richmond Hill" />
        <meta name="geo.position" content="43.8828;-79.4403" />
        <meta name="ICBM" content="43.8828, -79.4403" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-[family-name:var(--font-dm-sans)]">
        {children}
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script dangerouslySetInnerHTML={{ __html: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');" }} />
        {/* Microsoft Clarity (heatmaps + session recordings) */}
        <script dangerouslySetInnerHTML={{ __html: "(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script','CLARITY_ID');" }} />
      </body>
    </html>
  )
}
