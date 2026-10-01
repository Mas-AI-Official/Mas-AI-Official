import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

type L = { label: string; href: string }

export const isExternal = (href: string) => /^https?:\/\//.test(href)

/** Internal links use next/link with a trailing slash; external links carry rel="noopener". */
export function ItemLinks({ links, variant = 'inline' }: { links: L[]; variant?: 'inline' | 'buttons' }) {
  if (links.length === 0) return null
  return (
    <ul className={variant === 'buttons' ? 'wk-actions' : 'wk-links'}>
      {links.map((l) => {
        const ext = isExternal(l.href)
        const cls = variant === 'buttons' ? 'btn btn-ghost' : 'link-arrow'
        return (
          <li key={l.href}>
            {ext ? (
              <a href={l.href} rel="noopener" className={cls}>
                {l.label}
                <ArrowUpRight aria-hidden="true" />
              </a>
            ) : (
              <Link href={l.href} className={cls}>
                {l.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}
