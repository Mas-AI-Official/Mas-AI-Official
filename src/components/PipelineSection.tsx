'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// --- Data -----------------------------------------------------------------

interface Stage {
  number: string
  name: string
  description: string
}

const stages: Stage[] = [
  {
    number: '01',
    name: 'SecurityGate',
    description:
      'Prompt injection detection, input sanitization, threat assessment',
  },
  {
    number: '02',
    name: 'InputValidator',
    description:
      'Schema validation, type checking, constraint enforcement',
  },
  {
    number: '03',
    name: 'GovernanceEngine',
    description:
      'Policy enforcement, ABAC permissions, compliance checks',
  },
  {
    number: '04',
    name: 'ContextBuilder',
    description:
      'NBMF memory retrieval, context assembly, knowledge grounding',
  },
  {
    number: '05',
    name: 'ReasoningCore',
    description:
      'Standard, Council, or Quintessence reasoning modes',
  },
  {
    number: '06',
    name: 'ActionPlanner',
    description:
      'CMD (chat/plan) vs EXE (execute/act) mode selection',
  },
  {
    number: '07',
    name: 'OutputValidator',
    description:
      'Response quality checks, hallucination detection, format validation',
  },
  {
    number: '08',
    name: 'ResponseFormatter',
    description:
      'Output structuring, citation attachment, confidence scoring',
  },
  {
    number: '09',
    name: 'FeedbackLoop',
    description:
      'Silent council review, quality scoring, improvement signals',
  },
  {
    number: '10',
    name: 'AuditLog',
    description:
      'Full decision trace, lineage recording, compliance evidence',
  },
]

// --- Variants -------------------------------------------------------------

const stageVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0, 0, 0.2, 1] as [number, number, number, number],
      delay: i * 0.06,
    },
  }),
}

const connectorVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: (i: number) => ({
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0, 0, 0.2, 1] as [number, number, number, number],
      delay: i * 0.06 + 0.25,
    },
  }),
}

const connectorVerticalVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: (i: number) => ({
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0, 0, 0.2, 1] as [number, number, number, number],
      delay: i * 0.06 + 0.25,
    },
  }),
}

// --- Sub-components -------------------------------------------------------

function StageCard({ stage, index }: { stage: Stage; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={stageVariants}
      className="glass group flex w-[140px] shrink-0 flex-col rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-mas-cyan/40 hover:shadow-[0_0_16px_var(--color-mas-cyan-glow)]"
    >
      <span className="mb-2 font-mono text-2xl font-bold text-mas-cyan">
        {stage.number}
      </span>
      <h3 className="mb-1.5 font-display text-sm font-semibold text-mas-text">
        {stage.name}
      </h3>
      <p className="text-[11px] leading-snug text-mas-text-muted">
        {stage.description}
      </p>
    </motion.div>
  )
}

function HorizontalConnector({ index }: { index: number }) {
  return (
    <motion.div
      custom={index}
      variants={connectorVariants}
      className="hidden w-6 shrink-0 origin-left self-center md:block"
    >
      <div
        className="h-[2px] w-full rounded-full"
        style={{
          background:
            'linear-gradient(90deg, var(--color-mas-cyan), var(--color-mas-cyan-glow))',
        }}
      />
    </motion.div>
  )
}

function VerticalConnector({ index }: { index: number }) {
  return (
    <motion.div
      custom={index}
      variants={connectorVerticalVariants}
      className="flex origin-top justify-center md:hidden"
    >
      <div
        className="h-6 w-[2px] rounded-full"
        style={{
          background:
            'linear-gradient(180deg, var(--color-mas-cyan), var(--color-mas-cyan-glow))',
        }}
      />
    </motion.div>
  )
}

// --- Main component -------------------------------------------------------

export default function PipelineSection() {
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

      <div ref={ref} className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
          className="mb-4 text-center"
        >
          <span className="mb-3 inline-block font-mono text-sm font-medium tracking-wider text-mas-cyan uppercase">
            10-Stage Governed Pipeline
          </span>
          <h2 className="text-gradient font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Every Action. Every Stage. Governed.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
          className="mx-auto mb-16 max-w-3xl text-center text-base leading-relaxed text-mas-text-muted"
        >
          Each agent request passes through all 10 stages before reaching
          output. This is governance inside the execution layer.
        </motion.p>

        {/* Desktop: horizontal flow with flex-wrap */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="hidden flex-wrap items-start justify-center gap-y-6 md:flex"
        >
          {stages.map((stage, i) => (
            <div key={stage.number} className="flex items-start">
              <StageCard stage={stage} index={i} />
              {i < stages.length - 1 && <HorizontalConnector index={i} />}
            </div>
          ))}
        </motion.div>

        {/* Mobile: vertical stack */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col items-center md:hidden"
        >
          {stages.map((stage, i) => (
            <div key={stage.number} className="flex flex-col items-center">
              {/* On mobile, make cards wider */}
              <motion.div
                custom={i}
                variants={stageVariants}
                className="glass group w-full max-w-xs rounded-xl p-4 transition-all duration-300 hover:border-mas-cyan/40 hover:shadow-[0_0_16px_var(--color-mas-cyan-glow)]"
              >
                <span className="mb-2 inline-block font-mono text-2xl font-bold text-mas-cyan">
                  {stage.number}
                </span>
                <h3 className="mb-1.5 font-display text-sm font-semibold text-mas-text">
                  {stage.name}
                </h3>
                <p className="text-xs leading-snug text-mas-text-muted">
                  {stage.description}
                </p>
              </motion.div>
              {i < stages.length - 1 && <VerticalConnector index={i} />}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
