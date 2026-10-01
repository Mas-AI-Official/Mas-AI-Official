import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PageHead } from '@/components/ui/PageHead'
import { CtaBand } from '@/components/ui/CtaBand'
import { FAMILIES, PRACTICES, DEPTH } from '@/content/site'
import { CASE_STUDIES, type WorkItem } from '@/content/work'
import { ItemLinks } from './ItemLinks'

const SERVICES = [...FAMILIES, ...PRACTICES, ...DEPTH]

type Study = NonNullable<WorkItem['caseStudy']>

/** One point renders as a sentence, several as a ruled list. */
function Points({ items, quiet }: { items: string[]; quiet?: boolean }) {
  if (items.length === 1) return <p className={quiet ? 't-small' : 't-body'}>{items[0]}</p>
  return (
    <ul className={quiet ? 'tick-list wk-quiet' : 'tick-list'}>
      {items.map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
  )
}

/** One of the five case sections: a numbered plain-language heading on the left, the content on the right. */
function Step({
  n,
  id,
  title,
  first,
  children,
  below,
}: {
  n: number
  id: string
  title: string
  first?: boolean
  children: React.ReactNode
  below?: React.ReactNode
}) {
  return (
    <section className={first ? 'wk-step wk-step--first' : 'wk-step'} aria-labelledby={id}>
      <div className="wrap wk-step__grid">
        <div className="wk-step__head" data-reveal>
          <span className="t-label">{String(n).padStart(2, '0')}</span>
          <h2 id={id} className="t-h3">
            {title}
          </h2>
        </div>
        <div className="wk-step__body" data-reveal style={{ ['--i' as string]: 1 }}>
          {children}
        </div>
      </div>
      {below}
    </section>
  )
}

export function CaseStudy({ item }: { item: WorkItem & { caseStudy: Study } }) {
  const cs = item.caseStudy
  const related = item.proves.map((slug) => SERVICES.find((s) => s.slug === slug)).filter((s) => Boolean(s)) as typeof SERVICES
  const idx = CASE_STUDIES.findIndex((w) => w.slug === item.slug)
  const prev = idx > 0 ? CASE_STUDIES[idx - 1] : null
  const next = idx >= 0 && idx < CASE_STUDIES.length - 1 ? CASE_STUDIES[idx + 1] : null

  const figure = item.image ? (
    <div className="wrap wk-step__figure">
      <figure className="wk-figure" data-reveal>
        <picture>
          {item.image.srcSmall ? <source media="(max-width: 767px)" srcSet={item.image.srcSmall} /> : null}
          <Image
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.width}
            height={item.image.height}
            sizes="(min-width: 1320px) 1256px, 92vw"
          />
        </picture>
      </figure>
    </div>
  ) : null

  // Sections are numbered in the order they render, so an omitted section never leaves a gap.
  let n = 0

  return (
    <>
      <PageHead
        title={item.name}
        lead={item.line}
        crumbs={[
          { name: 'Work', path: '/work/' },
          { name: item.name, path: `/work/${item.slug}/` },
        ]}
      >
        <span className="chip">{item.label}</span>
      </PageHead>

      <Step n={++n} id="cs-problem-title" title="The problem" first>
        <p className="wk-problem">{cs.problem}</p>
      </Step>

      <Step n={++n} id="cs-built-title" title="What we engineered" below={figure}>
        <p className="wk-insight">{cs.insight}</p>
        <Points items={cs.built} />
      </Step>

      {cs.connected && cs.connected.length ? (
        <Step n={++n} id="cs-connected-title" title="How it connected">
          <Points items={cs.connected} />
        </Step>
      ) : null}

      {cs.engineering && cs.engineering.length ? (
        <Step n={++n} id="cs-tech-title" title="What technology was appropriate">
          <Points items={cs.engineering} quiet />
        </Step>
      ) : null}

      <Step n={++n} id="cs-state-title" title="Where it stands">
        <p className="wk-state">{cs.state}</p>
        <p className="t-mono">Current state, stated as it is today.</p>
      </Step>

      {item.links && item.links.length ? (
        <section className="wk-step wk-linkband-sec" aria-labelledby="cs-links-title">
          <div className="wrap wk-linkband">
            <h2 id="cs-links-title" className="t-h3">
              See it yourself
            </h2>
            <ItemLinks links={item.links} variant="buttons" />
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="wk-step" aria-labelledby="cs-related-title">
          <div className="wrap split">
            <div className="wk-related__head" data-reveal>
              <h2 id="cs-related-title" className="t-h2 wk-h2">
                What this means for your project
              </h2>
              <p className="t-body">The same approach, applied to your business.</p>
            </div>
            <ul className="rows">
              {related.map((s) => (
                <li key={s.slug}>
                  <h3 className="t-h4">
                    <Link href={s.href} className="link">
                      {s.name}
                    </Link>
                  </h3>
                  <p className="t-body">{s.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {prev || next ? (
        <nav className="wk-pn-sec" aria-label="More case studies">
          <div className="wrap wk-pn">
            {prev ? (
              <Link href={`/work/${prev.slug}/`} className="wk-pn__link" rel="prev">
                <span className="t-mono wk-pn__dir">
                  <ArrowLeft aria-hidden="true" />
                  Previous case study
                </span>
                <span className="t-h4">{prev.name}</span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {next ? (
              <Link href={`/work/${next.slug}/`} className="wk-pn__link wk-pn__link--next" rel="next">
                <span className="t-mono wk-pn__dir">
                  Next case study
                  <ArrowRight aria-hidden="true" />
                </span>
                <span className="t-h4">{next.name}</span>
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}

      <CtaBand line="If your problem looks like one of these, tell us. We will say whether a build is the right answer." />
    </>
  )
}
