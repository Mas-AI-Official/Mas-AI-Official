'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Eye, Brain, Search, Layers, type LucideIcon } from 'lucide-react'

// --- Data -----------------------------------------------------------------

interface Problem {
  icon: LucideIcon
  title: string
  description: string
}

const problems: Problem[] = [
  {
    icon: Shield,
    title: 'No Governance',
    description:
      'Decisions happen in black boxes. No policy enforcement, no accountability, no way to explain what happened.',
  },
  {
    icon: Eye,
    title: 'Black-Box Reasoning',
    description:
      'Cannot explain to regulators or stakeholders what happened or why. Compliance becomes impossible.',
  },
  {
    icon: Brain,
    title: 'Fragmented Memory',
    description:
      'Every conversation starts from zero. No learning across sessions. No persistent organizational knowledge.',
  },
  {
    icon: Search,
    title: 'No Traceability',
    description:
      'When something goes wrong, there is no chain of decisions to investigate. No audit trail exists.',
  },
  {
    icon: Layers,
    title: 'No Scalable Control',
    description:
      'Adding more agents means more chaos. No coordination, no conflict resolution, no organizational structure.',
  },
]

// --- Variants -------------------------------------------------------------

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

// --- Component ------------------------------------------------------------

function ProblemCard({ problem }: { problem: Problem }) {
  const Icon = problem.icon

  return (
    <motion.div
      variants={cardVariants}
      className="glass group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-mas-cyan/40 hover:shadow-[0_0_20px_var(--color-mas-cyan-glow)]"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-mas-cyan/10">
        <Icon className="h-6 w-6 text-mas-cyan" strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 font-display text-lg font-semibold text-mas-text">
        {problem.title}
      </h3>
      <p className="text-sm leading-relaxed text-mas-text-muted">
        {problem.description}
      </p>
    </motion.div>
  )
}

export default function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
          className="mb-14 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-mas-text sm:text-4xl md:text-5xl">
            Why AI Agents Fail Without Governance
          </h2>
        </motion.div>

        {/* Problem cards grid */}
        <motion.div
          ref={ref}
          variants={gridVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {problems.map((problem) => (
            <ProblemCard key={problem.title} problem={problem} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
