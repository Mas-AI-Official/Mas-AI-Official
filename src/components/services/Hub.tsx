import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHead } from '@/components/ui/PageHead'
import { CtaBand } from '@/components/ui/CtaBand'
import { Faq } from '@/components/home/Faq'
import { Capabilities } from '@/components/home/Capabilities'
import { DEPTH, FAMILIES, PRACTICES } from '@/content/site'
import { HUB, SERVICES } from '@/content/services'
import { OFFER } from '@/content/facts'

const idx = (i: number) => ({ ['--i' as string]: i })

/** /services/ hub: three families in an asymmetric grid, practices and depth pages as rows, then the Blueprint. */
export function Hub() {
  return (
    <>
      <PageHead title={HUB.h1} lead={HUB.lead} crumbs={[{ name: 'Services', path: '/services/' }]} />

      <Capabilities />

      <section id="how" className="section svp-hub-how" aria-labelledby="how-title">
        <div className="wrap split">
          <div className="svp-head">
            <h2 id="how-title" className="t-h2" data-reveal>
              {HUB.how.title}
            </h2>
            <p className="t-lead">{HUB.how.intro}</p>
          </div>
          <ul className="svp-hub-rows">
            {PRACTICES.map((p, i) => (
              <li key={p.slug} data-reveal style={idx(i)}>
                <h3 className="t-h3">
                  <Link href={p.href} className="link">
                    {p.name}
                  </Link>
                </h3>
                <p className="t-body">{p.line}</p>
                <ul className="svp-hub-list">
                  {SERVICES[p.slug].build.items.slice(0, 3).map((b) => (
                    <li key={b.name}>{b.name}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="depth" className="section svp-hub-depth" aria-labelledby="depth-title">
        <div className="wrap split">
          <div className="svp-head">
            <h2 id="depth-title" className="t-h2" data-reveal>
              {HUB.depth.title}
            </h2>
            <p className="t-lead">{HUB.depth.intro}</p>
          </div>
          <ul className="svp-hub-rows">
            {DEPTH.map((d, i) => (
              <li key={d.slug} data-reveal style={idx(i)}>
                <h3 className="t-h3">{d.name}</h3>
                <p className="t-body">{d.line}</p>
                <Link href={d.href} className="link-arrow">
                  Read the page
                  <ArrowRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="delivery" className="section svp-extra" aria-labelledby="delivery-title">
        <div className="wrap">
          <div className="svp-head svp-head--wide">
            <h2 id="delivery-title" className="t-h2" data-reveal>
              {HUB.delivery.title}
            </h2>
            <p className="t-lead">{HUB.delivery.intro}</p>
          </div>
          <ul className="svp-grid">
            {HUB.delivery.items.map((d, i) => (
              <li key={d.name} data-reveal style={idx(i % 2)}>
                <h3 className="t-h4">{d.name}</h3>
                <p className="t-body">{d.line}</p>
              </li>
            ))}
          </ul>
          <p className="t-small svp-extra__note">{HUB.delivery.note}</p>
        </div>
      </section>

      <Faq items={HUB.delivery.faq} title="Questions about delivery" id="delivery-faq" />

      <section id="blueprint" className="section svp-blueprint" aria-labelledby="blueprint-title">
        <div className="wrap">
          <div className="surface svp-blueprint__box" data-reveal>
            <div className="svp-blueprint__text">
              <h2 id="blueprint-title" className="t-h2">
                {HUB.blueprint.title}
              </h2>
              <p className="t-lead">{HUB.blueprint.body}</p>
              <Link href="/blueprint/" className="btn btn-ghost">
                See the {OFFER.name}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <ul className="tick-list svp-blueprint__list" aria-label={`What the ${OFFER.name} produces`}>
              {HUB.blueprint.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand title={HUB.cta.title} line={HUB.cta.line} />
    </>
  )
}
