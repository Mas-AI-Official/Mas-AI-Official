'use client'

import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
}

const lineVariants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 20 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-40 px-6">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, var(--color-mas-cyan) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {/* Company tag */}
          <motion.p
            variants={lineVariants}
            className="text-sm uppercase tracking-[0.2em] text-[var(--color-mas-cyan)] font-[family-name:var(--font-mono)]"
          >
            MAS-AI Technologies Inc.
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={lineVariants}
            className="text-gradient font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Building the Infrastructure for Governed AI
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={lineVariants}
            className="mx-auto max-w-3xl text-lg text-[var(--color-mas-text-secondary)] sm:text-xl md:text-2xl"
          >
            We build AI systems that enterprises can actually trust. Governed agents, auditable decisions, and scalable intelligence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={lineVariants}
            className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="https://daena.mas-ai.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-mas-cyan)] px-8 py-3.5 text-base font-semibold text-[var(--color-mas-bg)] transition-all hover:shadow-[0_0_30px_var(--color-mas-cyan-glow)] hover:scale-105"
            >
              Explore Daena
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-mas-border)] px-8 py-3.5 text-base font-semibold text-[var(--color-mas-text)] transition-all hover:border-[var(--color-mas-cyan)] hover:text-[var(--color-mas-cyan)]"
            >
              Work With Us
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
