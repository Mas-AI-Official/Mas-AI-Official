'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * PhiLatticeBackground: Fibonacci spiral + honeycomb connections.
 *
 * This visualizes the actual PhiLattice Architecture patent:
 * - Nodes placed using Fibonacci/sunflower spiral (golden angle)
 * - Max 6 connections per node (hexagonal honeycomb topology)
 * - Mouse proximity brightens nearby nodes (intelligence responds to attention)
 * - Scroll fades the canvas so it never competes with content
 * - Subtle orbital drift gives it life without distraction
 */

interface PLNode {
  x: number
  y: number
  bx: number // base X (for drift calculation)
  by: number // base Y
  conns: number[]
  bright: number
  ring: number
}

export default function PhiLatticeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const scrollRef = useRef(0)
  const rafRef = useRef<number>(0)
  const nodesRef = useRef<PLNode[]>([])

  const buildNetwork = useCallback((w: number, h: number) => {
    const nodes: PLNode[] = []
    const cx = w / 2, cy = h / 2
    const PHI = (1 + Math.sqrt(5)) / 2
    const GA = 2 * Math.PI / (PHI * PHI) // Golden angle ~137.5deg
    const count = Math.min(180, Math.floor((w * h) / 9000))
    const spread = Math.min(w, h) / (Math.sqrt(count) * 1.8)

    for (let i = 0; i < count; i++) {
      const angle = i * GA
      const r = Math.sqrt(i) * spread
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r
      if (x < -60 || x > w + 60 || y < -60 || y > h + 60) continue
      nodes.push({ x, y, bx: x, by: y, conns: [], bright: 0, ring: Math.floor(Math.sqrt(i)) })
    }

    // Honeycomb connections: each node connects to up to 6 nearest
    const maxDist = Math.min(w, h) / (Math.sqrt(count) * 0.8)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].conns.length >= 6) break
        const dx = nodes[i].bx - nodes[j].bx
        const dy = nodes[i].by - nodes[j].by
        if (dx * dx + dy * dy < maxDist * maxDist) {
          nodes[i].conns.push(j)
          nodes[j].conns.push(i)
        }
      }
    }
    return nodes
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      nodesRef.current = buildNetwork(w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    let lastT = 0

    function draw(time: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      const nodes = nodesRef.current
      const mx = mouseRef.current.x, my = mouseRef.current.y

      // Scroll progress: 0 at top, 1 at bottom of page
      const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const scrollPct = Math.min(1, scrollRef.current / docH)

      // DIVE-IN ZOOM: scale up from center as user scrolls deeper
      // 1.0x at hero, grows to 3.5x at the bottom of the page
      const zoom = 1 + scrollPct * 2.5

      // Opacity: stay visible but fade slightly at extreme zoom
      const scrollFade = Math.max(0.2, 1 - scrollPct * 0.6)

      // Color temperature shift: cyan (top/cool) to gold (bottom/warm)
      // This maps to trust psychology: cool = competence, warm = trust
      const warmth = scrollPct

      // Center point for zoom
      const cx = w / 2, cy = h / 2

      // Periodic wave pulse
      const waveCycle = (time * 0.0002) % 1.0
      const waveCenterX = w * waveCycle
      const waveWidth = w * 0.25

      // Update positions (drift + zoom from center)
      for (const n of nodes) {
        const drift = time * 0.00008 * (n.ring % 2 === 0 ? 1 : -1)
        const driftX = n.bx + Math.sin(drift + n.by * 0.008) * 3
        const driftY = n.by + Math.cos(drift + n.bx * 0.008) * 3

        // Apply zoom: scale distance from center
        n.x = cx + (driftX - cx) * zoom
        n.y = cy + (driftY - cy) * zoom

        // Mouse proximity glow (use zoomed positions)
        const dx = mx - n.x, dy = my - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const mouseTarget = dist < 250 ? (1 - dist / 250) * 1.0 : 0

        // Wave pulse glow
        const waveDist = Math.abs(n.x - waveCenterX)
        const waveTarget = waveDist < waveWidth ? (1 - waveDist / waveWidth) * 0.5 : 0

        const target = Math.max(mouseTarget, waveTarget)
        n.bright += (target - n.bright) * 0.08
      }

      // Interpolated color: cyan at top, gold at bottom
      const lineR = Math.round(0 + warmth * 212)
      const lineG = Math.round(200 - warmth * 32)
      const lineB = Math.round(255 - warmth * 192)
      const nodeR = Math.round(0 + warmth * 255)
      const nodeG = Math.round(200 + warmth * 15)
      const nodeB = Math.round(255 - warmth * 255)

      // Draw connections (cull off-screen for performance at high zoom)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        for (const j of n.conns) {
          if (j <= i) continue
          const m = nodes[j]

          // Off-screen culling: skip if both endpoints are far off viewport
          if ((n.x < -50 && m.x < -50) || (n.x > w + 50 && m.x > w + 50)) continue
          if ((n.y < -50 && m.y < -50) || (n.y > w + 50 && m.y > w + 50)) continue

          const avg = (n.bright + m.bright) / 2
          const a = (0.10 + avg * 0.4) * scrollFade

          ctx.beginPath()
          ctx.moveTo(n.x, n.y)
          ctx.lineTo(m.x, m.y)
          ctx.strokeStyle = `rgba(${lineR}, ${lineG}, ${lineB}, ${a})`
          ctx.lineWidth = 0.5 + avg * 1.5
          ctx.stroke()
        }
      }

      // Draw nodes (cull off-screen)
      for (const n of nodes) {
        if (n.x < -60 || n.x > w + 60 || n.y < -60 || n.y > h + 60) continue

        const a = (0.18 + n.bright * 0.6) * scrollFade
        const r = 1.5 + n.bright * 3

        if (n.bright > 0.05) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${nodeR}, ${nodeG}, ${nodeB}, ${n.bright * 0.25 * scrollFade})`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${nodeR}, ${nodeG}, ${nodeB}, ${a})`
        ctx.fill()
      }
    }

    function loop(t: number) {
      rafRef.current = requestAnimationFrame(loop)
      if (t - lastT < 33) return // ~30fps
      lastT = t
      draw(t)
    }

    if (reduced) {
      draw(0)
    } else {
      rafRef.current = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
    }
  }, [buildNetwork])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
