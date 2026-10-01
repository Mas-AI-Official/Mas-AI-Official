import { PageHead } from '@/components/ui/PageHead'
import { COMPANY } from '@/content/facts'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Privacy notice',
  description: 'What the mas-ai.co inquiry form collects, who delivers it, and how to ask us to delete it.',
  path: '/privacy/',
})

const LAST_UPDATED = '2026-09-30'

export default function PrivacyPage() {
  return (
    <>
      <PageHead
        title="Privacy notice"
        lead="What this website collects, who handles it, and how to ask us to delete it."
        crumbs={[{ name: 'Privacy', path: '/privacy/' }]}
      >
        <p className="t-mono">
          Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
        </p>
      </PageHead>

      <section className="section" aria-label="Privacy notice">
        <div className="wrap">
          <div className="legal prose">
            <h2 className="t-h3">Who we are</h2>
            <p>
              This website is run by {COMPANY.legalName}, {COMPANY.locality}, {COMPANY.region}, {COMPANY.countryName}. You can
              reach us at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
            </p>

            <h2 className="t-h3">What the inquiry form collects</h2>
            <p>The form at /start/ collects what you type into it:</p>
            <ul>
              <li>what you are trying to improve, and what happens today;</li>
              <li>
                the tools and other systems involved, where your data may be processed, the hardware you have or need, and
                your timeline, if you choose to answer;
              </li>
              <li>your company name and size, if you choose to give them;</li>
              <li>your name and email address, and a phone number if you choose to give one.</li>
            </ul>
            <p>
              If you reached the site through a link from one of our posts or ads, the link carries campaign labels such as
              utm_source=linkedin. This tab remembers them, without a cookie, and the form sends them with your answers so we
              know which post brought you. Visitors who arrive without such a link send none.
            </p>
            <p>Nothing is sent as you move between steps. Data is sent only when you press the send button.</p>

            <h2 className="t-h3">How it reaches us</h2>
            <p>
              When you send the form, your answers are delivered to us by email through FormSubmit (formsubmit.co). FormSubmit
              acts as a processor: it receives what you submit in order to pass it to our inbox. Its handling of that data is
              described in its own policy. This website has no database of its own and keeps no copy of what you submit.
            </p>
            <p>
              If the form cannot send, the page offers an email link and a copy button instead. Those use your own mail app
              and clipboard, and nothing goes to FormSubmit.
            </p>

            <h2 className="t-h3">What we do with it</h2>
            <p>We use your answers to reply to you and to scope the work you asked about. We do not sell them.</p>

            <h2 className="t-h3">The site guide</h2>
            <p>
              The site guide runs entirely in your browser. It sends nothing to us or to anyone else, and it does not need the
              inquiry form.
            </p>

            <h2 className="t-h3">Cookies and analytics</h2>
            <p>This site sets no analytics or advertising cookies.</p>

            <h2 className="t-h3">Other sites</h2>
            <p>
              The site is hosted on GitHub Pages, and GitHub may process technical request data such as your IP address under
              its own policy. The booking link for the 30-minute fit call opens Calendly, and links to GitHub and LinkedIn open
              those services. Once you follow one of these links, that service&apos;s own privacy policy applies.
            </p>

            <h2 className="t-h3">Deletion and corrections</h2>
            <p>
              To ask us to delete or correct something you sent, email{' '}
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> from the address you used and say what you would like
              removed or changed.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
