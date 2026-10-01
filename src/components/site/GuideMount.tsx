'use client'

import dynamic from 'next/dynamic'
import { Component, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Mount gate for the site guide (preserved from the original ClientOverlays contract):
 * the guide's code loads on the first pointer, touch or key interaction, or when the browser
 * is idle (3 s cap), so it never competes with the first paint. Now mounted site-wide from the
 * layout instead of only on "/". The dynamic import stays in this client boundary because
 * ssr:false cannot live in a Server Component.
 */
const Guide = dynamic(() => import('@/components/guide/Guide').then((m) => m.Guide), { ssr: false })

/**
 * A failed guide chunk (flaky mobile network, blocked request) rejects the dynamic import during render. With no
 * boundary it reached the root error page and replaced the whole site with "Something went wrong" (measured on the
 * frozen build with the guide chunk aborted). The guide is an enhancement, so a failure renders nothing instead.
 */
class GuideBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.warn('Site guide failed to load; the page continues without it.', error)
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function GuideMount() {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    let done = false
    const arm = () => {
      if (done) return
      done = true
      setArmed(true)
      cleanup()
    }
    type Idle = (cb: () => void, opts?: { timeout: number }) => number
    const ric = (window as unknown as { requestIdleCallback?: Idle }).requestIdleCallback
    const idleHandle = ric ? ric(arm, { timeout: 3000 }) : window.setTimeout(arm, 2500)
    const events = ['pointerdown', 'touchstart', 'keydown'] as const
    events.forEach((ev) => window.addEventListener(ev, arm, { once: true, passive: true }))
    function cleanup() {
      events.forEach((ev) => window.removeEventListener(ev, arm))
      const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback
      if (ric && cic) cic(idleHandle)
      else window.clearTimeout(idleHandle)
    }
    return cleanup
  }, [])

  return armed ? (
    <GuideBoundary>
      <Guide />
    </GuideBoundary>
  ) : null
}
