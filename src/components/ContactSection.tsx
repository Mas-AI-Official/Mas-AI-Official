'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Mail, Calendar } from 'lucide-react'

// --- Variants ---------------------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

// --- Component --------------------------------------------------------------

export default function ContactSection() {
  return (
    <section id="contact" className="relative px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-gradient font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Let&apos;s Build Something
          </h2>
        </div>

        {/* Two-column grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          {/* Left card: Explore Daena */}
          <motion.div variants={fadeUp} className="glass flex flex-col rounded-xl p-8">
            <h3 className="font-display text-xl font-bold text-[var(--color-mas-text)]">
              Explore Daena
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
              See our flagship AI platform in action.
            </p>
            <div className="mt-6">
              <a
                href="https://daena.mas-ai.co"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-mas-cyan)] px-6 py-2.5 text-sm font-semibold text-[var(--color-mas-bg)] transition-shadow hover:shadow-[0_0_24px_var(--color-mas-cyan-glow)]"
              >
                Visit Daena
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Right card: Enterprise Inquiry */}
          <motion.div variants={fadeUp} className="glass flex flex-col rounded-xl p-8">
            <h3 className="font-display text-xl font-bold text-[var(--color-mas-text)]">
              Enterprise Inquiry
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
              Interested in deploying governed AI in your organization?
            </p>
            <div className="mt-6 flex flex-col gap-4">
              <a
                href="mailto:masoud.masoori@mas-ai.co"
                className="flex items-center gap-2 text-sm text-[var(--color-mas-text-secondary)] transition-colors hover:text-[var(--color-mas-cyan)]"
              >
                <Mail className="h-4 w-4" />
                masoud.masoori@mas-ai.co
              </a>
              <a
                href="mailto:masoud.masoori@mas-ai.co?subject=Enterprise%20AI%20Deployment"
                className="flex items-center gap-2 text-sm text-[var(--color-mas-text-secondary)] transition-colors hover:text-[var(--color-mas-cyan)]"
              >
                <Calendar className="h-4 w-4" />
                Book a Call
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
