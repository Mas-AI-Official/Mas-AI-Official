'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    n: '01',
    title: 'Discovery call',
    body:
      '45 minutes. We map your repetitive tasks, current tool stack, and where automation would save the most hours. No pitch deck, just a list of what\'s worth building.',
  },
  {
    n: '02',
    title: 'Fixed-scope proposal',
    body:
      'We write up exactly what we\'ll build, what you\'ll own afterward, and what it costs. No hourly billing, no surprise invoices.',
  },
  {
    n: '03',
    title: 'Install + integrate',
    body:
      'We deploy on your hardware or cloud, connect it to your tools, and wrap it in Daena governance. Shield is always on. Audit trail on by default.',
  },
  {
    n: '04',
    title: 'Handover + hypercare',
    body:
      'Two-week window where we\'re on-call. You get runbooks, training for your team, and full source code. After that, you own it.',
  },
]

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            How it works
          </p>
          <h2 className="text-gradient font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Four steps. No agency bloat.
          </h2>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative glass rounded-xl p-7"
            >
              <div className="mb-4 font-[family-name:var(--font-mono)] text-xs tracking-widest text-[var(--color-mas-cyan)]">
                STEP {s.n}
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white font-[family-name:var(--font-display)]">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                {s.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
