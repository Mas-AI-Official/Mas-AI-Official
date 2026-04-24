'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BOOKING } from '@/constants/booking'

export default function CtaBlock() {
  return (
    <section id="contact-automation" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="animated-border relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
        >
          <h2 className="mb-5 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">
            Book a 45-minute discovery call
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            We&apos;ll map where AI saves your team the most hours. If we can
            help, we&apos;ll write a fixed-scope proposal within 48 hours. If
            we can&apos;t, we&apos;ll tell you, and refer you to someone who
            can.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:masoud.masoori@mas-ai.co?subject=Automation%20discovery%20call"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-mas-cyan)] px-10 py-4 text-base font-bold text-[var(--color-mas-bg)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_var(--color-mas-cyan-glow)]"
            >
              Email Masoud
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={BOOKING.consult30}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-mas-border)] px-10 py-4 text-base font-semibold text-[var(--color-mas-text)] transition-all duration-300 hover:border-[var(--color-mas-cyan)] hover:text-[var(--color-mas-cyan)]"
            >
              Book on Calendly
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
