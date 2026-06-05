// JSON-LD builders for the GEO "answer pages".
//
// The site-wide @graph (Organization #organization, Person #founder, Daena
// #daena SoftwareApplication, #website) is already injected on every route by
// app/layout.tsx. These builders add the PER-PAGE nodes — TechArticle, FAQPage,
// BreadcrumbList — and cross-link them to the global entities by stable @id so
// AI search engines resolve "this page is about the Daena product, authored by
// the MAS-AI founder" without re-declaring those entities.

const SITE = 'https://mas-ai.co'
const ORG = `${SITE}/#organization`
const FOUNDER = `${SITE}/#founder`
const DAENA = `${SITE}/#daena`
const WEBSITE = `${SITE}/#website`

export type FaqItem = { q: string; a: string }

// Page-level Article. about -> the Daena product entity; author -> the founder.
export function techArticle(opts: {
  slug: string
  headline: string
  description: string
  dateModified?: string
}) {
  const url = `${SITE}${opts.slug}`
  return {
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    headline: opts.headline,
    description: opts.description,
    inLanguage: 'en-US',
    datePublished: '2026-06-05',
    dateModified: opts.dateModified ?? '2026-06-05',
    author: { '@id': FOUNDER },
    publisher: { '@id': ORG },
    about: { '@id': DAENA },
    isPartOf: { '@id': WEBSITE },
    mainEntityOfPage: url,
  }
}

// Visible FAQ must match these items 1:1 (no schema-only questions).
export function faqPage(slug: string, items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE}${slug}#faq`,
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

export function breadcrumb(slug: string, name: string) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${SITE}${slug}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name, item: `${SITE}${slug}` },
    ],
  }
}

export function answerGraph(nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}
