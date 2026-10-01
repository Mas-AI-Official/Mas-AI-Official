import type { Metadata } from 'next'
import { COMPANY, DAENA, PATENTS, PROGRAMS } from '@/content/facts'

export const SITE_URL = COMPANY.url

/** Canonical URL for a route path ("/" or "/services/"). Always trailing slash (static export). */
export function canonical(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${p.endsWith('/') ? p : `${p}/`}`
}

type PageMeta = {
  title: string
  description: string
  path: string
  /** Absolute title (no " | MAS-AI" suffix). */
  absolute?: boolean
  image?: string
  noindex?: boolean
}

export function pageMetadata({ title, description, path, absolute, image = '/og-image.png', noindex }: PageMeta): Metadata {
  const url = canonical(path)
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: absolute ? title : `${title} | MAS-AI`,
      description,
      siteName: 'MAS-AI Technologies',
      locale: 'en_CA',
      images: [{ url: image, width: 1200, height: 630, alt: 'MAS-AI Technologies' }],
    },
    twitter: { card: 'summary_large_image', title: absolute ? title : `${title} | MAS-AI`, description, images: [image] },
    robots: noindex ? { index: false, follow: true } : undefined,
  }
}

const ORG_ID = `${SITE_URL}/#organization`
const FOUNDER_ID = `${SITE_URL}/#founder`

/** Site-wide graph: Organization, founder, website. Only published facts. */
export function siteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': ORG_ID,
        name: COMPANY.legalName,
        alternateName: COMPANY.shortName,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/mas-ai-logo.png`,
        email: COMPANY.email,
        foundingDate: COMPANY.founded,
        founder: { '@id': FOUNDER_ID },
        address: {
          '@type': 'PostalAddress',
          addressLocality: COMPANY.locality,
          addressRegion: COMPANY.region,
          addressCountry: COMPANY.country,
        },
        areaServed: ['CA', 'US', 'EU'],
        knowsAbout: [
          'AI implementation',
          'Workflow automation',
          'AI agents',
          'Retrieval-augmented generation',
          'Private and local AI deployment',
          'Custom software development',
          'Website development',
          'AI governance',
        ],
        sameAs: [COMPANY.github, COMPANY.founder.linkedin, DAENA.url],
        memberOf: PROGRAMS.filter((p) => p.publish).map((p) => ({ '@type': 'Organization', name: p.name })),
      },
      {
        '@type': 'Person',
        '@id': FOUNDER_ID,
        name: COMPANY.founder.name,
        jobTitle: COMPANY.founder.title,
        worksFor: { '@id': ORG_ID },
        sameAs: [COMPANY.founder.linkedin, COMPANY.founder.github],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'MAS-AI Technologies',
        publisher: { '@id': ORG_ID },
        inLanguage: 'en',
      },
    ],
  }
}

export function serviceJsonLd(opts: { path: string; name: string; description: string; serviceType: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonical(opts.path)}#service`,
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    provider: { '@id': ORG_ID },
    areaServed: ['CA', 'US', 'EU'],
    url: canonical(opts.path),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: canonical(it.path) })),
  }
}

export function faqJsonLd(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

export const PUBLISHED_PATENTS = PATENTS.filter((p) => p.publish)

/** Serialize JSON-LD safely for a <script> tag. */
export function ld(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
