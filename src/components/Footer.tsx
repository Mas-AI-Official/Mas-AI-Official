import Link from 'next/link'

// --- Data -------------------------------------------------------------------

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
  { label: 'Contact', href: '#contact' },
  { label: 'Investors', href: '/investors.html' },
]

const connectLinks: FooterLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/masoud-masoori', external: true },
  { label: 'GitHub', href: 'https://github.com/Mas-AI-Official', external: true },
  { label: 'Email', href: 'mailto:masoud.masoori@mas-ai.co' },
]

// --- Helper -----------------------------------------------------------------

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
                className="text-sm text-[var(--color-mas-text-muted)] transition-colors hover:text-[var(--color-mas-cyan)]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-[var(--color-mas-text-muted)] transition-colors hover:text-[var(--color-mas-cyan)]"
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

// --- Component --------------------------------------------------------------

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-mas-border)] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Three-column links */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          <FooterColumn title="Products" links={productLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Connect" links={connectLinks} />
        </div>

        {/* Bottom section */}
        <div className="mt-12 flex flex-col items-center gap-3 text-center text-xs text-[var(--color-mas-text-muted)]">
          <p>2026 MAS-AI Technologies Inc. All rights reserved.</p>
          <p>Patent-pending: PhiLattice Architecture + NBMF / Enterprise-DNA</p>
          <div className="flex items-center gap-4">
            <a
              href="https://daena.mas-ai.co/terms-of-service.html"
              className="transition-colors hover:text-[var(--color-mas-cyan)]"
            >
              Terms of Service
            </a>
            <span className="text-[var(--color-mas-border)]">|</span>
            <a
              href="https://daena.mas-ai.co/privacy-policy.html"
              className="transition-colors hover:text-[var(--color-mas-cyan)]"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
