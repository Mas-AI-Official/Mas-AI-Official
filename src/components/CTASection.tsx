'use client'

import { motion } from 'framer-motion'
import { Mail, Linkedin } from 'lucide-react'

export default function CTASection() {
  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-mas-cyan)] opacity-[0.03] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-3xl px-6 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm uppercase tracking-widest text-[var(--color-mas-cyan)] mb-4 font-mono"
        >
          Get Started
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-6 text-[var(--color-mas-text)]"
        >
          Ready to deploy AI agents you can actually trust?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[var(--color-mas-text-secondary)] mb-10 max-w-xl mx-auto"
        >
          Explore Daena, book a technical walkthrough, or discuss how governance-first AI agents can transform your operations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a
            href="https://daena.mas-ai.co"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[var(--color-mas-cyan)] px-8 py-3.5 text-base font-semibold text-[var(--color-mas-bg)] transition-all hover:shadow-[0_0_30px_var(--color-mas-cyan-glow)] hover:scale-105"
          >
            Explore Daena
          </a>
          <a
            href="mailto:masoud.masoori@mas-ai.co?subject=Daena Demo Request"
            className="rounded-full border border-[var(--color-mas-border)] px-8 py-3.5 text-base font-semibold text-[var(--color-mas-text)] transition-all hover:border-[var(--color-mas-cyan)] hover:text-[var(--color-mas-cyan)]"
          >
            Book a Demo
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-6"
        >
          <a
            href="mailto:masoud.masoori@mas-ai.co"
            className="flex items-center gap-2 text-sm text-[var(--color-mas-text-muted)] hover:text-[var(--color-mas-cyan)] transition-colors"
          >
            <Mail size={16} />
            masoud.masoori@mas-ai.co
          </a>
          <a
            href="https://www.linkedin.com/in/masoud-masoori"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--color-mas-text-muted)] hover:text-[var(--color-mas-cyan)] transition-colors"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  )
}
