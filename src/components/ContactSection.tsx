'use client'

import { useRef, useState, type FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight,
  Mail,
  Calendar,
  ArrowUpRight,
  Sparkles,
  CheckCircle,
  Shield,
  Zap,
  Users,
  Loader2,
} from 'lucide-react'

// --- Variants ---------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
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

// --- Component --------------------------------------------------------------

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email || !name) return

    setFormState('loading')

    try {
      // FormSubmit.co — free, no signup needed, emails go directly to founder
      const res = await fetch('https://formsubmit.co/ajax/masoud.masoori@mas-ai.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company: company || 'Not specified',
          _subject: `Early Access Request: ${name}${company ? ` (${company})` : ''}`,
          source: 'mas-ai.co early access form',
          timestamp: new Date().toISOString(),
        }),
      })

      if (res.ok) {
        setFormState('success')
        setEmail('')
        setName('')
        setCompany('')
      } else {
        throw new Error('Submission failed')
      }
    } catch {
      // Fallback: open mailto with pre-filled content
      const subject = encodeURIComponent(`Early Access Request: ${name}`)
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'Not specified'}\n\nI'd like to request early access to Daena.`
      )
      window.open(`mailto:masoud.masoori@mas-ai.co?subject=${subject}&body=${body}`)
      setFormState('success')
    }
  }

  return (
    <section id="early-access" className="relative px-6 py-20 md:py-28">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,200,255,0.04) 40%, rgba(0,200,255,0.04) 60%, transparent 100%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-mas-cyan)]/20 bg-[var(--color-mas-cyan)]/8 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-mas-cyan)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-mas-cyan)] font-[family-name:var(--font-mono)]">
              Limited Early Access
            </span>
          </div>
          <h2 className="text-gradient font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Be First to Deploy Governed AI
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-mas-text-secondary)] md:text-lg">
            Join our early access program. Get hands-on with Daena before public launch
            and help shape the future of governed AI agent orchestration.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-8 lg:grid-cols-5"
        >
          {/* Left: Early Access Form (3 cols) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-3 rounded-2xl p-8 md:p-10 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 22, 41, 0.6) 0%, rgba(20, 28, 50, 0.5) 100%)',
              border: '1px solid rgba(0, 200, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-60 h-60 bg-[var(--color-mas-cyan)]/[0.04] rounded-full blur-3xl pointer-events-none" />

            <h3 className="font-display text-xl font-bold text-white mb-2">
              Request Early Access
            </h3>
            <p className="text-sm text-[var(--color-mas-text-secondary)] mb-8">
              Fill out the form and we&apos;ll reach out with onboarding details within 24 hours.
            </p>

            {formState === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
                <h4 className="font-display text-lg font-bold text-white">You&apos;re on the list!</h4>
                <p className="text-sm text-[var(--color-mas-text-secondary)] text-center max-w-sm">
                  We&apos;ll review your request and reach out within 24 hours with next steps.
                  Check your email for a confirmation.
                </p>
                <button
                  onClick={() => setFormState('idle')}
                  className="mt-2 text-xs text-[var(--color-mas-cyan)] hover:underline"
                >
                  Submit another request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-mas-text-muted)] mb-2 font-[family-name:var(--font-mono)]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full rounded-xl bg-white/[0.04] border border-[var(--color-mas-border)] px-4 py-3 text-sm text-white placeholder:text-[var(--color-mas-text-muted)] outline-none transition-all duration-300 focus:border-[var(--color-mas-cyan)]/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,200,255,0.08)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-mas-text-muted)] mb-2 font-[family-name:var(--font-mono)]">
                      Company
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full rounded-xl bg-white/[0.04] border border-[var(--color-mas-border)] px-4 py-3 text-sm text-white placeholder:text-[var(--color-mas-text-muted)] outline-none transition-all duration-300 focus:border-[var(--color-mas-cyan)]/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,200,255,0.08)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[var(--color-mas-text-muted)] mb-2 font-[family-name:var(--font-mono)]">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="w-full rounded-xl bg-white/[0.04] border border-[var(--color-mas-border)] px-4 py-3 text-sm text-white placeholder:text-[var(--color-mas-text-muted)] outline-none transition-all duration-300 focus:border-[var(--color-mas-cyan)]/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,200,255,0.08)]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formState === 'loading'}
                  className="btn-ripple group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-mas-cyan)] px-8 py-3.5 text-sm font-bold text-[var(--color-mas-bg)] transition-all duration-300 hover:shadow-[0_0_32px_var(--color-mas-cyan-glow)] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {formState === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Request Early Access
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </button>
                <p className="text-[11px] text-[var(--color-mas-text-muted)] text-center">
                  No spam. We&apos;ll only contact you about early access.
                </p>
              </form>
            )}
          </motion.div>

          {/* Right: What you get + Enterprise contact (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* What early access includes */}
            <motion.div
              variants={cardVariants}
              className="rounded-2xl p-7 flex-1"
              style={{
                background: 'rgba(15, 22, 41, 0.5)',
                border: '1px solid rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <h4 className="font-display text-base font-bold text-white mb-5">
                Early Access Includes
              </h4>
              <ul className="flex flex-col gap-4">
                {[
                  { icon: Zap, text: 'Full platform access with governed agent orchestration', color: 'var(--color-mas-cyan)' },
                  { icon: Shield, text: '10-stage pipeline with audit trail and policy enforcement', color: 'var(--color-mas-gold)' },
                  { icon: Users, text: 'Direct line to the founder for onboarding support', color: '#a78bfa' },
                  { icon: Sparkles, text: 'Shape the roadmap — your feedback drives development', color: '#22c55e' },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <li key={i} className="flex items-start gap-3 group/item">
                      <div
                        className="mt-0.5 flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-all duration-300 group-hover/item:scale-110"
                        style={{
                          background: `linear-gradient(135deg, color-mix(in srgb, ${item.color} 15%, transparent), transparent)`,
                          boxShadow: `0 0 0 1px color-mix(in srgb, ${item.color} 20%, transparent)`,
                        }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                      </div>
                      <span className="text-sm text-[var(--color-mas-text-secondary)] leading-snug">
                        {item.text}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </motion.div>

            {/* Enterprise inquiry card */}
            <motion.div
              variants={cardVariants}
              className="rounded-2xl p-7 group"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(15,22,41,0.5) 100%)',
                border: '1px solid rgba(124,58,237,0.15)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <h4 className="font-display text-base font-bold text-white mb-3">
                Enterprise Inquiry
              </h4>
              <p className="text-xs text-[var(--color-mas-text-secondary)] mb-5 leading-relaxed">
                Need a custom deployment, governance integration, or architecture consulting?
              </p>
              <div className="flex flex-col gap-2.5">
                <a
                  href="mailto:masoud.masoori@mas-ai.co"
                  className="group/link flex items-center gap-3 rounded-lg border border-[var(--color-mas-border)] bg-white/[0.02] px-4 py-2.5 text-sm text-[var(--color-mas-text-secondary)] transition-all duration-300 hover:border-[#a78bfa]/30 hover:text-[#a78bfa] hover:bg-[#7c3aed]/5"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="text-xs">masoud.masoori@mas-ai.co</span>
                  <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 transition-all duration-200 group-hover/link:opacity-60" />
                </a>
                <a
                  href="mailto:masoud.masoori@mas-ai.co?subject=Enterprise%20AI%20Deployment%20Inquiry"
                  className="group/link flex items-center gap-3 rounded-lg border border-[var(--color-mas-border)] bg-white/[0.02] px-4 py-2.5 text-sm text-[var(--color-mas-text-secondary)] transition-all duration-300 hover:border-[#a78bfa]/30 hover:text-[#a78bfa] hover:bg-[#7c3aed]/5"
                >
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="text-xs">Book a Call</span>
                  <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 transition-all duration-200 group-hover/link:opacity-60" />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
