'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, ShieldCheck, Flame, Zap } from 'lucide-react'

// Hormozi Grand Slam Offer block.
// The math: Value = (Dream Outcome × Perceived Likelihood) / (Time × Effort).
// The copy levers: stack, anchor, price cut, bonus, guarantee, urgency.
// Each lever has a specific visual slot below. Swap props per page, not structure.

interface StackItem {
  label: string
  anchor: string   // what this would cost elsewhere
  detail?: string  // one-line why
}

interface Bonus {
  label: string
  value: string    // $ amount or equivalent ("worth $2,500")
}

export interface GrandSlamOfferProps {
  eyebrow: string            // e.g. "The Automation Grand Slam"
  headline: string           // the OUTCOME promise
  subhead: string            // WHO it's for + WHAT they avoid
  stack: StackItem[]         // the thing they get
  bonuses: Bonus[]           // stacked extras
  anchorTotal: string        // e.g. "$58,500"
  yourPrice: string          // e.g. "$18,000"
  priceSubtext?: string      // e.g. "one-time · fixed scope"
  guarantee: string          // the risk reversal
  urgency: string            // scarcity / deadline
  ctaLabel: string
  ctaHref: string
  accent: 'cyan' | 'red'
}

const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const rowV = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export default function GrandSlamOffer(props: GrandSlamOfferProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const isCyan = props.accent === 'cyan'
  const accentVar = isCyan ? 'var(--color-mas-cyan)' : 'var(--color-klyntar-red)'
  const accentGlow = isCyan ? 'var(--color-mas-cyan-glow)' : 'var(--color-klyntar-red-glow)'
  const gradientClass = isCyan ? 'text-gradient' : 'text-gradient-red'

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          ref={ref}
          variants={containerV}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative overflow-hidden rounded-3xl"
          style={{
            border: `1px solid ${accentVar}`,
            background: 'rgba(6,10,20,0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: `0 0 80px ${accentGlow}, inset 0 0 0 1px rgba(255,255,255,0.04)`,
          }}
        >
          {/* Urgency ribbon */}
          <motion.div variants={rowV} className="flex items-center justify-center gap-2 border-b py-3 px-4 text-center"
            style={{
              borderColor: accentVar,
              background: `linear-gradient(90deg, transparent, ${accentGlow}, transparent)`,
            }}
          >
            <Flame size={14} style={{ color: accentVar }} />
            <span
              className="text-[11px] uppercase tracking-[0.18em] font-[family-name:var(--font-mono)] font-semibold"
              style={{ color: accentVar }}
            >
              {props.urgency}
            </span>
          </motion.div>

          <div className="p-8 md:p-12">
            {/* Eyebrow */}
            <motion.p
              variants={rowV}
              className="mb-4 text-center text-xs uppercase tracking-[0.3em] font-[family-name:var(--font-mono)]"
              style={{ color: accentVar }}
            >
              {props.eyebrow}
            </motion.p>

            {/* Headline, the outcome */}
            <motion.h2
              variants={rowV}
              className={`${gradientClass} mx-auto mb-5 max-w-3xl text-center font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl`}
            >
              {props.headline}
            </motion.h2>

            {/* Subhead, who + what they avoid */}
            <motion.p
              variants={rowV}
              className="mx-auto mb-10 max-w-2xl text-center text-base text-[var(--color-mas-text-secondary)] md:text-lg leading-relaxed"
            >
              {props.subhead}
            </motion.p>

            {/* The stack */}
            <motion.div
              variants={rowV}
              className="mb-8 rounded-2xl border border-[var(--color-mas-border)] bg-[rgba(15,22,41,0.4)] backdrop-blur-sm p-6 md:p-8"
            >
              <p className="mb-5 text-xs uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)]">
                Here&apos;s what you get
              </p>
              <ul className="space-y-4">
                {props.stack.map((item) => (
                  <li key={item.label} className="flex flex-col gap-1 border-b border-[var(--color-mas-border)]/50 pb-4 last:border-0 last:pb-0 md:flex-row md:items-start md:justify-between md:gap-6">
                    <div className="flex items-start gap-3">
                      <Check size={18} className="mt-0.5 flex-shrink-0" style={{ color: accentVar }} />
                      <div>
                        <div className="text-sm md:text-base font-semibold text-white">{item.label}</div>
                        {item.detail && (
                          <div className="mt-1 text-xs md:text-sm text-[var(--color-mas-text-muted)]">{item.detail}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right text-xs md:text-sm text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)] line-through opacity-70">
                      {item.anchor}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Bonus stack */}
            {props.bonuses.length > 0 && (
              <motion.div
                variants={rowV}
                className="mb-8 rounded-2xl p-6 md:p-8"
                style={{
                  background: `linear-gradient(135deg, ${accentGlow}, transparent)`,
                  border: `1px dashed ${accentVar}`,
                }}
              >
                <p className="mb-5 flex items-center gap-2 text-xs uppercase tracking-widest font-[family-name:var(--font-mono)]" style={{ color: accentVar }}>
                  <Zap size={14} /> Plus, free bonuses
                </p>
                <ul className="space-y-3">
                  {props.bonuses.map((b) => (
                    <li key={b.label} className="flex items-center justify-between gap-4 text-sm text-[var(--color-mas-text)]">
                      <span>{b.label}</span>
                      <span className="font-[family-name:var(--font-mono)] text-xs" style={{ color: accentVar }}>
                        {b.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Anchor + Price */}
            <motion.div
              variants={rowV}
              className="mb-8 flex flex-col items-center gap-1 text-center"
            >
              <div className="text-sm text-[var(--color-mas-text-muted)]">
                What agencies charge:{' '}
                <span className="line-through font-[family-name:var(--font-mono)]">
                  {props.anchorTotal}
                </span>
              </div>
              <div className="font-[family-name:var(--font-display)] text-5xl font-bold md:text-6xl" style={{ color: accentVar }}>
                {props.yourPrice}
              </div>
              {props.priceSubtext && (
                <div className="mt-1 text-xs uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)]">
                  {props.priceSubtext}
                </div>
              )}
            </motion.div>

            {/* Guarantee, the biggest trust builder */}
            <motion.div
              variants={rowV}
              className="mb-8 flex items-start gap-4 rounded-xl border p-5"
              style={{
                borderColor: accentVar,
                background: 'rgba(6,10,20,0.5)',
              }}
            >
              <ShieldCheck size={24} className="mt-0.5 flex-shrink-0" style={{ color: accentVar }} />
              <div>
                <div className="mb-1 text-sm font-bold uppercase tracking-wider font-[family-name:var(--font-mono)]" style={{ color: accentVar }}>
                  The guarantee
                </div>
                <p className="text-sm text-[var(--color-mas-text)] md:text-base">
                  {props.guarantee}
                </p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={rowV} className="text-center">
              <a
                href={props.ctaHref}
                className="group inline-flex items-center justify-center gap-2 rounded-full px-12 py-5 text-lg font-bold transition-all duration-300 hover:scale-105"
                style={{
                  background: accentVar,
                  color: isCyan ? 'var(--color-mas-bg)' : 'white',
                  boxShadow: `0 0 48px ${accentGlow}`,
                }}
              >
                {props.ctaLabel}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <p className="mt-4 text-xs text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]">
                No credit card · 48-hour response · You can walk away at any time
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
