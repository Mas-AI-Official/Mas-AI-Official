import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, KeyRound } from 'lucide-react'
import { PageHead } from '@/components/ui/PageHead'
import { CtaBand } from '@/components/ui/CtaBand'
import { Faq } from '@/components/home/Faq'
import { GrowthLockup } from '@/components/growth/GrowthLockup'
import { ApprovalBoard } from '@/components/growth/ApprovalBoard'
import { GROWTH, GROWTH_INDEXABLE } from '@/content/growth'
import { CTA } from '@/content/site'
import { pageMetadata, serviceJsonLd, ld } from '@/lib/seo'

export const metadata = pageMetadata({
  title: GROWTH.meta.title,
  absolute: true,
  description: GROWTH.meta.description,
  path: GROWTH.path,
  noindex: !GROWTH_INDEXABLE,
})

type Offer = typeof GROWTH.audit | typeof GROWTH.pilot

const idx = (i: number) => ({ ['--i' as string]: i })
const num = (i: number) => String(i + 1).padStart(2, '0')

function OfferTerms({ offer }: { offer: Offer }) {
  return (
    <div className="wk-terms gr-terms">
      <div className="gr-price" data-reveal>
        <p className="wk-price">{offer.price}</p>
        <p className="t-body">{offer.priceNote}</p>
      </div>
      <dl className="wk-terms__list" data-reveal style={idx(1)}>
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

/**
 * /growth/: the name lockup and the weekly approval list, problems, the weekly loop, three sample pieces,
 * the six parts (tagged by what runs today), what stays the client's, the two scoped first steps, approvals,
 * AI use, what the page does not claim, questions, call to action.
 * Built from the service-page and work-page classes; the only page-specific rules are the gr-* block in work.css.
 */
export default function GrowthPage() {
  const g = GROWTH
  return (
    <>
      <PageHead
        title={g.h1}
        lead={g.lead}
        eyebrow={<GrowthLockup line={g.line} />}
        visual={<ApprovalBoard />}
        crumbs={[{ name: g.name, path: g.path }]}
      >
        <Link href={CTA.href} className="btn btn-primary">
          {CTA.label}
          <ArrowRight aria-hidden="true" />
        </Link>
        <a href="#start" className="btn btn-ghost">
          {g.startLink}
        </a>
      </PageHead>

      <section id="problems" className="section svp-problems" aria-labelledby="gr-problems-title">
        <div className="wrap split">
          <div className="svp-head">
            <h2 id="gr-problems-title" className="t-h2" data-reveal>
              {g.problems.title}
            </h2>
            <p className="t-lead">{g.problems.intro}</p>
          </div>
          <ul className="svp-said">
            {g.problems.items.map((p, i) => (
              <li key={p.said} data-reveal style={idx(i)}>
                <p className="svp-said__q">{`“${p.said}”`}</p>
                <p className="t-body">{p.means}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="loop" className="section wk-section" aria-labelledby="gr-loop-title">
        <div className="wrap">
          <div className="svp-head svp-head--wide">
            <h2 id="gr-loop-title" className="t-h2" data-reveal>
              {g.loop.title}
            </h2>
            <p className="t-lead">{g.loop.intro}</p>
          </div>
          <ol className="wk-steps gr-steps gr-loop">
            {g.loop.steps.map((s, i) => (
              <li key={s.name} data-gate={s.gate ? '' : undefined} data-reveal style={idx(i % 3)}>
                <span className="wk-steps__dot" aria-hidden="true" />
                <span className="t-mono" aria-hidden="true">
                  {num(i)}
                </span>
                <h3 className="t-h4">{s.name}</h3>
                <p className="t-small">{s.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="examples" className="section wk-section" aria-labelledby="gr-examples-title">
        <div className="wrap">
          <div className="svp-head svp-head--wide">
            <h2 id="gr-examples-title" className="t-h2" data-reveal>
              {g.examples.title}
            </h2>
            <p className="t-lead">{g.examples.intro}</p>
          </div>
          <div className="gr-samples" role="region" aria-label={g.examples.label} tabIndex={0} data-reveal>
            <ul>
              {g.examples.items.map((x) => (
                <li key={x.src}>
                  <figure>
                    {'video' in x ? (
                      <video controls playsInline preload="none" poster={x.src} width={x.w} height={x.h} aria-label={x.alt}>
                        <source src={x.video} type="video/mp4" />
                      </video>
                    ) : (
                      <Image src={x.src} alt={x.alt} width={x.w} height={x.h} loading="lazy" />
                    )}
                    <figcaption className="t-mono">{x.kind}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
          <p className="t-small svp-steps__note">{g.examples.note}</p>
        </div>
      </section>

      <section id="parts" className="section svp-build" aria-labelledby="gr-parts-title">
        <div className="wrap">
          <div className="svp-head svp-head--wide">
            <h2 id="gr-parts-title" className="t-h2" data-reveal>
              {g.parts.title}
            </h2>
            <p className="t-lead">{g.parts.intro}</p>
          </div>
          <ol className="svp-grid">
            {g.parts.items.map((p, i) => (
              <li key={p.name} data-reveal style={idx(i % 2)}>
                <span className="t-mono" aria-hidden="true">
                  {num(i)}
                </span>
                <h3 className="t-h4">{p.name}</h3>
                <p className="t-body">{p.line}</p>
                <p className="t-mono gr-tag" data-state={p.state}>
                  {g.parts.states[p.state]}
                </p>
              </li>
            ))}
          </ol>
          <p className="t-small svp-steps__note">{g.parts.note}</p>
        </div>
      </section>

      <section id="yours" className="section svp-receive" aria-labelledby="gr-own-title">
        <div className="wrap svp-receive__grid">
          <div className="svp-receive__side">
            <h2 id="gr-own-title" className="t-h2" data-reveal>
              {g.own.title}
            </h2>
            <p className="t-lead">{g.own.intro}</p>
            <aside className="surface svp-handover" data-reveal style={idx(1)}>
              <KeyRound aria-hidden="true" />
              <h3 className="t-h4">{g.own.handoverTitle}</h3>
              <p className="t-body">{g.own.handover}</p>
            </aside>
          </div>
          <ul className="tick-list svp-receive__list">
            {g.own.items.map((it, i) => (
              <li key={it} data-reveal style={idx(i % 3)}>
                {it}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="start" className="section wk-section" aria-labelledby="gr-audit-title">
        <div className="wrap">
          <p className="t-mono" data-reveal>
            {g.audit.tag}
          </p>
          <h2 id="gr-audit-title" className="t-h2" data-reveal>
            {g.audit.name}
          </h2>
          <p className="t-lead wk-intro" data-reveal style={idx(1)}>
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
              <li key={r.name} data-reveal style={idx(i % 2)}>
                <span className="t-mono" aria-hidden="true">
                  {num(i)}
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

      <section id="pilot" className="section wk-section" aria-labelledby="gr-pilot-title">
        <div className="wrap">
          <p className="t-mono" data-reveal>
            {g.pilot.tag}
          </p>
          <h2 id="gr-pilot-title" className="t-h2 wk-h2" data-reveal>
            {g.pilot.name}
          </h2>
          <p className="t-lead wk-intro" data-reveal style={idx(1)}>
            {g.pilot.for}
          </p>
          <OfferTerms offer={g.pilot} />
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
          <div className="prose" data-reveal style={idx(1)}>
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
          <div className="prose" data-reveal style={idx(1)}>
            {g.honest.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <Faq items={[...g.faq]} title={g.faqTitle} id="faq" />

      <CtaBand title={g.cta.title} line={g.cta.line} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ld({
            ...serviceJsonLd({ path: g.path, name: g.name, description: g.meta.description, serviceType: g.serviceType }),
            areaServed: { '@type': 'AdministrativeArea', name: 'Ontario, Canada' },
          }),
        }}
      />
    </>
  )
}
