'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'

// Note: tiers are anchor points, not a rigid SKU list.
// Real pricing happens in a proposal after discovery.
const tiers = [
  {
    name: 'Quick Install',
    headline: '$1,500. $4,000',
    sub: 'For a single tool: OpenClaw, Claude Code, or a voice assistant MVP',
    highlight: false,
    features: [
      'One tool, safely deployed',
      'Daena governance wrapper',
      '1-week delivery',
      '2-week hypercare',
      'Runbook + team training',
    ],
    cta: 'Get a quote',
  },
  {
    name: 'Automation Build',
    headline: '$6,000. $18,000',
    sub: 'For a full agent workflow: custom job automation or executive secretary',
    highlight: true,
    features: [
      'Custom agent, fully integrated',
      'Shield + Security always on',
      'MCP connectors for your stack',
      '3-4 week build window',
      '30-day hypercare + iteration',
      'Full source code + ownership',
    ],
    cta: 'Book discovery',
  },
  {
    name: 'Managed Operator',
    headline: '$3,500 / mo',
    sub: 'For ongoing: we operate and evolve your automation alongside your team',
    highlight: false,
    features: [
      '10 hrs/mo senior AI operator time',
      'Monthly optimization + new agents',
      'Daena platform access included',
      'Klyntar security monitoring',
      'Priority support (Slack/email)',
    ],
    cta: 'Talk to us',
  },
]

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            Pricing
          </p>
          <h2 className="text-gradient font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Fixed-scope. No hourly billing.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            Anchor prices. Your actual proposal is written after a 45-min call.
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                t.highlight
                  ? 'animated-border border-transparent'
                  : 'glass hover:border-[var(--color-mas-cyan)]'
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-mas-cyan)] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-mas-bg)]">
                  Most Popular
                </div>
              )}

              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-mas-text-secondary)] font-[family-name:var(--font-mono)]">
                {t.name}
              </h3>
              <div className="mb-3 font-[family-name:var(--font-display)] text-3xl font-bold text-white md:text-4xl">
                {t.headline}
              </div>
              <p className="mb-6 text-sm text-[var(--color-mas-text-secondary)]">
                {t.sub}
              </p>

              <ul className="mb-8 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--color-mas-text)]">
                    <Check size={16} className="mt-0.5 flex-shrink-0 text-[var(--color-mas-cyan)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact-automation"
                className={`block w-full rounded-full py-3 text-center text-sm font-bold transition-all ${
                  t.highlight
                    ? 'bg-[var(--color-mas-cyan)] text-[var(--color-mas-bg)] hover:shadow-[0_0_24px_var(--color-mas-cyan-glow)]'
                    : 'border border-[var(--color-mas-border)] text-[var(--color-mas-text)] hover:border-[var(--color-mas-cyan)] hover:text-[var(--color-mas-cyan)]'
                }`}
              >
                {t.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
