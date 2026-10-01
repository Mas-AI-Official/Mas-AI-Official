import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CTA } from '@/content/site'

/** Closing call to action for inner pages. One contact-intent label site-wide. */
export function CtaBand({ title = 'Bring us the bottleneck.', line }: { title?: string; line?: string }) {
  return (
    <section className="section cta-band" aria-labelledby="cta-band-title">
      <div className="wrap cta-band__inner">
        <h2 id="cta-band-title" className="t-h2">
          {title}
        </h2>
        {line ? <p className="t-lead">{line}</p> : null}
        <Link href={CTA.href} className="btn btn-primary">
          {CTA.label}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
