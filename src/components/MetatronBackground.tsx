'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * MetatronBackground: Sacred geometry hexagonal network with scroll-driven depth dive.
 *
 * As the user scrolls down, the hexagonal pattern zooms in, as if diving
 * deeper into the core of the Metatron's Cube. Each section boundary
 * corresponds to a deeper "layer." Gold particles flow along connections.
 * Cursor proximity amplifies node glow within 200px.
 */

interface HexNode {
  baseX: number
  baseY: number
  radius: number
  layer: number
}

interface Connection {
  from: number
  to: number
  progress: number
  speed: number
  baseGlow: number
}

export default function MetatronBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const scrollRef = useRef(0)
  const scrollMaxRef = useRef(1)
  const animRef = useRef<number>(0)
  const nodesRef = useRef<HexNode[]>([])
  const connectionsRef = useRef<Connection[]>([])

  const createHexNetwork = useCallback((w: number, h: number, isMobile: boolean) => {
    const nodes: HexNode[] = []
    const connections: Connection[] = []
    const cx = w / 2
    const cy = h / 2
    const layers = isMobile ? 3 : 5
    const baseRadius = Math.min(w, h) * 0.08
    const hexSpacing = baseRadius * 1.6

    // Central node
    nodes.push({ baseX: cx, baseY: cy, radius: 5, layer: 0 })

    // Hexagonal layers
    for (let layer = 1; layer <= layers; layer++) {
      const r = hexSpacing * layer
      const count = 6 * layer
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2
        nodes.push({
          baseX: cx + r * Math.cos(angle),
          baseY: cy + r * Math.sin(angle),
          radius: Math.max(2, 5 - layer * 0.5),
          layer,
        })
      }
    }

    // Connect each node to nearest 4-5
    nodes.forEach((node, idx) => {
      const distances = nodes
        .map((other, oi) => ({
          idx: oi,
          dist: Math.hypot(node.baseX - other.baseX, node.baseY - other.baseY),
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(1, 5)

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
            speed: 0.004 + Math.random() * 0.008,
            baseGlow: 0.2 + Math.random() * 0.3,
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

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
      scrollMaxRef.current = Math.max(1, document.documentElement.scrollHeight - h)
      createHexNetwork(w, h, w <= 768)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onScroll = () => {
      scrollRef.current = window.scrollY
      scrollMaxRef.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
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

      // Scroll-driven depth: 0 = top of page, 1 = bottom
      const depth = Math.min(1, scrollRef.current / scrollMaxRef.current)

      // Zoom factor: starts at 1.0, goes to 3.5 at bottom
      const zoom = 1 + depth * 2.5

      // Opacity: slightly fades at extreme depth but stays visible
      const globalAlpha = Math.max(0.04, 0.12 - depth * 0.06)

      // Glow color shifts from cyan to gold as depth increases
      const cyanWeight = 1 - depth
      const goldWeight = depth

      const cx = w / 2
      const cy = h / 2
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Draw connections
      for (const conn of connections) {
        const fromNode = nodes[conn.from]
        const toNode = nodes[conn.to]
        if (!fromNode || !toNode) continue

        // Apply zoom: scale positions from center
        const fx = cx + (fromNode.baseX - cx) * zoom
        const fy = cy + (fromNode.baseY - cy) * zoom
        const tx = cx + (toNode.baseX - cx) * zoom
        const ty = cy + (toNode.baseY - cy) * zoom

        const px = fx + (tx - fx) * conn.progress
        const py = fy + (ty - fy) * conn.progress

        // Mouse proximity
        const mdist = Math.hypot(mx - px, my - py)
        const mouseBoost = mdist < 200 ? (1 - mdist / 200) * 0.3 : 0
        const alpha = (conn.baseGlow + mouseBoost) * globalAlpha

        // Color blend: cyan to gold based on depth
        const r = Math.round(0 * cyanWeight + 255 * goldWeight)
        const g = Math.round(200 * cyanWeight + 215 * goldWeight)
        const b = Math.round(255 * cyanWeight + 0 * goldWeight)

        // Line
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(fx, fy)
        ctx.lineTo(tx, ty)
        ctx.stroke()

        // Particle
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 2})`
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(px, py, 1.5, 0, Math.PI * 2)
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
        const nx = cx + (n.baseX - cx) * zoom
        const ny = cy + (n.baseY - cy) * zoom

        // Only render if on screen (with margin)
        if (nx < -50 || nx > w + 50 || ny < -50 || ny > h + 50) continue

        const mdist = Math.hypot(mx - nx, my - ny)
        const mouseGlow = mdist < 200 ? (1 - mdist / 200) * 0.4 : 0
        const pulse = 0.5 + Math.sin(Date.now() * 0.002 + i * 0.7) * 0.3
        const alpha = (pulse * 0.1 + mouseGlow) * (globalAlpha / 0.12)

        const r = Math.round(0 * cyanWeight + 255 * goldWeight)
        const g = Math.round(200 * cyanWeight + 215 * goldWeight)
        const b = Math.round(255 * cyanWeight + 0 * goldWeight)

        // Glow
        const rg = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.radius * zoom * 3)
        rg.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`)
        rg.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = rg
        ctx.beginPath()
        ctx.arc(nx, ny, n.radius * zoom * 3, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.beginPath()
        ctx.arc(nx, ny, n.radius * Math.min(zoom, 2), 0, Math.PI * 2)
        ctx.fill()
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
