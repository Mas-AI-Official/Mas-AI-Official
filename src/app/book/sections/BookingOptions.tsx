'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Calendar,
  ShieldAlert,
  Rocket,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

interface Option {
  id: 'consult' | 'scan' | 'audit'
  accent: 'gold' | 'red' | 'cyan'
  icon: typeof Calendar
  eyebrow: string
  title: string
  subtitle: string
  includes: string[]
  duration: string
  whoFor: string
  ctaLabel: string
  ctaHref: string
}

const options: Option[] = [
  {
    id: 'consult',
    accent: 'gold',
    icon: Calendar,
    eyebrow: 'Option A',
    title: 'Free 30-min Consultation',
    subtitle: 'For: "We don\'t know what we need yet."',
    includes: [
      'Walk through your current AI and security posture',
      'Map gaps, risks, and fastest wins',
      'Honest recommendation on which path fits',
      'No pitch deck, no commitment, no credit card',
    ],
    duration: '30 minutes',
    whoFor: 'If you are exploring, unsure about scope, or want a second opinion before committing to anything paid.',
    ctaLabel: 'Book 30-min Call',
    ctaHref: 'https://calendly.com/masoud-masoori/30-min-consultation',
  },
  {
    id: 'scan',
    accent: 'red',
    icon: ShieldAlert,
    eyebrow: 'Option B',
    title: 'Free Security Scan',
    subtitle: 'For: "Is our stack exposed right now?"',
    includes: [
      'Send us a URL, repo, or mobile app link',
      '2-hour Klyntar recon, automated plus manual',
      'Redacted PDF with top 3 findings, 48-hour turnaround',
      'No meeting required, no follow-up spam',
    ],
    duration: '2 hours of our time, 48h turnaround',
    whoFor: 'If you already ship AI, a website, an API, or a mobile app and want a real look at exposures before a pen test or an auditor asks.',
    ctaLabel: 'Request Free Scan',
    ctaHref: 'mailto:masoud.masoori@mas-ai.co?subject=Free%20security%20recon%20request&body=Target%20URL%20or%20repo%3A%20%0A%0AAny%20specific%20area%20of%20concern%3A%20%0A%0AOur%20company%20and%20your%20role%3A%20',
  },
  {
    id: 'audit',
    accent: 'cyan',
    icon: Rocket,
    eyebrow: 'Option C',
    title: 'Free Automation Audit',
    subtitle: 'For: "We want AI, but we are not sure how."',
    includes: [
      '45-min scoping call',
      'Map top 3 repetitive tasks worth automating',
      'Fixed-scope proposal with exact cost and timeline',
      'You decide whether to move forward after the call',
    ],
    duration: '45 minutes plus 48h proposal',
    whoFor: 'If your team wants Claude Code, OpenClaw, voice assistants, or a custom agent but has not figured out what to build first.',
    ctaLabel: 'Book 45-min Audit',
    ctaHref: 'https://calendly.com/masoud-masoori/45-min-automation-audit',
  },
]

const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const tileV = {
  hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export default function BookingOptions() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          ref={ref}
          variants={containerV}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {options.map((opt) => (
            <OptionTile key={opt.id} option={opt} />
          ))}
        </motion.div>

        <p className="mt-10 text-center text-xs text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]">
          All three responded to within 48 business hours · No credit card required · All three can become paid engagements later but never automatically
        </p>

        {/* Pricing reassurance. scope matches the business */}
        <div className="mt-8 mx-auto max-w-3xl rounded-2xl border border-[var(--color-mas-gold)]/30 bg-[rgba(212,168,83,0.05)] p-6 text-center">
          <p className="text-sm text-[var(--color-mas-text-secondary)]">
            <strong className="text-[var(--color-mas-gold)]">Worried about price?</strong>
            {' '}Paid engagements run from <strong className="text-white">$3,000 for a single-target scan</strong> to <strong className="text-white">$45,000 for multi-system builds</strong>.
            Scope matches your business size. Ontario SMBs, Series A-C SaaS, and enterprise all fit.
            The free consultation is where we figure out which bucket you are in.
          </p>
        </div>
      </div>
    </section>
  )
}

function OptionTile({ option }: { option: Option }) {
  const Icon = option.icon
  const [hovered, setHovered] = useState(false)
  const accent =
    option.accent === 'cyan'
      ? 'var(--color-mas-cyan)'
      : option.accent === 'red'
      ? 'var(--color-klyntar-red)'
      : 'var(--color-mas-gold)'
  const glow =
    option.accent === 'cyan'
      ? 'var(--color-mas-cyan-glow)'
      : option.accent === 'red'
      ? 'var(--color-klyntar-red-glow)'
      : 'var(--color-mas-gold-glow)'

  return (
    <motion.div
      variants={tileV}
      className="group relative overflow-hidden rounded-3xl p-8 md:p-10 transition-all duration-500"
      style={{
        border: `1px solid ${hovered ? accent : 'var(--color-mas-border)'}`,
        background: 'rgba(10,14,26,0.55)',
        backdropFilter: 'blur(14px)',
        boxShadow: hovered
          ? `0 0 0 1px ${accent}, 0 22px 60px ${glow}`
          : '0 18px 48px rgba(0,0,0,0.4)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient light */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-[240px] w-[360px] rounded-full blur-[70px] transition-opacity duration-500"
        style={{
          background: accent,
          opacity: hovered ? 0.18 : 0.08,
        }}
      />

      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-500 group-hover:rotate-6"
            style={{
              background: `linear-gradient(135deg, ${glow}, transparent)`,
              border: `1px solid ${accent}`,
            }}
          >
            <Icon size={22} style={{ color: accent }} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-[family-name:var(--font-mono)]" style={{ color: accent }}>
            {option.eyebrow}
          </span>
        </div>

        <h3 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-bold text-white md:text-3xl">
          {option.title}
        </h3>
        <p className="mb-6 text-sm italic text-[var(--color-mas-text-secondary)]">
          {option.subtitle}
        </p>

        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wider font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)]">
          <Clock size={13} style={{ color: accent }} />
          {option.duration}
        </div>

        <p className="mb-6 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
          <span className="text-[var(--color-mas-text)] font-semibold">Who for: </span>
          {option.whoFor}
        </p>

        <ul className="mb-8 space-y-2.5">
          {option.includes.map((inc) => (
            <li key={inc} className="flex items-start gap-2 text-sm text-[var(--color-mas-text)]">
              <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
              <span>{inc}</span>
            </li>
          ))}
        </ul>

        <a
          href={option.ctaHref}
          target={option.ctaHref.startsWith('http') ? '_blank' : undefined}
          rel={option.ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="group/cta inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: accent,
            color: option.accent === 'red' ? 'white' : 'var(--color-mas-bg)',
            boxShadow: `0 0 24px ${glow}`,
          }}
        >
          {option.ctaLabel}
          <ArrowRight size={15} className="transition-transform group-hover/cta:translate-x-1" />
        </a>
      </div>
    </motion.div>
  )
}
