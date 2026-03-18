'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Rocket, Shield, Compass } from 'lucide-react'

// --- Data -------------------------------------------------------------------

interface ServiceCard {
  icon: typeof Rocket
  title: string
  description: string
}

const services: ServiceCard[] = [
  {
    icon: Rocket,
    title: 'AI Agent System Deployment',
    description:
      'Custom multi-agent systems designed for your operations. Governed execution, auditable memory, and scalable architecture from day one.',
  },
  {
    icon: Shield,
    title: 'Enterprise Governance Integration',
    description:
      'Add policy enforcement, audit trails, and compliance reporting to your existing AI systems. Compatible with your regulatory requirements.',
  },
  {
    icon: Compass,
    title: 'AI Architecture Consulting',
    description:
      'Design your AI agent topology using patent-pending PhiLattice principles. We help you plan, architect, and validate before you build.',
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

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

// --- Component --------------------------------------------------------------

export default function EnterpriseServices() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-gradient mb-4 text-3xl font-bold font-[family-name:var(--font-display)] tracking-tight sm:text-4xl md:text-5xl">
            Deploy Governed AI In Your Organization
          </h2>
          <p className="mx-auto max-w-3xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            We help medium and large enterprises set up AI agent systems with governance,
            audit trails, and policy enforcement built in.
          </p>
        </div>

        {/* Cards */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className="glass rounded-xl p-8 transition-all duration-300 hover:border-[var(--color-mas-cyan)] hover:-translate-y-[2px]"
              >
                <Icon
                  size={28}
                  className="mb-5 text-[var(--color-mas-cyan)]"
                />
                <h3 className="mb-3 text-lg font-semibold text-white font-[family-name:var(--font-display)]">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                  {service.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-14 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-mas-cyan)] px-8 py-3 text-sm font-semibold text-[var(--color-mas-cyan)] transition-all hover:bg-[var(--color-mas-cyan)]/10 hover:shadow-[0_0_24px_var(--color-mas-cyan-glow)]"
          >
            Discuss Your Project
          </a>
        </motion.div>
      </div>
    </section>
  )
}
