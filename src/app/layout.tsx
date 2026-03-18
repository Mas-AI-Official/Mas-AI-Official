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
      foundingDate: '2026-01',
      foundingLocation: { '@type': 'Place', name: 'Ontario, Canada' },
      address: { '@type': 'PostalAddress', addressLocality: 'Richmond Hill', addressRegion: 'Ontario', addressCountry: 'CA' },
      founders: [{ '@type': 'Person', name: 'Masoud Masoori', jobTitle: 'Founder & CEO' }],
      sameAs: ['https://github.com/Mas-AI-Official', 'https://www.linkedin.com/in/masoud-masoori'],
      contactPoint: { '@type': 'ContactPoint', contactType: 'Sales', email: 'masoud.masoori@mas-ai.co', availableLanguage: 'English' },
      memberOf: { '@type': 'Organization', name: 'Google for Startups Cloud Program' },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Daena by MAS-AI',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'Governance-first AI agent orchestration platform. AI-autonomous company OS with 10-stage governed pipeline, PhiLattice architecture, and NBMF auditable memory.',
      offers: { '@type': 'Offer', availability: 'https://schema.org/PreOrder', description: 'Early access and pilot programs available' },
      creator: { '@type': 'Organization', name: 'MAS-AI Technologies Inc.' },
    },
    {
      '@type': 'WebSite',
      name: 'MAS-AI',
      url: 'https://mas-ai.co',
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
