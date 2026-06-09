'use client'

import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Lenis fights native momentum scroll on touch devices: with
    // touchMultiplier > 1 it captures touch events and re-emits them
    // through its own easing, which feels rubbery on iOS and laggy on
    // Android. Native mobile scroll is already smooth - opt out below md
    // and on coarse pointers.
    const isMobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
    if (isMobile) return

    // Lenis + GSAP + ScrollTrigger are desktop-only. Load them dynamically
    // AFTER the mobile bail-out above so phones never download or parse the
    // smooth-scroll engine - it is off the mobile critical path entirely.
    let cleanup = () => {}
    let cancelled = false

    void (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
      })
      lenisRef.current = lenis

      // Sync Lenis scroll with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      cleanup = () => {
        gsap.ticker.remove(tick)
        lenis.destroy()
        lenisRef.current = null
      }
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return <>{children}</>
}
