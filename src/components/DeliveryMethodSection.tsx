'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Search,
  DraftingCompass,
  Blocks,
  ShieldCheck,
  Rocket,
  ArrowRight,
  Clock3,
  FileCheck2,
} from 'lucide-react'

type DeliveryStep = {
  number: string
  title: string
  description: string
  output: string
  icon: typeof Search
  accent: string
}

const steps: DeliveryStep[] = [
  {
    number: '01',
    title: 'Discover the first workflow',
    description:
      'We map the people, systems, delays, risks, and handoffs around one real process. The goal is not “add AI.” The goal is a measurable business result.',
    output: 'Priority workflow, baseline, and success metric',
    icon: Search,
    accent: 'var(--color-mas-cyan)',
  },
  {
    number: '02',
    title: 'Write the operating blueprint',
    description:
      'We define integrations, data boundaries, human approvals, failure states, ownership, and the exact scope before implementation begins.',
    output: 'Written scope, architecture, timeline, and fixed price',
    icon: DraftingCompass,
    accent: 'var(--color-mas-gold)',
  },
  {
    number: '03',
    title: 'Build in a controlled environment',
    description:
      'We connect the required tools, implement the workflow, add audit trails, and keep risky actions behind explicit approval gates.',
    output: 'Working staging system with source repository',
    icon: Blocks,
    accent: 'var(--color-mas-cyan)',
  },
  {
    number: '04',
    title: 'Prove it before production',
    description:
      'We test expected behavior, edge cases, access controls, rollback paths, and security. You see what passed, what failed, and what changed.',
    output: 'Acceptance evidence, risk review, and launch sign-off',
    icon: ShieldCheck,
    accent: 'var(--color-klyntar-red)',
  },
  {
    number: '05',
    title: 'Launch, hand over, and improve',
    description:
      'We deploy the first workflow, train the people who own it, document the system, and define what should be automated next based on real usage.',
    output: 'Live workflow, documentation, training, and ownership',
    icon: Rocket,
    accent: 'var(--color-mas-gold)',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const stepVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export default function DeliveryMethodSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="delivery" className="relative overflow-hidden py-20 md:py-28">
      <div className="enterprise-grid-bg pointer-events-none absolute inset-0 opacity-35" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/3 h-[460px] w-[460px] rounded-full opacity-[0.08] blur-[140px]"
        style={{ background: 'var(--color-mas-cyan)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[460px] w-[460px] rounded-full opacity-[0.08] blur-[140px]"
        style={{ background: 'var(--color-mas-gold)' }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
              How We Deliver
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              <span className="text-white">No black box. </span>
              <span className="text-gradient">You see the system become real.</span>
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--color-mas-text-secondary)] md:text-lg">
              Every engagement moves through the same evidence-based delivery path. Scope is written before build,
              approvals are designed before execution, and production happens only after acceptance testing.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-mas-gold)]/25 bg-[var(--color-mas-gold)]/[0.05] px-5 py-4 text-left lg:max-w-[290px]">
            <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-[family-name:var(--font-mono)] text-[var(--color-mas-gold)]">
              <Clock3 size={13} /> Typical focused deployment
            </p>
            <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
              First workflow in as little as 21 days
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-mas-text-muted)]">
              Timing depends on access, integrations, and approval requirements. The written blueprint sets the real schedule.
            </p>
          </div>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-[27px] top-10 hidden h-[calc(100%-5rem)] w-px bg-gradient-to-b from-[var(--color-mas-cyan)]/60 via-[var(--color-mas-gold)]/30 to-[var(--color-klyntar-red)]/20 md:block lg:left-[calc(10%+27px)] lg:right-[10%] lg:top-[27px] lg:h-px lg:w-auto"
          />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <motion.article
                  key={step.number}
                  variants={stepVariants}
                  className="group relative rounded-3xl border border-[var(--color-mas-border)] bg-[rgba(10,14,26,0.7)] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
                >
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div
                      className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border bg-[var(--color-mas-bg)]"
                      style={{
                        color: step.accent,
                        borderColor: `color-mix(in srgb, ${step.accent} 45%, transparent)`,
                        boxShadow: `0 0 28px color-mix(in srgb, ${step.accent} 15%, transparent)`,
                      }}
                    >
                      <Icon size={23} />
                    </div>
                    <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-white/[0.06] transition-colors duration-300 group-hover:text-white/[0.1]">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mb-3 font-[family-name:var(--font-display)] text-lg font-bold leading-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                    {step.description}
                  </p>

                  <div className="mt-auto border-t border-[var(--color-mas-border)]/60 pt-4">
                    <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)]">
                      <FileCheck2 size={12} style={{ color: step.accent }} />
                      You receive
                    </p>
                    <p className="text-sm font-medium leading-relaxed text-white/90">{step.output}</p>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="/book"
            data-cursor="cta"
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: 'var(--color-mas-gold)',
              color: 'var(--color-mas-bg)',
              boxShadow: '0 0 28px var(--color-mas-gold-glow)',
            }}
          >
            Map My First Workflow
            <ArrowRight size={16} />
          </a>
          <a
            href="/automation"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-mas-border)] px-8 py-4 text-sm font-semibold text-[var(--color-mas-text-secondary)] transition-all duration-300 hover:border-[var(--color-mas-cyan)]/50 hover:text-white"
          >
            See Automation Services
          </a>
        </motion.div>
      </div>
    </section>
  )
}
