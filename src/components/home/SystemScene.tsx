'use client'

import { useEffect, useRef } from 'react'
import type { CapabilityVariant } from '@/content/home'
import { drawSystem } from './stage/systems'
import { readPalette, sizeCanvas } from './Stage'

const BLEND_MS = 520

/**
 * The operation drawn in one capability's shape. Changing `variant` moves the same stations into the new
 * shape (object permanence) instead of swapping pictures. Draws only while on screen; a still under
 * reduced motion. Decorative: the surrounding text carries the meaning.
 */
export function SystemScene({ variant, className }: { variant: CapabilityVariant; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const state = useRef({ from: variant, to: variant, since: 0, wake: () => {} })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const pal = readPalette(canvas)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ctx: CanvasRenderingContext2D | null = null
    let view = { w: 1, h: 1, phone: false }
    let raf = 0
    let visible = false
    const t0 = performance.now()

    const draw = (now: number) => {
      if (!ctx) return
      const s = state.current
      const blend = reduce ? 1 : Math.min(1, (now - s.since) / BLEND_MS)
      drawSystem(ctx, view, pal, s.from, s.to, blend, reduce ? 1.2 : (now - t0) / 1000)
    }
    const frame = (now: number) => {
      draw(now)
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0
    }
    const wake = () => {
      if (reduce) return draw(performance.now())
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame)
    }
    state.current.wake = wake
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      ctx = sizeCanvas(canvas, r.width, r.height)
      view = { w: r.width, h: r.height, phone: r.width < 520 }
      draw(performance.now())
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) wake()
    })
    const ro = new ResizeObserver(resize)
    const onVis = () => (document.hidden ? undefined : wake())
    io.observe(canvas)
    ro.observe(canvas)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  useEffect(() => {
    const s = state.current
    if (s.to === variant) return
    s.from = s.to
    s.to = variant
    s.since = performance.now()
    s.wake()
  }, [variant])

  return <canvas ref={ref} className={className ? `system-scene ${className}` : 'system-scene'} aria-hidden="true" />
}
