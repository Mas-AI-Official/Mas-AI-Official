'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Building2,
  BriefcaseBusiness,
  HardHat,
  HeartPulse,
  Laptop2,
  ShoppingBag,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react'

type Sector = {
  icon: typeof Building2
  title: string
  description: string
  workflows: string[]
  firstWin: string
  accent: string
}

const sectors: Sector[] = [
  {
    icon: Building2,
    title: 'Real Estate & Property Operations',
    description:
      'Turn slow lead response, listing coordination, tenant questions, and maintenance intake into governed workflows that stay visible to your team.',
    workflows: ['Lead qualification', 'Listing coordination', 'Tenant support'],
    firstWin: 'Respond to every new lead in minutes, then route qualified opportunities to a human.',
    accent: 'var(--color-mas-gold)',
  },
  {
    icon: HeartPulse,
    title: 'Clinics & Care Administration',
    description:
      'Reduce front-desk pressure without handing clinical judgment to an agent. Automate intake, scheduling, reminders, document routing, and follow-up.',
    workflows: ['Patient intake', 'Scheduling', 'Follow-up'],
    firstWin: 'Recover missed calls and reduce no-shows while keeping staff approval in the loop.',
    accent: 'var(--color-mas-cyan)',
  },
  {
    icon: HardHat,
    title: 'Construction & Field Operations',
    description:
      'Connect project documents, RFIs, permits, daily reports, and compliance tasks so teams spend less time searching and more time building.',
    workflows: ['Document control', 'RFI routing', 'Permit tracking'],
    firstWin: 'Give project teams one governed assistant for finding, drafting, and routing project information.',
    accent: 'var(--color-mas-gold)',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Professional Services',
    description:
      'Create a reliable operating layer for proposals, research, client onboarding, meeting follow-up, knowledge retrieval, and recurring reporting.',
    workflows: ['Client onboarding', 'Proposal drafting', 'Knowledge search'],
    firstWin: 'Turn every meeting into assigned actions, client follow-up, and an auditable record.',
    accent: 'var(--color-mas-cyan)',
  },
  {
    icon: ShoppingBag,
    title: 'Commerce & Customer Operations',
    description:
      'Coordinate customer support, order questions, returns, content, and escalation across the tools you already use, with clear approval boundaries.',
    workflows: ['Customer support', 'Returns triage', 'Content operations'],
    firstWin: 'Resolve repetitive questions automatically and escalate exceptions with full context.',
    accent: 'var(--color-klyntar-red)',
  },
  {
    icon: Laptop2,
    title: 'SaaS, AI & Digital Products',
    description:
      'Add governed agents to support, QA, engineering, security, and internal operations without replacing your stack or locking into one model provider.',
    workflows: ['Support operations', 'Agentic QA', 'Security review'],
    firstWin: 'Deploy one production workflow with approvals, audit trails, and measurable reliability.',
    accent: 'var(--color-klyntar-red)',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export default function SectorsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-90px' })

  return (
    <section id="sectors" className="relative overflow-hidden py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 h-[520px] w-[900px] max-w-[95vw] -translate-x-1/2 rounded-full opacity-10 blur-[150px]"
        style={{ background: 'var(--color-mas-gold)' }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] font-[family-name:var(--font-mono)] text-[var(--color-mas-gold)]">
            Who We Build For
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="text-white">Start with the workflow that </span>
            <span className="text-gradient-gold">pays for the next one.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-[var(--color-mas-text-secondary)] md:text-lg">
            We do not sell a generic chatbot. We identify one expensive, repetitive, or risky process,
            connect it to your real systems, and launch a governed first workflow with a measurable result.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {sectors.map((sector) => {
            const Icon = sector.icon
            return (
              <motion.article
                key={sector.title}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-[var(--color-mas-border)] bg-[rgba(10,14,26,0.58)] p-7 backdrop-blur-xl transition-colors duration-300 hover:border-white/20"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-[0.08] blur-[70px] transition-opacity duration-300 group-hover:opacity-[0.16]"
                  style={{ background: sector.accent }}
                />

                <div className="relative">
                  <div
                    className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border"
                    style={{
                      color: sector.accent,
                      borderColor: `color-mix(in srgb, ${sector.accent} 35%, transparent)`,
                      background: `color-mix(in srgb, ${sector.accent} 8%, transparent)`,
                    }}
                  >
                    <Icon size={23} />
                  </div>

                  <h3 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold leading-tight text-white">
                    {sector.title}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                    {sector.description}
                  </p>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {sector.workflows.map((workflow) => (
                      <span
                        key={workflow}
                        className="rounded-full border border-[var(--color-mas-border)] bg-white/[0.025] px-3 py-1.5 text-[11px] font-medium text-[var(--color-mas-text-secondary)]"
                      >
                        {workflow}
                      </span>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-[var(--color-mas-border)]/60 bg-black/20 p-4">
                    <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)]">
                      <CheckCircle2 size={12} style={{ color: sector.accent }} />
                      Strong first win
                    </p>
                    <p className="text-sm leading-relaxed text-white/90">{sector.firstWin}</p>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl border border-[var(--color-mas-border)] bg-[rgba(15,22,41,0.42)] p-7 text-center backdrop-blur-xl md:flex-row md:text-left"
        >
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.24em] font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
              Your sector is not listed?
            </p>
            <p className="max-w-3xl text-sm leading-relaxed text-[var(--color-mas-text-secondary)] md:text-base">
              The common pattern is what matters: repeated work, fragmented tools, slow follow-up, or risky actions that need human approval.
            </p>
          </div>
          <a
            href="/book"
            data-cursor="cta"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--color-mas-cyan)] px-6 py-3 text-sm font-bold text-[var(--color-mas-cyan)] transition-all duration-300 hover:scale-[1.03] hover:bg-[var(--color-mas-cyan)]/10"
          >
            Map My Workflow
            <ArrowUpRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
