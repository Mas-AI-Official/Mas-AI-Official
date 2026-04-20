'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Eye, FileSearch, Mic, CheckCircle2 } from 'lucide-react'

// The free audit is the primary lead magnet. Define EXACTLY what they get
// so there's no ambiguity at intake. Every minute of Masoud's time listed
// here is real.
// TODO(Masoud), plan marker 3. Override the scope if you want the free
// audit to be larger or smaller.

const phases = [
  {
    icon: Eye,
    phase: 'Phase 1',
    title: '2-hour recon',
    body:
      'You send us a URL (or a GitHub repo, or a Play Store link). I run Klyntar against it, automated scanners + manual inspection + external attack surface mapping. No meeting, no onboarding call. Just me, your stack, and 120 minutes.',
    deliverable: 'Raw scan logs + credential-leak hunt + DNS hygiene notes',
  },
  {
    icon: FileSearch,
    phase: 'Phase 2',
    title: '3 highest-impact findings',
    body:
      'From everything I find, I pick the 3 items most likely to land in the next pen test, the ones that would actually get you flagged by an auditor or an attacker. Proof-of-exploit included for anything that qualifies.',
    deliverable: 'Redacted 1-page PDF with the top 3 + why they matter + how to fix',
  },
  {
    icon: Mic,
    phase: 'Phase 3',
    title: '60-minute readout (optional)',
    body:
      'Optional. If you want us to walk through the findings with your team, we\'ll do a 60-min video call. Otherwise the PDF tells the whole story and you can act on it without us on the line.',
    deliverable: 'Call recording + Q&A doc if you want it',
  },
  {
    icon: CheckCircle2,
    phase: 'Phase 4',
    title: 'You decide what\'s next',
    body:
      'If the findings are worth fixing and you want us to architect the remediation, we scope a paid engagement, typically $12,500 for a single-target deep audit or $18,000 for a full build. If not, we part ways. Nothing owed. No follow-up spam.',
    deliverable: 'Fixed-scope proposal within 48 hours of your ask',
  },
]

const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const cardV = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export default function ArchitectAudit() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="audit-scope" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] font-[family-name:var(--font-mono)] text-[var(--color-klyntar-red)]">
            The free audit
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="text-white">Exactly what you get </span>
            <span className="text-gradient-red">. And exactly what it costs</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            No retainer. No upsell trap. Three hours of architect time,
            delivered in a PDF, on 48-hour turnaround. You owe us nothing.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerV}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {phases.map((p) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.title}
                variants={cardV}
                className="glass rounded-xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-klyntar-red)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-lg"
                    style={{
                      background: 'var(--color-klyntar-red-glow)',
                      border: '1px solid var(--color-klyntar-red)',
                    }}
                  >
                    <Icon size={20} style={{ color: 'var(--color-klyntar-red)' }} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-klyntar-red)]">
                    {p.phase}
                  </span>
                </div>

                <h3 className="mb-3 text-lg font-semibold text-white font-[family-name:var(--font-display)]">
                  {p.title}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                  {p.body}
                </p>

                <div className="rounded-lg border border-[var(--color-mas-border)]/50 bg-[rgba(15,22,41,0.4)] px-4 py-3">
                  <div className="text-[10px] uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)] mb-1">
                    Deliverable
                  </div>
                  <div className="text-xs text-[var(--color-mas-text)]">
                    {p.deliverable}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Anti-sell block, who this is NOT for (Hormozi filter) */}
        <div className="mt-14 rounded-2xl border border-[var(--color-mas-border)] bg-[rgba(15,22,41,0.3)] p-8 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)]">
            This is NOT for
          </p>
          <p className="mx-auto max-w-3xl text-base text-[var(--color-mas-text-secondary)]">
            Teams who need a 100-page scanner dump for a compliance audit
            (that&apos;s Big 4&apos;s job). Teams who want a retainer without
            first seeing output. Or anyone shopping on price. I charge what
            I charge because the deliverable lands. If $12k feels expensive,
            I&apos;m not your fit.
          </p>
        </div>
      </div>
    </section>
  )
}
