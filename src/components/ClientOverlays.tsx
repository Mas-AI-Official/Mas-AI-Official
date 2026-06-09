'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Decorative / interactive chrome that is NOT needed for first paint or SEO.
// next/dynamic (ssr:false) keeps these out of the initial JS chunk so mobile
// renders the actual content first.
const PhiLatticeBackground = dynamic(() => import('./PhiLatticeBackground'), { ssr: false })
const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false })
const DaenaGuide = dynamic(() => import('./DaenaGuide'), { ssr: false })

export default function ClientOverlays() {
  // DaenaGuide is the heaviest client component (756 lines + framer-motion +
  // a scroll listener that drives animation state on every scroll). On a
  // throttled phone, mounting it during load is what makes the page feel
  // stuck/partial. So we hold it back until the page has loaded and the user
  // either engages (a deliberate tap/key) OR the browser goes idle. The chat
  // still appears for everyone within a few seconds - it just never competes
  // with the initial render.
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    let done = false
    const mount = () => {
      if (done) return
      done = true
      cleanup()
      setShowGuide(true)
    }

    const cleanup = () => {
      window.removeEventListener('pointerdown', mount)
      window.removeEventListener('touchstart', mount)
      window.removeEventListener('keydown', mount)
    }

    // Deliberate interaction mounts immediately. We intentionally do NOT listen
    // on 'scroll' so the first scroll stays buttery - the idle fallback covers
    // users who just scroll.
    window.addEventListener('pointerdown', mount, { passive: true })
    window.addEventListener('touchstart', mount, { passive: true })
    window.addEventListener('keydown', mount)

    // Idle fallback so the chat still shows for passive users.
    const ric: number =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(mount, { timeout: 3000 })
        : window.setTimeout(mount, 2500)

    return () => {
      cleanup()
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(ric)
      else clearTimeout(ric)
    }
  }, [])

  return (
    <>
      <PhiLatticeBackground />
      <CustomCursor />
      {showGuide && <DaenaGuide />}
    </>
  )
}
