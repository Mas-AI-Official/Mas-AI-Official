'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * MetatronBackground: Sacred Metatron's Cube geometry with scroll-driven depth dive.
 *
 * Metatron's Cube = 13 circles (1 center + 6 inner ring + 6 outer ring)
 * connected by lines forming the Platonic solids. As the user scrolls,
 * the camera zooms into the center, creating a "diving into the sacred core" effect.
 *
 * NOT a random hexagonal grid. This is the real sacred geometry pattern.
 */

interface MetatronNode {
  bx: number // base x (relative to center, -1 to 1)
  by: number // base y
  ring: number // 0=center, 1=inner, 2=outer
  r: number // draw radius
}

export default function MetatronBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const scrollRef = useRef(0)
  const scrollMaxRef = useRef(1)
  const animRef = useRef<number>(0)
  const particlesRef = useRef<{ conn: number; progress: number; speed: number }[]>([])

  // Build Metatron's Cube geometry (13 nodes + connecting lines)
  const buildGeometry = useCallback(() => {
    const nodes: MetatronNode[] = []

    // Center node
    nodes.push({ bx: 0, by: 0, ring: 0, r: 6 })

    // Inner ring: 6 nodes at equal angles, radius ~0.18
    const innerR = 0.18
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2
      nodes.push({ bx: innerR * Math.cos(a), by: innerR * Math.sin(a), ring: 1, r: 5 })
    }

    // Outer ring: 6 nodes at offset angles, radius ~0.36
    const outerR = 0.36
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2 + Math.PI / 6
      nodes.push({ bx: outerR * Math.cos(a), by: outerR * Math.sin(a), ring: 2, r: 4 })
    }

    // Metatron's Cube connections: every node connects to every other node
    // This creates the complete graph that reveals the Platonic solids
    const connections: [number, number][] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        connections.push([i, j])
      }
    }

    // Create flowing particles along connections
    const particles = connections.map((_, idx) => ({
      conn: idx,
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.006,
    }))
    particlesRef.current = particles

    return { nodes, connections }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0

    const { nodes, connections } = buildGeometry()

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scrollMaxRef.current = Math.max(1, document.documentElement.scrollHeight - h)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const onScroll = () => {
      scrollRef.current = window.scrollY
      scrollMaxRef.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    let lastT = 0
    const fpsGap = 1000 / 30

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      const depth = Math.min(1, scrollRef.current / scrollMaxRef.current)
      // Zoom: 1x at top, 4x at bottom (diving into the cube's center)
      const zoom = 1 + depth * 3
      // Scale factor based on viewport
      const scale = Math.min(w, h) * 0.9

      const cx = w / 2
      const cy = h / 2
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Global alpha fades slightly at extreme depth
      const globalA = Math.max(0.03, 0.1 - depth * 0.04)

      // Color temperature: cyan at top, gold at bottom
      const cw = 1 - depth // cyan weight
      const gw = depth // gold weight

      // Draw connections (the sacred geometry lines)
      for (let ci = 0; ci < connections.length; ci++) {
        const [ai, bi] = connections[ci]
        const a = nodes[ai]
        const b = nodes[bi]

        const ax = cx + a.bx * scale * zoom
        const ay = cy + a.by * scale * zoom
        const bx = cx + b.bx * scale * zoom
        const by = cy + b.by * scale * zoom

        // Skip if both endpoints off-screen
        if ((ax < -100 && bx < -100) || (ax > w + 100 && bx > w + 100)) continue
        if ((ay < -100 && by < -100) || (ay > h + 100 && by > h + 100)) continue

        // Mouse proximity to midpoint
        const midX = (ax + bx) / 2
        const midY = (ay + by) / 2
        const mDist = Math.hypot(mx - midX, my - midY)
        const mBoost = mDist < 250 ? (1 - mDist / 250) * 0.15 : 0
        const lineA = (globalA * 0.7 + mBoost)

        const r = Math.round(0 * cw + 255 * gw)
        const g = Math.round(212 * cw + 215 * gw)
        const b2 = Math.round(255 * cw + 0 * gw)

        ctx.strokeStyle = `rgba(${r},${g},${b2},${lineA})`
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(bx, by)
        ctx.stroke()
      }

      // Draw particles flowing along connections
      const particles = particlesRef.current
      for (const p of particles) {
        const [ai, bi] = connections[p.conn]
        if (!ai && ai !== 0) continue
        const a = nodes[ai]
        const b = nodes[bi]

        const ax = cx + a.bx * scale * zoom
        const ay = cy + a.by * scale * zoom
        const bx = cx + b.bx * scale * zoom
        const by = cy + b.by * scale * zoom

        const px = ax + (bx - ax) * p.progress
        const py = ay + (by - ay) * p.progress

        // Skip off-screen
        if (px < -50 || px > w + 50 || py < -50 || py > h + 50) {
          if (!reduced) { p.progress += p.speed; if (p.progress > 1) p.progress = 0 }
          continue
        }

        const mDist = Math.hypot(mx - px, my - py)
        const mGlow = mDist < 200 ? (1 - mDist / 200) * 0.4 : 0
        const pA = (globalA * 1.5 + mGlow)

        ctx.fillStyle = `rgba(255, 215, 0, ${pA})`
        ctx.shadowColor = '#FFD700'
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.arc(px, py, 1.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        if (!reduced) {
          p.progress += p.speed
          if (p.progress > 1) p.progress = 0
        }
      }

      // Draw nodes (the 13 circles of Metatron's Cube)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const nx = cx + n.bx * scale * zoom
        const ny = cy + n.by * scale * zoom

        if (nx < -80 || nx > w + 80 || ny < -80 || ny > h + 80) continue

        const mDist = Math.hypot(mx - nx, my - ny)
        const mGlow = mDist < 200 ? (1 - mDist / 200) * 0.5 : 0
        const pulse = 0.5 + Math.sin(Date.now() * 0.002 + i * 1.3) * 0.3
        const nA = (pulse * globalA + mGlow)

        const r = Math.round(0 * cw + 255 * gw)
        const g = Math.round(212 * cw + 215 * gw)
        const b2 = Math.round(255 * cw + 0 * gw)

        // Circle outline (Metatron's Cube uses circles, not dots)
        const circR = n.r * Math.min(zoom, 2.5)
        ctx.strokeStyle = `rgba(${r},${g},${b2},${nA * 0.6})`
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.arc(nx, ny, circR * 3, 0, Math.PI * 2)
        ctx.stroke()

        // Glow center
        const rg = ctx.createRadialGradient(nx, ny, 0, nx, ny, circR * 2)
        rg.addColorStop(0, `rgba(${r},${g},${b2},${nA * 0.4})`)
        rg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = rg
        ctx.beginPath()
        ctx.arc(nx, ny, circR * 2, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.fillStyle = `rgba(${r},${g},${b2},${nA})`
        ctx.beginPath()
        ctx.arc(nx, ny, circR * 0.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function loop(t: number) {
      animRef.current = requestAnimationFrame(loop)
      if (t - lastT < fpsGap) return
      lastT = t
      draw()
    }

    if (reduced) { draw() } else { animRef.current = requestAnimationFrame(loop) }

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
    }
  }, [buildGeometry])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
