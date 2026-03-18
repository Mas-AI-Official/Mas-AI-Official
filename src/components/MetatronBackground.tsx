'use client'

import { useEffect, useRef, useCallback } from 'react'

interface HexNode {
  x: number
  y: number
  radius: number
  glow: number
  layer: number
}

interface Connection {
  from: number
  to: number
  progress: number
  speed: number
  glow: number
}

export default function MetatronBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const scrollRef = useRef(0)
  const animRef = useRef<number>(0)
  const nodesRef = useRef<HexNode[]>([])
  const connectionsRef = useRef<Connection[]>([])

  const createHexNetwork = useCallback((w: number, h: number, isMobile: boolean) => {
    const nodes: HexNode[] = []
    const connections: Connection[] = []
    const cx = w / 2
    const cy = h / 2
    const layers = isMobile ? 2 : 3
    const baseRadius = Math.min(w, h) * 0.12
    const hexSpacing = baseRadius * 1.8

    // Central node
    nodes.push({ x: cx, y: cy, radius: 6, glow: 1, layer: 0 })

    // Hexagonal layers
    for (let layer = 1; layer <= layers; layer++) {
      const r = hexSpacing * layer
      const count = 6 * layer
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2
        nodes.push({
          x: cx + r * Math.cos(angle),
          y: cy + r * Math.sin(angle),
          radius: 4,
          glow: 0.7,
          layer,
        })
      }
    }

    // Connect each node to 5 nearest
    const intensity = isMobile ? 0.3 : 1.0
    nodes.forEach((node, idx) => {
      const distances = nodes
        .map((other, oi) => ({
          idx: oi,
          dist: Math.hypot(node.x - other.x, node.y - other.y),
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(1, 6)

      distances.forEach((d) => {
        const exists = connections.some(
          (c) =>
            (c.from === idx && c.to === d.idx) ||
            (c.from === d.idx && c.to === idx)
        )
        if (!exists) {
          connections.push({
            from: idx,
            to: d.idx,
            progress: Math.random(),
            speed: 0.006 + Math.random() * 0.012,
            glow: (0.3 + Math.random() * 0.4) * intensity,
          })
        }
      })
    })

    nodesRef.current = nodes
    connectionsRef.current = connections
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const isMobile = window.innerWidth <= 768
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let w = 0
    let h = 0

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      createHexNetwork(w, h, window.innerWidth <= 768)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    let lastTime = 0
    const fpsCap = 1000 / 30

    function drawFrame() {
      if (!ctx) return
      const nodes = nodesRef.current
      const connections = connectionsRef.current

      ctx.clearRect(0, 0, w, h)

      const scrollFade = Math.max(0, 1 - scrollRef.current / (h * 0.8))
      if (scrollFade < 0.01) return

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const globalAlpha = scrollFade * 0.12 // Max 12% opacity: never obstructs text

      // Draw connections with flowing particles
      for (const conn of connections) {
        const from = nodes[conn.from]
        const to = nodes[conn.to]
        if (!from || !to) continue

        const px = from.x + (to.x - from.x) * conn.progress
        const py = from.y + (to.y - from.y) * conn.progress

        // Mouse proximity boost
        const mdist = Math.hypot(mx - px, my - py)
        const mouseBoost = mdist < 200 ? (1 - mdist / 200) * 2 : 0
        const alpha = (conn.glow + mouseBoost * 0.3) * globalAlpha

        // Line
        const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y)
        grad.addColorStop(0, `rgba(255, 215, 0, 0)`)
        grad.addColorStop(
          Math.max(0, conn.progress - 0.15),
          `rgba(255, 215, 0, 0)`
        )
        grad.addColorStop(conn.progress, `rgba(255, 215, 0, ${alpha})`)
        grad.addColorStop(
          Math.min(1, conn.progress + 0.15),
          `rgba(0, 200, 255, ${alpha * 0.7})`
        )
        grad.addColorStop(1, `rgba(0, 200, 255, 0)`)

        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()

        // Flowing particle
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 1.5})`
        ctx.shadowColor = '#FFD700'
        ctx.shadowBlur = 12 * scrollFade
        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        if (!reducedMotion) {
          conn.progress += conn.speed
          if (conn.progress > 1) conn.progress = 0
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const mdist = Math.hypot(mx - n.x, my - n.y)
        const mouseGlow = mdist < 200 ? (1 - mdist / 200) * 0.4 : 0
        const pulse = 0.6 + Math.sin(Date.now() * 0.003 + i) * 0.4
        const alpha = (pulse * 0.15 + mouseGlow) * scrollFade

        // Outer glow
        const rgr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 4)
        rgr.addColorStop(0, `rgba(255, 215, 0, ${alpha * 0.5})`)
        rgr.addColorStop(0.5, `rgba(0, 200, 255, ${alpha * 0.25})`)
        rgr.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = rgr
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`
        ctx.shadowColor = '#FFD700'
        ctx.shadowBlur = 10 * scrollFade
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    function loop(time: number) {
      animRef.current = requestAnimationFrame(loop)
      if (time - lastTime < fpsCap) return
      lastTime = time
      drawFrame()
    }

    if (reducedMotion) {
      drawFrame()
    } else {
      animRef.current = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [createHexNetwork])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
