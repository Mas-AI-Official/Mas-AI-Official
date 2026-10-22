import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHead } from '@/components/ui/PageHead'
import { CtaBand } from '@/components/ui/CtaBand'
import { GROWTH, GROWTH_INDEXABLE } from '@/content/growth'
import { CTA } from '@/content/site'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: GROWTH.meta.title,
  description: GROWTH.meta.description,
  path: GROWTH.path,
  noindex: !GROWTH_INDEXABLE,
})

type Offer = typeof GROWTH.audit | typeof GROWTH.pilot

function OfferTerms({ offer }: { offer: Offer }) {
  return (
    <div className="wk-terms gr-terms">
      <div data-reveal>
        <p className="wk-price">
          {offer.price}
        </p>
      </div>
      <dl className="wk-terms__list" data-reveal style={{ ['--i' as string]: 1 }}>
        {offer.terms.map((t) => (
          <div key={t.k}>
            <dt className="t-mono">{t.k}</dt>
            <dd>{t.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default function GrowthPage() {
  const g = GROWTH
  return (
    <>
      <PageHead title={g.name} lead={g.lead} crumbs={[{ name: g.name, path: g.path }]}>
        <Link href={CTA.href} className="btn btn-primary">
          {CTA.label}
          <ArrowRight aria-hidden="true" />
        </Link>
      </PageHead>

      <section className="section wk-section" aria-labelledby="gr-who-title">
        <div className="wrap split">
          <h2 id="gr-who-title" className="t-h2 wk-h2" data-reveal>
            Who it is for
          </h2>
          <div className="prose" data-reveal style={{ ['--i' as string]: 1 }}>
            {g.who.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="gr-audit-title">
        <div className="wrap">
          <p className="t-mono" data-reveal>
            {g.audit.tag}
          </p>
          <h2 id="gr-audit-title" className="t-h2 wk-h2" data-reveal>
            {g.audit.name}
          </h2>
          <p className="t-lead wk-intro" data-reveal style={{ ['--i' as string]: 1 }}>
            {g.audit.for}
          </p>
          <OfferTerms offer={g.audit} />
          <h3 className="t-h3 gr-sub" data-reveal>
            {g.audit.reportTitle}
          </h3>
          <p className="t-body gr-sub-intro" data-reveal>
            {g.audit.reportIntro}
          </p>
          <ol className="wk-map">
            {g.audit.report.map((r, i) => (
              <li key={r.name} data-reveal style={{ ['--i' as string]: i % 2 }}>
                <span className="t-mono" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="t-h4">{r.name}</h4>
                  <p className="t-small">{r.line}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="gr-pilot-title">
        <div className="wrap">
          <p className="t-mono" data-reveal>
            {g.pilot.tag}
          </p>
          <h2 id="gr-pilot-title" className="t-h2 wk-h2" data-reveal>
            {g.pilot.name}
          </h2>
          <p className="t-lead wk-intro" data-reveal style={{ ['--i' as string]: 1 }}>
            {g.pilot.for}
          </p>
          <OfferTerms offer={g.pilot} />
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="gr-steps-title">
        <div className="wrap">
          <h2 id="gr-steps-title" className="t-h2 wk-h2" data-reveal>
            {g.stepsTitle}
          </h2>
          <ol className="wk-steps gr-steps">
            {g.steps.map((s, i) => (
              <li key={s.name} data-reveal style={{ ['--i' as string]: i }}>
                <span className="wk-steps__dot" aria-hidden="true" />
                <h3 className="t-h4">{s.name}</h3>
                <p className="t-small">{s.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="gr-approve-title">
        <div className="wrap split">
          <div className="wk-related__head" data-reveal>
            <h2 id="gr-approve-title" className="t-h2 wk-h2">
              {g.approveTitle}
            </h2>
            <p className="t-body">{g.approveIntro}</p>
          </div>
          <ul className="rows">
            {g.approve.map((a) => (
              <li key={a.name} data-reveal>
                <h3 className="t-h4">{a.name}</h3>
                <p className="t-body">{a.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="gr-ai-title">
        <div className="wrap split">
          <h2 id="gr-ai-title" className="t-h2 wk-h2" data-reveal>
            {g.aiTitle}
          </h2>
          <div className="prose" data-reveal style={{ ['--i' as string]: 1 }}>
            {g.ai.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="gr-honest-title">
        <div className="wrap split">
          <h2 id="gr-honest-title" className="t-h2 wk-h2" data-reveal>
            {g.honestTitle}
          </h2>
          <div className="prose" data-reveal style={{ ['--i' as string]: 1 }}>
            {g.honest.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={g.cta.title} line={g.cta.line} />
    </>
  )
}
