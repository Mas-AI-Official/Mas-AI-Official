'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Is the free option actually free?',
    a: 'Yes. No credit card. No obligation. No auto-enrollment into a paid plan. We give up 30 minutes on the call or 2 hours on the security scan because people who see the work firsthand convert far better than any cold outreach we could send. The free tier is marketing that costs us time instead of dollars.',
  },
  {
    q: 'Can Ontario businesses actually afford your paid engagements?',
    a: 'Yes, and the free tier is where we prove it. Scope matches the client. A local SMB that needs one agent or a single website scan gets a smaller fixed-scope engagement (typically $3k to $8k). Enterprise engagements with multi-system scope run $12k to $45k. We size the work to the business. The free consultation is where we figure out which bucket you fit.',
  },
  {
    q: 'What if we want all three options?',
    a: 'Book the 30-minute consultation first. We figure out which combination makes sense. Often we run the security scan or the automation audit as part of a paid engagement once both are in scope.',
  },
  {
    q: 'Do you work on platforms you did not build?',
    a: 'Yes. Daena and Klyntar are what we build with when you need them, but we work with whatever stack you run. AWS, GCP, Azure, on-prem, open-source, commercial, whatever. Security work is stack-agnostic. Automation work adapts to the AI runtimes your team already prefers.',
  },
  {
    q: 'What counts as a valid target for the free security scan?',
    a: 'A public URL. A GitHub repo. A mobile app store link. An API endpoint we can reach. Anything outside your firewall, essentially. For internal-only systems we arrange scope during a paid engagement with an NDA in place.',
  },
  {
    q: 'We are in the EU. Is the AI Act offer separate?',
    a: 'Yes, that is a separate time-boxed offer. Book the 30-min call and we decide whether your AI features put you in scope for the Aug 2, 2026 deadline. If they do, we switch to the readiness sprint track and deliver regulator-ready artifacts in 10 business days.',
  },
  {
    q: 'Who sees our data during the free scan?',
    a: 'Only us. Nothing goes to third parties. Vault material (anything sensitive pulled into Klyntar during a recon) is destroyed within 24 hours of delivering the PDF. If you want an NDA in place first, we sign yours or send you ours before we touch anything.',
  },
  {
    q: 'What happens if attackers still get through after we finish?',
    a: 'Every engagement is scoped to specific targets and a specific window. We find and fix what we can find inside that window. We do not promise 100% security (nobody can, and anyone who claims they can is lying). Our contract caps liability at the engagement value, carves out third-party breaches and zero-day CVEs discovered after delivery, and sets clear scope boundaries. We are careful. We are governed. We are not insurance.',
  },
  {
    q: 'Can we see case studies first?',
    a: 'We are in early engagement phase so case studies are limited and anonymized. What we can show you: the patents (USPTO #63/877,082 and #64/020,421), the GitHub commits, the Daena product at daena.mas-ai.co, and the Klyntar capability list. Ask us on the call.',
  },
]

export default function BookingFaq() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section ref={ref} className="relative py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            Before you book
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
            <span className="text-white">Questions we get </span>
            <span className="text-gradient">a lot</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="rounded-xl border border-[var(--color-mas-border)] bg-[rgba(15,22,41,0.4)] backdrop-blur-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="font-[family-name:var(--font-display)] text-base font-semibold text-white md:text-lg">
                  {f.q}
                </span>
                <ChevronDown
                  size={20}
                  className="flex-shrink-0 text-[var(--color-mas-cyan)] transition-transform duration-300"
                  style={{ transform: openIdx === idx ? 'rotate(180deg)' : 'rotate(0)' }}
                />
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
