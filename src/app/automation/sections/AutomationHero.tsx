'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function AutomationHero() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-32 pb-20">
      {/* Soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-[600px] w-[800px] max-w-[120vw] rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, var(--color-mas-cyan) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 rounded-full border border-[var(--color-mas-border)] bg-[rgba(15,22,41,0.4)] backdrop-blur-md px-4 py-2"
        >
          <Zap size={14} className="text-[var(--color-mas-cyan)]" />
          <span className="text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            Automation Services
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="text-gradient">We install</span>
          <br />
          <span className="text-white">the AI you already want</span>
          <span className="text-[var(--color-mas-cyan)]">.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mb-10 max-w-3xl text-lg text-[var(--color-mas-text-secondary)] sm:text-xl leading-relaxed"
        >
          OpenClaw, Claude Code, voice booking assistants, custom agent
          integrations, installed safely, governed by <span className="text-[var(--color-mas-cyan)] font-semibold">Daena</span>,
          protected by <span className="text-[var(--color-klyntar-red)] font-semibold">Klyntar</span>. You keep your
          workflow. We make it autonomous.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#contact-automation"
            className="group inline-flex items-center justify-center rounded-full bg-[var(--color-mas-cyan)] px-10 py-4 text-base font-bold text-[var(--color-mas-bg)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_var(--color-mas-cyan-glow)]"
          >
            Book a Discovery Call
          </a>
          <a
            href="#catalog"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-mas-border)] px-10 py-4 text-base font-semibold text-[var(--color-mas-text)] transition-all duration-300 hover:border-[var(--color-mas-cyan)] hover:text-[var(--color-mas-cyan)]"
          >
            See What We Install
          </a>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-wider text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]"
        >
          <span>· Zero telemetry by default</span>
          <span>· Audit trail on every action</span>
          <span>· Your data, your hardware option</span>
          <span>· Works with your stack</span>
        </motion.div>
      </div>
    </section>
  )
}
