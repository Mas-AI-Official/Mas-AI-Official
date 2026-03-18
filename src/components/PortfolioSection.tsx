'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

// --- Data -------------------------------------------------------------------

interface PortfolioItem {
  title: string
  description: string
  href: string
  hero?: boolean
  badge?: string
  dimmed?: boolean
  subtitle?: string
}

const projects: PortfolioItem[] = [
  {
    title: 'Daena by MAS-AI',
    description:
      'The AI-autonomous company OS with governance built in. 10-stage governed pipeline, PhiLattice Architecture, Neural-Backed Memory Fabric. Two patent-pending innovations. 300+ tests passing.',
    href: 'https://daena.mas-ai.co',
    hero: true,
    badge: 'Flagship Platform',
  },
  {
    title: 'ContentOPS',
    description:
      'Autonomous content operations built on Daena. Self-coordinating agents with shared memory.',
    href: 'https://contentops.mas-ai.co',
  },
  {
    title: 'Med Smart',
    description:
      'AI-powered healthcare solution for intelligent medical diagnosis and patient care.',
    href: '/medsmart',
  },
  {
    title: 'Construction AI',
    description:
      'AI system for construction permit analysis, building code compliance, and project management.',
    href: '/construction-ai',
  },
  {
    title: 'NatureNLP',
    description:
      'Efficiency-first NLP research prototype exploring oscillatory mechanisms and regenerative learning.',
    href: '#',
    dimmed: true,
    subtitle: '(Research Archive)',
  },
]

// --- Variants ---------------------------------------------------------------

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

// --- Component --------------------------------------------------------------

export default function PortfolioSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="portfolio" className="relative px-6 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-mas-cyan">
            MAS-AI Portfolio
          </p>
          <h2 className="text-gradient font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            What We Build
          </h2>
        </div>

        {/* Grid */}
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={cardVariants}
              className={`group relative ${project.hero ? 'md:col-span-2 md:row-span-1' : ''} ${project.dimmed ? 'opacity-60' : ''}`}
            >
              <a
                href={project.href}
                target={project.href.startsWith('http') ? '_blank' : undefined}
                rel={project.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`
                  glass flex h-full flex-col justify-between rounded-2xl p-6 transition-transform duration-300
                  ${!project.dimmed ? 'hover:scale-[1.02]' : ''}
                  ${project.hero ? 'glow-border md:p-10' : ''}
                `}
              >
                {/* Badge */}
                {project.badge && (
                  <span className="mb-4 inline-block w-fit rounded-full border border-mas-gold/30 bg-mas-gold/10 px-3 py-1 text-xs font-semibold text-mas-gold">
                    {project.badge}
                  </span>
                )}

                <div>
                  {/* Title */}
                  <h3
                    className={`font-display text-xl font-bold tracking-tight ${project.hero ? 'text-gradient text-2xl sm:text-3xl' : 'text-mas-text'} flex items-center gap-2`}
                  >
                    {project.title}
                    {project.subtitle && (
                      <span className="text-sm font-normal text-mas-text-muted">
                        {project.subtitle}
                      </span>
                    )}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-relaxed text-mas-text-secondary sm:text-base">
                    {project.description}
                  </p>
                </div>

                {/* CTA / Arrow */}
                <div className="mt-6 flex items-center">
                  {project.hero ? (
                    <span className="inline-flex items-center gap-2 rounded-lg bg-mas-cyan px-6 py-2.5 text-sm font-semibold text-mas-bg transition-shadow hover:shadow-[0_0_24px_var(--color-mas-cyan-glow)]">
                      Explore Daena
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  ) : !project.dimmed ? (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-mas-cyan transition-colors group-hover:text-mas-text">
                      Learn more
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  ) : null}
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
