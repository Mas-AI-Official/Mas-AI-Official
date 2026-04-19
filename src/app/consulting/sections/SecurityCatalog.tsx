'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Globe,
  Smartphone,
  Brain,
  Database,
  Building,
  LifeBuoy,
} from 'lucide-react'

interface Service {
  icon: typeof Globe
  title: string
  hook?: string
  pitch: string
  deliverables: string[]
  timeframe: string
  guarantee?: string
}

// First card is rewritten in the full Hormozi pattern, the rest follow the
// same template once you've edited them with your own voice.
const services: Service[] = [
  {
    icon: Globe,
    title: 'Website Security Scan, results in 5 days',
    hook: 'Every finding comes with a working exploit. Or it doesn\'t make the report.',
    pitch:
      'Klyntar-powered audit of your public site. We go deeper than automated scanners. SQLi, XSS, CMDi, SSRF, XXE, Log4Shell, broken auth, and every CRITICAL we report ships with a reproducible proof-of-exploit. No scanner dumps. No 100-page PDFs. Just the short list of things that are actually exposed.',
    deliverables: [
      'Automated + manual test coverage (OWASP + API Top 10)',
      'Zero-FP gate. OPERATOR+ findings must reproduce or they\'re dropped',
      'BeyondMythos enrichment on every finding',
      'Executive summary + technical deep-dive',
      'Remediation guide with copy-paste code snippets',
      'One round of re-test after fixes included',
    ],
    timeframe: '5 business days',
    guarantee: 'No working exploit at OPERATOR+ tier? You pay nothing.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Audit (APK / IPA)',
    pitch:
      'Static + dynamic analysis for Android and iOS builds. We find hardcoded secrets, insecure storage, broken cert pinning, and risky third-party SDKs.',
    deliverables: [
      'APK/IPA decompilation + static scan',
      'Runtime instrumentation (Frida)',
      'Secrets + credential audit',
      'App-store compliance checklist',
    ],
    timeframe: '~1–2 weeks',
  },
  {
    icon: Brain,
    title: 'AI Governance Audit',
    pitch:
      'Your team shipped an LLM feature. Does it leak training data? Can users jailbreak it? Are prompts auditable? We benchmark against Daena governance standards.',
    deliverables: [
      'Prompt-injection + jailbreak testing',
      'PII leakage + memorization probes',
      'Tool-use permission review',
      'Governance gap report + fixes',
    ],
    timeframe: '~2 weeks',
  },
  {
    icon: Building,
    title: 'Business Infrastructure Review',
    pitch:
      'Exposed S3 buckets, misconfigured DNS, dangling subdomains, leaked creds on GitHub. We find what\'s hanging out in public and lock it down.',
    deliverables: [
      'External attack surface map',
      'Credential leak hunt (GitHub, pastebin)',
      'DNS + subdomain hygiene audit',
      'SaaS + vendor exposure review',
    ],
    timeframe: '~1–2 weeks',
  },
  {
    icon: Database,
    title: 'Code Review + CI/CD Hardening',
    pitch:
      'Repo-level audit for insecure patterns, supply-chain risk, and weak CI/CD. We plug Klyntar into your pipeline so every PR gets scanned.',
    deliverables: [
      'Semgrep + custom rule authoring',
      'Dependency + SBOM audit',
      'GitHub Actions / GitLab CI hardening',
      'Klyntar PR-scan integration',
    ],
    timeframe: '~2 weeks',
  },
  {
    icon: LifeBuoy,
    title: 'Vulnerability Support Retainer',
    pitch:
      'Ongoing: when your vendor drops a CVE or your team ships a scary PR, we respond. Klyntar monitors, we triage, you stay shipping.',
    deliverables: [
      '24-hour critical-CVE response SLA',
      'Monthly threat intel brief',
      'Klyntar continuous monitoring',
      'Retained hours for incident response',
    ],
    timeframe: 'ongoing',
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

export default function SecurityCatalog() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="catalog" className="relative py-20 md:py-28">
      <div className="klyntar-grid-bg absolute inset-0 pointer-events-none opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] font-[family-name:var(--font-mono)] text-[var(--color-klyntar-red)]">
            The Catalog
          </p>
          <h2 className="text-gradient-red font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Six ways we harden your business
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            Every engagement ends with a proof-of-exploit bundle. If we can&apos;t
            break it, we say so, and you have a defensible record.
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
                className="glass group relative overflow-hidden rounded-xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-klyntar-red)]"
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
                  <span className="rounded-full border border-[var(--color-mas-border)] px-3 py-1 text-[10px] uppercase tracking-wider text-[var(--color-mas-text-muted)] font-[family-name:var(--font-mono)]">
                    {s.timeframe}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white font-[family-name:var(--font-display)]">
                  {s.title}
                </h3>

                {s.hook && (
                  <p className="mb-3 text-sm italic leading-relaxed text-[var(--color-klyntar-red)]">
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
                        className="mt-[6px] inline-block h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-klyntar-red)]"
                      />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                {s.guarantee && (
                  <p className="mt-4 rounded-lg border border-[var(--color-klyntar-red)]/30 bg-[var(--color-klyntar-red-glow)]/5 px-3 py-2 text-xs text-[var(--color-klyntar-red)]">
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
