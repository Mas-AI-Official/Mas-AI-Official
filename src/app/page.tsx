import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import PipelineSection from '@/components/PipelineSection'
import ComparisonSection from '@/components/ComparisonSection'
import PortfolioSection from '@/components/PortfolioSection'
import TrustSection from '@/components/TrustSection'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import MetatronBackground from '@/components/MetatronBackground'

export default function HomePage() {
  return (
    <>
      <MetatronBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <PipelineSection />
        <ComparisonSection />
        <PortfolioSection />
        <TrustSection />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
