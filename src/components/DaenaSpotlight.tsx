'use client'

import { useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useInView,
  animate,
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// --- Animated counter -------------------------------------------------------

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
    const controls = animate(motionVal, target, {
      duration,
      ease: [0, 0, 0.2, 1] as [number, number, number, number],
    })
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
        className="text-3xl font-bold text-[var(--color-mas-cyan)] font-[family-name:var(--font-display)]"
      >
        0{suffix}
      </span>
      <span className="text-sm text-[var(--color-mas-text-muted)]">{label}</span>
    </div>
  )
}

// --- Variants ---------------------------------------------------------------

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

// --- Component --------------------------------------------------------------

export default function DaenaSpotlight() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          ref={ref}
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="glow-border rounded-2xl bg-[rgba(15,22,41,0.2)] backdrop-blur-[8px] p-10 md:p-14"
        >
          {/* Badge */}
          <span className="mb-6 inline-block rounded-full border border-[var(--color-mas-gold)]/20 bg-[var(--color-mas-gold)]/10 px-3 py-1 text-xs uppercase tracking-wider text-[var(--color-mas-gold)]">
            FLAGSHIP PLATFORM
          </span>

          {/* Heading */}
          <h2 className="mb-6 text-4xl font-bold font-[family-name:var(--font-display)] md:text-5xl">
            Meet <span className="text-shimmer">Daena</span>
          </h2>

          {/* Description */}
          <p className="mb-10 max-w-3xl text-base leading-relaxed text-[var(--color-mas-text-secondary)] md:text-lg">
            Daena is our governance-first AI agent orchestration platform. It coordinates
            multiple AI agents with built-in policy enforcement, auditable memory, and
            traceable decisions across every step. Two patent-pending architectures.
            300+ automated tests passing.
          </p>

          {/* Stats */}
          <div className="mb-10 flex items-center justify-start gap-8 md:gap-12">
            <AnimatedCounter target={300} suffix="+" label="Tests" />
            <div className="h-10 w-px bg-[var(--color-mas-border)]" />
            <AnimatedCounter target={2} label="Patents Pending" />
            <div className="h-10 w-px bg-[var(--color-mas-border)]" />
            <AnimatedCounter target={10} label="Stage Pipeline" />
          </div>

          {/* CTA */}
          <a
            href="https://daena.mas-ai.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-mas-cyan)] px-8 py-3 text-sm font-semibold text-[var(--color-mas-bg)] transition-shadow hover:shadow-[0_0_24px_var(--color-mas-cyan-glow)]"
          >
            Explore Daena
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
