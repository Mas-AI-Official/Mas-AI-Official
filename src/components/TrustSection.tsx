'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  CheckCircle,
  Shield,
  TestTube2,
  CheckSquare,
  Cloud,
  Sparkles,
  Mail,
  Linkedin,
  type LucideIcon,
} from 'lucide-react'

// --- Data -----------------------------------------------------------------

interface TrustItem {
  icon: LucideIcon
  metric: string
  label: string
}

const trustItems: TrustItem[] = [
  {
    icon: CheckCircle,
    metric: 'Accepted',
    label: 'Google for Startups Cloud Program',
  },
  {
    icon: Shield,
    metric: 'PhiLattice + NBMF',
    label: 'Two Patent-Pending Architectures',
  },
  {
    icon: TestTube2,
    metric: '300+',
    label: 'Automated Tests Passing',
  },
  {
    icon: CheckSquare,
    metric: '6/6',
    label: 'End-to-End Tests',
  },
  {
    icon: Cloud,
    metric: 'Secured',
    label: 'Azure + GCP Credits',
  },
  {
    icon: Sparkles,
    metric: 'Approved',
    label: 'Perplexity for Startups',
  },
]

// --- Variants -------------------------------------------------------------

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

const founderVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.6, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

// --- Sub-components -------------------------------------------------------

function TrustCard({ item }: { item: TrustItem }) {
  const Icon = item.icon

  return (
    <motion.div
      variants={itemVariants}
      className="glass group rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-mas-cyan/40 hover:shadow-[0_0_20px_var(--color-mas-cyan-glow)]"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-mas-cyan/10">
        <Icon className="h-6 w-6 text-mas-cyan" strokeWidth={1.5} />
      </div>
      <p className="mb-1 font-display text-xl font-bold text-mas-text">
        {item.metric}
      </p>
      <p className="text-sm leading-snug text-mas-text-muted">{item.label}</p>
    </motion.div>
  )
}

// --- Main component -------------------------------------------------------

export default function TrustSection() {
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
          className="mb-14 text-center"
        >
          <h2 className="text-gradient font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Built on Real Engineering
          </h2>
        </motion.div>

        {/* Trust signals grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {trustItems.map((item) => (
            <TrustCard key={item.label} item={item} />
          ))}
        </motion.div>

        {/* Founder section */}
        <motion.div
          variants={founderVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="glass glow-border mx-auto max-w-3xl rounded-2xl p-8 md:p-10"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            {/* Avatar placeholder - initials */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-mas-cyan/10">
              <span className="font-display text-2xl font-bold text-mas-cyan">
                MM
              </span>
            </div>

            <div className="flex-1">
              <h3 className="mb-1 font-display text-xl font-semibold text-mas-text">
                Masoud Masoori
              </h3>
              <p className="mb-4 font-mono text-sm text-mas-cyan">
                Founder & CEO
              </p>
              <p className="mb-6 text-sm leading-relaxed text-mas-text-muted">
                Founder and CEO of MAS-AI Technologies Inc. With a background
                spanning civil engineering, AI/ML, and robotics, building Daena
                as a governance-first AI platform for enterprise deployment.
                Solo technical founder with two patent-pending architectures.
              </p>

              {/* Contact links */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:masoud.masoori@mas-ai.co"
                  className="inline-flex items-center gap-2 rounded-lg border border-mas-border px-4 py-2 text-sm font-medium text-mas-text-secondary transition-colors hover:border-mas-cyan hover:text-mas-cyan"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.5} />
                  Email
                </a>
                <a
                  href="https://www.linkedin.com/in/masoud-masoori"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-mas-border px-4 py-2 text-sm font-medium text-mas-text-secondary transition-colors hover:border-mas-cyan hover:text-mas-cyan"
                >
                  <Linkedin className="h-4 w-4" strokeWidth={1.5} />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
