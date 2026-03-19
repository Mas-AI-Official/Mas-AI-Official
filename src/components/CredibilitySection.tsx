'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  CheckCircle,
  Shield,
  Cloud,
  Sparkles,
  Mail,
  Linkedin,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'

// --- Data -------------------------------------------------------------------

interface TrustBadge {
  icon: LucideIcon
  label: string
}

const trustBadges: TrustBadge[] = [
  { icon: CheckCircle, label: 'Google for Startups Cloud Program' },
  { icon: Shield, label: '2 USPTO Patents Pending' },
  { icon: Cloud, label: 'Azure for Startups' },
  { icon: Cloud, label: 'GCP Credits Secured' },
  { icon: Sparkles, label: 'Perplexity for Startups' },
]

// --- Variants ---------------------------------------------------------------

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

// --- Component --------------------------------------------------------------

export default function CredibilitySection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="credibility" className="relative px-6 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-gradient font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Backed by Real Engineering
          </h2>
        </div>

        {/* Trust badges */}
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-20 flex gap-6 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-x-visible"
        >
          {trustBadges.map((badge) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={badge.label}
                variants={itemVariants}
                className="glass flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-5 py-4"
              >
                <Icon className="h-5 w-5 text-[var(--color-mas-cyan)]" />
                <span className="text-sm font-medium text-[var(--color-mas-text)]">
                  {badge.label}
                </span>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Founder section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
          className="mx-auto max-w-2xl text-center"
        >
          {/* Founder photo */}
          <div className="relative mx-auto mb-6 h-24 w-24">
            <div className="absolute inset-[-8px] rounded-full bg-amber-500/20 blur-xl" />
            <Image
              src="/assets/masoud-photo.jpg"
              alt="Masoud Masoori, Founder and CEO of MAS-AI Technologies"
              width={96}
              height={96}
              className="rounded-full border-2 border-amber-500/20 object-cover w-24 h-24"
            />
          </div>

          {/* Name & title */}
          <h3 className="text-xl font-bold text-[var(--color-mas-text)]">Masoud Masoori</h3>
          <p className="mt-1 text-sm font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            Founder &amp; CEO
          </p>

          {/* Bio */}
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
            Solo technical founder and senior AI/ML architect. Background spanning deep learning,
            robotics, and enterprise systems. Built MAS-AI from zero into a governance-first AI
            company with two patent-pending architectures.
          </p>

          {/* Links */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <a
              href="mailto:masoud.masoori@mas-ai.co"
              className="flex items-center gap-2 text-sm text-[var(--color-mas-text-secondary)] transition-colors hover:text-[var(--color-mas-cyan)]"
            >
              <Mail className="h-4 w-4" />
              masoud.masoori@mas-ai.co
            </a>
            <a
              href="https://www.linkedin.com/in/masoud-masoori"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--color-mas-text-secondary)] transition-colors hover:text-[var(--color-mas-cyan)]"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
