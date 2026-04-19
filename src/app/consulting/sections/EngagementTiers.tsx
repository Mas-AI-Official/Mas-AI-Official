'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'

const tiers = [
  {
    name: 'Single Scan',
    headline: '$2,500. $7,500',
    sub: 'For a website, app, or single codebase',
    highlight: false,
    features: [
      'Full Klyntar scan + manual review',
      'Proof-of-exploit bundle',
      'Remediation guide',
      'One round of re-test after fixes',
      'Delivered in 5–10 business days',
    ],
    cta: 'Get a quote',
  },
  {
    name: 'Business Audit',
    headline: '$9,000. $22,000',
    sub: 'For your full external footprint + critical internal systems',
    highlight: true,
    features: [
      'Website + apps + infrastructure',
      'Credential leak hunt + DNS hygiene',
      'AI governance review if applicable',
      '2 rounds of re-test included',
      'Executive summary + technical deep-dive',
      '30-day remediation support',
    ],
    cta: 'Book audit',
  },
  {
    name: 'Security Retainer',
    headline: '$4,500 / mo',
    sub: 'Continuous monitoring + incident response',
    highlight: false,
    features: [
      'Klyntar continuous scanning',
      'Quarterly deep audits included',
      '24-hour critical-CVE response SLA',
      'Monthly threat intel brief',
      'Priority incident-response retainer',
    ],
    cta: 'Talk to us',
  },
]

export default function EngagementTiers() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] font-[family-name:var(--font-mono)] text-[var(--color-klyntar-red)]">
            Engagement
          </p>
          <h2 className="text-gradient-red font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Fixed-scope. No retainer traps.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            Anchor prices. Scope is set in a 30-min call, not after a 2-hour
            requirements workshop.
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
                  ? 'border border-[var(--color-klyntar-red)]'
                  : 'glass hover:border-[var(--color-klyntar-red)]'
              }`}
              style={
                t.highlight
                  ? {
                      background: 'rgba(185, 28, 60, 0.08)',
                      boxShadow: '0 0 40px var(--color-klyntar-red-glow)',
                    }
                  : undefined
              }
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-klyntar-red)] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
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
                    <Check size={16} className="mt-0.5 flex-shrink-0 text-[var(--color-klyntar-red)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact-consulting"
                className={`block w-full rounded-full py-3 text-center text-sm font-bold transition-all ${
                  t.highlight
                    ? 'bg-[var(--color-klyntar-red)] text-white hover:shadow-[0_0_24px_var(--color-klyntar-red-glow)]'
                    : 'border border-[var(--color-mas-border)] text-[var(--color-mas-text)] hover:border-[var(--color-klyntar-red)] hover:text-[var(--color-klyntar-red)]'
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
