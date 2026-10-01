import Link from 'next/link'
import Image from 'next/image'
import { FOOTER, CTA } from '@/content/site'
import { COMPANY } from '@/content/facts'

export function Footer() {
  return (
    <footer className="site-footer" aria-labelledby="footer-title">
      <div className="wrap">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link href="/" className="wordmark" aria-label="MAS-AI Technologies, home">
              <Image src="/brand/mark-64.png" alt="" width={32} height={32} />
              <span>MAS-AI</span>
            </Link>
            <p id="footer-title" className="t-h3 site-footer__line">
              We build the system your business is missing.
            </p>
            <Link href={CTA.href} className="btn btn-primary">
              {CTA.label}
            </Link>
          </div>
          <div className="site-footer__cols">
            {FOOTER.map((col) => (
              <div key={col.title}>
                <p className="t-label">{col.title}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="site-footer__bottom">
          <p>
            {COMPANY.legalName}. {COMPANY.locality}, {COMPANY.region}, {COMPANY.countryName}.
          </p>
          <ul>
            <li><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
            <li><a href={COMPANY.founder.linkedin} rel="noopener">LinkedIn</a></li>
            <li><a href={COMPANY.github} rel="noopener">GitHub</a></li>
            <li><Link href="/privacy/">Privacy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
