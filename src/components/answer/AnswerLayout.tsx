import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { PageHead } from '@/components/ui/PageHead'
import { CtaBand } from '@/components/ui/CtaBand'
import { CTA } from '@/content/site'
import { DAENA } from '@/content/facts'
import { ld } from '@/lib/seo'

type RelatedLink = { href: string; label: string }

/**
 * Shared shell for the Daena answer pages. Server component: the H1, the short answer, the body, tables and
 * the FAQ are all in the static HTML that crawlers and AI fetchers receive. Header, footer and <main> come
 * from the root layout.
 */
export default function AnswerLayout({
  crumbs,
  h1,
  tldr,
  proof,
  jsonLd,
  related,
  ctaTitle = 'Bring us the bottleneck.',
  ctaLine = 'Tell us what you want to fix. We reply with what we would build, or a clear no.',
  children,
}: {
  crumbs: { name: string; path: string }[]
  h1: string
  tldr: string
  /** Short factual chips. Numbers must come from src/content/facts.ts. */
  proof?: string[]
  jsonLd: object
  related?: RelatedLink[]
  ctaTitle?: string
  ctaLine?: string
  children: ReactNode
}) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(jsonLd) }} />
      <div className="answer-head">
        <PageHead title={h1} crumbs={crumbs}>
          <Link href={CTA.href} className="btn btn-primary">
            {CTA.label}
            <ArrowRight aria-hidden="true" />
          </Link>
          <a href={DAENA.url} className="btn btn-ghost" rel="noopener">
            Explore Daena
            <ArrowUpRight aria-hidden="true" />
          </a>
        </PageHead>
      </div>

      <article className="section answer">
        <div className="wrap answer__layout">
          <aside className="answer__summary" aria-label="Short answer">
            <div className="surface answer__tldr">
              <p className="t-label">Short answer</p>
              <p className="answer__tldr-text">{tldr}</p>
            </div>
            {proof && proof.length > 0 ? (
              <ul className="answer__proof" aria-label="Facts">
                {proof.map((p) => (
                  <li key={p} className="chip">
                    {p}
                  </li>
                ))}
              </ul>
            ) : null}
          </aside>

          <div className="answer__body">
            {children}
            {related && related.length > 0 ? (
              <nav className="answer__related" aria-labelledby="answer-related-title">
                <h2 id="answer-related-title" className="t-h4">
                  Keep reading
                </h2>
                <ul>
                  {related.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className="link-arrow">
                        {r.label}
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>
      </article>

      <CtaBand title={ctaTitle} line={ctaLine} />
    </>
  )
}
