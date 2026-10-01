import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react'
import { PageHead } from '@/components/ui/PageHead'
import { CtaBand } from '@/components/ui/CtaBand'
import { COMPANY } from '@/content/facts'
import { COMPANY_PAGE } from '@/content/company'
import { COMPANY_SECTION } from '@/content/home'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Company',
  description: `MAS-AI Technologies Inc. is a founder-led company in ${COMPANY.locality}, ${COMPANY.region}, ${COMPANY.countryName}. How we work, how we build, and where to find us.`,
  path: '/company/',
})

export default function CompanyPage() {
  const c = COMPANY_PAGE
  return (
    <>
      <PageHead title={c.title} lead={c.lead} crumbs={[{ name: 'Company', path: '/company/' }]} />

      <section className="section wk-section" aria-labelledby="co-facts-title">
        <div className="wrap split">
          <h2 id="co-facts-title" className="t-h2 wk-h2" data-reveal>
            The company
          </h2>
          <dl className="wk-facts" data-reveal style={{ ['--i' as string]: 1 }}>
            {c.facts.map((f) => (
              <div key={f.term} className="wk-facts__row">
                <dt className="t-mono">{f.term}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="co-team-title">
        <div className="wrap split">
          <h2 id="co-team-title" className="t-h2 wk-h2" data-reveal>
            {c.team.title}
          </h2>
          <dl className="wk-facts" data-reveal style={{ ['--i' as string]: 1 }}>
            {c.team.rows.map((f) => (
              <div key={f.term} className="wk-facts__row">
                <dt className="t-mono">{f.term}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="co-how-title">
        <div className="wrap">
          <h2 id="co-how-title" className="t-h2 wk-h2" data-reveal>
            How we work
          </h2>
          <p className="t-lead wk-intro" data-reveal style={{ ['--i' as string]: 1 }}>
            {COMPANY_SECTION.intro}
          </p>
          <ul className="wk-principles">
            {c.principles.map((p, i) => (
              <li key={p.name} data-reveal style={{ ['--i' as string]: i }}>
                <h3 className="t-h4">{p.name}</h3>
                <p className="t-body">{p.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="co-practice-title">
        <div className="wrap split">
          <div className="wk-related__head" data-reveal>
            <h2 id="co-practice-title" className="t-h2 wk-h2">
              How we build
            </h2>
            <p className="t-body">These are practices we follow on every project, not claims about a number.</p>
          </div>
          <ul className="rows">
            {c.practices.map((p) => (
              <li key={p.name} data-reveal>
                <h3 className="t-h4">{p.name}</h3>
                <p className="t-body">{p.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="co-ip-title">
        <div className="wrap wk-ip">
          <div className="wk-ip__col" data-reveal>
            <h2 id="co-ip-title" className="t-h3">
              Patent application
            </h2>
            {c.patents.map((p) => (
              <div key={p.number} className="surface wk-patent">
                <span className="chip chip-gold">{p.kind}</span>
                <p className="t-h4">{p.title}</p>
                <p className="t-mono">
                  No. {p.number}, filed {p.filed}
                </p>
              </div>
            ))}
            <p className="t-small">{c.patentNote}</p>
          </div>
          <div className="wk-ip__col" data-reveal style={{ ['--i' as string]: 1 }}>
            <h2 className="t-h3">Programs</h2>
            <ul className="wk-programs">
              {c.programs.map((p) => (
                <li key={p.name}>
                  <span className="t-h4">{p.name}</span>
                  <span className="t-small">{p.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section wk-section" aria-labelledby="co-find-title">
        <div className="wrap split">
          <div className="wk-related__head" data-reveal>
            <h2 id="co-find-title" className="t-h2 wk-h2">
              Find us
            </h2>
            <p className="t-body">{c.investors}</p>
          </div>
          <ul className="wk-contact" data-reveal style={{ ['--i' as string]: 1 }}>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="link-arrow">
                <Mail aria-hidden="true" />
                {COMPANY.email}
              </a>
            </li>
            <li>
              <a href={COMPANY.github} rel="noopener" className="link-arrow">
                GitHub organization
                <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href={COMPANY.founder.linkedin} rel="noopener" className="link-arrow">
                {COMPANY.founder.name} on LinkedIn
                <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
            <li>
              <Link href="/work/" className="link-arrow">
                The work we build and run ourselves
                <ArrowRight aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
