import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import PhiLatticeBackground from '@/components/PhiLatticeBackground'
import SecurityArchitectHero from './sections/SecurityArchitectHero'
import ArchitectAudit from './sections/ArchitectAudit'
import KlyntarFortress from '@/app/consulting/sections/KlyntarFortress'
import ConsultingGrandSlam from '@/app/consulting/sections/ConsultingGrandSlam'
import SecurityCatalog from '@/app/consulting/sections/SecurityCatalog'
import EngagementTiers from '@/app/consulting/sections/EngagementTiers'
import ConsultingCta from '@/app/consulting/sections/ConsultingCta'

export const metadata: Metadata = {
  title: 'AI Security Architect | MAS-AI Technologies',
  description:
    'Your AI deployment passes security review in 21 days, or you keep the audit free. I built Klyntar (25+ exploit signatures, Zero-FP gate). I know exactly where the holes are.',
  keywords: [
    'AI security architect',
    'LLM security audit',
    'Klyntar security',
    'AI governance consulting',
    'AI red team',
    'prompt injection audit',
    'EU AI Act readiness',
    'AI security researcher for hire',
  ],
  openGraph: {
    title: 'AI Security Architect-for-Hire | MAS-AI Technologies',
    description:
      'Free AI security audit. 2-hour recon. Proof-of-exploit on every finding. Pay nothing until you want remediation.',
    url: 'https://mas-ai.co/security',
    type: 'website',
  },
}

export default function SecurityPage() {
  return (
    <SmoothScroll>
      <PhiLatticeBackground />
      <Navbar />
      <main className="relative z-[2]" style={{ background: 'transparent' }}>
        <SecurityArchitectHero />
        <div className="section-divider" />
        <ArchitectAudit />
        <div className="section-divider" />
        <KlyntarFortress />
        <div className="section-divider" />
        <SecurityCatalog />
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
