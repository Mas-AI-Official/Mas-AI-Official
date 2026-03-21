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
  { label: 'Investors', href: '/investors.html' },
  { label: 'Contact', href: '#contact' },
]

const connectLinks: FooterLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/masoud-masoori', external: true },
  { label: 'GitHub', href: 'https://github.com/Mas-AI-Official', external: true },
  { label: 'Email', href: 'mailto:masoud.masoori@mas-ai.co' },
]

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-mas-text)]">
        {title}
      </h4>
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
  const isInView = useInView(ref, { once: true, margin: '-40px' })

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
