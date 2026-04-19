import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import PhiLatticeBackground from '@/components/PhiLatticeBackground'
import AiActHero from './sections/AiActHero'
import AiActGrandSlam from './sections/AiActGrandSlam'
import AiActCta from './sections/AiActCta'

export const metadata: Metadata = {
  title: 'EU AI Act Readiness Sprint | MAS-AI Technologies',
  description:
    'The EU AI Act enforces August 2, 2026. Up to €35M or 7% of global turnover in penalties. Fixed 2-week readiness sprint, architecture, documentation, exit-ready audit trail.',
  keywords: [
    'EU AI Act compliance',
    'EU AI Act readiness',
    'AI regulation 2026',
    'AI governance compliance',
    'EU AI Act August 2026',
  ],
  openGraph: {
    title: 'EU AI Act Readiness Sprint. 2 Weeks to Compliant',
    description:
      'Aug 2, 2026 deadline. €35M max penalty. 2-week sprint to documented compliance.',
    url: 'https://mas-ai.co/ai-act-readiness',
    type: 'website',
  },
}

export default function AiActReadinessPage() {
  return (
    <SmoothScroll>
      <PhiLatticeBackground />
      <Navbar />
      <main className="relative z-[2]" style={{ background: 'transparent' }}>
        <AiActHero />
        <div className="section-divider" />
        <AiActGrandSlam />
        <div className="section-divider" />
        <AiActCta />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
