'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, Mail, Calendar, ExternalLink, Sparkles } from 'lucide-react'

// --- Variants ---------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

// --- Component --------------------------------------------------------------

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })

  return (
    <section id="contact" className="relative px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-sm uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            CONTACT
          </p>
          <h2 className="text-gradient font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Let&apos;s Build Something
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--color-mas-text-secondary)]">
            Ready to deploy governed AI? Explore our platform or start a conversation.
          </p>
        </motion.div>

        {/* Two-column grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          {/* Left card: Explore Daena */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
            className="card-gradient-hover glass group flex flex-col rounded-xl p-8 cursor-default"
          >
            <div
              className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{
                background: 'linear-gradient(135deg, rgba(0,200,255,0.12), transparent)',
                boxShadow: '0 0 0 1px rgba(0,200,255,0.2)',
              }}
            >
              <Sparkles className="h-6 w-6 text-[var(--color-mas-cyan)] transition-all duration-300" />
            </div>

            <h3 className="font-display text-xl font-bold text-[var(--color-mas-text)] transition-colors duration-300 group-hover:text-white">
              Explore Daena
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
              See our flagship AI platform in action. Governance-first orchestration with
              auditable memory and traceable decisions.
            </p>
            <div className="mt-auto pt-6">
              <a
                href="https://daena.mas-ai.co"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ripple inline-flex items-center gap-2 rounded-full bg-[var(--color-mas-cyan)] px-6 py-2.5 text-sm font-semibold text-[var(--color-mas-bg)] transition-all duration-300 hover:shadow-[0_0_24px_var(--color-mas-cyan-glow)] hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Visit Daena
                  <ExternalLink className="h-4 w-4" />
                </span>
              </a>
            </div>
          </motion.div>

          {/* Right card: Enterprise Inquiry */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
            className="card-gradient-hover glass group flex flex-col rounded-xl p-8 cursor-default"
          >
            <div
              className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.12), transparent)',
                boxShadow: '0 0 0 1px rgba(124,58,237,0.2)',
              }}
            >
              <Mail className="h-6 w-6 text-[#a78bfa] transition-all duration-300" />
            </div>

            <h3 className="font-display text-xl font-bold text-[var(--color-mas-text)] transition-colors duration-300 group-hover:text-white">
              Enterprise Inquiry
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
              Interested in deploying governed AI in your organization?
              We offer system deployment, governance integration, and architecture consulting.
            </p>
            <div className="mt-auto pt-6 flex flex-col gap-3">
              <a
                href="mailto:masoud.masoori@mas-ai.co"
                className="group/link flex items-center gap-3 rounded-lg border border-[var(--color-mas-border)] px-4 py-3 text-sm text-[var(--color-mas-text-secondary)] transition-all duration-300 hover:border-[#a78bfa]/30 hover:text-[#a78bfa] hover:bg-[#7c3aed]/5"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span>masoud.masoori@mas-ai.co</span>
                <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 transition-all duration-200 group-hover/link:opacity-60" />
              </a>
              <a
                href="mailto:masoud.masoori@mas-ai.co?subject=Enterprise%20AI%20Deployment"
                className="group/link flex items-center gap-3 rounded-lg border border-[var(--color-mas-border)] px-4 py-3 text-sm text-[var(--color-mas-text-secondary)] transition-all duration-300 hover:border-[#a78bfa]/30 hover:text-[#a78bfa] hover:bg-[#7c3aed]/5"
              >
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Book a Call</span>
                <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 transition-all duration-200 group-hover/link:opacity-60" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
