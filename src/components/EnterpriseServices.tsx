'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Rocket, Shield, Compass, ArrowRight } from 'lucide-react'

interface ServiceCard {
  icon: typeof Rocket
  title: string
  description: string
  accentColor: string
  number: string
}

const services: ServiceCard[] = [
  {
    icon: Rocket,
    title: 'AI Agent System Deployment',
    description:
      'Custom multi-agent systems designed for your operations. Governed execution, auditable memory, and scalable architecture from day one.',
    accentColor: 'var(--color-mas-gold)',
    number: '01',
  },
  {
    icon: Shield,
    title: 'Enterprise Governance Integration',
    description:
      'Add policy enforcement, audit trails, and compliance reporting to your existing AI systems. Compatible with your regulatory requirements.',
    accentColor: 'var(--color-mas-cyan)',
    number: '02',
  },
  {
    icon: Compass,
    title: 'AI Architecture Consulting',
    description:
      'Design your AI agent topology using patent-pending PhiLattice principles. We help you plan, architect, and validate before you build.',
    accentColor: '#7c3aed',
    number: '03',
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

export default function EnterpriseServices() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })

  return (
    <section className="relative py-16 md:py-24">
      <div className="enterprise-grid-bg absolute inset-0 pointer-events-none opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-sm uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-gold)]">
            ENTERPRISE
          </p>
          <h2 className="text-gradient-gold mb-4 text-3xl font-bold font-[family-name:var(--font-display)] tracking-tight sm:text-4xl md:text-5xl">
            Deploy Governed AI In Your Organization
          </h2>
          <p className="max-w-3xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            We help medium and large enterprises set up AI agent systems with governance,
            audit trails, and policy enforcement built in.
          </p>
        </motion.div>

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
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                className="card-gradient-hover glass rounded-xl p-8 group cursor-default relative overflow-hidden"
              >
                {/* Service number */}
                <span className="absolute top-4 right-4 text-5xl font-bold font-[family-name:var(--font-display)] opacity-[0.04] select-none transition-opacity duration-300 group-hover:opacity-[0.08]">
                  {service.number}
                </span>

                <div
                  className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-400 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${service.accentColor} 12%, transparent), transparent)`,
                    boxShadow: `0 0 0 1px color-mix(in srgb, ${service.accentColor} 20%, transparent)`,
                  }}
                >
                  <Icon
                    size={26}
                    className="transition-all duration-300"
                    style={{ color: service.accentColor }}
                  />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-white font-[family-name:var(--font-display)] transition-colors duration-300" style={{ '--hover-color': service.accentColor } as React.CSSProperties}>
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                  {service.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <a
            href="#contact"
            className="btn-ripple group inline-flex items-center gap-2 justify-center rounded-full border border-[var(--color-mas-gold)] px-8 py-3 text-sm font-semibold text-[var(--color-mas-gold)] transition-all hover:bg-[var(--color-mas-gold)]/10 hover:shadow-[0_0_24px_var(--color-mas-gold-glow)]"
          >
            <span className="relative z-10">Discuss Your Project</span>
            <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
