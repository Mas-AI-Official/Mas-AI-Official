'use client'

import { usePathname } from 'next/navigation'
import { useLayoutEffect } from 'react'

/**
 * One observer for every [data-reveal] element on the page (styles/motion.css).
 * - Adds .is-in when an element enters; removes it only once the element has fully left the
 *   viewport, so entrances replay scrolling up and nothing visible ever disappears.
 * - Elements already in the first viewport are marked in before the page is armed, so they never hide: the
 *   hidden start state only exists under html.reveal-armed, and it lands without a transition (the style flush)
 *   before html.reveal-live turns transitions on. Server-rendered content never waits for hydration.
 * - The same disarm, mark, re-arm runs before paint on every client navigation (a layout effect), so the new
 *   page's first viewport is never painted hidden either (scripts/qa/firstview.py, navigation leg).
 * - Under reduced motion CSS shows everything; this is a no-op.
 */
export function RevealRoot() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (els.length === 0) return
    // Disarm while measuring, so nothing is hidden when its position is read; mark what is in view; arm (the
    // hidden state lands without a transition); turn transitions on next frame.
    const root = document.documentElement
    root.classList.remove('reveal-armed', 'reveal-live')
    const vh = window.innerHeight
    for (const el of els) {
      if (el.getBoundingClientRect().top < vh) el.classList.add('is-in')
    }
    root.classList.add('reveal-armed')
    void root.offsetWidth
    const raf = requestAnimationFrame(() => root.classList.add('reveal-live'))
    // Two observers: entering needs 8% of the viewport, leaving needs the whole viewport. One observer with the
    // 8% margin un-marked an element sitting in the bottom band, so it vanished while in view.
    const show = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) e.target.classList.add('is-in')
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )
    const reset = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (!e.isIntersecting) e.target.classList.remove('is-in')
      },
      { threshold: 0 },
    )
    els.forEach((el) => {
      show.observe(el)
      reset.observe(el)
    })
    return () => {
      cancelAnimationFrame(raf)
      show.disconnect()
      reset.disconnect()
    }
  }, [pathname])

  return null
}
