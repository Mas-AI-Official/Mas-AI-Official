'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

const productLinks: FooterLink[] = [
  { label: 'Daena', href: 'https://daena.mas-ai.co', external: true },
  { label: 'ContentOPS', href: 'https://contentops.mas-ai.co', external: true },
  { label: 'Med Smart', href: '/medsmart.html' },
  { label: 'Construction AI', href: '/construction-ai.html' },
]

const companyLinks: FooterLink[] = [
  { label: 'Early Access', href: '#early-access' },
  { label: 'Investors', href: '/investors.html' },
  { label: 'About', href: '#credibility' },
]

const connectLinks: FooterLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/masoud-masoori', external: true },
  { label: 'GitHub', href: 'https://github.com/Mas-AI-Official', external: true },
  { label: 'Email', href: 'mailto:masoud.masoori@mas-ai.co' },
]

// GEO "answer pages" — linked sitewide so they are not orphans and crawlers
// reach them from every page.
const learnLinks: FooterLink[] = [
  { label: 'What is Daena?', href: '/what-is-daena' },
  { label: 'AI Governance Platform', href: '/ai-governance-platform' },
  { label: 'Multi-Agent AI Company OS', href: '/multi-agent-ai-company-os' },
  { label: 'AI Control Plane for Business', href: '/ai-control-plane-for-business' },
  { label: 'Daena vs LangChain', href: '/compare/daena-vs-langchain' },
  { label: 'Daena vs AutoGen', href: '/compare/daena-vs-autogen' },
  { label: 'AI Agent Governance', href: '/use-cases/ai-agent-governance' },
  { label: 'Multi-LLM Routing', href: '/use-cases/multi-llm-routing' },
]

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      {/* h3, not h4, so heading order on the home page is sequential —
       * sections above use h2/h3 and Lighthouse flagged the jump to h4. */}
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-mas-text)]">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-sm text-[var(--color-mas-text-muted)] transition-colors hover:text-[var(--color-mas-cyan)]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="link-underline text-sm text-[var(--color-mas-text-muted)] transition-colors hover:text-[var(--color-mas-cyan)]"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-40px' })

  return (
    <footer className="border-t border-[var(--color-mas-border)] px-6 py-16 relative">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl"
      >
        {/* Logo + columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 mb-4 md:mb-0">
            <a href="/" className="inline-block mb-4 group">
              <Image
                src="/Mas-ai Logo.png"
                alt="MAS-AI"
                width={100}
                height={32}
                className="h-8 w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(0,200,255,0.3)]"
              />
            </a>
            <p className="text-xs text-[var(--color-mas-text-muted)] leading-relaxed max-w-[200px]">
              Building governed AI systems for enterprises that demand trust and accountability.
            </p>
          </div>

          <FooterColumn title="Products" links={productLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Connect" links={connectLinks} />
        </div>

        {/* Learn — answer-page link hub for SEO / AI search discovery */}
        <div className="mt-10">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-mas-text)]">
            Learn
          </h3>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
            {learnLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="link-underline text-sm text-[var(--color-mas-text-muted)] transition-colors hover:text-[var(--color-mas-cyan)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="mt-12 mb-6 h-px bg-gradient-to-r from-transparent via-[var(--color-mas-border)] to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[var(--color-mas-text-muted)]">
          <p>&copy; 2026 MAS-AI Technologies Inc. All rights reserved.</p>
          <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider opacity-60">
            Patent-pending: PhiLattice + NBMF
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://daena.mas-ai.co/terms-of-service.html"
              className="link-underline transition-colors hover:text-[var(--color-mas-cyan)]"
            >
              Terms
            </a>
            <a
              href="https://daena.mas-ai.co/privacy-policy.html"
              className="link-underline transition-colors hover:text-[var(--color-mas-cyan)]"
            >
              Privacy
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
