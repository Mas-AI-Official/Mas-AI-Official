import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { workFor, type WorkItem } from '@/content/work'
import type { ServiceContent } from '@/content/services'

function target(w: WorkItem): { href: string; external: boolean; label: string } | null {
  if (w.caseStudy) return { href: `/work/${w.slug}/`, external: false, label: 'Read the case study' }
  const first = w.links?.[0]
  if (!first) return null
  return { href: first.href, external: first.href.startsWith('http'), label: first.label }
}

function Go({ w }: { w: WorkItem }) {
  const t = target(w)
  if (!t) return null
  return t.external ? (
    <a href={t.href} className="link-arrow" rel="noopener">
      {t.label}
      <ArrowUpRight aria-hidden="true" />
    </a>
  ) : (
    <Link href={t.href} className="link-arrow">
      {t.label}
      <ArrowRight aria-hidden="true" />
    </Link>
  )
}

/** Proof from work.ts: the first item leads, the rest follow as rows. No client work is ever shown. */
export function Proof({ content: c }: { content: ServiceContent }) {
  const order = c.proof.order ?? []
  const rank = (w: WorkItem) => {
    const i = order.indexOf(w.slug)
    return i === -1 ? order.length : i
  }
  const items = workFor(c.proof.source ?? c.slug)
    .filter((w) => order.length === 0 || order.includes(w.slug))
    .sort((a, b) => rank(a) - rank(b))
  if (items.length === 0) return null
  const [lead, ...rest] = items
  const built = lead.caseStudy?.built.slice(0, 3)
  const extra = !lead.caseStudy ? (lead.links ?? []) : []

  return (
    <section id="proof" className="section svp-proof" aria-labelledby="proof-title">
      <div className="wrap">
        <div className="svp-head svp-head--wide">
          <h2 id="proof-title" className="t-h2" data-reveal>
            {c.proof.title}
          </h2>
          <p className="t-lead">{c.proof.intro}</p>
        </div>

        <article className="surface svp-lead" data-reveal>
          <div className="svp-lead__text">
            <span className="chip chip-gold">{lead.label}</span>
            <h3 className="t-h3">{lead.name}</h3>
            <p className="t-body">{c.proof.why[lead.slug] ?? lead.line}</p>
            {lead.caseStudy ? <p className="t-small">{lead.caseStudy.state}</p> : null}
            <Go w={lead} />
          </div>
          <div className="svp-lead__aside">
            {lead.image ? (
              <figure className="svp-lead__figure">
                <Image
                  src={lead.image.srcSmall ?? lead.image.src}
                  alt={lead.image.alt}
                  width={lead.image.srcSmall ? 960 : lead.image.width}
                  height={lead.image.srcSmall ? Math.round((960 * lead.image.height) / lead.image.width) : lead.image.height}
                  sizes="(min-width: 1024px) 45vw, 92vw"
                />
              </figure>
            ) : built ? (
              <ul className="tick-list">
                {built.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : extra.length > 0 ? (
              <ul className="svp-links">
                {extra.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith('http') ? (
                      <a href={l.href} className="link-arrow" rel="noopener">
                        {l.label}
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    ) : (
                      <Link href={l.href} className="link-arrow">
                        {l.label}
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </article>

        {rest.length > 0 ? (
          <ul className="svp-prows">
            {rest.map((w, i) => (
              <li key={w.slug} className="svp-prow" data-reveal style={{ ['--i' as string]: i }}>
                <h3 className="t-h4 svp-prow__name">{w.name}</h3>
                <p className="t-body svp-prow__why">{c.proof.why[w.slug] ?? w.line}</p>
                <span className="chip svp-prow__label">{w.label}</span>
                <span className="svp-prow__go">
                  <Go w={w} />
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
