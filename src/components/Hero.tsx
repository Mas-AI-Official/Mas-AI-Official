'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
      // Entrance: staggered word reveal with blur
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

      // CTA and stats fade in after text
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

      // Pin hero and blur/scale on exit
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

  const headline = 'Building the Infrastructure for Governed AI'
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
          We build AI systems that enterprises can actually trust. Governed
          agents, auditable decisions, and scalable intelligence.
        </p>

        {/* CTAs */}
        <div className="hero-cta flex flex-col items-center justify-center gap-4 sm:flex-row mb-16">
          <a
            href="https://daena.mas-ai.co"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="cta"
            className="group relative inline-flex items-center justify-center rounded-full bg-[var(--color-mas-cyan)] px-10 py-4 text-base font-bold text-[var(--color-mas-bg)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_var(--color-mas-cyan-glow)]"
          >
            <span className="relative z-10">Explore Daena</span>
          </a>
          <a
            href="#portfolio"
            data-cursor="cta"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-mas-border)] px-10 py-4 text-base font-semibold text-[var(--color-mas-text)] transition-all duration-300 hover:border-[var(--color-mas-cyan)] hover:text-[var(--color-mas-cyan)] hover:shadow-[0_0_20px_var(--color-mas-border-glow)]"
          >
            View Portfolio
          </a>
        </div>

        {/* Stats strip */}
        <div className="hero-stats flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { value: '300+', label: 'Tests Passing' },
            { value: '10', label: 'Pipeline Stages' },
            { value: '2', label: 'Patents Pending' },
            { value: '6/6', label: 'E2E Tests' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-neon font-[family-name:var(--font-display)] md:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-mas-text-muted)]">
          Scroll
        </span>
        <div className="h-8 w-px bg-gradient-to-b from-[var(--color-mas-cyan)] to-transparent" />
      </div>
    </section>
  )
}
