'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// --- Data -----------------------------------------------------------------

interface ComparisonCard {
  title: string
  description: string
}

const daenaCards: ComparisonCard[] = [
  {
    title: 'Daena: Governance in the execution layer',
    description:
      'Every agent action passes through a 10-stage governed pipeline before it reaches output. Policy enforcement happens at the moment of decision, not after.',
  },
  {
    title: 'Daena: Memory that persists and audits',
    description:
      'NBMF stores every decision, its context, its reasoning, and its outcome across sessions. Agents build institutional knowledge. Auditors can query any decision at any time.',
  },
]

const alternativeCards: ComparisonCard[] = [
  {
    title: 'Monitoring tools: Governance bolted on after',
    description:
      'External tools observe AI systems after decisions are made. They can flag problems but cannot prevent them.',
  },
  {
    title: 'Ad-hoc agents: Memory that disappears',
    description:
      'Each session starts from zero. No shared context across agents, no persistent records, no queryable history.',
  },
]

// --- Variants -------------------------------------------------------------

const columnVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

// --- Sub-components -------------------------------------------------------

function DaenaCard({ card }: { card: ComparisonCard }) {
  return (
    <motion.div
      variants={cardVariants}
      className="glass rounded-2xl border-mas-cyan/30 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-mas-cyan/50 hover:shadow-[0_0_20px_var(--color-mas-cyan-glow)]"
      style={{ borderColor: 'var(--color-mas-cyan-glow)' }}
    >
      <h3 className="mb-3 font-display text-lg font-semibold text-mas-text">
        {card.title}
      </h3>
      <p className="text-sm leading-relaxed text-mas-text-secondary">
        {card.description}
      </p>
    </motion.div>
  )
}

function AlternativeCard({ card }: { card: ComparisonCard }) {
  return (
    <motion.div
      variants={cardVariants}
      className="glass rounded-2xl p-6 opacity-70"
    >
      <h3 className="mb-3 font-display text-lg font-semibold text-mas-text-secondary">
        {card.title}
      </h3>
      <p className="text-sm leading-relaxed text-mas-text-muted">
        {card.description}
      </p>
    </motion.div>
  )
}

// --- Main component -------------------------------------------------------

export default function ComparisonSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative px-6 py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
          className="mb-4 text-center"
        >
          <h2 className="text-gradient font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Governance Inside vs. Governance After
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
          className="mx-auto mb-16 max-w-3xl text-center text-base leading-relaxed text-mas-text-muted"
        >
          Most AI governance tools monitor existing AI systems from the outside.
          Daena by MAS-AI takes a fundamentally different approach.
        </motion.p>

        {/* Two-column contrast */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left: Daena (full opacity, cyan accent) */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-6"
          >
            {/* Column label */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-mas-cyan shadow-[0_0_8px_var(--color-mas-cyan-glow)]" />
              <span className="font-mono text-xs font-medium tracking-wider text-mas-cyan uppercase">
                Built-in governance
              </span>
            </div>
            {daenaCards.map((card) => (
              <DaenaCard key={card.title} card={card} />
            ))}
          </motion.div>

          {/* Right: Alternatives (dimmed) */}
          <motion.div
            variants={columnVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-6"
          >
            {/* Column label */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-mas-text-muted" />
              <span className="font-mono text-xs font-medium tracking-wider text-mas-text-muted uppercase">
                Bolted-on monitoring
              </span>
            </div>
            {alternativeCards.map((card) => (
              <AlternativeCard key={card.title} card={card} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
