import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { featuredWork } from '@/content/work'
import { WORK_SECTION } from '@/content/home'

/**
 * Tier A proof after the scenario: problem first, what we engineered second, the label always visible.
 * Technology stays on the case pages. The full index and the lab live on /work/.
 */
export function SelectedWork() {
  const items = featuredWork()
  return (
    <section id="work" className="section sw" aria-labelledby="work-title">
      <div className="wrap">
        <div className="sw__head">
          <h2 id="work-title" className="t-h2">
            {WORK_SECTION.title}
          </h2>
          <p className="t-lead">{WORK_SECTION.intro}</p>
        </div>
        <ol className="sw__list">
          {items.map((w) => (
            <li key={w.slug} className="sw__item">
              <p className="sw__meta">{w.label}</p>
              <div className="sw__body">
                <h3 className="t-h3">
                  <Link href={`/work/${w.slug}/`} className="sw__link">
                    {w.name}
                  </Link>
                </h3>
                {w.caseStudy ? <p className="sw__problem">{w.caseStudy.problem}</p> : null}
                <p className="t-body">{w.line}</p>
              </div>
              <ArrowRight className="sw__arrow" aria-hidden="true" />
            </li>
          ))}
        </ol>
        <Link href="/work/" className="link-arrow">
          All work, including the lab
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
