'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Network, ShieldAlert, ArrowRight } from 'lucide-react'

// Two portraits, same face, two modes.
// Daena = clean governance portrait. Klyntar = symbiote security mode.
// Visual storytelling: one product, two capabilities, one character.
//
// Image paths (both backgrounds-removed via rembg, saved 2026-04-19):
//   /assets/img/daena-avatar-new.png  (clean portrait, Daena side)
//   /assets/img/klyntar-avatar.png    (half-symbiote, Klyntar security mode)

interface Pillar {
  label: string
  value: string
}

interface Face {
  id: 'daena' | 'klyntar'
  eyebrow: string
  name: string
  tagline: string
  description: string
  pillars: Pillar[]
  cta: { label: string; href: string }
  icon: typeof Network
  accent: 'cyan' | 'red'
  avatarSrc: string
  avatarAlt: string
}

const faces: Face[] = [
  {
    id: 'daena',
    eyebrow: 'The Platform',
    name: 'Daena',
    tagline: 'Governed AI. Any runtime.',
    description:
      '10 departments. 60 agent capabilities. A 10-stage auditable pipeline that runs Claude, Codex, Gemini, Grok, or Ollama, governed end-to-end. Patent-pending PhiLattice topology. Neural-Backed Memory Fabric.',
    pillars: [
      { label: 'Departments', value: '10' },
      { label: 'Agent Capabilities', value: '60' },
      { label: 'Pipeline Stages', value: '10' },
      { label: 'Memory Tiers', value: '5' },
    ],
    cta: { label: 'Explore Daena', href: 'https://daena.mas-ai.co' },
    icon: Network,
    accent: 'cyan',
    avatarSrc: '/assets/img/daena-avatar-new.png',
    avatarAlt: 'Daena, the governed AI platform',
  },
  {
    id: 'klyntar',
    eyebrow: 'Security Mode',
    name: 'Klyntar',
    tagline: 'When Daena defends.',
    description:
      'Klyntar is Daena in security mode. Honeypot traps. 25+ exploit signatures. Anti-scanner detection for 45+ hacking tools. Zero-FP gate drops findings without a working exploit. The same defense layer that protects our own production ships on every engagement.',
    pillars: [
      { label: 'Exploit Signatures', value: '25+' },
      { label: 'Scanners Detected', value: '45+' },
      { label: 'Reasoning Stages', value: '20' },
      { label: 'Shield Layers', value: '4' },
    ],
    cta: { label: 'See Security Services', href: '/security' },
    icon: ShieldAlert,
    accent: 'red',
    avatarSrc: '/assets/img/klyntar-avatar.png',
    avatarAlt: 'Klyntar, Daena in security mode',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
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
            One Character. Two Modes.
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="text-white">Meet </span>
            <span className="text-gradient">Daena</span>
            <span className="text-white">. Meet </span>
            <span className="text-gradient-red">Klyntar</span>
            <span className="text-white">.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            <strong className="text-white">Same platform. Same character.</strong>
            {' '}Daena handles governance and orchestration.
            Klyntar is the <strong className="text-[var(--color-klyntar-red)]">security mode</strong>
            {' '}that activates when there is something to defend.
          </p>
        </div>

        {/* Twin portraits side by side */}
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

        {/* Unifying kernel strip */}
        <div className="mt-12 rounded-2xl border border-[var(--color-mas-border)] bg-[rgba(15,22,41,0.3)] backdrop-blur-md px-6 py-5 text-center">
          <p className="text-sm text-[var(--color-mas-text-secondary)]">
            <span className="font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">Shared kernel:</span>
            {' '}<strong className="text-white">Shield always on</strong>
            {' · '}<strong className="text-white">SecurityGate</strong>
            {' · '}audit trail that never blocks execution
            {' · '}bring-your-own runtime
            {' · '}<strong className="text-white">zero telemetry by default</strong>
          </p>
        </div>
      </div>
    </section>
  )
}

// --- Panel with portrait ---

function FacePanel({ face }: { face: Face }) {
  const Icon = face.icon
  const [hovered, setHovered] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  const isCyan = face.accent === 'cyan'
  const accentVar = isCyan ? 'var(--color-mas-cyan)' : 'var(--color-klyntar-red)'
  const accentGlow = isCyan ? 'var(--color-mas-cyan-glow)' : 'var(--color-klyntar-red-glow)'
  const gridClass = isCyan ? 'enterprise-grid-bg' : 'klyntar-grid-bg'
  const gradientClass = isCyan ? 'text-gradient' : 'text-gradient-red'
  const neonClass = isCyan ? 'text-neon' : 'text-neon-red'

  return (
    <motion.div
      variants={panelVariants}
      className="group relative overflow-hidden rounded-2xl border border-[var(--color-mas-border)] bg-[rgba(15,22,41,0.35)] backdrop-blur-md p-6 md:p-8 transition-all duration-500 hover:-translate-y-1"
      style={{
        boxShadow: `0 0 0 1px transparent, 0 20px 60px rgba(0,0,0,0.5)`,
      }}
      onMouseEnter={(e) => {
        setHovered(true)
        e.currentTarget.style.borderColor = accentVar
        e.currentTarget.style.boxShadow = `0 0 0 1px ${accentVar}, 0 20px 60px ${accentGlow}`
      }}
      onMouseLeave={(e) => {
        setHovered(false)
        e.currentTarget.style.borderColor = 'var(--color-mas-border)'
        e.currentTarget.style.boxShadow = `0 0 0 1px transparent, 0 20px 60px rgba(0,0,0,0.5)`
      }}
    >
      <div className={`${gridClass} absolute inset-0 pointer-events-none opacity-40`} aria-hidden />

      {/* Circular avatar. smaller icon style, accent ring */}
      <div className="relative mb-6 flex justify-center">
        {/* Ambient glow behind portrait */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mx-auto h-56 w-56 md:h-64 md:w-64 rounded-full blur-[40px] transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle, ${accentVar}, transparent 65%)`,
            opacity: hovered ? 0.65 : 0.32,
          }}
        />

        {/* Circular avatar with accent ring + drop shadow */}
        <div
          className="relative h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden transition-transform duration-700 group-hover:scale-[1.06]"
          style={{
            border: `2px solid ${accentVar}`,
            background: 'rgba(10,14,26,0.65)',
            boxShadow: `0 0 0 4px ${accentGlow}, 0 8px 32px ${accentGlow}, inset 0 0 32px rgba(0,0,0,0.3)`,
          }}
        >
          {!imgFailed ? (
            <Image
              src={face.avatarSrc}
              alt={face.avatarAlt}
              fill
              sizes="(min-width: 768px) 192px, 160px"
              className="object-cover object-center"
              onError={() => setImgFailed(true)}
              priority={isCyan}
            />
          ) : (
            <AvatarPlaceholder accent={face.accent} label={face.name} />
          )}
        </div>

        {/* Orbiting accent pulse on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mx-auto h-44 w-44 md:h-52 md:w-52 rounded-full border transition-all duration-700"
          style={{
            borderColor: accentVar,
            opacity: hovered ? 0.25 : 0,
            transform: hovered ? 'scale(1.25)' : 'scale(1)',
          }}
        />
      </div>

      <div className="relative">
        {/* Eyebrow + icon */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${accentGlow}, transparent)`,
              border: `1px solid ${accentVar}`,
            }}
          >
            <Icon size={18} style={{ color: accentVar }} />
          </div>
          <p className="text-[11px] uppercase tracking-[0.25em] font-[family-name:var(--font-mono)]"
             style={{ color: accentVar }}>
            {face.eyebrow}
          </p>
        </div>

        {/* Name */}
        <h3 className={`${gradientClass} mb-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold tracking-tight`}>
          {face.name}
        </h3>

        {/* Tagline */}
        <p className="mb-5 text-lg md:text-xl text-[var(--color-mas-text)] font-medium">
          {face.tagline}
        </p>

        {/* Description */}
        <p className="mb-7 text-sm md:text-base leading-relaxed text-[var(--color-mas-text-secondary)]">
          {face.description}
        </p>

        {/* Pillars */}
        <div className="mb-7 grid grid-cols-2 gap-4">
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

        {/* CTA */}
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

// --- Fallback placeholder shown if the avatar image is missing ---
// Renders a tasteful SVG silhouette with the name, so layout is never broken
// by a missing PNG. Auto-swaps to the real image the moment it exists.

function AvatarPlaceholder({ accent, label }: { accent: 'cyan' | 'red'; label: string }) {
  const color = accent === 'cyan' ? '#00c8ff' : '#ff4060'
  return (
    <svg viewBox="0 0 256 256" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`g-${label}`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="70%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="256" height="256" fill={`url(#g-${label})`} />
      {/* Abstract head silhouette */}
      <circle cx="128" cy="100" r="44" fill={color} fillOpacity="0.3" />
      <path
        d="M48 240 Q 48 160 128 160 Q 208 160 208 240 Z"
        fill={color}
        fillOpacity="0.3"
      />
      <text
        x="128"
        y="210"
        textAnchor="middle"
        fill="#fff"
        fontSize="14"
        fontFamily="monospace"
        fontWeight="700"
        letterSpacing="2"
      >
        {label.toUpperCase()}
      </text>
    </svg>
  )
}
