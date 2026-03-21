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
  ArrowUpRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Image from 'next/image'

// --- Data -------------------------------------------------------------------

interface TrustBadge {
  icon: LucideIcon
  label: string
  accentColor: string
}

const trustBadges: TrustBadge[] = [
  { icon: CheckCircle, label: 'Google for Startups Cloud Program', accentColor: '#22c55e' },
  { icon: Shield, label: '2 USPTO Patents Pending', accentColor: 'var(--color-mas-gold)' },
  { icon: Cloud, label: 'Azure for Startups', accentColor: '#0ea5e9' },
  { icon: Cloud, label: 'GCP Credits Secured', accentColor: '#facc15' },
  { icon: Sparkles, label: 'Perplexity for Startups', accentColor: '#a78bfa' },
]

// --- Variants ---------------------------------------------------------------

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

const founderVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

// --- Component --------------------------------------------------------------

export default function CredibilitySection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="credibility" className="relative px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-sm uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            CREDIBILITY
          </p>
          <h2 className="text-gradient font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Backed by Real Engineering
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--color-mas-text-secondary)]">
            Recognized by industry leaders and backed by patent-pending technology.
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-20 flex gap-4 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-x-visible"
        >
          {trustBadges.map((badge) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={badge.label}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                className="card-gradient-hover glass group flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-5 py-4 cursor-default transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
              >
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${badge.accentColor} 15%, transparent), transparent)`,
                    boxShadow: `0 0 0 1px color-mix(in srgb, ${badge.accentColor} 20%, transparent)`,
                  }}
                >
                  <Icon className="h-4 w-4 transition-colors duration-300" style={{ color: badge.accentColor }} />
                </div>
                <span className="text-sm font-medium text-[var(--color-mas-text)] transition-colors duration-200 group-hover:text-white">
                  {badge.label}
                </span>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Founder section */}
        <motion.div
          variants={founderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto max-w-2xl"
        >
          <div className="glass card-gradient-hover rounded-2xl p-10 text-center group">
            {/* Founder photo with ambient glow */}
            <div className="relative mx-auto mb-6 h-28 w-28">
              <div className="absolute inset-[-12px] rounded-full bg-amber-500/15 blur-2xl transition-all duration-500 group-hover:bg-amber-500/25 group-hover:blur-3xl" />
              <Image
                src="/assets/masoud-photo.jpg"
                alt="Masoud Masoori, Founder and CEO of MAS-AI Technologies"
                width={112}
                height={112}
                className="relative rounded-full border-2 border-amber-500/20 object-cover w-28 h-28 transition-all duration-300 group-hover:border-amber-500/40 group-hover:shadow-[0_0_30px_rgba(212,168,83,0.15)]"
              />
            </div>

            {/* Name & title */}
            <h3 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
              Masoud Masoori
            </h3>
            <p className="mt-1 text-sm font-[family-name:var(--font-mono)] text-[var(--color-mas-gold)]">
              Founder &amp; CEO
            </p>

            {/* Bio */}
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
              Solo technical founder and senior AI/ML architect. Background spanning deep learning,
              robotics, and enterprise systems. Built MAS-AI from zero into a governance-first AI
              company with two patent-pending architectures.
            </p>

            {/* Links */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <a
                href="mailto:masoud.masoori@mas-ai.co"
                className="group/link inline-flex items-center gap-2 rounded-full border border-[var(--color-mas-border)] px-4 py-2 text-sm text-[var(--color-mas-text-secondary)] transition-all duration-300 hover:border-[var(--color-mas-cyan)]/30 hover:text-[var(--color-mas-cyan)] hover:shadow-[0_0_16px_rgba(0,200,255,0.08)]"
              >
                <Mail className="h-4 w-4" />
                Email
                <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover/link:opacity-60 group-hover/link:translate-x-0" />
              </a>
              <a
                href="https://www.linkedin.com/in/masoud-masoori"
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 rounded-full border border-[var(--color-mas-border)] px-4 py-2 text-sm text-[var(--color-mas-text-secondary)] transition-all duration-300 hover:border-[#0a66c2]/30 hover:text-[#0a66c2] hover:shadow-[0_0_16px_rgba(10,102,194,0.1)]"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
                <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover/link:opacity-60 group-hover/link:translate-x-0" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
