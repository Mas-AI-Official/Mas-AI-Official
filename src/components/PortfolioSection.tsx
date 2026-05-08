'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Cpu,
  FileText,
  GitMerge,
  Heart,
  HardHat,
  ShieldCheck,
  Film,
  Code2,
  Sparkles,
  ArrowUpRight,
  BadgeCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface PortfolioItem {
  title: string
  description: string
  icon: LucideIcon
  badge: string
  badgeColor: string
  /** Primary destination — the whole card click target. */
  href?: string
  hero?: boolean
  /** Optional brand image used instead of the lucide icon. Square works best. */
  logoSrc?: string
  logoAlt?: string
  /** Optional secondary CTA pill inside the card. Stops propagation so it
   *  doesn't trigger the whole-card link. Useful when a project has both
   *  a marketing site (primary) and a live demo (secondary explore path). */
  secondaryHref?: string
  secondaryLabel?: string
}

const projects: PortfolioItem[] = [
  {
    title: 'Daena',
    description: 'Governance-first AI agent orchestration platform with 10-stage pipeline, PhiLattice Architecture, NBMF auditable memory, and runtime adapters for Claude Code, Codex, Gemini, Grok, and Ollama',
    icon: Cpu,
    badge: 'Flagship',
    badgeColor: 'var(--color-mas-cyan)',
    href: 'https://daena.mas-ai.co',
    hero: true,
  },
  {
    title: 'Daena Coder',
    description: 'Open-source AI coding agent. Daena\u2019s 10-stage governance pipeline applied to code execution. Audit log on every edit, file/terminal/browser/MCP capabilities, bring-your-own runtime (Claude, GPT, Gemini, Grok, Ollama).',
    icon: Code2,
    badge: 'Open Source',
    badgeColor: '#2DD4BF',
    href: 'https://github.com/Mas-AI-Official/Daena-Coder',
  },
  {
    title: 'KYA Mission Control',
    description:
      'Trust infrastructure for autonomous AI agents. Cryptographic passports, scoped child delegation, multi-dimensional budget hard-stops, and Ed25519-signed mission receipts that are verifiable offline and optionally anchored on Base. Live border-checkpoint console with 9 interactive scenarios on real RFC 9421 signed requests.',
    icon: BadgeCheck,
    badge: 'Live',
    badgeColor: '#D4A843',
    // Primary (whole-card click): the marketing site \u2014 full story.
    href: 'https://kya.mas-ai.co',
    // Secondary pill: the live border-checkpoint demo.
    secondaryHref: 'https://kya-mission-lab-szw3mq5rma-nn.a.run.app/console/',
    secondaryLabel: 'Live demo',
    logoSrc: '/kya-logo.png',
    logoAlt: 'KYA Mission Control \u00b7 Identity \u00b7 Governance \u00b7 Access',
    hero: true,
  },
  {
    title: 'Daena Guard',
    description: 'AI security and governance layer for enterprise agent deployments',
    icon: ShieldCheck,
    badge: 'In Development',
    badgeColor: 'var(--color-mas-gold)',
    href: 'https://github.com/Mas-AI-Official/hackathon_demo',
  },
  {
    title: 'Predictor',
    description:
      'GPT, but with simulation on it. A local-first decision-simulation backend: drop in a question or a set of options, and it gathers evidence, simulates outcomes (persona reactions + scenario distribution), and returns ranked results with probability and an evidence trail. Universal Console (2–3 min calibrated forecast) or Deep Simulation (5–15 min multi-agent). HTTP + MCP service, Qwen3-8B local, AGPL v3.',
    icon: Sparkles,
    badge: 'Alpha v0.1',
    badgeColor: '#a78bfa',
    href: 'https://github.com/Mas-AI-Official/Predictor',
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

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
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

export default function PortfolioSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })

  return (
    <section className="relative px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-sm uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            PORTFOLIO
          </p>
          <h2 className="text-gradient font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            What We Build
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--color-mas-text-secondary)]">
            Products and projects built under MAS-AI Technologies Inc.
          </p>
        </motion.div>

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
            const hasSecondary = Boolean(project.secondaryHref)

            const cardContent = (
              <>
                <div className="flex items-start justify-between">
                  {project.logoSrc ? (
                    <div
                      className="relative w-12 h-12 rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-110 bg-black"
                      style={{
                        boxShadow: `0 0 0 1px color-mix(in srgb, ${project.badgeColor} 30%, transparent)`,
                      }}
                    >
                      <Image
                        src={project.logoSrc}
                        alt={project.logoAlt || project.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        background: `linear-gradient(135deg, color-mix(in srgb, ${project.badgeColor} 15%, transparent), transparent)`,
                        boxShadow: `0 0 0 1px color-mix(in srgb, ${project.badgeColor} 20%, transparent)`,
                      }}
                    >
                      <Icon className="h-5 w-5 transition-colors duration-300" style={{ color: project.badgeColor }} />
                    </div>
                  )}
                  <span
                    className="badge-shimmer rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${project.badgeColor} 15%, transparent)`,
                      color: project.badgeColor,
                    }}
                  >
                    {project.badge}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-[var(--color-mas-text)] transition-colors duration-300 group-hover:text-white">
                  {project.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                  {project.description}
                </p>

                {hasLink && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {/* Primary explore — when there's NO secondary, a plain
                        span is enough (the whole card is already an anchor).
                        When there IS a secondary, we make THIS the stretched
                        anchor (inset-0 ::after) so card-area clicks still go
                        to the primary URL — and the outer wrapper switches
                        to a <div> to avoid <a>-in-<a> nesting. */}
                    {hasSecondary ? (
                      // Stretched-link: ::after covers the whole card area
                      // (positioned against the card's `relative` outer div).
                      // Sits at z-[1] so it's above text content (z:auto)
                      // but BELOW the secondary pill (z-10).
                      <a
                        href={project.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-300 opacity-60 group-hover:opacity-100 after:absolute after:inset-0 after:content-[''] after:z-[1] after:rounded-xl"
                        style={{ color: project.badgeColor }}
                      >
                        <span>Website</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-300 opacity-60 group-hover:opacity-100"
                        style={{ color: project.badgeColor }}
                      >
                        <span>Explore</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    )}

                    {/* Secondary CTA pill — sits above the stretched anchor's
                        ::after via z-10 + relative positioning. */}
                    {project.secondaryHref && (
                      <a
                        href={project.secondaryHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                          borderColor: `color-mix(in srgb, ${project.badgeColor} 35%, transparent)`,
                          color: project.badgeColor,
                          backgroundColor: `color-mix(in srgb, ${project.badgeColor} 8%, transparent)`,
                        }}
                      >
                        <span>{project.secondaryLabel || 'Open'}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
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
                {hasLink && !hasSecondary ? (
                  // Single-link card: whole card is one anchor (simple case).
                  <a
                    href={project.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    data-cursor="explore"
                    className={`card-gradient-hover glass group flex h-full flex-col rounded-xl p-6 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] ${
                      project.hero ? 'animated-border breathe-glow' : 'hover:border-[var(--color-mas-cyan)]/30'
                    }`}
                  >
                    {cardContent}
                  </a>
                ) : hasLink && hasSecondary ? (
                  // Two-link card: outer is a <div> (no nested anchors).
                  // The primary "Website" link inside stretches via ::after
                  // to cover the whole card; the secondary pill sits on z-10
                  // so card-area clicks go to primary, pill clicks go to demo.
                  <div
                    data-cursor="explore"
                    className={`card-gradient-hover glass group relative flex h-full flex-col rounded-xl p-6 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] ${
                      project.hero ? 'animated-border breathe-glow' : 'hover:border-[var(--color-mas-cyan)]/30'
                    }`}
                  >
                    {cardContent}
                  </div>
                ) : (
                  <div
                    className={`card-gradient-hover glass flex h-full cursor-default flex-col rounded-xl p-6 group transition-all duration-400 hover:-translate-y-1 ${
                      project.hero ? 'animated-border breathe-glow' : ''
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
