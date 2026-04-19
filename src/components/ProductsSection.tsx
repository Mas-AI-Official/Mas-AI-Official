'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Network, ShieldAlert, ArrowRight } from 'lucide-react'

// Daena is the PLATFORM. Klyntar is Daena's SECURITY LAYER.
// This section shows the two capabilities side-by-side, but the framing is:
// "one platform (Daena), with security baked in (Klyntar)."

interface Pillar {
  label: string
  value: string
}

interface Face {
  id: 'core' | 'security'
  eyebrow: string
  name: string
  tagline: string
  description: string
  pillars: Pillar[]
  cta: { label: string; href: string }
  icon: typeof Network
  accent: 'cyan' | 'red'
}

const faces: Face[] = [
  {
    id: 'core',
    eyebrow: 'The Platform',
    name: 'Daena',
    tagline: 'Governed AI. Any runtime.',
    description:
      '10 departments, 60 agent capabilities, a 10-stage auditable pipeline. Runs Claude, Codex, Gemini, Grok, or Ollama, governed end-to-end with patent-pending PhiLattice topology and Neural-Backed Memory Fabric.',
    pillars: [
      { label: 'Departments', value: '10' },
      { label: 'Agent Capabilities', value: '60' },
      { label: 'Pipeline Stages', value: '10' },
      { label: 'Memory Tiers', value: '5' },
    ],
    cta: { label: 'Explore Daena', href: 'https://daena.mas-ai.co' },
    icon: Network,
    accent: 'cyan',
  },
  {
    id: 'security',
    eyebrow: "Daena's Security Layer",
    name: 'Klyntar',
    tagline: 'Every deployment, defended.',
    description:
      'Klyntar is the security engine baked into Daena. Honeypot traps, 25+ exploit signatures, anti-scanner detection for 45+ hacking tools. Zero-FP gate drops any finding without a working exploit. The same layer that protects our own production ships to every engagement.',
    pillars: [
      { label: 'Exploit Signatures', value: '25+' },
      { label: 'Scanners Detected', value: '45+' },
      { label: 'Reasoning Stages', value: '20' },
      { label: 'Shield Layers', value: '4' },
    ],
    cta: { label: 'See Security Services', href: '/security' },
    icon: ShieldAlert,
    accent: 'red',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
}

const panelVariants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export default function ProductsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative py-20 md:py-28">
      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            How We Work
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="text-white">One platform. </span>
            <span className="text-gradient">Governance</span>
            <span className="text-white"> and </span>
            <span className="text-gradient-red">security</span>
            <span className="text-white"> built in.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            We built <strong className="text-white">Daena</strong> to run our own AI safely.
            {' '}<strong className="text-white">Klyntar</strong> is the security layer inside it.
            We install this same stack at your company, or we use it to audit
            the stack <strong className="text-white">you already run</strong>.
          </p>
        </div>

        {/* Side-by-side panels */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-0"
        >
          <FacePanel face={faces[0]} />
          <div
            className="product-divider-vert hidden lg:block mx-6 self-stretch"
            aria-hidden
          />
          <FacePanel face={faces[1]} />
        </motion.div>

        {/* Unifying bottom strip */}
        <div className="mt-12 rounded-2xl border border-[var(--color-mas-border)] bg-[rgba(15,22,41,0.3)] backdrop-blur-md px-6 py-5 text-center">
          <p className="text-sm text-[var(--color-mas-text-secondary)]">
            <span className="font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">Shared kernel:</span>{' '}
            <strong className="text-white">Shield always on</strong>
            {' · '}
            <strong className="text-white">SecurityGate</strong>
            {' · '}
            audit trail that never blocks execution
            {' · '}
            bring-your-own runtime
            {' · '}
            <strong className="text-white">zero telemetry by default</strong>
          </p>
        </div>
      </div>
    </section>
  )
}

// --- Panel ---

function FacePanel({ face }: { face: Face }) {
  const Icon = face.icon
  const isCyan = face.accent === 'cyan'
  const accentVar = isCyan ? 'var(--color-mas-cyan)' : 'var(--color-klyntar-red)'
  const accentGlow = isCyan ? 'var(--color-mas-cyan-glow)' : 'var(--color-klyntar-red-glow)'
  const gridClass = isCyan ? 'enterprise-grid-bg' : 'klyntar-grid-bg'
  const gradientClass = isCyan ? 'text-gradient' : 'text-gradient-red'
  const neonClass = isCyan ? 'text-neon' : 'text-neon-red'

  return (
    <motion.div
      variants={panelVariants}
      className="group relative overflow-hidden rounded-2xl border border-[var(--color-mas-border)] bg-[rgba(15,22,41,0.35)] backdrop-blur-md p-8 md:p-10 transition-all duration-500 hover:-translate-y-1"
      style={{
        boxShadow: `0 0 0 1px transparent, 0 20px 60px rgba(0,0,0,0.5)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accentVar
        e.currentTarget.style.boxShadow = `0 0 0 1px ${accentVar}, 0 20px 60px ${accentGlow}`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-mas-border)'
        e.currentTarget.style.boxShadow = `0 0 0 1px transparent, 0 20px 60px rgba(0,0,0,0.5)`
      }}
    >
      <div className={`${gridClass} absolute inset-0 pointer-events-none opacity-40`} aria-hidden />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${accentGlow}, transparent)`,
              border: `1px solid ${accentVar}`,
            }}
          >
            <Icon size={20} style={{ color: accentVar }} />
          </div>
          <p className="text-[11px] uppercase tracking-[0.25em] font-[family-name:var(--font-mono)]"
             style={{ color: accentVar }}>
            {face.eyebrow}
          </p>
        </div>

        <h3 className={`${gradientClass} mb-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold tracking-tight`}>
          {face.name}
        </h3>

        <p className="mb-5 text-lg md:text-xl text-[var(--color-mas-text)] font-medium">
          {face.tagline}
        </p>

        <p className="mb-8 text-sm md:text-base leading-relaxed text-[var(--color-mas-text-secondary)]">
          {face.description}
        </p>

        <div className="mb-8 grid grid-cols-2 gap-4 md:gap-6">
          {face.pillars.map((pill) => (
            <div key={pill.label}>
              <div className={`${neonClass} font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold`}>
                {pill.value}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]">
                {pill.label}
              </div>
            </div>
          ))}
        </div>

        <a
          href={face.cta.href}
          target={face.cta.href.startsWith('http') ? '_blank' : undefined}
          rel={face.cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          data-cursor="cta"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 hover:scale-[1.03]"
          style={{
            background: accentVar,
            color: isCyan ? 'var(--color-mas-bg)' : 'white',
            boxShadow: `0 0 24px ${accentGlow}`,
          }}
        >
          {face.cta.label}
          <ArrowRight size={16} />
        </a>
      </div>
    </motion.div>
  )
}
