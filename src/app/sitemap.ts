import type { MetadataRoute } from 'next'
import { canonical } from '@/lib/seo'
import { CASE_STUDIES } from '@/content/work'
import { DATE_MODIFIED } from '@/lib/answer-seo'

export const dynamic = 'force-static'

/**
 * Every indexable route, with the trailing slash the static export serves.
 * Excluded on purpose: /book/ and /consulting/ (redirect stubs) and the legacy static HTML files.
 */
const CORE = [
  '/',
  '/services/',
  '/automation/',
  '/software/',
  '/websites/',
  '/private-ai/',
  '/security/',
  '/rag/',
  '/ai-act-readiness/',
  '/work/',
  '/company/',
  '/blueprint/',
  '/start/',
  '/privacy/',
]

const ANSWERS = [
  '/what-is-daena/',
  '/ai-governance-platform/',
  '/multi-agent-ai-company-os/',
  '/ai-control-plane-for-business/',
  '/compare/daena-vs-langchain/',
  '/compare/daena-vs-autogen/',
  '/use-cases/ai-agent-governance/',
  '/use-cases/multi-llm-routing/',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const work = CASE_STUDIES.map((w) => `/work/${w.slug}/`)
  return [...CORE, ...work, ...ANSWERS].map((path) => ({
    url: canonical(path),
    lastModified: DATE_MODIFIED,
  }))
}
