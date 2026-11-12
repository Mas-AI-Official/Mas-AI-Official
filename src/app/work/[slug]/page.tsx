import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudy } from '@/components/work/CaseStudy'
import { CASE_STUDIES } from '@/content/work'
import { pageMetadata } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return CASE_STUDIES.map((w) => ({ slug: w.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = CASE_STUDIES.find((w) => w.slug === slug)
  if (!item) return {}
  return pageMetadata({
    title: `${item.name} case study: ${item.label}`,
    // A line under about 110 characters reads thin as a search snippet, so it gets the page's own name in front.
    description: item.line.length < 110 ? `${item.name}, a MAS-AI case study. ${item.line}` : item.line,
    path: `/work/${item.slug}/`,
  })
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const item = CASE_STUDIES.find((w) => w.slug === slug)
  if (!item || !item.caseStudy) notFound()
  return <CaseStudy item={{ ...item, caseStudy: item.caseStudy }} />
}
