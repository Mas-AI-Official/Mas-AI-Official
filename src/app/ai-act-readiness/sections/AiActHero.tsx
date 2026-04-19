'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Calendar } from 'lucide-react'

// Countdown to EU AI Act deadline. Scarcity is REAL here, this is an
// actual regulatory deadline, not a marketing fiction.
const DEADLINE = new Date('2026-08-02T00:00:00Z')

function daysUntil(d: Date): number {
  const now = new Date()
  const diff = d.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function AiActHero() {
  const days = daysUntil(DEADLINE)

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center px-6 pt-32 pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, var(--color-mas-gold) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 rounded-full border px-4 py-2"
          style={{
            borderColor: 'var(--color-mas-gold)',
            background: 'rgba(212, 168, 83, 0.1)',
          }}
        >
          <AlertTriangle size={14} className="text-[var(--color-mas-gold)]" />
          <span className="text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-mono)] text-[var(--color-mas-gold)]">
            EU AI Act · Enforcement Deadline
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="text-white">You have </span>
          <span className="text-gradient-gold">{days} days</span>
          <br />
          <span className="text-white">before the EU AI Act fines you.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mb-10 max-w-3xl text-lg text-[var(--color-mas-text-secondary)] sm:text-xl leading-relaxed"
        >
          August 2, 2026. High-risk AI systems must comply or face penalties up
          to €35 million or 7% of global annual turnover. Most companies are
          still figuring out what &ldquo;high-risk&rdquo; means. I&apos;ll get you
          through the gate, architecture, documentation, audit trail, in
          one fixed 2-week sprint.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#contact-aiact"
            className="group inline-flex items-center justify-center gap-2 rounded-full px-10 py-4 text-base font-bold transition-all duration-300 hover:scale-105"
            style={{
              background: 'var(--color-mas-gold)',
              color: 'var(--color-mas-bg)',
              boxShadow: '0 0 40px var(--color-mas-gold-glow)',
            }}
          >
            <Calendar size={16} />
            Book the 2-Week Sprint
          </a>
          <a
            href="#aiact-offer"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-mas-border)] px-10 py-4 text-base font-semibold text-[var(--color-mas-text)] transition-all duration-300 hover:border-[var(--color-mas-gold)] hover:text-[var(--color-mas-gold)]"
          >
            See What&apos;s Included
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-wider text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]"
        >
          <span>· Fixed 2-week sprint</span>
          <span>· Documentation artifact you can hand to regulators</span>
          <span>· Daena audit trail pre-wired</span>
          <span>· Backed by 2 USPTO AI governance patents</span>
        </motion.div>
      </div>
    </section>
  )
}
