import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { COMPANY_SECTION } from '@/content/home'
import { COMPANY, PROGRAMS } from '@/content/facts'
import { PUBLISHED_PATENTS } from '@/lib/seo'

export function Company() {
  const programs = PROGRAMS.filter((p) => p.publish)
  return (
    <section id="company" className="section company" aria-labelledby="company-title">
      <div className="wrap company__grid">
        <div className="company__head">
          <h2 id="company-title" className="t-h2" data-reveal>
            {COMPANY_SECTION.title}
          </h2>
          <p className="t-lead" data-reveal style={{ ['--i' as string]: 1 }}>
            {COMPANY_SECTION.intro}
          </p>
          <p className="company__founder" data-reveal style={{ ['--i' as string]: 2 }}>
            <span className="t-h4">{COMPANY.founder.name}</span>
            <span className="t-small">{COMPANY.founder.title}, {COMPANY.legalName}</span>
          </p>
          <Link href="/company/" className="link-arrow">
            About the company
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="company__side">
          <ul className="principles">
            {COMPANY_SECTION.principles.map((p, i) => (
              <li key={p.name} data-reveal style={{ ['--i' as string]: i }}>
                <p className="t-h4">{p.name}</p>
                <p className="t-small">{p.line}</p>
              </li>
            ))}
          </ul>
          <dl className="creds">
            {PUBLISHED_PATENTS.map((p) => (
              <div key={p.number}>
                <dt className="t-label">Patent application</dt>
                <dd>
                  {p.title}, {p.kind} {p.number}
                </dd>
              </div>
            ))}
            <div>
              <dt className="t-label">Programs</dt>
              <dd>{programs.map((p) => p.name).join(', ')}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
