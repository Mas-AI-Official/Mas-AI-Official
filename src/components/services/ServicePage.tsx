import Link from 'next/link'
import { ArrowRight, KeyRound } from 'lucide-react'
import { PageHead } from '@/components/ui/PageHead'
import { CtaBand } from '@/components/ui/CtaBand'
import { Faq } from '@/components/home/Faq'
import { CTA, WORK_CTA } from '@/content/site'
import { linkFor, type ServiceContent } from '@/content/services'
import { serviceJsonLd, ld } from '@/lib/seo'
import { Runs } from './Runs'
import { Proof } from './Proof'
import { SystemScene } from '@/components/home/SystemScene'
import type { CapabilityVariant } from '@/content/home'

/** Which shape of the living system each service page shows (src/components/home/stage/systems.ts). */
const VARIANT: Record<string, CapabilityVariant> = {
  automation: 'integration',
  software: 'software',
  websites: 'websites',
  'private-ai': 'private',
  security: 'governance',
  rag: 'agents',
  'ai-act-readiness': 'governance',
}

const idx = (i: number) => ({ ['--i' as string]: i })
const num = (i: number) => String(i + 1).padStart(2, '0')

/**
 * One template for every service page. Order is fixed: problems, what we build, what you receive,
 * connections, where it can run, proof, questions, related, call to action.
 */
export function ServicePage({ content: c }: { content: ServiceContent }) {
  return (
    <>
      <PageHead
        title={c.h1}
        lead={c.lead}
        visual={VARIANT[c.slug] ? <SystemScene variant={VARIANT[c.slug]} className="page-head__scene" /> : undefined}
        crumbs={[
          { name: 'Services', path: '/services/' },
          { name: c.name, path: c.path },
        ]}
      >
        <Link href={CTA.href} className="btn btn-primary">
          {CTA.label}
          <ArrowRight aria-hidden="true" />
        </Link>
        <Link href={WORK_CTA.href} className="btn btn-ghost">
          {WORK_CTA.label}
        </Link>
      </PageHead>

      <section id="problems" className="section svp-problems" aria-labelledby="problems-title">
        <div className="wrap split">
          <div className="svp-head">
            <h2 id="problems-title" className="t-h2" data-reveal>
              {c.problems.title}
            </h2>
            {c.problems.intro ? <p className="t-lead">{c.problems.intro}</p> : null}
          </div>
          <ul className="svp-said">
            {c.problems.items.map((p, i) => (
              <li key={p.said} data-reveal style={idx(i)}>
                <p className="svp-said__q">{`“${p.said}”`}</p>
                <p className="t-body">{p.means}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="build" className="section svp-build" aria-labelledby="build-title">
        <div className="wrap">
          <div className="svp-head svp-head--wide">
            <h2 id="build-title" className="t-h2" data-reveal>
              {c.build.title}
            </h2>
            {c.build.intro ? <p className="t-lead">{c.build.intro}</p> : null}
          </div>
          <ol className="svp-grid">
            {c.build.items.map((b, i) => (
              <li key={b.name} data-reveal style={idx(i % 2)}>
                <span className="t-mono" aria-hidden="true">
                  {num(i)}
                </span>
                <h3 className="t-h4">{b.name}</h3>
                <p className="t-body">{b.line}</p>
              </li>
            ))}
          </ol>
          {c.callout ? (
            <aside className="svp-callout" aria-labelledby="callout-title">
              <h3 id="callout-title" className="t-h4">
                {c.callout.title}
              </h3>
              <p className="t-body">{c.callout.body}</p>
            </aside>
          ) : null}
        </div>
      </section>

      {c.stages ? (
        <section id="stages" className="section svp-stages" aria-labelledby="stages-title">
          <div className="wrap">
            <div className="svp-head svp-head--wide">
              <h2 id="stages-title" className="t-h2" data-reveal>
                {c.stages.title}
              </h2>
              <p className="t-lead">{c.stages.intro}</p>
            </div>
            <ol className="svp-steps">
              {c.stages.steps.map((s, i) => (
                <li key={s.name} className="svp-step" data-step={i + 1} data-reveal style={idx(i)}>
                  <span className="svp-step__n t-mono" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="t-h3">{s.name}</h3>
                  <p className="t-body">{s.line}</p>
                </li>
              ))}
            </ol>
            {c.stages.note ? <p className="t-small svp-steps__note">{c.stages.note}</p> : null}
          </div>
        </section>
      ) : null}

      <section id="receive" className="section svp-receive" aria-labelledby="receive-title">
        <div className="wrap svp-receive__grid">
          <div className="svp-receive__side">
            <h2 id="receive-title" className="t-h2" data-reveal>
              {c.receive.title}
            </h2>
            {c.receive.intro ? <p className="t-lead">{c.receive.intro}</p> : null}
            <aside className="surface svp-handover" data-reveal style={idx(1)}>
              <KeyRound aria-hidden="true" />
              <h3 className="t-h4">{c.receive.handoverTitle}</h3>
              <p className="t-body">{c.receive.handover}</p>
            </aside>
          </div>
          <ul className="tick-list svp-receive__list">
            {c.receive.items.map((it, i) => (
              <li key={it} data-reveal style={idx(i % 3)}>
                {it}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="connects" className="section svp-connects" aria-labelledby="connects-title">
        <div className="wrap split">
          <h2 id="connects-title" className="t-h2" data-reveal>
            {c.connects.title}
          </h2>
          <div className="svp-connects__body">
            <p className="t-lead">{c.connects.intro}</p>
            <ul className="svp-chips" aria-label="Kinds of system we connect to">
              {c.connects.chips.map((chip) => (
                <li key={chip} className="chip">
                  {chip}
                </li>
              ))}
            </ul>
            <p className="t-small">{c.connects.note}</p>
          </div>
        </div>
      </section>

      <Runs runs={c.runs} />

      {c.extras?.map((x) => (
        <section key={x.id} id={x.id} className="section svp-extra" aria-labelledby={`${x.id}-title`}>
          <div className="wrap">
            <div className="svp-head svp-head--wide">
              <h2 id={`${x.id}-title`} className="t-h2" data-reveal>
                {x.title}
              </h2>
              <p className="t-lead">{x.intro}</p>
            </div>
            <ul className="svp-grid">
              {x.items.map((b, i) => (
                <li key={b.name} data-reveal style={idx(i % 2)}>
                  <h3 className="t-h4">{b.name}</h3>
                  <p className="t-body">{b.line}</p>
                </li>
              ))}
            </ul>
            {x.note ? <p className="t-small svp-extra__note">{x.note}</p> : null}
          </div>
        </section>
      ))}

      {c.stack ? (
        <section id="stack" className="section svp-stack" aria-labelledby="stack-title">
          <div className="wrap split">
            <div className="svp-head">
              <h2 id="stack-title" className="t-h2" data-reveal>
                {c.stack.title}
              </h2>
              <p className="t-lead">{c.stack.intro}</p>
            </div>
            <div className="svp-stack__body">
              <dl className="svp-stack__list">
                {c.stack.groups.map((g) => (
                  <div key={g.name} className="svp-stack__row" data-reveal>
                    <dt className="t-mono">{g.name}</dt>
                    <dd className="t-body">{g.line}</dd>
                  </div>
                ))}
              </dl>
              {c.stack.note ? <p className="t-small">{c.stack.note}</p> : null}
            </div>
          </div>
        </section>
      ) : null}

      <Proof content={c} />

      <Faq items={c.faq} title="Questions we get" id="faq" />

      <section className="section svp-related" aria-labelledby="related-title">
        <div className="wrap">
          <h2 id="related-title" className="t-h4">
            Related
          </h2>
          <ul className="svp-related__list">
            {c.related.map((slug) => {
              const l = linkFor(slug)
              return (
                <li key={slug}>
                  <Link href={l.href} className="link-arrow">
                    {l.name}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                  <p className="t-small">{l.line}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <CtaBand title={c.cta.title} line={c.cta.line} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ld(
            serviceJsonLd({ path: c.path, name: c.h1, description: c.meta.description, serviceType: c.serviceType }),
          ),
        }}
      />
    </>
  )
}
