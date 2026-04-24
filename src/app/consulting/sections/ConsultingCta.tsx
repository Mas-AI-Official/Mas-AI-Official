'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BOOKING } from '@/constants/booking'

export default function ConsultingCta() {
  return (
    <section id="contact-consulting" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
          style={{
            border: '1px solid var(--color-klyntar-red)',
            background: 'rgba(185, 28, 60, 0.05)',
            boxShadow: '0 0 60px var(--color-klyntar-red-glow)',
          }}
        >
          <h2 className="mb-5 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-5xl">
            Want to see what&apos;s exposed?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            Send us a URL or a repo. We&apos;ll run a 2-hour recon pass and
            come back with the three highest-impact things we&apos;d fix first
           , free, no strings, redacted if you want.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:masoud.masoori@mas-ai.co?subject=Free%20security%20recon%20request"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-klyntar-red)] px-10 py-4 text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_var(--color-klyntar-red-glow)]"
            >
              Request Free Recon
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={BOOKING.consult30}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-mas-border)] px-10 py-4 text-base font-semibold text-[var(--color-mas-text)] transition-all duration-300 hover:border-[var(--color-klyntar-red)] hover:text-[var(--color-klyntar-red)]"
            >
              Book a Call
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
