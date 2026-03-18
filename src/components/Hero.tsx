'use client'

import { useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useInView,
  animate,
} from 'framer-motion'

// --- Animated counter atom ------------------------------------------------

interface CounterProps {
  target: number
  suffix?: string
  label: string
  duration?: number
}

function AnimatedCounter({ target, suffix = '', label, duration = 2 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, (v) => Math.round(v))
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!isInView) return
    const controls = animate(motionVal, target, { duration, ease: [0, 0, 0.2, 1] as [number, number, number, number] })
    return controls.stop
  }, [isInView, motionVal, target, duration])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => {
      if (ref.current) ref.current.textContent = `${v}${suffix}`
    })
    return unsubscribe
  }, [rounded, suffix])

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        ref={ref}
        className="text-4xl font-bold font-display text-mas-cyan"
      >
        0{suffix}
      </span>
      <span className="text-sm text-mas-text-secondary">{label}</span>
    </div>
  )
}

// --- Variants -------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
}

const lineVariants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 20 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

const statContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 1.0 },
  },
}

const statItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

// --- Hero -----------------------------------------------------------------

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 px-6">
      {/* Background glow accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, var(--color-mas-cyan) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Staggered text reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {/* Headline */}
          <motion.h1
            variants={lineVariants}
            className="text-gradient font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Governed AI Agents. Auditable Decisions. Enterprise Trust.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={lineVariants}
            className="mx-auto max-w-3xl text-lg text-mas-text-secondary sm:text-xl md:text-2xl"
          >
            MAS-AI builds Daena, the AI company OS where every agent is
            governed, every decision is traced, and every action is auditable.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={lineVariants}
            className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="https://daena.mas-ai.co"
              className="inline-flex items-center justify-center rounded-lg bg-mas-cyan px-8 py-3 text-base font-semibold text-mas-bg transition-shadow hover:shadow-[0_0_24px_var(--color-mas-cyan-glow)]"
            >
              Explore Daena
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center justify-center rounded-lg border border-mas-border px-8 py-3 text-base font-semibold text-mas-text transition-colors hover:border-mas-cyan hover:text-mas-cyan"
            >
              View Portfolio
            </a>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={statContainerVariants}
          initial="hidden"
          animate="visible"
          className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          <motion.div variants={statItemVariants}>
            <AnimatedCounter target={300} suffix="+" label="Tests Passing" />
          </motion.div>
          <motion.div variants={statItemVariants}>
            <AnimatedCounter target={10} label="Pipeline Stages" />
          </motion.div>
          <motion.div variants={statItemVariants}>
            <AnimatedCounter target={2} label="Patents Pending" />
          </motion.div>
          <motion.div variants={statItemVariants}>
            <AnimatedCounter target={6} suffix="/6" label="E2E Tests" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
