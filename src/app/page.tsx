import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TwoPathsSection from '@/components/TwoPathsSection'
import CredentialsSection from '@/components/CredentialsSection'
import ProductsSection from '@/components/ProductsSection'
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

        <section id="paths" className="relative" style={{ background: 'radial-gradient(ellipse at 20% 30%, rgba(0,200,255,0.05) 0%, transparent 45%), radial-gradient(ellipse at 80% 70%, rgba(255,64,96,0.05) 0%, transparent 45%)' }}>
          <TwoPathsSection />
        </section>

        <div className="w-[60%] mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

        <section id="proof" className="relative" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(0,200,255,0.04) 0%, transparent 50%)' }}>
          <CredentialsSection />
        </section>

        <div className="w-[60%] mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

        <section id="products" className="relative" style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(0,200,255,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(255,64,96,0.05) 0%, transparent 50%)' }}>
          <ProductsSection />
        </section>

        <div className="w-[60%] mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

        <section id="portfolio" className="relative" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,200,255,0.04) 0%, transparent 55%)' }}>
          <PortfolioSection />
        </section>

        <div className="w-[60%] mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

        <section id="enterprise" className="relative enterprise-grid-bg" style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(212,168,83,0.05) 0%, transparent 55%)' }}>
          <EnterpriseServices />
        </section>

        <div className="w-[60%] mx-auto h-px bg-gradient-to-r from-transparent via-[var(--color-mas-gold)]/15 to-transparent" />

        <section id="credibility" className="relative">
          <CredibilitySection />
        </section>

        <div className="w-[60%] mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />

        <section id="contact" className="relative">
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
