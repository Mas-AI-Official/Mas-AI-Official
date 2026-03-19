import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import WhatWeDo from '@/components/WhatWeDo'
import DaenaSpotlight from '@/components/DaenaSpotlight'
import PortfolioSection from '@/components/PortfolioSection'
import EnterpriseServices from '@/components/EnterpriseServices'
import CredibilitySection from '@/components/CredibilitySection'
import ContactSection from '@/components/ContactSection'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import PhiLatticeBackground from '@/components/PhiLatticeBackground'
import SmoothScroll from '@/components/SmoothScroll'
import CustomCursor from '@/components/CustomCursor'
import DaenaGuide from '@/components/DaenaGuide'

export default function HomePage() {
  return (
    <SmoothScroll>
      <PhiLatticeBackground />
      <CustomCursor />
      <DaenaGuide />
      <Navbar />
      <main className="relative z-[2]" style={{ background: 'transparent' }}>
        <div id="hero">
          <Hero />
        </div>

        <div className="w-[60%] mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

        <section id="what-we-do" className="relative" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.04) 0%, transparent 50%)' }}>
          <WhatWeDo />
        </section>

        <div className="w-[60%] mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

        <section id="daena" className="relative" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(0,200,255,0.07) 0%, transparent 55%)' }}>
          <DaenaSpotlight />
        </section>

        <div className="w-[60%] mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

        <section id="portfolio" className="relative" style={{ background: 'linear-gradient(180deg, rgba(15,22,41,0.5) 0%, rgba(10,14,26,0.8) 50%, rgba(15,22,41,0.5) 100%)' }}>
          <PortfolioSection />
        </section>

        <div className="w-[60%] mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

        <section id="enterprise" className="relative enterprise-grid-bg" style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(212,168,83,0.05) 0%, transparent 55%)' }}>
          <EnterpriseServices />
        </section>

        <div className="w-[60%] mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

        <section id="credibility" className="relative" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(0,200,255,0.03) 0%, transparent 50%)' }}>
          <CredibilitySection />
        </section>

        <div className="w-[60%] mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

        <section id="contact" className="relative" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 60%)' }}>
          <ContactSection />
        </section>

        <div className="w-[60%] mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

        <section id="faq" className="relative">
          <FAQ />
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  )
}
