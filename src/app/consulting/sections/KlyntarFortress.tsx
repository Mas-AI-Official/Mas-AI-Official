'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Bug, Radar, Lock, Fingerprint, Network, Target } from 'lucide-react'

const capabilities = [
  {
    icon: Bug,
    label: 'Exploit Signatures',
    value: '25+',
    detail: 'SQLi · XSS · CMDi · SSRF · XXE · Log4Shell · path traversal',
  },
  {
    icon: Radar,
    label: 'Scanners Detected',
    value: '45+',
    detail: 'nuclei · sqlmap · burp · nmap · hydra · gobuster · by behavior',
  },
  {
    icon: Fingerprint,
    label: 'Attacker Fingerprinting',
    value: 'TTL · TCP · HTTP',
    detail: 'OS + toolchain + intent classification in <1s',
  },
  {
    icon: Target,
    label: 'Honeypot Traps',
    value: 'Tarpit',
    detail: 'Fake endpoints that slow attackers and log every request',
  },
  {
    icon: Network,
    label: 'Tor / Darkweb Intel',
    value: 'Live',
    detail: 'Cross-reference IPs against .onion threat feeds',
  },
  {
    icon: Lock,
    label: 'Zero-FP Gate',
    value: 'No noise',
    detail: 'Findings without a working exploit are dropped before reporting',
  },
]

export default function KlyntarFortress() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] font-[family-name:var(--font-mono)] text-[var(--color-klyntar-red)]">
            Under the hood
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="text-white">Built on </span>
            <span className="text-gradient-red">Klyntar</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            Klyntar is our security-first AI platform, a 20-stage reasoning
            pipeline hardened with defense-in-depth. Every engagement runs on
            the same stack we use to protect our own infrastructure.
          </p>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {capabilities.map((c) => {
            const Icon = c.icon
            return (
              <motion.div
                key={c.label}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="glass rounded-xl p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Icon size={22} style={{ color: 'var(--color-klyntar-red)' }} />
                  <p className="text-[11px] uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)]">
                    {c.label}
                  </p>
                </div>
                <div className="mb-2 text-2xl font-bold text-neon-red font-[family-name:var(--font-display)]">
                  {c.value}
                </div>
                <p className="text-sm text-[var(--color-mas-text-secondary)]">
                  {c.detail}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
