'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// --- Data -----------------------------------------------------------------

interface Feature {
  title: string
  badge?: string
  description: string
}

const features: Feature[] = [
  {
    title: '10-Stage Governed Pipeline',
    description:
      'Every action passes through SecurityGate, GovernanceEngine, ReasoningCore, AuditLog, and 6 more stages before reaching output.',
  },
  {
    title: 'PhiLattice Architecture',
    badge: 'Patent Pending',
    description:
      'Fibonacci-derived hexagonal topology for scalable multi-agent orchestration with departmental governance boundaries.',
  },
  {
    title: 'NBMF: Auditable Memory',
    badge: 'Patent Pending',
    description:
      'Neural-Backed Memory Fabric gives agents persistent, queryable, auditable memory with full traceability.',
  },
]

// --- Variants -------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

// --- Component ------------------------------------------------------------

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <motion.div
      variants={itemVariants}
      className="glow-border group relative rounded-2xl"
    >
      <div className="glass rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-mas-cyan/40 hover:shadow-[0_0_24px_var(--color-mas-cyan-glow)]">
        {/* Title row with optional badge */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h3 className="font-display text-xl font-semibold text-mas-text">
            {feature.title}
          </h3>
          {feature.badge && (
            <span className="inline-flex items-center rounded-full border border-mas-gold/40 px-3 py-0.5 text-xs font-medium text-mas-gold">
              {feature.badge}
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-mas-text-muted">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

export default function SolutionSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      {/* Subtle background gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, var(--color-mas-bg) 0%, var(--color-mas-bg-light) 50%, var(--color-mas-bg) 100%)',
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
          className="mb-6 text-center"
        >
          <h2 className="text-gradient font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Meet Daena
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
          className="mb-6 text-center font-display text-lg font-medium text-mas-text-secondary sm:text-xl"
        >
          The AI Company OS with Governance Built In
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
          className="mx-auto mb-16 max-w-3xl text-center text-base leading-relaxed text-mas-text-muted"
        >
          Daena is a governance-first AI agent orchestration platform developed
          by MAS-AI Technologies Inc. Unlike AI governance monitoring tools that
          observe existing AI systems, Daena embeds governance directly into the
          agent execution layer through a 10-stage pipeline. Every agent action
          is governed, every decision is traced, every action is auditable.
        </motion.p>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
          className="mt-14 text-center"
        >
          <a
            href="https://daena.mas-ai.co"
            className="inline-flex items-center justify-center rounded-lg bg-mas-cyan px-8 py-3 text-base font-semibold text-mas-bg transition-shadow hover:shadow-[0_0_24px_var(--color-mas-cyan-glow)]"
          >
            Explore Daena Platform
          </a>
        </motion.div>
      </div>
    </section>
  )
}
