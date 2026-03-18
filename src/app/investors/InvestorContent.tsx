'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowLeft,
  ShieldAlert,
  BrainCog,
  FileSearch,
  FlaskConical,
  Scale,
  Rocket,
  ExternalLink,
  Mail,
  Linkedin,
  Calendar,
  Building2,
  Target,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

// ---------------------------------------------------------------------------
// Reusable Section wrapper with in-view detection
// ---------------------------------------------------------------------------

function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.section
      ref={ref}
      id={id}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`relative px-6 py-16 md:py-24 ${className}`}
    >
      {children}
    </motion.section>
  )
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const problemCards = [
  {
    icon: ShieldAlert,
    title: 'No Governance',
    description: 'AI agents make decisions in black boxes with no oversight, no approval gates, and no policy enforcement.',
  },
  {
    icon: BrainCog,
    title: 'No Memory',
    description: 'Every session starts from zero. Agents forget context, lose decisions, and repeat mistakes.',
  },
  {
    icon: FileSearch,
    title: 'No Traceability',
    description: 'When things go wrong, there is no audit trail. No way to replay what happened or why.',
  },
]

const metricCards = [
  { value: '300+', label: 'Tests Passing', icon: FlaskConical },
  { value: '2', label: 'Patents Pending', icon: Scale },
  { value: '10-Stage', label: 'Governed Pipeline', icon: Target },
  { value: 'Google', label: 'Startups Program', icon: Building2 },
]

const roadmapItems = [
  {
    period: 'Next 90 Days',
    title: 'Early Access Program',
    description: 'Onboard design partners for governed agent deployment. Validate enterprise workflows with real teams.',
    icon: Rocket,
  },
  {
    period: '6 Months',
    title: 'Enterprise Pilot Deployments',
    description: 'Paid pilot programs with mid-market and enterprise customers. Measure ROI on governed AI operations.',
    icon: Building2,
  },
  {
    period: '12 Months',
    title: 'Revenue + Series A Positioning',
    description: 'Recurring revenue from pilot conversions. Position for Series A with validated metrics and customer proof points.',
    icon: Target,
  },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function InvestorContent() {
  return (
    <>
      <Navbar />

      <main className="relative z-10 pt-24">
        {/* Back link */}
        <div className="mx-auto max-w-6xl px-6 mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-mas-text-secondary)] transition-colors hover:text-[var(--color-mas-cyan)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to MAS-AI
          </Link>
        </div>

        {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
        <Section className="text-center">
          {/* Radial glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full opacity-20 blur-[140px]"
            style={{
              background: 'radial-gradient(circle, var(--color-mas-cyan) 0%, transparent 70%)',
            }}
          />

          <div className="relative mx-auto max-w-4xl">
            <motion.p
              variants={fadeUp}
              className="mb-4 text-xs uppercase tracking-[0.25em] text-[var(--color-mas-cyan)] font-[family-name:var(--font-mono)]"
            >
              MAS-AI Technologies Inc.
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mb-6 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              <span className="text-gradient">Investor Overview</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto max-w-2xl text-lg text-[var(--color-mas-text-secondary)] leading-relaxed"
            >
              Governance-first AI agent orchestration with two patent-pending architectures.
              Built for enterprises that need AI they can actually trust.
            </motion.p>
          </div>
        </Section>

        <div className="section-divider" />

        {/* ── 2. Problem ───────────────────────────────────────────────────── */}
        <Section>
          <div className="mx-auto max-w-6xl">
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <h2 className="text-gradient font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Why Enterprises Cannot Trust Current AI Agents
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {problemCards.map((card) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={card.title}
                    variants={fadeUp}
                    className="glass rounded-2xl p-8 transition-colors"
                  >
                    <div className="mb-4 inline-flex rounded-xl bg-red-500/10 p-3">
                      <Icon className="h-6 w-6 text-red-400" />
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-[var(--color-mas-text)]">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                      {card.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </Section>

        <div className="section-divider" />

        {/* ── 3. Solution ──────────────────────────────────────────────────── */}
        <Section>
          <div className="mx-auto max-w-4xl text-center">
            <motion.div variants={fadeUp} className="mb-8">
              <h2 className="text-gradient font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Daena: Governance-First AI Agent Orchestration
              </h2>
              <p className="mx-auto max-w-3xl text-base leading-relaxed text-[var(--color-mas-text-secondary)]">
                Daena is the AI company operating system where every agent is governed, every decision is
                traced, and every action is auditable. Built on two patent-pending architectures: the
                PhiLattice Architecture for scalable agent topology, and Neural-Backed Memory Fabric (NBMF)
                for persistent, auditable memory across agent lifetimes.
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <a
                href="https://daena.mas-ai.co/pitch-deck.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-mas-cyan)] px-8 py-3 text-sm font-bold text-[var(--color-mas-bg)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_var(--color-mas-cyan-glow)]"
              >
                View Full Pitch Deck
                <ExternalLink className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </Section>

        <div className="section-divider" />

        {/* ── 4. Key Metrics ───────────────────────────────────────────────── */}
        <Section>
          <div className="mx-auto max-w-6xl">
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <h2 className="text-gradient font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Key Metrics
              </h2>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {metricCards.map((card) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={card.label}
                    variants={fadeUp}
                    className="glass rounded-2xl p-8 text-center transition-colors"
                  >
                    <div className="mx-auto mb-4 inline-flex rounded-xl bg-[var(--color-mas-cyan)]/10 p-3">
                      <Icon className="h-6 w-6 text-[var(--color-mas-cyan)]" />
                    </div>
                    <div className="text-3xl font-bold text-neon font-[family-name:var(--font-display)] mb-1">
                      {card.value}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]">
                      {card.label}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </Section>

        <div className="section-divider" />

        {/* ── 5. Investment Materials ───────────────────────────────────────── */}
        <Section>
          <div className="mx-auto max-w-3xl">
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <h2 className="text-gradient font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Investment Materials
              </h2>
            </motion.div>

            <motion.a
              variants={fadeUp}
              href="https://daena.mas-ai.co/pitch-deck.html"
              target="_blank"
              rel="noopener noreferrer"
              className="glass group flex items-center justify-between rounded-2xl p-8 transition-all duration-300 hover:border-[var(--color-mas-cyan)]/30"
            >
              <div>
                <h3 className="text-lg font-bold text-[var(--color-mas-text)] mb-1">
                  Daena Pitch Deck
                </h3>
                <p className="text-sm text-[var(--color-mas-text-secondary)]">
                  Full product vision, market analysis, architecture overview, and go-to-market strategy.
                </p>
              </div>
              <ExternalLink className="h-5 w-5 shrink-0 text-[var(--color-mas-text-muted)] transition-colors group-hover:text-[var(--color-mas-cyan)]" />
            </motion.a>
          </div>
        </Section>

        <div className="section-divider" />

        {/* ── 6. Roadmap ───────────────────────────────────────────────────── */}
        <Section>
          <div className="mx-auto max-w-4xl">
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <h2 className="text-gradient font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Roadmap
              </h2>
            </motion.div>

            <div className="relative">
              {/* Vertical timeline line */}
              <div
                aria-hidden
                className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-mas-cyan)]/40 via-[var(--color-mas-cyan)]/20 to-transparent md:left-1/2 md:-translate-x-px"
              />

              <div className="flex flex-col gap-12">
                {roadmapItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.period}
                      variants={fadeUp}
                      className={`relative flex items-start gap-6 md:gap-12 ${
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-6 top-2 z-10 -translate-x-1/2 md:left-1/2">
                        <div className="h-3 w-3 rounded-full border-2 border-[var(--color-mas-cyan)] bg-[var(--color-mas-bg)]" />
                      </div>

                      {/* Card */}
                      <div className={`ml-12 glass rounded-2xl p-6 md:ml-0 md:w-[calc(50%-2rem)] ${
                        index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                      }`}>
                        <div className={`mb-3 flex items-center gap-2 ${
                          index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                        }`}>
                          <Calendar className="h-4 w-4 text-[var(--color-mas-cyan)]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-mas-cyan)] font-[family-name:var(--font-mono)]">
                            {item.period}
                          </span>
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-[var(--color-mas-text)]">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                          {item.description}
                        </p>
                      </div>

                      {/* Spacer for alternating layout */}
                      <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </Section>

        <div className="section-divider" />

        {/* ── 7. Founder ───────────────────────────────────────────────────── */}
        <Section>
          <div className="mx-auto max-w-2xl text-center">
            <motion.div variants={fadeUp} className="mb-10">
              <h2 className="text-gradient font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Founder
              </h2>
            </motion.div>

            <motion.div variants={fadeUp}>
              {/* Founder photo */}
              <div className="relative mx-auto mb-6 h-24 w-24">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/30 to-transparent blur-xl" />
                <Image
                  src="/assets/img/masoud.jpg"
                  alt="Masoud Masoori, Founder and CEO of MAS-AI Technologies"
                  width={96}
                  height={96}
                  className="relative z-10 h-24 w-24 rounded-full border-2 border-[var(--color-mas-gold)]/30 object-cover shadow-[0_0_20px_var(--color-mas-gold-glow)]"
                />
              </div>

              {/* Name and title */}
              <h3 className="text-xl font-bold text-[var(--color-mas-text)]">
                Masoud Masoori
              </h3>
              <p className="mt-1 text-sm font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
                Founder and CEO
              </p>

              {/* Bio */}
              <p className="mt-5 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                Solo technical founder and senior AI/ML architect. Immigrated to Canada, rebuilt from
                zero, and built MAS-AI into a governance-first AI company with two patent-pending
                architectures. Based in Ontario, Canada.
              </p>
            </motion.div>
          </div>
        </Section>

        <div className="section-divider" />

        {/* ── 8. Contact ───────────────────────────────────────────────────── */}
        <Section>
          <div className="mx-auto max-w-2xl text-center">
            <motion.div variants={fadeUp} className="mb-10">
              <h2 className="text-gradient font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Get in Touch
              </h2>
              <p className="mt-4 text-[var(--color-mas-text-secondary)]">
                Interested in learning more about MAS-AI? Reach out directly.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
              <a
                href="mailto:masoud.masoori@mas-ai.co"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mas-border)] px-6 py-3 text-sm font-medium text-[var(--color-mas-text)] transition-all duration-300 hover:border-[var(--color-mas-cyan)] hover:text-[var(--color-mas-cyan)] hover:shadow-[0_0_20px_var(--color-mas-border-glow)]"
              >
                <Mail className="h-4 w-4" />
                masoud.masoori@mas-ai.co
              </a>
              <a
                href="https://www.linkedin.com/in/masoud-masoori"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-mas-border)] px-6 py-3 text-sm font-medium text-[var(--color-mas-text)] transition-all duration-300 hover:border-[var(--color-mas-cyan)] hover:text-[var(--color-mas-cyan)] hover:shadow-[0_0_20px_var(--color-mas-border-glow)]"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </motion.div>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-mas-border)] px-6 py-12">
        <div className="mx-auto max-w-6xl text-center text-xs text-[var(--color-mas-text-muted)]">
          <p>2026 MAS-AI Technologies Inc. All rights reserved.</p>
          <p className="mt-2">Patent-pending: PhiLattice Architecture + NBMF</p>
        </div>
      </footer>
    </>
  )
}
