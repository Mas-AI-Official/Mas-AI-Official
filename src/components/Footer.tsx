import { ExternalLink } from 'lucide-react'

const navLinks = [
  { label: 'Daena AI', href: 'https://daena.mas-ai.co', external: true },
  { label: 'Email', href: 'mailto:masoud.masoori@mas-ai.co', external: false },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/masoud-masoori/', external: true },
  { label: 'GitHub', href: 'https://github.com/Mas-AI-Official', external: true },
]

export default function Footer() {
  return (
    <footer className="border-t border-mas-border px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
        {/* Navigation links */}
        <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1 text-sm text-mas-text-secondary transition-colors hover:text-mas-cyan"
            >
              {link.label}
              {link.external && <ExternalLink className="h-3 w-3" />}
            </a>
          ))}
        </nav>

        {/* Legal */}
        <div className="flex flex-col items-center gap-3 text-xs text-mas-text-muted">
          <p>2026 MAS-AI Technologies Inc. All rights reserved.</p>
          <p>Patent-pending: PhiLattice Architecture + NBMF / Enterprise-DNA</p>
          <div className="flex items-center gap-4">
            <a
              href="https://daena.mas-ai.co/terms-of-service.html"
              className="transition-colors hover:text-mas-text-secondary"
            >
              Terms of Service
            </a>
            <span className="text-mas-border">|</span>
            <a
              href="https://daena.mas-ai.co/privacy-policy.html"
              className="transition-colors hover:text-mas-text-secondary"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
