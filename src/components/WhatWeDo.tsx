'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Cpu, Building2, Layers, ArrowRight } from 'lucide-react'

interface FeatureCard {
  icon: typeof Cpu
  title: string
  description: string
  highlight: string
  accentColor: string
  glowColor: string
}

const features: FeatureCard[] = [
  {
    icon: Cpu,
    title: 'AI Platforms',
    description:
      'We build governed AI platforms with built-in policy enforcement, auditable memory, and traceable decision-making.',
    highlight: 'governed AI platforms',
    accentColor: 'var(--color-mas-cyan)',
    glowColor: 'rgba(0, 200, 255, 0.12)',
  },
  {
    icon: Building2,
    title: 'Enterprise Deployment',
    description:
      'We help enterprises deploy AI agent systems with governance from day one. Adaptable to your industry and compliance requirements.',
    highlight: 'governance from day one',
    accentColor: '#7c3aed',
    glowColor: 'rgba(124, 58, 237, 0.12)',
  },
  {
    icon: Layers,
    title: 'Applied AI Products',
    description:
      'We ship AI products across healthcare, construction, content operations, and more. Real solutions, not demos.',
    highlight: 'Real solutions',
    accentColor: 'var(--color-mas-gold)',
    glowColor: 'rgba(212, 168, 83, 0.12)',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

export default function WhatWeDo() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-4 text-sm uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]"
        >
          WHAT WE DO
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 text-3xl font-bold font-[family-name:var(--font-display)] text-white md:text-4xl"
        >
          Three pillars of <span className="text-gradient">governed intelligence</span>
        </motion.h2>

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
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                className="card-gradient-hover glass rounded-xl p-8 group cursor-default"
                style={{ '--card-accent': feature.accentColor } as React.CSSProperties}
              >
                {/* Icon with glow */}
                <div
                  className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-400 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: `linear-gradient(135deg, ${feature.glowColor}, transparent)`,
                    boxShadow: `0 0 0 1px ${feature.accentColor}20`,
                  }}
                >
                  <Icon
                    size={26}
                    className="transition-all duration-300"
                    style={{ color: feature.accentColor }}
                  />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-white font-[family-name:var(--font-display)] transition-colors duration-300 group-hover:text-[var(--card-accent)]">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-mas-text-secondary)] mb-4">
                  {feature.description.split(feature.highlight).map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>{part}<span className="text-white font-medium">{feature.highlight}</span></span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>

                {/* Learn more hint */}
                <div className="flex items-center gap-1 text-xs uppercase tracking-wider opacity-0 group-hover:opacity-60 transition-all duration-300 translate-y-2 group-hover:translate-y-0" style={{ color: feature.accentColor }}>
                  <span>Learn more</span>
                  <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
