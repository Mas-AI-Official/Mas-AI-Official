'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { DAENA_STATS } from '@/constants/daena-stats'

gsap.registerPlugin(ScrollTrigger)

function AnimatedCounter({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          animate(count, target, { duration, ease: [0.25, 0.46, 0.45, 0.94] })
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(ref.current)
    const unsub = rounded.on('change', (v) => setDisplay(String(v)))
    return () => { observer.disconnect(); unsub() }
  }, [count, rounded, target, duration])

  return <span ref={ref}>{display}{suffix}</span>
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const ctx = gsap.context(() => {
      const words = wordsRef.current.filter(Boolean)
      gsap.set(words, { opacity: 0, y: 30, filter: 'blur(12px)' })

      gsap.to(words, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.7,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3,
      })

      gsap.from('.hero-cta', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.3 + words.length * 0.2 + 0.2,
      })
      gsap.from('.hero-stats', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.3 + words.length * 0.2 + 0.4,
      })

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=150%',
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const p = self.progress
          const scale = 1 - p * 0.15
          const blur = p * 20
          const opacity = 1 - p * 1.2
          gsap.set(content, {
            scale,
            filter: `blur(${blur}px)`,
            opacity: Math.max(0, opacity),
          })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const headline = 'Governed AI Agents for the Enterprise'
  const headlineWords = headline.split(' ')

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full opacity-25 blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, var(--color-mas-cyan) 0%, transparent 70%)',
        }}
      />

      <div ref={contentRef} className="relative mx-auto max-w-5xl text-center">
        {/* Pre-launch badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-mas-gold)]/30 bg-[var(--color-mas-gold)]/10 px-4 py-1.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-mas-gold)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-mas-gold)]" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-mas-gold)] font-[family-name:var(--font-mono)]">
            Early Access Now Open
          </span>
        </motion.div>

        {/* Company tag */}
        <p
          ref={(el) => { wordsRef.current[0] = el }}
          className="mb-6 text-xs uppercase tracking-[0.25em] text-[var(--color-mas-cyan)] font-[family-name:var(--font-mono)]"
        >
          MAS-AI Technologies Inc.
        </p>

        {/* Headline with per-word animation */}
        <h1 className="mb-8 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {headlineWords.map((word, i) => (
            <span
              key={i}
              ref={(el) => { wordsRef.current[i + 1] = el }}
              className={`inline-block mr-[0.3em] ${word === 'Governed' ? 'text-shimmer' : 'text-gradient'}`}
              style={{ willChange: 'transform, opacity, filter' }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subheadline */}
        <p
          ref={(el) => { wordsRef.current[headlineWords.length + 1] = el }}
          className="mx-auto mb-10 max-w-3xl text-lg text-[var(--color-mas-text-secondary)] sm:text-xl md:text-2xl leading-relaxed"
        >
          Daena orchestrates {DAENA_STATS.agentCapabilities} AI agents across {DAENA_STATS.departments} departments with built-in governance,
          auditable memory, and traceable decisions. {DAENA_STATS.patentsFiled} USPTO patents filed. {DAENA_STATS.testsPassing.toLocaleString()} tests passing. Free to start.
        </p>

        {/* CTAs */}
        <div className="hero-cta flex flex-col items-center justify-center gap-4 sm:flex-row mb-16">
          <a
            href="https://daena.mas-ai.co"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="cta"
            className="btn-ripple group relative inline-flex items-center justify-center rounded-full bg-[var(--color-mas-cyan)] px-10 py-4 text-base font-bold text-[var(--color-mas-bg)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_var(--color-mas-cyan-glow)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>
          <a
            href="#early-access"
            data-cursor="cta"
            className="btn-ripple group inline-flex items-center justify-center rounded-full border border-[var(--color-mas-gold)]/30 bg-[var(--color-mas-gold)]/5 px-10 py-4 text-base font-semibold text-[var(--color-mas-gold)] transition-all duration-300 hover:border-[var(--color-mas-gold)]/50 hover:bg-[var(--color-mas-gold)]/10 hover:shadow-[0_0_20px_var(--color-mas-gold-glow)]"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Talk to Us
            </span>
          </a>
        </div>

        {/* Stats strip with animated counters */}
        <div className="hero-stats flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { target: DAENA_STATS.testsPassing, suffix: '', label: 'Tests Passing' },
            { target: DAENA_STATS.agentCapabilities, suffix: '', label: 'AI Agents' },
            { target: DAENA_STATS.patentsFiled, suffix: '', label: 'USPTO Patents Filed' },
            { target: DAENA_STATS.aiProviders, suffix: '', label: 'AI Providers' },
          ].map((s) => (
            <motion.div
              key={s.label}
              className="text-center group cursor-default"
              whileHover={{ scale: 1.08, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <div className="text-3xl font-bold text-neon font-[family-name:var(--font-display)] md:text-4xl transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(0,200,255,0.6)]">
                <AnimatedCounter target={s.target} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)] transition-colors duration-300 group-hover:text-[var(--color-mas-cyan)]">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll indicator with pulse */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-mas-text-muted)]">
          Scroll
        </span>
        <div className="h-8 w-px bg-gradient-to-b from-[var(--color-mas-cyan)] to-transparent" />
      </motion.div>
    </section>
  )
}
