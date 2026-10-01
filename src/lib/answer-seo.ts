// JSON-LD builders for the Daena answer pages.
//
// The site-wide graph (Organization, founder, WebSite) is injected on every route by app/layout.tsx and the
// breadcrumb by PageHead. These builders add the per-page nodes: TechArticle, FAQPage and the Daena
// SoftwareApplication entity, linked to the global entities by stable @id.
import { DAENA } from '@/content/facts'
import { SITE_URL, canonical } from '@/lib/seo'

const ORG = `${SITE_URL}/#organization`
const FOUNDER = `${SITE_URL}/#founder`
const DAENA_ID = `${SITE_URL}/#daena`
const WEBSITE = `${SITE_URL}/#website`

export const DATE_MODIFIED = '2026-09-30'

export type FaqItem = { q: string; a: string }

/** The Daena product entity every answer page is about. */
export function daenaApp() {
  return {
    '@type': 'SoftwareApplication',
    '@id': DAENA_ID,
    name: 'Daena',
    url: DAENA.url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'A governed multi-agent platform: AI departments that plan and act inside approval gates and an audit trail.',
    publisher: { '@id': ORG },
    author: { '@id': FOUNDER },
    sameAs: [DAENA.repo],
  }
}

/** Page-level article. about: the Daena entity; author: the founder. */
export function techArticle(opts: { path: string; headline: string; description: string }) {
  const url = canonical(opts.path)
  return {
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    headline: opts.headline,
    description: opts.description,
    inLanguage: 'en',
    datePublished: '2026-06-05',
    dateModified: DATE_MODIFIED,
    author: { '@id': FOUNDER },
    publisher: { '@id': ORG },
    about: { '@id': DAENA_ID },
    isPartOf: { '@id': WEBSITE },
    mainEntityOfPage: url,
  }
}

/** The visible FAQ must match these items one to one. */
export function faqPage(path: string, items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${canonical(path)}#faq`,
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

export function answerGraph(path: string, headline: string, description: string, faq: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [techArticle({ path, headline, description }), faqPage(path, faq), daenaApp()],
  }
}

