'use client'

import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'

export default function SecurityArchitectHero() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center px-6 pt-32 pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, var(--color-klyntar-red) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 rounded-full border border-[var(--color-klyntar-red)] bg-[rgba(185,28,60,0.1)] backdrop-blur-md px-4 py-2"
        >
          <ShieldAlert size={14} className="text-[var(--color-klyntar-red)]" />
          <span className="text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-mono)] text-[var(--color-klyntar-red)]">
            Security Services · Klyntar Inside
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="text-white">We built the AI security </span>
          <span className="text-gradient-red">fortress</span>
          <span className="text-white">.</span>
          <br />
          <span className="text-white">We&apos;ll </span>
          <span className="text-gradient">audit</span>
          <span className="text-white"> yours. Free.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mb-10 max-w-3xl text-lg text-[var(--color-mas-text-secondary)] sm:text-xl leading-relaxed"
        >
          <strong className="text-white">Klyntar</strong> is our security layer inside Daena.
          Zero-FP gate. <strong className="text-[var(--color-klyntar-red)]">25+ exploit signatures</strong>.
          Asset Shield vault. BeyondMythos enrichment. Backed by <strong className="text-white">two USPTO
          patents</strong> in AI governance. Send us a URL or repo. We return the
          <strong className="text-[var(--color-klyntar-red)]"> 3 highest-impact exposures</strong> we
          would fix first. Free. 48-hour turnaround. No meeting needed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#contact-consulting"
            className="group inline-flex items-center justify-center rounded-full bg-[var(--color-klyntar-red)] px-10 py-4 text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_var(--color-klyntar-red-glow)]"
          >
            Scan Us, Free
          </a>
          <a
            href="#audit-scope"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-mas-border)] px-10 py-4 text-base font-semibold text-[var(--color-mas-text)] transition-all duration-300 hover:border-[var(--color-klyntar-red)] hover:text-[var(--color-klyntar-red)]"
          >
            See What You Get
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-wider text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]"
        >
          <span>· 2 USPTO AI governance patents</span>
          <span>· 48-hour recon turnaround</span>
          <span>· Proof-of-exploit on every finding</span>
          <span>· Pay nothing until remediation starts</span>
        </motion.div>
      </div>
    </section>
  )
}
