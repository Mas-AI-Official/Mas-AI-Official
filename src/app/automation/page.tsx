import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import PhiLatticeBackground from '@/components/PhiLatticeBackground'
import AutomationHero from './sections/AutomationHero'
import ServiceCatalog from './sections/ServiceCatalog'
import HowItWorks from './sections/HowItWorks'
import AutomationGrandSlam from './sections/AutomationGrandSlam'
import Pricing from './sections/Pricing'
import CtaBlock from './sections/CtaBlock'

export const metadata: Metadata = {
  title: 'AI Automation Services | MAS-AI Technologies',
  description:
    'We install the AI tools your team already loves, safely. OpenClaw, Claude Code, voice booking assistants, and custom agent integrations with governance and audit trails included.',
  keywords: [
    'AI automation services',
    'OpenClaw installation',
    'voice assistant deployment',
    'AI booking secretary',
    'governed AI integration',
    'Claude Code setup',
    'enterprise AI automation',
  ],
  openGraph: {
    title: 'AI Automation Services | MAS-AI Technologies',
    description:
      'Safe installation of OpenClaw, voice assistants, and custom AI agents, governed by Daena, protected by Klyntar.',
    url: 'https://mas-ai.co/automation',
    type: 'website',
  },
}

export default function AutomationPage() {
  return (
    <SmoothScroll>
      <PhiLatticeBackground />
      <Navbar />
      <main className="relative z-[2]" style={{ background: 'transparent' }}>
        <AutomationHero />
        <div className="section-divider" />
        <ServiceCatalog />
        <div className="section-divider" />
        <HowItWorks />
        <div className="section-divider" />
        <AutomationGrandSlam />
        <div className="section-divider" />
        <Pricing />
        <div className="section-divider" />
        <CtaBlock />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
