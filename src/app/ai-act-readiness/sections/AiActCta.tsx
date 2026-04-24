'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BOOKING } from '@/constants/booking'

export default function AiActCta() {
  return (
    <section id="contact-aiact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
          style={{
            border: '1px solid var(--color-mas-gold)',
            background: 'rgba(212, 168, 83, 0.05)',
            boxShadow: '0 0 60px var(--color-mas-gold-glow)',
          }}
        >
          <h2 className="mb-5 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">
            10 days to AI Act compliant.
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            Start with a 30-minute scoping call. If you&apos;re in scope
            we&apos;ll confirm the sprint. If you&apos;re NOT in scope
            I&apos;ll send you a one-pager explaining why, free.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:masoud.masoori@mas-ai.co?subject=EU%20AI%20Act%20Readiness%20Sprint"
              className="group inline-flex items-center gap-2 rounded-full px-10 py-4 text-base font-bold transition-all duration-300 hover:scale-105"
              style={{
                background: 'var(--color-mas-gold)',
                color: 'var(--color-mas-bg)',
                boxShadow: '0 0 40px var(--color-mas-gold-glow)',
              }}
            >
              Email Masoud
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={BOOKING.consult30}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-mas-border)] px-10 py-4 text-base font-semibold text-[var(--color-mas-text)] transition-all duration-300 hover:border-[var(--color-mas-gold)] hover:text-[var(--color-mas-gold)]"
            >
              Book Scoping Call
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
