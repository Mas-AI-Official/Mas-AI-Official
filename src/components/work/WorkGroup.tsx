import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { WorkItem, WorkTier } from '@/content/work'
import { TIER_COPY } from './labels'
import { ItemLinks } from './ItemLinks'

function CaseLink({ item, children }: { item: WorkItem; children: React.ReactNode }) {
  if (!item.caseStudy) return null
  return (
    <Link href={`/work/${item.slug}/`} className="link-arrow">
      {children}
      <ArrowRight aria-hidden="true" />
    </Link>
  )
}

/** Tier A: a featured entry. The problem leads, at display size; one image at most. */
function Feature({ item, index }: { item: WorkItem; index: number }) {
  const cs = item.caseStudy
  return (
    <li className="wk-feature" data-reveal style={{ ['--i' as string]: index }}>
      <div className="wk-feature__id">
        <h3 className="t-h4">{item.name}</h3>
        <span className="t-mono">{item.label}</span>
      </div>
      <div className="wk-feature__body">
        {cs ? <p className="wk-feature__problem">{cs.problem}</p> : null}
        <p className="t-body">{item.line}</p>
        {item.image ? (
          <figure className="wk-feature__figure">
            <picture>
              {item.image.srcSmall ? <source media="(max-width: 767px)" srcSet={item.image.srcSmall} /> : null}
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                sizes="(min-width: 1320px) 760px, (min-width: 1024px) 56vw, 92vw"
              />
            </picture>
          </figure>
        ) : null}
        <div className="wk-foot">
          <CaseLink item={item}>Read the case study</CaseLink>
          {item.links ? <ItemLinks links={item.links} /> : null}
        </div>
      </div>
    </li>
  )
}

/** Tier B and C: a compact row. Name and label, one line, links. Lab rows also state where the work stands. */
function Row({ item, index, showState }: { item: WorkItem; index: number; showState?: boolean }) {
  return (
    <li className="wk-row" data-reveal style={{ ['--i' as string]: index }}>
      <div className="wk-row__id">
        <h3 className="t-h4">{item.name}</h3>
        <span className="t-mono">{item.label}</span>
      </div>
      <div className="wk-row__text">
        <p className="t-body">{item.line}</p>
        {showState && item.caseStudy ? (
          <p className="t-small wk-row__state">
            <span className="t-mono">Where it stands</span> {item.caseStudy.state}
          </p>
        ) : null}
      </div>
      <div className="wk-foot wk-row__links">
        <CaseLink item={item}>Case study</CaseLink>
        {item.links ? <ItemLinks links={item.links} /> : null}
      </div>
    </li>
  )
}

/** One tier on /work/: heading and explanation, then the entries in the tier's own shape. */
export function WorkGroup({ tier, items }: { tier: WorkTier; items: WorkItem[] }) {
  const copy = TIER_COPY[tier]
  const headId = `work-${copy.id}-title`
  return (
    <section id={copy.id} className={`wk-tier wk-tier--${tier.toLowerCase()}`} aria-labelledby={headId}>
      <div className="wrap">
        <header className="wk-tier__head" data-reveal>
          <h2 id={headId} className="t-h2">
            {copy.heading}
          </h2>
          <p className="t-body">{copy.explain}</p>
        </header>
        {tier === 'A' ? (
          <ol className="wk-features">
            {items.map((w, i) => (
              <Feature key={w.slug} item={w} index={i} />
            ))}
          </ol>
        ) : (
          <ul className="wk-rows">
            {items.map((w, i) => (
              <Row key={w.slug} item={w} index={i} showState={tier === 'C'} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
