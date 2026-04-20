import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import PhiLatticeBackground from '@/components/PhiLatticeBackground'
import BookingHero from './sections/BookingHero'
import BookingOptions from './sections/BookingOptions'
import BookingFaq from './sections/BookingFaq'

export const metadata: Metadata = {
  title: 'Book a Call | MAS-AI Technologies',
  description:
    'Three ways to start. Free 30-min consultation, free security scan, or free automation audit. All free. All under 48-hour response.',
  keywords: [
    'book free consultation',
    'AI security audit',
    'automation audit',
    'MAS-AI call',
    'free security scan',
  ],
  openGraph: {
    title: 'Book a Free Call | MAS-AI Technologies',
    description:
      'Three options. All free. All 48-hour turnaround. Consultation, security scan, or automation audit.',
    url: 'https://mas-ai.co/book',
    type: 'website',
  },
}

// FAQPage schema drives Google AI Overviews + Perplexity citation. Must match
// the visible FAQ text on BookingFaq.tsx. Google flags mismatch as spam.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://mas-ai.co/book#faq',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the free option actually free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. No credit card. No obligation. No auto-enrollment into a paid plan. We give up 30 minutes on the call or 2 hours on the security scan because people who see the work firsthand convert far better than any cold outreach we could send. The free tier is marketing that costs us time instead of dollars.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Ontario businesses actually afford your paid engagements?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Scope matches the client. A local SMB that needs one agent or a single website scan gets a smaller fixed-scope engagement (typically $3,000 to $8,000). Enterprise engagements with multi-system scope run $12,000 to $45,000. The free consultation is where we figure out which bucket fits.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you work on platforms you did not build?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Daena and Klyntar are what we build with when you need them, but we work with whatever stack you run. AWS, GCP, Azure, on-prem, open-source, commercial, whatever. Security work is stack-agnostic. Automation work adapts to the AI runtimes your team already prefers.',
      },
    },
    {
      '@type': 'Question',
      name: 'What counts as a valid target for the free security scan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A public URL, a GitHub repo, a mobile app store link, or an API endpoint we can reach. Anything outside your firewall. For internal-only systems we arrange scope during a paid engagement with an NDA in place.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if attackers still get through after you finish?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every engagement is scoped to specific targets and a specific window. We find and fix what we can find inside that window. We do not promise 100% security. nobody can, and anyone who claims they can is lying. Our contract caps liability at the engagement value, carves out third-party breaches and zero-day CVEs discovered after delivery, and sets clear scope boundaries.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who sees our data during the free scan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Only us. Nothing goes to third parties. Vault material (anything sensitive pulled into Klyntar during a recon) is destroyed within 24 hours of delivering the PDF. If you want an NDA in place first, we sign yours or send you ours before we touch anything.',
      },
    },
  ],
}

// Breadcrumb schema for the /book page helps Google display breadcrumb in
// search results and helps AI search place the page in site hierarchy.
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'MAS-AI Technologies', item: 'https://mas-ai.co' },
    { '@type': 'ListItem', position: 2, name: 'Book a Call', item: 'https://mas-ai.co/book' },
  ],
}

export default function BookPage() {
  return (
    <SmoothScroll>
      <PhiLatticeBackground />
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="relative z-[2]" style={{ background: 'transparent' }}>
        <BookingHero />
        <div className="section-divider" />
        <BookingOptions />
        <div className="section-divider" />
        <BookingFaq />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
