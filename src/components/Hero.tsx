'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Hero: the three-beat BUILD / GOVERN / SECURE frame.
// Every word is color-coded to signal which sector below it belongs to.
// "build"  = gradient (we build things, primary MAS-AI act)
// "govern" = cyan (Daena territory)
// "secure" = red  (Klyntar territory)
// Mouse-reactive glow turns the whole hero into a "lit scene" that
// follows the cursor. Subtle, never distracting.

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])
  const mouseLightRef = useRef<HTMLDivElement>(null)
  const [counterVisible, setCounterVisible] = useState(false)

  // Kinetic-typography headline tokens
  const headlineWords: { text: string; tone: 'white' | 'gradient' | 'cyan' | 'red' | 'gradient-red' }[] = [
    { text: 'Your', tone: 'white' },
    { text: 'AI', tone: 'gradient' },
    { text: 'moves', tone: 'white' },
    { text: 'fast.', tone: 'gradient' },
    { text: 'Can', tone: 'white' },
    { text: 'you', tone: 'white' },
    { text: 'prove', tone: 'cyan' },
    { text: "it's", tone: 'white' },
    { text: 'safe?', tone: 'gradient-red' },
  ]

  // Entry animation
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // On mobile the GSAP entry tween causes a visible flash-of-invisible-
    // headline on slow phones (SSG paints words visible → useEffect hides
    // them → tween fades them in). We skip the entry choreography below md
    // and on coarse pointers so the static HTML is what the user sees.
    // The pin + blur-on-exit ScrollTrigger is also disabled — pin-spacing
    // on touch breaks native momentum scroll. Mouse-reactive glow is
    // separately gated below.
    const isMobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
    if (prefersReduced || isMobile) {
      setCounterVisible(true)
      return
    }

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
        stagger: 0.14,
        ease: 'power3.out',
        delay: 0.25,
      })
      // Use gsap.set + gsap.to (not gsap.from) so we can also flip
      // pointerEvents — gsap.from doesn't accept arbitrary "from" overrides
      // for non-numeric properties cleanly. While the CTAs are fading in,
      // they're invisible-but-clickable; pointer-events:none prevents
      // accidental clicks during the entry animation.
      gsap.set('.hero-cta', { opacity: 0, y: 20, pointerEvents: 'none' })
      gsap.to('.hero-cta', {
        opacity: 1,
        y: 0,
        pointerEvents: 'auto',
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.25 + words.length * 0.14 + 0.15,
      })
      gsap.set('.hero-stats', { opacity: 0, y: 20 })
      gsap.to('.hero-stats', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.25 + words.length * 0.14 + 0.35,
        onComplete: () => setCounterVisible(true),
      })

      // Pin + blur on exit
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=150%',
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const p = self.progress
          gsap.set(content, {
            scale: 1 - p * 0.15,
            filter: `blur(${p * 20}px)`,
            opacity: Math.max(0, 1 - p * 1.2),
            // Disable clicks once content is meaningfully faded (>40% blurred).
            // Without this, the CTAs stay invisible-but-clickable while pinned,
            // creating phantom click targets in the empty area below the navbar.
            pointerEvents: p > 0.4 ? 'none' : 'auto',
          })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  // Mouse-reactive glow: a soft radial light that follows the cursor
  // inside the hero area. Turns the whole section into a "lit scene."
  // Touch devices have no cursor, so the effect is pure dead weight there.
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
    if (isMobile) return

    const section = sectionRef.current
    const light = mouseLightRef.current
    if (!section || !light) return

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      light.style.setProperty('--mx', `${x}px`)
      light.style.setProperty('--my', `${y}px`)
      light.style.opacity = '1'
    }
    const onLeave = () => {
      light.style.opacity = '0'
    }

    section.addEventListener('mousemove', onMove)
    section.addEventListener('mouseleave', onLeave)
    return () => {
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Mouse-reactive radial glow */}
      <div
        ref={mouseLightRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(0, 200, 255, 0.09), transparent 60%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Dual ambient glows (cyan left, red right) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 -translate-x-1/2 h-[700px] w-[700px] rounded-full opacity-20 blur-[140px]"
        style={{ background: 'radial-gradient(circle, var(--color-mas-cyan) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-3/4 -translate-x-1/2 h-[700px] w-[700px] rounded-full opacity-15 blur-[140px]"
        style={{ background: 'radial-gradient(circle, var(--color-klyntar-red) 0%, transparent 70%)' }}
      />

      <div ref={contentRef} className="relative mx-auto max-w-5xl text-center pt-20 md:pt-24">
        {/* Navbar covers the top, so we lead straight with the headline. No eyebrow. */}

        {/* Three-beat headline */}
        <h1 className="mb-8 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {headlineWords.map((word, i) => {
            const toneClass =
              word.tone === 'cyan'
                ? 'text-gradient'
                : word.tone === 'red'
                ? 'text-gradient-red'
                : word.tone === 'gradient'
                ? 'text-shimmer'
                : word.tone === 'gradient-red'
                ? 'text-gradient-red'
                : 'text-white'
            return (
              <span
                key={i}
                ref={(el) => {
                  wordsRef.current[i + 1] = el
                }}
                className={`inline-block mr-[0.25em] ${toneClass}`}
                style={{ willChange: 'transform, opacity, filter' }}
              >
                {word.text}
              </span>
            )
          })}
        </h1>

        {/* Subheadline, We voice, bold on the power phrases */}
        <p
          ref={(el) => {
            wordsRef.current[headlineWords.length + 1] = el
          }}
          className="mx-auto mb-8 max-w-3xl text-lg text-[var(--color-mas-text-secondary)] sm:text-xl md:text-2xl leading-relaxed"
        >
          We install <strong className="text-[var(--color-mas-cyan)]">AI agents that run your business on autopilot</strong>.
          Every action logged. Every decision auditable.
          Every <strong className="text-[var(--color-klyntar-red)]">hole found before attackers find it</strong>.
          Live in 21 days, and <strong className="text-white">the source code is yours</strong>.
        </p>

        {/* Trust ribbon */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-wider font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)]">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-mas-cyan)]" />
            <strong className="text-[var(--color-mas-text-secondary)]">2 USPTO patents filed</strong>
          </span>
          <span className="text-[var(--color-mas-text-muted)]/50">·</span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-klyntar-red)]" />
            <strong className="text-[var(--color-mas-text-secondary)]">Fixed scope, fixed price</strong>
          </span>
          <span className="text-[var(--color-mas-text-muted)]/50">·</span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-mas-gold)]" />
            <strong className="text-[var(--color-mas-text-secondary)]">Live in 21 days</strong>
          </span>
          <span className="text-[var(--color-mas-text-muted)]/50">·</span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-mas-cyan)]" />
            <strong className="text-[var(--color-mas-text-secondary)]">You own the source code</strong>
          </span>
        </div>

        {/* Triple-CTA: primary free call, secondary free scan, tertiary path explorer */}
        <div className="hero-cta flex flex-col items-center justify-center gap-4 sm:flex-row mb-8">
          <a
            href="/book"
            data-cursor="cta"
            className="group relative inline-flex items-center justify-center gap-2 rounded-full px-10 py-4 text-base font-bold transition-all duration-300 hover:scale-105"
            style={{
              background: 'var(--color-mas-gold)',
              color: 'var(--color-mas-bg)',
              boxShadow: '0 0 32px var(--color-mas-gold-glow)',
            }}
          >
            <span className="relative z-10">Book a Free Call</span>
          </a>
          <a
            href="/security#contact-consulting"
            data-cursor="cta"
            className="group relative inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:scale-105"
            style={{
              // Subtle gradient (lighter top-left to darker bottom-right)
              // pushes the effective bg luminance under the text down enough
              // for white-on-red to satisfy AA contrast, while keeping the
              // brand red as the dominant impression.
              background:
                'linear-gradient(135deg, var(--color-klyntar-red) 0%, #c61b3a 100%)',
              boxShadow: '0 0 20px var(--color-klyntar-red-glow)',
              textShadow: '0 1px 1px rgba(0,0,0,0.35)',
            }}
          >
            <span className="relative z-10">Get a Free Scan</span>
          </a>
          <a
            href="#paths"
            data-cursor="cta"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-mas-border)] px-8 py-4 text-sm font-semibold text-[var(--color-mas-text-secondary)] transition-all duration-300 hover:border-[var(--color-mas-text)] hover:text-[var(--color-mas-text)]"
          >
            Compare Both Paths
          </a>
        </div>

        {/* Named guarantee — the risk reversal, in writing */}
        <p className="mx-auto mb-4 max-w-2xl text-sm text-[var(--color-mas-text-secondary)]">
          If our free 2-hour scan finds nothing worth fixing, we put that in writing
          and <strong className="text-white">you owe us nothing</strong>.
        </p>

        {/* Micro-trust */}
        <p className="mb-14 text-xs text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]">
          30-minute call · Scan results in 48 hours · No credit card · Fixed price, in writing
        </p>

        {/* Animated counter strip */}
        <div className="hero-stats flex flex-wrap justify-center gap-8 md:gap-12">
          {[
            { value: 2, suffix: '', label: 'USPTO Patents', tone: 'cyan' },
            { value: 21, suffix: '', label: 'Days to Live Agents', tone: 'cyan' },
            { value: 48, suffix: 'h', label: 'Scan Turnaround', tone: 'red' },
            { value: 3086, suffix: '', label: 'Tests Passing', tone: 'cyan' },
            { value: 100, suffix: '%', label: 'Source Ownership', tone: 'cyan' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className={`text-3xl font-bold font-[family-name:var(--font-display)] md:text-4xl ${
                  s.tone === 'red' ? 'text-neon-red' : 'text-neon'
                }`}
              >
                <Counter target={s.value} active={counterVisible} />
                {s.suffix}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator. Previously had opacity-40 on the wrapper, which
       * dropped the muted-grey text's contrast to 1.58 (Lighthouse fail).
       * Now the muted color itself carries the dimness (~6:1) and we only
       * dim the gradient line. */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-mas-text-secondary)]">
          Scroll
        </span>
        <div className="h-8 w-px bg-gradient-to-b from-[var(--color-mas-cyan)]/60 to-transparent" />
      </div>
    </section>
  )
}

// Count-up number. Starts once active becomes true.
function Counter({ target, active }: { target: number; active: boolean }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const startAt = performance.now()
    const duration = 1400
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - startAt) / duration)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target])
  return <>{value.toLocaleString()}</>
}
