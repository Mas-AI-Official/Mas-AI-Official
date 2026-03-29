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
  accentColor?: string
}

function AnimatedCounter({ target, suffix = '', label, duration = 2, accentColor = 'var(--color-mas-cyan)' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, (v) => Math.round(v))
  const isInView = useInView(ref, { once: false, margin: '-40px' })

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
    <motion.div
      className="flex flex-col items-center gap-1 group/stat cursor-default"
      whileHover={{ scale: 1.08, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
    >
      <span
        ref={ref}
        className="text-3xl font-bold font-[family-name:var(--font-display)] transition-all duration-300 group-hover/stat:drop-shadow-[0_0_12px_var(--color-mas-cyan-glow)]"
        style={{ color: accentColor }}
      >
        0{suffix}
      </span>
      <span className="text-sm text-[var(--color-mas-text-muted)]">{label}</span>
    </motion.div>
  )
}

// --- Variants ---------------------------------------------------------------

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

// --- Component --------------------------------------------------------------

export default function DaenaSpotlight() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          ref={ref}
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="animated-border breathe-glow rounded-2xl bg-[rgba(15,22,41,0.2)] backdrop-blur-[8px] p-10 md:p-14 relative overflow-hidden"
        >
          {/* Ambient background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-mas-cyan)]/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[var(--color-mas-gold)]/[0.03] rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <span className="badge-shimmer relative mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-mas-gold)]/20 bg-[var(--color-mas-gold)]/10 px-3 py-1 text-xs uppercase tracking-wider text-[var(--color-mas-gold)]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
            FLAGSHIP PLATFORM &mdash; NOW AVAILABLE
          </span>

          {/* Heading */}
          <h2 className="mb-6 text-4xl font-bold font-[family-name:var(--font-display)] md:text-5xl">
            Meet <span className="text-shimmer">Daena</span>
          </h2>

          {/* Quote */}
          <p className="mb-8 text-shimmer text-lg md:text-xl font-semibold font-[family-name:var(--font-display)] italic leading-relaxed">
            &ldquo;Intelligence without governance is just a faster way to make mistakes.&rdquo;
          </p>

          {/* Description */}
          <p className="mb-6 max-w-3xl text-base leading-relaxed text-[var(--color-mas-text-secondary)] md:text-lg">
            Daena is the governed AI operating system. 10 departments, 60 agents,
            9 AI providers, all governed by a 10-stage auditable pipeline with
            9 immutable hard laws that cannot be disabled.
            Free to run locally with Ollama. Bring your own runtimes.
          </p>

          {/* Technology cards */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="rounded-lg border border-[var(--color-mas-border)] bg-[rgba(0,0,0,0.2)] p-3">
              <p className="text-xs font-semibold text-[var(--color-mas-gold)] font-[family-name:var(--font-mono)] mb-1">PhiLattice</p>
              <p className="text-xs text-[var(--color-mas-text-muted)] leading-relaxed">Fibonacci-based agent topology</p>
            </div>
            <div className="rounded-lg border border-[var(--color-mas-border)] bg-[rgba(0,0,0,0.2)] p-3">
              <p className="text-xs font-semibold text-[var(--color-mas-cyan)] font-[family-name:var(--font-mono)] mb-1">NBMF Memory</p>
              <p className="text-xs text-[var(--color-mas-text-muted)] leading-relaxed">5-tier, hallucinations auto-expire</p>
            </div>
            <div className="rounded-lg border border-[var(--color-mas-border)] bg-[rgba(0,0,0,0.2)] p-3">
              <p className="text-xs font-semibold text-[#2DD4BF] font-[family-name:var(--font-mono)] mb-1">TLM</p>
              <p className="text-xs text-[var(--color-mas-text-muted)] leading-relaxed">87.5% token savings per session</p>
            </div>
            <div className="rounded-lg border border-[var(--color-mas-border)] bg-[rgba(0,0,0,0.2)] p-3">
              <p className="text-xs font-semibold text-[#a78bfa] font-[family-name:var(--font-mono)] mb-1">eDNA</p>
              <p className="text-xs text-[var(--color-mas-text-muted)] leading-relaxed">Merkle-notarized agent learning</p>
            </div>
            <div className="rounded-lg border border-[var(--color-mas-border)] bg-[rgba(0,0,0,0.2)] p-3">
              <p className="text-xs font-semibold text-[#f59e0b] font-[family-name:var(--font-mono)] mb-1">Dream Engine</p>
              <p className="text-xs text-[var(--color-mas-text-muted)] leading-relaxed">Autonomous memory consolidation</p>
            </div>
            <div className="rounded-lg border border-[var(--color-mas-border)] bg-[rgba(0,0,0,0.2)] p-3">
              <p className="text-xs font-semibold text-[var(--color-mas-text)] font-[family-name:var(--font-mono)] mb-1">Smart Routing</p>
              <p className="text-xs text-[var(--color-mas-text-muted)] leading-relaxed">50-95% cost savings vs single model</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 flex flex-wrap items-center justify-start gap-8 md:gap-12">
            <AnimatedCounter target={1328} suffix="" label="Tests Passing" />
            <div className="h-10 w-px bg-[var(--color-mas-border)]" />
            <AnimatedCounter target={60} label="AI Agents" />
            <div className="h-10 w-px bg-[var(--color-mas-border)]" />
            <AnimatedCounter target={9} label="AI Providers" accentColor="var(--color-mas-gold)" />
            <div className="h-10 w-px bg-[var(--color-mas-border)]" />
            <AnimatedCounter target={2} label="USPTO Patents Filed" accentColor="var(--color-mas-gold)" />
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://daena.mas-ai.co"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ripple group/cta inline-flex items-center gap-2 rounded-full bg-[var(--color-mas-cyan)] px-8 py-3 text-sm font-semibold text-[var(--color-mas-bg)] transition-all duration-300 hover:shadow-[0_0_24px_var(--color-mas-cyan-glow)] hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
              </span>
            </a>
            <span className="text-xs text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]">Free with Ollama &bull; No API keys needed</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
