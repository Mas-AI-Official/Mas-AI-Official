'use client'

import Link from 'next/link'
import type { MouseEvent, ReactNode } from 'react'

/**
 * The wordmark link home. On another page it is an ordinary link. On the home page itself a Link to the same
 * URL keeps the scroll position, so the wordmark did nothing visible mid-page: here it goes back to the top
 * instead (smooth, or instant under reduced motion, via the html scroll-behavior rule) and drops any #hash.
 * New-tab and modified clicks are left to the browser.
 */
export function HomeLink({ className, label, onHome, children }: { className?: string; label: string; onHome?: () => void; children: ReactNode }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (window.location.pathname !== '/') return
    e.preventDefault()
    if (window.location.hash) history.replaceState(history.state, '', '/')
    window.scrollTo({ top: 0 })
    onHome?.()
  }
  return (
    <Link href="/" className={className} aria-label={label} onClick={onClick}>
      {children}
    </Link>
  )
}
