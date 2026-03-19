'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Cpu,
  FileText,
  GitMerge,
  Heart,
  HardHat,
  ShieldCheck,
  Sparkles,
  Film,
  ArrowUpRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// --- Data -------------------------------------------------------------------

interface PortfolioItem {
  title: string
  description: string
  icon: LucideIcon
  badge: string
  badgeColor: string
  href?: string
  hero?: boolean
}

const projects: PortfolioItem[] = [
  {
    title: 'Daena',
    description: 'Governance-first AI agent orchestration platform with 10-stage pipeline, PhiLattice Architecture, and NBMF auditable memory',
    icon: Cpu,
    badge: 'Flagship',
    badgeColor: 'var(--color-mas-cyan)',
    href: 'https://daena.mas-ai.co',
    hero: true,
  },
  {
    title: 'Deena GAO',
    description: 'Web3 DeFi governance agent for decentralized autonomous organizations',
    icon: ShieldCheck,
    badge: 'Hackathon',
    badgeColor: '#7c3aed',
    href: 'https://github.com/Mas-AI-Official/hackathon_demo',
  },
  {
    title: 'ContentOPS',
    description: 'Autonomous content operations engine that scrapes, generates, and publishes across platforms',
    icon: FileText,
    badge: 'Active',
    badgeColor: '#22c55e',
    href: 'https://github.com/Mas-AI-Official/contentops-core',
  },
  {
    title: 'Med Smart',
    description: 'AI-powered medical diagnosis and patient care management',
    icon: Heart,
    badge: 'Built',
    badgeColor: 'var(--color-mas-cyan)',
    href: '/medsmart.html',
  },
  {
    title: 'Construction AI',
    description: 'Building code compliance, permit analysis, and project management',
    icon: HardHat,
    badge: 'Built',
    badgeColor: 'var(--color-mas-cyan)',
    href: '/construction-ai.html',
  },
  {
    title: 'LigoVids',
    description: 'AI-powered movie dubbing with actor voice preservation',
    icon: Film,
    badge: 'Private',
    badgeColor: '#6b7280',
  },
  {
    title: 'AI Autonomous Company OS',
    description: 'Core framework for building AI-native autonomous organizations',
    icon: GitMerge,
    badge: 'Private',
    badgeColor: '#6b7280',
  },
]

// --- Variants ---------------------------------------------------------------

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
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
    <section id="portfolio" className="relative px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-gradient font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            What We Build
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--color-mas-text-secondary)]">
            Products and projects built under MAS-AI Technologies Inc.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {projects.map((project) => {
            const Icon = project.icon
            const isExternal = project.href?.startsWith('http')
            const hasLink = Boolean(project.href)

            const cardContent = (
              <>
                {/* Top row: icon + badge */}
                <div className="flex items-start justify-between">
                  <Icon className="h-6 w-6 text-[var(--color-mas-text-muted)]" />
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${project.badgeColor} 20%, transparent)`,
                      color: project.badgeColor,
                    }}
                  >
                    {project.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-[var(--color-mas-text)]">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                  {project.description}
                </p>

                {/* Link indicator */}
                {hasLink && (
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--color-mas-cyan)] transition-colors group-hover:text-[var(--color-mas-text)]">
                    <span>Explore</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                )}
              </>
            )

            return (
              <motion.div
                key={project.title}
                variants={cardVariants}
                className={project.hero ? 'md:col-span-2' : ''}
              >
                {hasLink ? (
                  <a
                    href={project.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className={`glass group flex h-full flex-col rounded-xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-mas-cyan)]/30 ${
                      project.hero ? 'glow-border' : ''
                    }`}
                  >
                    {cardContent}
                  </a>
                ) : (
                  <div
                    className={`glass flex h-full cursor-default flex-col rounded-xl p-6 ${
                      project.hero ? 'glow-border' : ''
                    }`}
                  >
                    {cardContent}
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
