'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Cpu, Building2, Layers } from 'lucide-react'

// --- Data -------------------------------------------------------------------

interface FeatureCard {
  icon: typeof Cpu
  title: string
  description: string
}

const features: FeatureCard[] = [
  {
    icon: Cpu,
    title: 'AI Platforms',
    description:
      'We build governed AI platforms with built-in policy enforcement, auditable memory, and traceable decision-making.',
  },
  {
    icon: Building2,
    title: 'Enterprise Deployment',
    description:
      'We help enterprises deploy AI agent systems with governance from day one. Adaptable to your industry and compliance requirements.',
  },
  {
    icon: Layers,
    title: 'Applied AI Products',
    description:
      'We ship AI products across healthcare, construction, content operations, and more. Real solutions, not demos.',
  },
]

// --- Variants ---------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

// --- Component --------------------------------------------------------------

export default function WhatWeDo() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Eyebrow */}
        <p className="mb-10 text-sm uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
          WHAT WE DO
        </p>

        {/* Cards */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="glass rounded-xl p-8 transition-all duration-300 hover:border-[var(--color-mas-cyan)] hover:-translate-y-[2px]"
              >
                <Icon
                  size={28}
                  className="mb-5 text-[var(--color-mas-cyan)]"
                />
                <h3 className="mb-3 text-lg font-semibold text-white font-[family-name:var(--font-display)]">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
