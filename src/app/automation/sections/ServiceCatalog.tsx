'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Bot,
  Mic,
  Calendar,
  Terminal,
  FileSearch,
  Plug,
} from 'lucide-react'

interface Service {
  icon: typeof Bot
  title: string
  hook?: string          // Hormozi-style hook: big claim or contrast, 1 line
  pitch: string
  deliverables: string[]
  timeframe: string
  guarantee?: string     // optional per-card risk reversal
}

// Positioning note: Catalog is ordered by install velocity.
// Fast wins first (OpenClaw, Claude Code) → higher-touch integrations last.
// The first card is written as the full Hormozi template, clone the pattern
// for the others when you're ready to tighten them.
const services: Service[] = [
  {
    icon: Terminal,
    title: 'OpenClaw, safely installed in 5 days',
    hook: 'Your devs want it. Your CISO won\'t sign it. We bridge the gap.',
    pitch:
      'The tool NVIDIA\'s CEO called "the next ChatGPT", wrapped in Daena governance so it runs scoped, audited, and reversible. Every action logs to your SIEM. Dangerous tool calls hit an approval queue before they fire.',
    deliverables: [
      'Hardened OpenClaw on your hardware or cloud (your pick)',
      'Daena sandbox with per-role approval gates',
      'Audit trail forwarded to your SIEM + Slack',
      'Klyntar security wrap, exploit signatures guard blast radius',
      'Runbook + 2-week founder-level hypercare',
    ],
    timeframe: '5 business days',
    guarantee: 'CISO not convinced after the demo? We refund and walk.',
  },
  {
    icon: Bot,
    title: 'Claude Code / Codex / Gemini CLI',
    pitch:
      'Your developers want Claude Code. Your security team wants to say no. We install it with guardrails so both sides get what they need.',
    deliverables: [
      'Multi-runtime setup (Claude, Codex, Gemini, Grok)',
      'Per-repo permissions + egress filters',
      'Audit log forwarding to your SIEM',
      'Team onboarding + best-practice guide',
    ],
    timeframe: '~1-2 weeks',
  },
  {
    icon: Mic,
    title: 'Voice Booking Assistant',
    pitch:
      'A 24/7 voice secretary that answers calls, books appointments, qualifies leads, and hands off to a human when the conversation matters.',
    deliverables: [
      'Twilio / ElevenLabs / 11Agents voice stack',
      'Calendar integration (Google / Outlook)',
      'CRM write-back (HubSpot / Pipedrive / Salesforce)',
      'Transcripts + call sentiment in Daena',
    ],
    timeframe: '~2 weeks',
  },
  {
    icon: Calendar,
    title: 'Executive Secretary Agent',
    pitch:
      'Inbox triage, meeting prep briefs, travel booking, contract chasing. A Daena-governed agent that knows your calendar and your preferences.',
    deliverables: [
      'Gmail / Outlook agent with approval queue',
      'Daily briefing at 7am with priorities',
      'Auto-drafted responses for your review',
      'Founder-Private memory tier (encrypted)',
    ],
    timeframe: '~2 weeks',
  },
  {
    icon: FileSearch,
    title: 'Custom Job Automations',
    pitch:
      'The 2-hour task you do every day? We build an agent that does it in 2 minutes, and logs every step so you can prove what happened.',
    deliverables: [
      '1 hour discovery → 1 agent prototype',
      'Governed by Daena 10-stage pipeline',
      'Integration with your existing tools',
      '4-week iteration window',
    ],
    timeframe: '~3-4 weeks',
  },
  {
    icon: Plug,
    title: 'MCP Connector Build-Out',
    pitch:
      'Connect your internal tools (databases, ticketing, ERP) as Model Context Protocol servers so any AI your team uses can reach them safely.',
    deliverables: [
      'Custom MCP servers for your internal APIs',
      'OAuth / SSO / tenant isolation',
      'Works with Claude, Codex, Daena, Klyntar',
      'Full source + docs delivered',
    ],
    timeframe: '~2-3 weeks',
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const card = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export default function ServiceCatalog() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="catalog" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            The Catalog
          </p>
          <h2 className="text-gradient font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Six ways we automate your business
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            Pick one to start. Every engagement is fixed-scope, fixed-price,
            and leaves you with production-grade infrastructure, not demos.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                variants={card}
                className="glass group relative overflow-hidden rounded-xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-mas-cyan)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--color-mas-cyan)] bg-[var(--color-mas-cyan-glow)]">
                    <Icon size={20} className="text-[var(--color-mas-cyan)]" />
                  </div>
                  <span className="rounded-full border border-[var(--color-mas-border)] px-3 py-1 text-[10px] uppercase tracking-wider text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]">
                    {s.timeframe}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white font-[family-name:var(--font-display)]">
                  {s.title}
                </h3>

                {s.hook && (
                  <p className="mb-3 text-sm italic leading-relaxed text-[var(--color-mas-cyan)]">
                    {s.hook}
                  </p>
                )}

                <p className="mb-5 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                  {s.pitch}
                </p>

                <ul className="space-y-2 border-t border-[var(--color-mas-border)] pt-5">
                  {s.deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-xs text-[var(--color-mas-text-secondary)]"
                    >
                      <span
                        aria-hidden
                        className="mt-[6px] inline-block h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-mas-cyan)]"
                      />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                {s.guarantee && (
                  <p className="mt-4 rounded-lg border border-[var(--color-mas-cyan)]/30 bg-[var(--color-mas-cyan-glow)]/5 px-3 py-2 text-xs text-[var(--color-mas-cyan)]">
                    <span className="font-semibold">Guarantee: </span>
                    {s.guarantee}
                  </p>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
