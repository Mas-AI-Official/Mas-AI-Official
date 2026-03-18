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

export default function HomePage() {
  return (
    <>
      <MetatronBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <WhatWeDo />
        <DaenaSpotlight />
        <PortfolioSection />
        <EnterpriseServices />
        <CredibilitySection />
        <ContactSection />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
