import { PageHead } from '@/components/ui/PageHead'
import { CtaBand } from '@/components/ui/CtaBand'
import { WorkGroup } from '@/components/work/WorkGroup'
import { LABEL_COPY, LABEL_ORDER, TIER_ORDER } from '@/components/work/labels'
import { workByTier } from '@/content/work'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Work',
  description:
    'The systems MAS-AI builds, runs and releases itself: a governed multi-agent platform, a retrieval engine, open-source tools and research, each with its current state.',
  path: '/work/',
})

export default function WorkIndexPage() {
  return (
    <>
      <PageHead
        title="We build our own company on this."
        lead="These are systems we build, run and release ourselves. Each one says what it does, what state it is in, and what it shows we can build for you."
        crumbs={[{ name: 'Work', path: '/work/' }]}
      />

      <section className="wk-note" aria-labelledby="work-client-title">
        <div className="wrap wk-note__inner">
          <h2 id="work-client-title" className="t-h4">
            About client work
          </h2>
          <p className="t-body">
            Client work is shown only with the client&apos;s written permission. Until we have that, this page shows
            systems we build, run and release ourselves.
          </p>
        </div>
      </section>

      {TIER_ORDER.map((tier) => {
        const items = workByTier(tier)
        return items.length ? <WorkGroup key={tier} tier={tier} items={items} /> : null
      })}

      <section className="wk-tier wk-key" aria-labelledby="work-key-title">
        <div className="wrap split">
          <h2 id="work-key-title" className="t-h2 wk-h2" data-reveal>
            What the labels mean
          </h2>
          <ul className="rows" data-reveal style={{ ['--i' as string]: 1 }}>
            {LABEL_ORDER.map((label) => (
              <li key={label}>
                <h3 className="t-h4">{label}</h3>
                <p className="t-body">{LABEL_COPY[label]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand line="Tell us what is slow. We will say whether a build, a Blueprint or nothing at all is the right next step." />
    </>
  )
}
