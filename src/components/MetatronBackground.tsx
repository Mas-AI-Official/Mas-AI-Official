'use client'

import { useEffect, useRef } from 'react'

/**
 * MetatronBackground: Direct port of the Daena website's metatron-hex-network.js
 * with added mouse cursor interaction and scroll depth-dive.
 *
 * 3 hexagonal layers of nodes, 5 connections per node with flowing golden particles,
 * 13-circle Metatron's Cube pattern drawn in background, radial glow on nodes.
 * Mouse proximity brightens nearby nodes/connections. Scroll zooms into center.
 */

interface MNode {
  x: number; y: number; radius: number; glow: number
  layer: number; connections: number[]
}
interface MConn {
  from: number; to: number; progress: number; speed: number; glow: number
}

export default function MetatronBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const scrollRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0, h = 0, cx = 0, cy = 0
    let nodes: MNode[] = []
    let connections: MConn[] = []

    function setup() {
      if (!canvas) return
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
      cx = w / 2
      cy = h / 2
      buildNetwork()
    }

    function buildNetwork() {
      nodes = []
      connections = []

      const layers = 3
      const baseR = Math.min(w, h) * 0.12
      const spacing = baseR * 1.8

      // Center node
      nodes.push({ x: cx, y: cy, radius: 8, glow: 1, layer: 0, connections: [] })

      // Hexagonal layers
      for (let layer = 1; layer <= layers; layer++) {
        const r = spacing * layer
        const count = 6 * layer
        for (let i = 0; i < count; i++) {
          const a = (Math.PI * 2 * i) / count - Math.PI / 2
          nodes.push({
            x: cx + r * Math.cos(a),
            y: cy + r * Math.sin(a),
            radius: 6, glow: 0.7, layer, connections: []
          })
        }
      }

      // Connect each node to 5 nearest
      nodes.forEach((node, idx) => {
        const dists = nodes.map((o, oi) => ({
          idx: oi,
          dist: Math.hypot(node.x - o.x, node.y - o.y),
        })).sort((a, b) => a.dist - b.dist).slice(1, 6)

        dists.forEach((d) => {
          const exists = connections.some(
            c => (c.from === idx && c.to === d.idx) || (c.from === d.idx && c.to === idx)
          )
          if (!exists) {
            connections.push({
              from: idx, to: d.idx,
              progress: Math.random(),
              speed: 0.008 + Math.random() * 0.015,
              glow: 0.4 + Math.random() * 0.5,
            })
            node.connections.push(d.idx)
          }
        })
      })
    }

    // Draw the 13-circle Metatron's Cube background pattern
    function drawMetatronBg() {
      if (!ctx) return
      ctx.save()
      ctx.globalAlpha = 0.1

      const circles = [
        { x: cx, y: cy, r: 40 },
        ...Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 6 - Math.PI / 2
          return { x: cx + 80 * Math.cos(a), y: cy + 80 * Math.sin(a), r: 30 }
        }),
        ...Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 6 - Math.PI / 2
          return { x: cx + 140 * Math.cos(a), y: cy + 140 * Math.sin(a), r: 25 }
        }),
      ]

      // Draw circles with glow
      circles.forEach(c => {
        ctx.beginPath()
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2)
        ctx.strokeStyle = '#FFD700'
        ctx.lineWidth = 1
        ctx.shadowBlur = 20
        ctx.shadowColor = '#FFD700'
        ctx.stroke()
        ctx.shadowBlur = 0
      })

      // Connect all circles
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 0.5
      circles.forEach((c, i) => {
        circles.slice(i + 1).forEach(o => {
          ctx.beginPath()
          ctx.moveTo(c.x, c.y)
          ctx.lineTo(o.x, o.y)
          ctx.stroke()
        })
      })

      ctx.restore()
    }

    function drawConnection(conn: MConn) {
      if (!ctx) return
      const f = nodes[conn.from]
      const t = nodes[conn.to]
      if (!f || !t) return

      const px = f.x + (t.x - f.x) * conn.progress
      const py = f.y + (t.y - f.y) * conn.progress

      // Mouse proximity boost
      const mx = mouseRef.current.x, my = mouseRef.current.y
      const mDist = Math.hypot(mx - px, my - py)
      const mBoost = mDist < 200 ? (1 - mDist / 200) * 0.5 : 0
      const glowVal = conn.glow + mBoost

      // Flowing gradient line
      const grad = ctx.createLinearGradient(f.x, f.y, t.x, t.y)
      grad.addColorStop(0, 'rgba(255, 215, 0, 0)')
      grad.addColorStop(Math.max(0, conn.progress - 0.2), 'rgba(255, 215, 0, 0)')
      grad.addColorStop(conn.progress, `rgba(255, 215, 0, ${glowVal})`)
      grad.addColorStop(Math.min(1, conn.progress + 0.2), `rgba(0, 188, 212, ${glowVal * 0.8})`)
      grad.addColorStop(1, 'rgba(0, 188, 212, 0)')

      ctx.strokeStyle = grad
      ctx.lineWidth = 2
      ctx.shadowBlur = 15
      ctx.shadowColor = '#FFD700'
      ctx.beginPath()
      ctx.moveTo(f.x, f.y)
      ctx.lineTo(t.x, t.y)
      ctx.stroke()

      // Flowing particle
      ctx.fillStyle = `rgba(255, 215, 0, ${glowVal})`
      ctx.shadowBlur = 20
      ctx.shadowColor = '#FFD700'
      ctx.beginPath()
      ctx.arc(px, py, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      if (!reduced) {
        conn.progress += conn.speed
        if (conn.progress > 1) conn.progress = 0
      }
    }

    function drawNode(node: MNode, idx: number) {
      if (!ctx) return
      // Mouse proximity boost
      const mx = mouseRef.current.x, my = mouseRef.current.y
      const mDist = Math.hypot(mx - node.x, my - node.y)
      const mBoost = mDist < 200 ? (1 - mDist / 200) * 0.6 : 0
      const glowVal = node.glow + mBoost

      // Outer radial glow
      const rg = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 3)
      rg.addColorStop(0, `rgba(255, 215, 0, ${glowVal * 0.6})`)
      rg.addColorStop(0.5, `rgba(0, 188, 212, ${glowVal * 0.3})`)
      rg.addColorStop(1, 'rgba(255, 215, 0, 0)')

      ctx.fillStyle = rg
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2)
      ctx.fill()

      // Node core
      ctx.fillStyle = `rgba(255, 215, 0, ${glowVal})`
      ctx.shadowBlur = 15
      ctx.shadowColor = '#FFD700'
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Pulse
      if (!reduced) {
        node.glow = 0.6 + Math.sin(Date.now() * 0.003 + idx) * 0.4
      }
    }

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      // Scroll depth: zoom into center
      const docH = Math.max(1, document.documentElement.scrollHeight - h)
      const depth = Math.min(1, scrollRef.current / docH)
      const zoom = 1 + depth * 2

      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(zoom, zoom)
      ctx.translate(-cx, -cy)

      // Fade slightly at depth
      ctx.globalAlpha = Math.max(0.3, 1 - depth * 0.5)

      drawMetatronBg()
      connections.forEach(c => drawConnection(c))
      nodes.forEach((n, i) => drawNode(n, i))

      ctx.restore()

      if (!reduced) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    setup()
    window.addEventListener('resize', setup)
    window.addEventListener('mousemove', (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }, { passive: true })
    window.addEventListener('scroll', () => {
      scrollRef.current = window.scrollY
    }, { passive: true })

    if (reduced) {
      animate() // single frame
    } else {
      animRef.current = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', setup)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
