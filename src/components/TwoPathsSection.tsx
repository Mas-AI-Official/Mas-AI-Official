'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Rocket, ShieldAlert, ArrowRight, Sparkles, Clock, CheckCircle2 } from 'lucide-react'

// The two-path decision. Short and punchy. One tile, one action.
// Hormozi rule: every word earns its place. Strong verbs, concrete outcomes,
// bold on the phrase the reader's eye lands on.

interface Path {
  id: 'build' | 'secure'
  accent: 'cyan' | 'red'
  icon: typeof Rocket
  eyebrow: string
  title: string
  titleBoldPart: string
  titleAfter: string
  question: string
  forWho: string
  benefits: string[]
  cadence: string
  cta: { label: string; href: string }
}

const paths: Path[] = [
  {
    id: 'build',
    accent: 'cyan',
    icon: Rocket,
    eyebrow: 'Path 01',
    title: 'You want to ',
    titleBoldPart: 'automate',
    titleAfter: ' your business.',
    question:
      'You run a team. They waste hours on repetitive work. You want AI doing the boring parts. You need it installed right, governed, and not going rogue.',
    forWho:
      'We install custom agents, voice assistants, Claude Code, OpenClaw, whatever fits. Every one ships wrapped in audit trails. Every action logs. Every risky tool call hits approval before it fires.',
    benefits: [
      'Installed in 21 days, fixed price, source code yours',
      'Governed by Daena, your policy, your enforcement',
      'Integrates with your existing stack, no rip-and-replace',
      'Free 45-min install audit before you commit a dollar',
    ],
    cadence: '21 days from signature',
    cta: { label: 'Book Free Install Audit', href: '/automation#contact-automation' },
  },
  {
    id: 'secure',
    accent: 'red',
    icon: ShieldAlert,
    eyebrow: 'Path 02',
    title: 'You want to ',
    titleBoldPart: 'find the holes',
    titleAfter: ' before attackers do.',
    question:
      'Your site is live. Your app is live. Your AI is live. Your last security check was a scanner dump. Someone else gets hacked in the news every week. You want a real look.',
    forWho:
      'We scan your websites, APIs, mobile apps, and cloud surface with Klyntar, our security layer inside Daena. Frontier-level discovery. Every finding comes with a working exploit or it does not make the report.',
    benefits: [
      'Free 2-hour recon, top 3 findings in 48 hours',
      'Zero-FP gate, no false alarms, no noise',
      'Proof-of-exploit on every operator-tier finding',
      'Works on your stack, cloud, code, whatever you run',
    ],
    cadence: 'Free recon in 48h, full audit in 5 days',
    cta: { label: 'Book Free Security Scan', href: '/security#contact-consulting' },
  },
]

const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

// pointerEvents is included so that until the tiles are visible they
// don't accept clicks. Without it, links inside an opacity-0 motion.div
// stay clickable — the user reported a phantom /book click target in
// the empty space below the navbar.
const tileV = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)', pointerEvents: 'none' as const },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    pointerEvents: 'auto' as const,
    transition: { duration: 0.7, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export default function TwoPathsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="paths" className="relative overflow-hidden py-20 md:py-28">
      {/* Ambient dual glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/4 h-[500px] w-[500px] max-w-[80vw] rounded-full opacity-10 blur-[150px]"
        style={{ background: 'var(--color-mas-cyan)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-1/4 h-[500px] w-[500px] max-w-[80vw] rounded-full opacity-10 blur-[150px]"
        style={{ background: 'var(--color-klyntar-red)' }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            Two Paths. Pick Yours.
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="text-white">Which one </span>
            <span className="text-gradient">sounds like you?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            Both start <strong className="text-white">free</strong>.
            Both end with <strong className="text-white">working software you own</strong>.
            Don&apos;t know which one? Scroll past the tiles, we&apos;ll help you decide.
          </p>
        </div>

        {/* Path tiles */}
        <motion.div
          ref={ref}
          variants={containerV}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {paths.map((p) => (
            <PathTile key={p.id} path={p} />
          ))}
        </motion.div>

        {/* Third option: Not sure, book free call.
            pointerEvents is animated so the wrapper isn't clickable until
            it's visible — prevents the inner /book link from being a
            phantom click target while the user is still above this
            section. */}
        <motion.div
          initial={{ opacity: 0, y: 20, pointerEvents: 'none' }}
          whileInView={{ opacity: 1, y: 0, pointerEvents: 'auto' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 rounded-2xl border border-[var(--color-mas-border)] bg-[rgba(15,22,41,0.4)] backdrop-blur-md p-8 text-center"
        >
          <p className="mb-1 text-xs uppercase tracking-[0.25em] font-[family-name:var(--font-mono)] text-[var(--color-mas-gold)]">
            Not sure which
          </p>
          <h3 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold text-white md:text-2xl">
            Talk to us. <span className="text-gradient-gold">Free 30 minutes.</span>
          </h3>
          <p className="mx-auto mb-6 max-w-2xl text-sm text-[var(--color-mas-text-secondary)]">
            No pitch deck. No commitment. Thirty minutes where we listen, map
            what you have, and tell you <strong className="text-white">the fastest path to a result</strong>.
            If neither fits, we say so and point you somewhere that does.
          </p>
          <a
            href="/book"
            data-cursor="cta"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold transition-all duration-300 hover:scale-105"
            style={{
              background: 'var(--color-mas-gold)',
              color: 'var(--color-mas-bg)',
              boxShadow: '0 0 24px var(--color-mas-gold-glow)',
            }}
          >
            Book Free 30-Min Call
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// --- Tile ---

function PathTile({ path }: { path: Path }) {
  const Icon = path.icon
  const [hovered, setHovered] = useState(false)
  const isCyan = path.accent === 'cyan'
  const accentVar = isCyan ? 'var(--color-mas-cyan)' : 'var(--color-klyntar-red)'
  const accentGlow = isCyan ? 'var(--color-mas-cyan-glow)' : 'var(--color-klyntar-red-glow)'
  const gradientClass = isCyan ? 'text-gradient' : 'text-gradient-red'
  const gridClass = isCyan ? 'enterprise-grid-bg' : 'klyntar-grid-bg'

  return (
    <motion.div
      variants={tileV}
      className="group relative overflow-hidden rounded-3xl p-8 md:p-10 transition-all duration-500"
      style={{
        border: `1px solid ${hovered ? accentVar : 'var(--color-mas-border)'}`,
        background: 'rgba(10,14,26,0.55)',
        backdropFilter: 'blur(14px)',
        boxShadow: hovered
          ? `0 0 0 1px ${accentVar}, 0 25px 80px ${accentGlow}`
          : '0 20px 60px rgba(0,0,0,0.4)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`${gridClass} absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-500 group-hover:opacity-60`} aria-hidden />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[400px] rounded-full blur-[80px] transition-opacity duration-500"
        style={{
          background: accentVar,
          opacity: hovered ? 0.18 : 0.08,
        }}
      />

      <div className="relative">
        {/* Icon + eyebrow */}
        <div className="mb-7 flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-500 group-hover:rotate-6"
            style={{
              background: `linear-gradient(135deg, ${accentGlow}, transparent)`,
              border: `1px solid ${accentVar}`,
            }}
          >
            <Icon size={22} style={{ color: accentVar }} />
          </div>
          <p className="text-[11px] uppercase tracking-[0.25em] font-[family-name:var(--font-mono)]" style={{ color: accentVar }}>
            {path.eyebrow}
          </p>
        </div>

        {/* Short punchy title with gradient on the verb */}
        <h3 className="mb-6 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl leading-tight">
          <span className="text-white">{path.title}</span>
          <span className={gradientClass}>{path.titleBoldPart}</span>
          <span className="text-white">{path.titleAfter}</span>
        </h3>

        {/* Question block */}
        <div className="mb-6 rounded-xl border border-[var(--color-mas-border)]/40 bg-[rgba(15,22,41,0.35)] px-5 py-4">
          <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)]">
            <Sparkles size={11} /> For you if
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
            {path.question}
          </p>
        </div>

        {/* What we do */}
        <p className="mb-6 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
          <strong className="text-white">What we do: </strong>
          {path.forWho}
        </p>

        {/* Benefit list */}
        <ul className="mb-8 space-y-2.5">
          {path.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-[var(--color-mas-text)]">
              <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" style={{ color: accentVar }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Cadence + CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-mas-border)]/50 pt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)]">
            <Clock size={13} style={{ color: accentVar }} />
            {path.cadence}
          </div>
          <a
            href={path.cta.href}
            data-cursor="cta"
            className="group/cta inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: accentVar,
              color: isCyan ? 'var(--color-mas-bg)' : 'white',
              boxShadow: `0 0 24px ${accentGlow}`,
            }}
          >
            {path.cta.label}
            <ArrowRight size={15} className="transition-transform group-hover/cta:translate-x-1" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
