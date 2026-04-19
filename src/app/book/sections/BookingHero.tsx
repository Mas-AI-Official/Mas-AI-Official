'use client'

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

export default function BookingHero() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center px-6 pt-32 pb-10">
      {/* Dual glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-20 left-1/4 h-[500px] w-[500px] rounded-full opacity-15 blur-[120px]"
        style={{ background: 'var(--color-mas-cyan)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-20 right-1/4 h-[500px] w-[500px] rounded-full opacity-15 blur-[120px]"
        style={{ background: 'var(--color-klyntar-red)' }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 rounded-full border border-[var(--color-mas-gold)] bg-[rgba(212,168,83,0.1)] backdrop-blur-md px-4 py-2"
        >
          <Calendar size={14} className="text-[var(--color-mas-gold)]" />
          <span className="text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-mono)] text-[var(--color-mas-gold)]">
            Free. 48-hour response.
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
        >
          <span className="text-white">Three ways to start. </span>
          <span className="text-gradient-gold">All free.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto max-w-2xl text-lg text-[var(--color-mas-text-secondary)] sm:text-xl leading-relaxed"
        >
          Pick the one that fits. You can always upgrade to a paid engagement
          later. None of these ask for a credit card, and none of them are a
          pitch disguised as a call.
        </motion.p>
      </div>
    </section>
  )
}
