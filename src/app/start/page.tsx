import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageHead } from '@/components/ui/PageHead'
import { InquiryFlow } from '@/components/start/InquiryFlow'
import { COMPANY } from '@/content/facts'
import { START } from '@/content/home'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Start a conversation',
  description:
    'Tell us what you are trying to improve and what happens today. Four short steps, and we reply by email. Or book a 30-minute fit call.',
  path: '/start/',
})

export default function StartPage() {
  return (
    <>
      <PageHead
        title={START.title}
        lead="Four short steps. Tell us what is slow, what happens today, and how to reach you. We reply by email."
        crumbs={[{ name: 'Start', path: '/start/' }]}
      >
        <p className="t-small">
          Prefer to talk first?{' '}
          <a className="link-arrow" href={COMPANY.booking} target="_blank" rel="noopener noreferrer">
            Book a 30-minute fit call
            <ArrowUpRight aria-hidden="true" />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </p>
      </PageHead>

      <section className="section" aria-label="Inquiry">
        <div className="wrap inq-layout">
          <InquiryFlow />
          <aside className="inq-aside" aria-labelledby="inq-next-title">
            <h2 id="inq-next-title" className="t-h3">
              What happens next
            </h2>
            <ol className="rows">
              <li>
                <span className="t-h4">We read it.</span>
                <span className="t-body">The founder reads every inquiry. There is no form-letter reply.</span>
              </li>
              <li>
                <span className="t-h4">We answer by email.</span>
                <span className="t-body">With questions, or with a clear next step.</span>
              </li>
              <li>
                <span className="t-h4">If it fits, a Blueprint.</span>
                <span className="t-body">
                  A short engagement that ends in a build plan or a clear no.{' '}
                  <Link href="/blueprint/" className="link">
                    See the Build Blueprint
                  </Link>
                  .
                </span>
              </li>
            </ol>
            <p className="t-small">
              Your answers arrive by email in the founder&apos;s inbox. Details are in the{' '}
              <Link href="/privacy/" className="link">
                privacy notice
              </Link>
              .
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}
