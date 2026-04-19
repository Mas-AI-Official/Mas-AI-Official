'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  FileText,
  Award,
  Sparkles,
  GraduationCap,
  Github,
  ShieldAlert,
  Search,
  TestTube,
} from 'lucide-react'

// Design principle: every single claim on this wall must be publicly
// verifiable by a stranger Googling for 60 seconds. No "elite", no "certified
// bug hunter", no "worked with Google." Only what survives scrutiny.

interface Patent {
  title: string
  appNumber: string
  filedDate: string
  description: string
}

const patents: Patent[] = [
  {
    title: 'PhiLattice Architecture',
    appNumber: 'USPTO #63/877,082',
    filedDate: 'Filed September 2025',
    description:
      'Fibonacci-hexagonal agent topology for governed multi-agent orchestration. Sunflower-honeycomb structure codebase-internal; PhiLattice is the external brand.',
  },
  {
    title: 'Neural-Backed Memory Fabric (NBMF)',
    appNumber: 'USPTO #64/020,421',
    filedDate: 'Filed March 2026',
    description:
      '5-tier trust-gated memory system with content-addressable deduplication, auto-expiring hallucinations, and tenant-scoped cross-department learning.',
  },
]

interface Credential {
  icon: typeof Award
  label: string
  title: string
  detail: string
  verifiable: string
  accent: 'cyan' | 'red' | 'gold'
}

const credentials: Credential[] = [
  {
    icon: Award,
    label: 'Accepted 2026',
    title: 'Google for Startups',
    detail: 'Program acceptance. GCP credits + ecosystem access for MAS-AI Technologies Inc.',
    verifiable: 'Verifiable via cloud.google.com/startup',
    accent: 'gold',
  },
  {
    icon: Sparkles,
    label: '2025/2026',
    title: 'Anthropic Academy',
    detail: 'Certified: Claude API, Model Context Protocol, Claude Code, AI Fluency.',
    verifiable: 'Verifiable via anthropic.com Academy',
    accent: 'cyan',
  },
  {
    icon: GraduationCap,
    label: '2025',
    title: 'Seneca College',
    detail: 'Graduate Certificate in Artificial Intelligence.',
    verifiable: 'Verifiable via Seneca alumni records',
    accent: 'cyan',
  },
  {
    icon: Github,
    label: 'Last 12 months',
    title: '2,038 GitHub contributions',
    detail: 'Sole engineer on Daena + Klyntar. 15+ public repos under Mas-AI-Official.',
    verifiable: 'Verifiable via github.com/Mas-AI-Official',
    accent: 'cyan',
  },
  {
    icon: TestTube,
    label: 'Daena v3.7',
    title: '2,956 tests passing',
    detail: '10-stage governed pipeline, 60 agent capabilities across 10 departments, 0 regressions at delivery.',
    verifiable: 'Verifiable via release notes at daena.mas-ai.co/whats-new',
    accent: 'cyan',
  },
  {
    icon: ShieldAlert,
    label: 'Klyntar Platform',
    title: '25+ exploit signatures',
    detail: 'SQLi · XSS · CMDi · SSRF · XXE · Log4Shell · plus 45+ scanners detected by behavior. Zero-FP gate.',
    verifiable: 'Architecture public at mas-ai.co/consulting',
    accent: 'red',
  },
  {
    icon: Search,
    label: 'Registered 2025',
    title: 'Bugcrowd researcher',
    // TODO(Masoud), line 2 flagged in plan. Confirm exact program list before
    // ship. Registration on a program is public; having accepted findings is
    // semi-public only if the program publishes a hall of fame.
    detail:
      'Registered security researcher on Bugcrowd. Active on public bug bounty programs at Tesla, Microsoft, Google, and X.',
    verifiable: 'Profile URL on request',
    accent: 'red',
  },
  {
    icon: FileText,
    label: 'Public',
    title: 'Toronto Starts member',
    detail: 'Federally incorporated in Canada. Member of Toronto startup ecosystem programs.',
    verifiable: 'Verifiable via torontostarts.com',
    accent: 'gold',
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export default function CredentialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            The Proof Wall
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="text-white">Every claim here is </span>
            <span className="text-gradient">verifiable</span>
            <span className="text-white">.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            No hype. No &ldquo;certified elite.&rdquo; Just what <strong className="text-white">we can show you the source for</strong>. Ask us about any line. We&apos;ll send you the link.
          </p>
        </div>

        {/* Featured: Patents (two side-by-side) */}
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {patents.map((p) => (
            <motion.div
              key={p.appNumber}
              variants={item}
              className="animated-border relative overflow-hidden rounded-2xl p-8"
            >
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--color-mas-cyan-glow), transparent)',
                        border: '1px solid var(--color-mas-cyan)',
                      }}
                    >
                      <FileText size={18} className="text-[var(--color-mas-cyan)]" />
                    </div>
                    <span className="text-[11px] uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
                      USPTO Provisional Patent
                    </span>
                  </div>
                  <span className="rounded-full border border-[var(--color-mas-border)] px-3 py-1 text-[10px] font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)]">
                    {p.filedDate}
                  </span>
                </div>

                <h3 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-bold text-white md:text-3xl">
                  {p.title}
                </h3>
                <p className="mb-3 font-[family-name:var(--font-mono)] text-xs text-[var(--color-mas-gold)]">
                  {p.appNumber}
                </p>
                <p className="text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                  {p.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Credentials grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {credentials.map((c) => {
            const Icon = c.icon
            const accentVar =
              c.accent === 'cyan'
                ? 'var(--color-mas-cyan)'
                : c.accent === 'red'
                ? 'var(--color-klyntar-red)'
                : 'var(--color-mas-gold)'
            const glow =
              c.accent === 'cyan'
                ? 'var(--color-mas-cyan-glow)'
                : c.accent === 'red'
                ? 'var(--color-klyntar-red-glow)'
                : 'var(--color-mas-gold-glow)'

            return (
              <motion.div
                key={c.title}
                variants={item}
                className="glass rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accentVar
                  e.currentTarget.style.boxShadow = `0 12px 40px ${glow}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <Icon size={18} style={{ color: accentVar }} />
                  <span
                    className="text-[10px] uppercase tracking-widest font-[family-name:var(--font-mono)]"
                    style={{ color: accentVar }}
                  >
                    {c.label}
                  </span>
                </div>
                <h3 className="mb-2 font-[family-name:var(--font-display)] text-base font-semibold text-white md:text-lg">
                  {c.title}
                </h3>
                <p className="mb-4 text-xs leading-relaxed text-[var(--color-mas-text-secondary)]">
                  {c.detail}
                </p>
                <p className="border-t border-[var(--color-mas-border)]/50 pt-3 text-[10px] italic text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]">
                  {c.verifiable}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom honesty line */}
        <p className="mt-10 text-center text-xs text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]">
          Every claim above has a public source. If a line here doesn&apos;t
          match what you find when you Google it, tell us and we&apos;ll take
          it down.
        </p>
      </div>
    </section>
  )
}
