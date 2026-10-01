import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHead } from '@/components/ui/PageHead'
import { CtaBand } from '@/components/ui/CtaBand'
import { Faq } from '@/components/home/Faq'
import { OFFER } from '@/content/facts'
import { BLUEPRINT } from '@/content/blueprint'
import { CTA, WORK_CTA } from '@/content/site'
import { pageMetadata, serviceJsonLd, ld } from '@/lib/seo'

export const metadata = pageMetadata({
  title: `${OFFER.name}: a plan you can build from`,
  description: `A fixed-price engagement that maps how your business runs and ends in a build plan or a clear no. ${OFFER.price}, ${OFFER.duration}.`,
  path: '/blueprint/',
})

// Offer terms render from OFFER (facts.ts). They are draft terms until the owner approves them.
const serviceLd = {
  ...serviceJsonLd({
    path: '/blueprint/',
    name: OFFER.name,
    description: BLUEPRINT.lead,
    serviceType: 'Business systems analysis and build planning',
  }),
  offers: {
    '@type': 'Offer',
    name: OFFER.name,
    price: OFFER.priceValue,
    priceCurrency: OFFER.currency,
    description: OFFER.credit,
  },
}

export default function BlueprintPage() {
  const b = BLUEPRINT
  return (
    <>
      <PageHead title={b.title} lead={b.lead} crumbs={[{ name: 'Build Blueprint', path: '/blueprint/' }]}>
        <Link href={CTA.href} className="btn btn-primary">
          {CTA.label}
          <ArrowRight aria-hidden="true" />
        </Link>
        <Link href={WORK_CTA.href} className="btn btn-ghost">
          {WORK_CTA.label}
        </Link>
      </PageHead>

      <section className="section wk-section" aria-labelledby="bp-terms-title">
        <div className="wrap wk-terms">
          <h2 id="bp-terms-title" className="visually-hidden">
            Terms
          </h2>
          <p className="wk-price" data-reveal>
            {OFFER.price}
          </p>
          <dl className="wk-terms__list" data-reveal style={{ ['--i' as string]: 1 }}>
            <div>
              <dt className="t-mono">Length</dt>
              <dd>{OFFER.duration}</dd>
            </div>
            <div>
              <dt className="t-mono">Credit</dt>
              <dd>{OFFER.credit}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="bp-who-title">
        <div className="wrap split">
          <h2 id="bp-who-title" className="t-h2 wk-h2" data-reveal>
            Who it is for
          </h2>
          <div className="prose" data-reveal style={{ ['--i' as string]: 1 }}>
            {b.who.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="bp-map-title">
        <div className="wrap">
          <h2 id="bp-map-title" className="t-h2 wk-h2" data-reveal>
            What we map
          </h2>
          <ol className="wk-map">
            {b.map.map((m, i) => (
              <li key={m.name} data-reveal style={{ ['--i' as string]: i % 2 }}>
                <span className="t-mono" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="t-h4">{m.name}</h3>
                  <p className="t-small">{m.line}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="bp-receive-title">
        <div className="wrap split">
          <div className="wk-related__head" data-reveal>
            <h2 id="bp-receive-title" className="t-h2 wk-h2">
              What you receive
            </h2>
            <p className="t-body">One written document. It is yours to use however you decide to proceed.</p>
          </div>
          <ul className="rows">
            {b.receive.map((r) => (
              <li key={r.name} data-reveal>
                <h3 className="t-h4">{r.name}</h3>
                <p className="t-body">{r.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="bp-run-title">
        <div className="wrap">
          <h2 id="bp-run-title" className="t-h2 wk-h2" data-reveal>
            How it runs
          </h2>
          <p className="t-lead wk-intro" data-reveal style={{ ['--i' as string]: 1 }}>
            {b.timelineNote}
          </p>
          <ol className="wk-steps">
            {b.steps.map((s, i) => (
              <li key={s.name} data-reveal style={{ ['--i' as string]: i }}>
                <span className="wk-steps__dot" aria-hidden="true" />
                <h3 className="t-h4">{s.name}</h3>
                <p className="t-small">{s.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="bp-example-title">
        <div className="wrap split">
          <div className="wk-related__head" data-reveal>
            <h2 id="bp-example-title" className="t-h2 wk-h2">
              Example structure
            </h2>
            <p className="t-body">
              The contents page of a Blueprint document. This is an illustrative outline, not a client document.
            </p>
          </div>
          <figure className="surface wk-doc" data-reveal style={{ ['--i' as string]: 1 }}>
            <figcaption className="t-label wk-doc__cap">Illustrative outline</figcaption>
            <ol className="wk-toc">
              {b.outline.map((o, i) => (
                <li key={o.name}>
                  <span className="t-mono" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="t-h4">{o.name}</p>
                    <p className="t-small">{o.line}</p>
                  </div>
                </li>
              ))}
            </ol>
          </figure>
        </div>
      </section>

      <Faq items={[...b.faq]} title="Questions about the Blueprint" id="bp-faq" />

      <CtaBand line="Tell us what is slow. We will say whether a Blueprint is the right first step." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(serviceLd) }} />
    </>
  )
}
