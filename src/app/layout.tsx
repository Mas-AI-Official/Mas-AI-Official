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

// Enhanced JSON-LD graph for AI search (ChatGPT, Perplexity, Claude, Gemini)
// and traditional Google SEO. Stable @id fields let AI systems resolve entities
// consistently across pages. knowsAbout + sameAs drive entity disambiguation,
// which is the #1 factor for AI citation probability in 2026.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // --- Organization ------------------------------------------------------
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': 'https://mas-ai.co/#organization',
      name: 'MAS-AI Technologies Inc.',
      alternateName: ['MAS-AI', 'Mas-AI', 'MAS-AI Technologies'],
      legalName: 'MAS-AI Technologies Inc.',
      url: 'https://mas-ai.co',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mas-ai.co/Mas-ai Logo.png',
        width: 512,
        height: 512,
      },
      image: 'https://mas-ai.co/og-image.png',
      description:
        'MAS-AI Technologies Inc. builds governed AI platforms (Daena) and security tools (Klyntar), and runs founder-led services: installing AI agents or auditing AI and infrastructure already in production. Two USPTO patents filed.',
      slogan: 'We build AI. We govern it. We secure everything.',
      foundingDate: '2026-01',
      foundingLocation: {
        '@type': 'Place',
        name: 'Ontario, Canada',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Richmond Hill',
          addressRegion: 'Ontario',
          addressCountry: 'CA',
        },
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Richmond Hill',
        addressRegion: 'Ontario',
        addressCountry: 'CA',
      },
      founder: { '@id': 'https://mas-ai.co/#founder' },
      employee: [{ '@id': 'https://mas-ai.co/#founder' }],
      numberOfEmployees: { '@type': 'QuantitativeValue', value: 1 },
      sameAs: [
        'https://github.com/Mas-AI-Official',
        'https://www.linkedin.com/in/masoud-masoori',
        'https://daena.mas-ai.co',
        'https://torontostarts.com',
      ],
      knowsAbout: [
        'AI governance',
        'AI security',
        'LLM security',
        'prompt injection',
        'multi-agent systems',
        'AI agent orchestration',
        'AI compliance',
        'EU AI Act',
        'vulnerability scanning',
        'penetration testing',
        'AI red team',
        'governed AI',
        'AI audit trails',
        'Retrieval-Augmented Generation',
        'autonomous agents',
        'OpenClaw',
        'Claude Code',
        'Model Context Protocol',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Sales and Business Inquiries',
        email: 'masoud.masoori@mas-ai.co',
        availableLanguage: ['English', 'Persian'],
        areaServed: 'Worldwide',
      },
      memberOf: [
        { '@type': 'Organization', name: 'Google for Startups Cloud Program' },
        { '@type': 'Organization', name: 'Toronto Starts' },
      ],
      award: [
        'Google for Startups (2026)',
        'Consensus Hong Kong 2026 Developer Pass',
      ],
      owns: [
        { '@id': 'https://mas-ai.co/#daena' },
        { '@id': 'https://mas-ai.co/#klyntar' },
        { '@id': 'https://mas-ai.co/#patent-philattice' },
        { '@id': 'https://mas-ai.co/#patent-nbmf' },
      ],
      makesOffer: [
        { '@id': 'https://mas-ai.co/automation#service' },
        { '@id': 'https://mas-ai.co/security#service' },
        { '@id': 'https://mas-ai.co/ai-act-readiness#service' },
      ],
    },

    // --- Founder (Person) --------------------------------------------------
    {
      '@type': 'Person',
      '@id': 'https://mas-ai.co/#founder',
      name: 'Masoud Masoori',
      jobTitle: 'Founder and Chief Executive Officer',
      worksFor: { '@id': 'https://mas-ai.co/#organization' },
      email: 'masoud.masoori@mas-ai.co',
      url: 'https://mas-ai.co',
      sameAs: [
        'https://www.linkedin.com/in/masoud-masoori',
        'https://github.com/Mas-AI-Official',
      ],
      alumniOf: [
        { '@type': 'CollegeOrUniversity', name: 'Seneca College', address: 'Toronto, Ontario, Canada' },
        { '@type': 'CollegeOrUniversity', name: 'University of Tehran', address: 'Tehran, Iran' },
      ],
      hasCredential: [
        { '@type': 'EducationalOccupationalCredential', name: 'Graduate Certificate in Artificial Intelligence', credentialCategory: 'Certificate', recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Seneca College' } },
        { '@type': 'EducationalOccupationalCredential', name: 'Master of Science, Civil Engineering', credentialCategory: 'degree' },
        { '@type': 'EducationalOccupationalCredential', name: 'AWS Certified Cloud Practitioner', credentialCategory: 'Certification' },
        { '@type': 'EducationalOccupationalCredential', name: 'Anthropic Academy: Claude API, MCP, Claude Code, AI Fluency', credentialCategory: 'Certification' },
        { '@type': 'EducationalOccupationalCredential', name: 'Cisco Cybersecurity Essentials', credentialCategory: 'Certification' },
      ],
      knowsAbout: [
        'AI governance',
        'AI security',
        'multi-agent systems',
        'LLM evaluation',
        'RAG pipelines',
        'vector databases',
        'prompt engineering',
        'AI safety',
      ],
      knowsLanguage: ['English', 'Persian'],
      nationality: 'Canadian',
      homeLocation: { '@type': 'Place', name: 'Richmond Hill, Ontario, Canada' },
    },

    // --- Daena (Product) ---------------------------------------------------
    {
      '@type': ['SoftwareApplication', 'Product'],
      '@id': 'https://mas-ai.co/#daena',
      name: 'Daena',
      alternateName: 'Daena by MAS-AI',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'AI Agent Orchestration Platform',
      operatingSystem: 'Cloud-hosted (any), self-hosted Linux or Windows',
      description:
        'Daena is a governance-first AI agent orchestration platform. 10 departments, 60 agent capabilities, 10-stage auditable pipeline, multi-runtime support (Claude, Codex, Gemini, Grok, Ollama, vLLM), 5-tier Neural-Backed Memory Fabric, patent-pending PhiLattice topology. Klyntar is its security layer.',
      url: 'https://daena.mas-ai.co',
      image: 'https://daena.mas-ai.co/assets/img/daena-logo-blue.png',
      creator: { '@id': 'https://mas-ai.co/#organization' },
      publisher: { '@id': 'https://mas-ai.co/#organization' },
      datePublished: '2026-01-01',
      softwareVersion: '3.7.0',
      featureList: [
        'Multi-runtime AI orchestration',
        'Governance-first architecture',
        '10-stage auditable pipeline',
        'Council reasoning mode (multi-model synthesis)',
        'Quintessence reasoning mode (DCP-injected)',
        'Neural-Backed Memory Fabric (5 tiers)',
        'PhiLattice agent topology',
        'Klyntar security layer',
        'MCP client and server',
        'Heartbeat/autopilot mode',
      ],
      offers: [
        { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock', description: 'Fully local on Ollama with governance included' },
        { '@type': 'Offer', name: 'Pro', price: '29-99', priceCurrency: 'USD', availability: 'https://schema.org/InStock', description: 'Multi-runtime routing, Council reasoning, EXE mode' },
        { '@type': 'Offer', name: 'Enterprise', price: '500+', priceCurrency: 'USD', availability: 'https://schema.org/InStock', description: 'Custom departments, SSO, SLA, on-prem deployment' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        ratingCount: '1',
        reviewCount: '0',
        worstRating: '1',
        bestRating: '5',
      },
    },

    // --- Klyntar (Product / Security Layer) --------------------------------
    {
      '@type': ['SoftwareApplication', 'Product'],
      '@id': 'https://mas-ai.co/#klyntar',
      name: 'Klyntar',
      alternateName: "Daena's Security Layer",
      applicationCategory: 'SecurityApplication',
      applicationSubCategory: 'AI Security Platform',
      operatingSystem: 'Embedded in Daena',
      description:
        'Klyntar is the security layer embedded in Daena. 25+ exploit signatures (SQLi, XSS, CMDi, SSRF, XXE, Log4Shell), 45+ hacking tools detected by behavior, Zero-FP gate that drops findings without a working exploit, Asset Shield vault + egress filter + consent tokens, BeyondMythos enrichment with ErrorOracle + AdversarialSimulator + CompositionalPlanner.',
      url: 'https://mas-ai.co/security',
      creator: { '@id': 'https://mas-ai.co/#organization' },
      publisher: { '@id': 'https://mas-ai.co/#organization' },
      isPartOf: { '@id': 'https://mas-ai.co/#daena' },
      featureList: [
        '25+ exploit signatures',
        '45+ scanners detected by behavior',
        'Zero-FP gate (no-exploit-no-report)',
        'Asset Shield vault',
        'BeyondMythos finding enrichment',
        '20-stage Laevateinn reasoning pipeline',
        'Honeypot traps',
        'Anti-scanner arsenal',
      ],
    },

    // --- Services ----------------------------------------------------------
    {
      '@type': 'Service',
      '@id': 'https://mas-ai.co/automation#service',
      name: 'AI Automation Install',
      description:
        'We install custom AI agents, voice assistants, Claude Code, OpenClaw, or custom workflow automation in your business, wrapped in Daena governance. 21-day build, fixed price, source code yours. Free 45-min install audit first.',
      provider: { '@id': 'https://mas-ai.co/#organization' },
      url: 'https://mas-ai.co/automation',
      areaServed: 'Worldwide',
      serviceType: 'AI Agent Installation and Integration',
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '3000',
        highPrice: '45000',
        priceCurrency: 'USD',
        offerCount: 3,
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://mas-ai.co/security#service',
      name: 'AI Security Audit',
      description:
        'Klyntar-powered security audits for AI systems, websites, APIs, mobile apps, and cloud infrastructure. Proof-of-exploit on every operator-tier finding. Free 2-hour recon returns top 3 highest-impact exposures in 48 hours. Paid audits from $12,500.',
      provider: { '@id': 'https://mas-ai.co/#organization' },
      url: 'https://mas-ai.co/security',
      areaServed: 'Worldwide',
      serviceType: 'Cybersecurity Audit and Penetration Testing',
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '0',
        highPrice: '22000',
        priceCurrency: 'USD',
        offerCount: 4,
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://mas-ai.co/ai-act-readiness#service',
      name: 'EU AI Act Readiness Sprint',
      description:
        'Fixed 2-week sprint to regulator-ready artifacts for the August 2, 2026 EU AI Act enforcement deadline. Delivers Article 9 risk management, Article 11 technical documentation, Article 12 audit trail (Daena-wired), Article 14 human oversight. $18,000 fixed scope.',
      provider: { '@id': 'https://mas-ai.co/#organization' },
      url: 'https://mas-ai.co/ai-act-readiness',
      areaServed: 'European Union',
      serviceType: 'AI Compliance and Regulatory Consulting',
      offers: {
        '@type': 'Offer',
        price: '18000',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },

    // --- Patents (CreativeWork with intellectualPropertyType) --------------
    {
      '@type': 'CreativeWork',
      '@id': 'https://mas-ai.co/#patent-philattice',
      name: 'PhiLattice Architecture',
      alternateName: 'Fibonacci-Hexagonal Agent Topology',
      description:
        'Patent-pending Fibonacci-hexagonal agent topology for governed multi-agent orchestration. USPTO Provisional Application #63/877,082, filed September 2025.',
      creator: { '@id': 'https://mas-ai.co/#founder' },
      datePublished: '2025-09',
      publisher: { '@type': 'Organization', name: 'United States Patent and Trademark Office' },
      identifier: 'USPTO #63/877,082',
    },
    {
      '@type': 'CreativeWork',
      '@id': 'https://mas-ai.co/#patent-nbmf',
      name: 'Neural-Backed Memory Fabric (NBMF)',
      description:
        'Patent-pending 5-tier trust-gated memory system with content-addressable deduplication, auto-expiring hallucinations, and tenant-scoped cross-department learning. USPTO Provisional Application #64/020,421, filed March 2026.',
      creator: { '@id': 'https://mas-ai.co/#founder' },
      datePublished: '2026-03',
      publisher: { '@type': 'Organization', name: 'United States Patent and Trademark Office' },
      identifier: 'USPTO #64/020,421',
    },

    // --- WebSite -----------------------------------------------------------
    {
      '@type': 'WebSite',
      '@id': 'https://mas-ai.co/#website',
      name: 'MAS-AI',
      url: 'https://mas-ai.co',
      publisher: { '@id': 'https://mas-ai.co/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://mas-ai.co/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
      inLanguage: 'en-US',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/Mas-ai Logo.png" />
        <link rel="apple-touch-icon" href="/Mas-ai Logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-[family-name:var(--font-dm-sans)]">
        {children}
      </body>
    </html>
  )
}
