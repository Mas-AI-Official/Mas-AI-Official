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

export default function BookPage() {
  return (
    <SmoothScroll>
      <PhiLatticeBackground />
      <Navbar />
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
