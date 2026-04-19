import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import PhiLatticeBackground from '@/components/PhiLatticeBackground'
import ConsultingHero from './sections/ConsultingHero'
import SecurityCatalog from './sections/SecurityCatalog'
import KlyntarFortress from './sections/KlyntarFortress'
import ConsultingGrandSlam from './sections/ConsultingGrandSlam'
import EngagementTiers from './sections/EngagementTiers'
import ConsultingCta from './sections/ConsultingCta'

export const metadata: Metadata = {
  title: 'Security & AI Consulting | MAS-AI Technologies',
  description:
    'Security scans, vulnerability audits, and AI governance reviews for your apps, website, and business, powered by Klyntar\'s defense-in-depth and Daena\'s governance pipeline.',
  keywords: [
    'security scan services',
    'vulnerability assessment',
    'AI governance consulting',
    'Klyntar security',
    'penetration testing',
    'web app security audit',
    'AI risk audit',
  ],
  openGraph: {
    title: 'Security & AI Consulting | MAS-AI Technologies',
    description:
      'Find what\'s exposed before attackers do. Klyntar-powered security scans with Zero-FP gating, no false-alarm noise.',
    url: 'https://mas-ai.co/consulting',
    type: 'website',
  },
}

export default function ConsultingPage() {
  return (
    <SmoothScroll>
      <PhiLatticeBackground />
      <Navbar />
      <main className="relative z-[2]" style={{ background: 'transparent' }}>
        <ConsultingHero />
        <div className="section-divider" />
        <SecurityCatalog />
        <div className="section-divider" />
        <KlyntarFortress />
        <div className="section-divider" />
        <ConsultingGrandSlam />
        <div className="section-divider" />
        <EngagementTiers />
        <div className="section-divider" />
        <ConsultingCta />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
