'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * One observer for every [data-reveal] element on the page (styles/motion.css).
 * - Adds .is-in when an element enters; removes it only once the element has fully left the
 *   viewport, so entrances replay scrolling up and nothing visible ever disappears.
 * - Elements already in the first viewport are marked in immediately (nothing waits for scroll).
 * - Rebinds on every client navigation. Under reduced motion CSS shows everything; this is a no-op.
 */
export function RevealRoot() {
  const pathname = usePathname()

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (els.length === 0) return
    const vh = window.innerHeight
    for (const el of els) {
      if (el.getBoundingClientRect().top < vh) el.classList.add('is-in')
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement
          if (e.isIntersecting) el.classList.add('is-in')
          else el.classList.remove('is-in')
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return null
}
