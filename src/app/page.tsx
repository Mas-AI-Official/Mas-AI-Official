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
import MetatronBackground from '@/components/MetatronBackground'
import SmoothScroll from '@/components/SmoothScroll'
import CustomCursor from '@/components/CustomCursor'
import DaenaPresence from '@/components/DaenaPresence'

// Section background wrappers
function SectionBg({ children, bg, id, className = '' }: {
  children: React.ReactNode
  bg?: string
  id?: string
  className?: string
}) {
  return (
    <section id={id} className={`relative ${className}`} style={bg ? { background: bg } : undefined}>
      {children}
    </section>
  )
}

export default function HomePage() {
  return (
    <SmoothScroll>
      <MetatronBackground />
      <CustomCursor />
      <DaenaPresence />
      <Navbar />
      <main className="relative z-10">
        <div id="hero">
          <Hero />
        </div>

        <div className="section-divider" />

        <SectionBg id="what-we-do">
          <WhatWeDo />
        </SectionBg>

        <div className="section-divider" />

        <SectionBg
          id="daena"
          bg="radial-gradient(ellipse at 50% 30%, rgba(0,200,255,0.06) 0%, transparent 60%)"
        >
          <DaenaSpotlight />
        </SectionBg>

        <div className="section-divider" />

        <SectionBg
          id="portfolio"
          bg="linear-gradient(180deg, var(--color-mas-bg) 0%, #0a0e1a 50%, var(--color-mas-bg) 100%)"
        >
          <PortfolioSection />
        </SectionBg>

        <div className="section-divider" />

        <SectionBg
          id="enterprise"
          bg="radial-gradient(ellipse at 50% 50%, rgba(212,168,83,0.04) 0%, transparent 60%)"
        >
          <EnterpriseServices />
        </SectionBg>

        <div className="section-divider" />

        <SectionBg id="credibility">
          <CredibilitySection />
        </SectionBg>

        <div className="section-divider" />

        <SectionBg
          id="contact"
          bg="radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 60%)"
        >
          <ContactSection />
        </SectionBg>

        <div className="section-divider" />

        <SectionBg id="faq">
          <FAQ />
        </SectionBg>
      </main>
      <Footer />
    </SmoothScroll>
  )
}
