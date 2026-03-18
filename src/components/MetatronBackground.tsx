'use client'

import { useEffect, useRef } from 'react'

/**
 * MetatronBackground: TRUE 3D Metatron's Cube with perspective projection.
 *
 * 13 nodes arranged in Metatron's Cube pattern, rendered with 3D perspective.
 * The camera moves forward on scroll, diving into the center of the cube.
 * Mouse movement tilts the entire 3D structure.
 * Golden flowing particles along connections with glow effects.
 *
 * 3D projection: each node has (x, y, z) coordinates projected to 2D via
 * perspective division. Scroll moves the camera's Z position forward.
 * Mouse tilts the structure around X and Y axes.
 */

interface Node3D {
  x: number; y: number; z: number
  r: number; ring: number
}

export default function MetatronBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0

    // Build Metatron's Cube in 3D space
    // Centered at origin, radius ~300 units
    const R1 = 180 // inner ring radius
    const R2 = 360 // outer ring radius
    const nodes: Node3D[] = []

    // Center node
    nodes.push({ x: 0, y: 0, z: 0, r: 10, ring: 0 })

    // Inner ring: 6 nodes, flat on z=0
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2
      nodes.push({ x: R1 * Math.cos(a), y: R1 * Math.sin(a), z: 0, r: 8, ring: 1 })
    }

    // Outer ring: 6 nodes at z=0, offset 30 degrees
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6 - Math.PI / 2 + Math.PI / 6
      nodes.push({ x: R2 * Math.cos(a), y: R2 * Math.sin(a), z: 0, r: 7, ring: 2 })
    }

    // Add depth layers: duplicate the pattern at z=-200 and z=200
    // This creates the 3D "cube" feel
    const baseCount = nodes.length
    for (let zOff of [-220, 220]) {
      // Inner ring at depth
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6 - Math.PI / 2 + (zOff > 0 ? Math.PI / 6 : 0)
        const rr = zOff > 0 ? R1 * 0.7 : R1 * 1.2
        nodes.push({ x: rr * Math.cos(a), y: rr * Math.sin(a), z: zOff, r: 6, ring: 3 })
      }
    }

    // Connections: complete graph for the 13 core nodes + connections to depth layers
    const connections: [number, number, number][] = [] // [from, to, particleProgress]
    // Core 13 nodes: connect all
    for (let i = 0; i < baseCount; i++) {
      for (let j = i + 1; j < baseCount; j++) {
        connections.push([i, j, Math.random()])
      }
    }
    // Connect depth layers to core
    for (let i = baseCount; i < nodes.length; i++) {
      // Connect to center
      connections.push([0, i, Math.random()])
      // Connect to nearest 2 inner ring nodes
      const dists = nodes.slice(1, 7).map((n, idx) => ({
        idx: idx + 1,
        d: Math.hypot(nodes[i].x - n.x, nodes[i].y - n.y)
      })).sort((a, b) => a.d - b.d)
      connections.push([dists[0].idx, i, Math.random()])
      connections.push([dists[1].idx, i, Math.random()])
    }

    const connSpeeds = connections.map(() => 0.008 + Math.random() * 0.015)

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      if (!canvas || !ctx) return
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouse = (e: MouseEvent) => {
      // Normalize to -1..1
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    // 3D projection function
    function project(x: number, y: number, z: number, camZ: number): [number, number, number] | null {
      // dz = distance from camera to node along Z axis
      // Camera looks toward +Z. Node must be in front of camera (z > camZ)
      const dz = z - camZ
      if (dz < 50) return null // too close or behind camera
      const fov = 800
      const scale = fov / dz
      return [w / 2 + x * scale, h / 2 + y * scale, scale]
    }

    // Rotate point around Y axis (mouse X) and X axis (mouse Y)
    function rotatePoint(x: number, y: number, z: number, ax: number, ay: number): [number, number, number] {
      // Rotate around Y axis
      let cos = Math.cos(ay), sin = Math.sin(ay)
      let x1 = x * cos - z * sin
      let z1 = x * sin + z * cos
      // Rotate around X axis
      cos = Math.cos(ax); sin = Math.sin(ax)
      let y1 = y * cos - z1 * sin
      let z2 = y * sin + z1 * cos
      return [x1, y1, z2]
    }

    let lastT = 0

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)
      timeRef.current += 0.016

      const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const scrollPct = Math.min(1, scrollRef.current / docH)

      // Camera Z: starts at distance where cube fills viewport, moves in
      const camZ = -700 + scrollPct * 500 // -700 to -200

      // Mouse-driven rotation (subtle)
      const rotY = mouseRef.current.x * 0.15
      const rotX = mouseRef.current.y * 0.1

      // Faster idle rotation
      const idleRotY = timeRef.current * 0.12
      const idleRotX = Math.sin(timeRef.current * 0.5) * 0.06

      const totalRotY = rotY + idleRotY
      const totalRotX = rotX + idleRotX

      // Fixed colors: lines = cyan, nodes = gold (no blending on scroll)
      // Global alpha: 20% visibility
      const baseAlpha = Math.max(0.04, 0.1 - scrollPct * 0.04)

      // Project all nodes
      const projected: ([number, number, number] | null)[] = nodes.map(n => {
        const [rx, ry, rz] = rotatePoint(n.x, n.y, n.z, totalRotX, totalRotY)
        return project(rx, ry, rz, camZ)
      })

      // Sort connections by average depth (draw far ones first)
      const sortedConns = connections.map((c, i) => ({ c, i })).sort((a, b) => {
        const pa = projected[a.c[0]], pb = projected[b.c[0]]
        const sa = pa ? pa[2] : 0, sb = pb ? pb[2] : 0
        return sa - sb // far (small scale) first
      })

      // Draw connections
      for (const { c, i } of sortedConns) {
        const [fi, ti] = c
        const fp = projected[fi], tp = projected[ti]
        if (!fp || !tp) continue

        const [fx, fy, fs] = fp
        const [tx, ty, ts] = tp
        const avgScale = (fs + ts) / 2
        const depthAlpha = Math.min(1, avgScale * 0.8) * baseAlpha

        // Mouse proximity to midpoint
        const mx = (fx + tx) / 2, my = (fy + ty) / 2
        const mDist = Math.hypot(mouseRef.current.x * w / 2 + w / 2 - mx, mouseRef.current.y * h / 2 + h / 2 - my)
        const mBoost = mDist < 200 ? (1 - mDist / 200) * 0.2 : 0

        const alpha = depthAlpha + mBoost

        // Lines are ALWAYS cyan
        ctx.strokeStyle = `rgba(0, 200, 255, ${alpha * 0.6})`
        ctx.lineWidth = Math.max(0.5, avgScale * 1.5)
        ctx.beginPath()
        ctx.moveTo(fx, fy)
        ctx.lineTo(tx, ty)
        ctx.stroke()

        // Flowing particle (gold)
        const progress = c[2]
        const px = fx + (tx - fx) * progress
        const py = fy + (ty - fy) * progress
        const pSize = Math.max(1, avgScale * 2)

        ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 2})`
        ctx.shadowColor = '#FFD700'
        ctx.shadowBlur = Math.max(3, avgScale * 6)
        ctx.beginPath()
        ctx.arc(px, py, pSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        if (!reduced) {
          c[2] += connSpeeds[i]
          if (c[2] > 1) c[2] = 0
        }
      }

      // Draw nodes (sorted by depth, far first)
      const sortedNodes = nodes.map((n, i) => ({ n, i, p: projected[i] }))
        .filter(x => x.p !== null)
        .sort((a, b) => a.p![2] - b.p![2])

      for (const { n, i, p } of sortedNodes) {
        if (!p) continue
        const [nx, ny, ns] = p

        // Skip off-screen
        if (nx < -100 || nx > w + 100 || ny < -100 || ny > h + 100) continue

        const depthAlpha = Math.min(1, ns * 0.8) * baseAlpha
        const pulse = 0.6 + Math.sin(timeRef.current * 2 + i * 0.9) * 0.3
        const nodeAlpha = depthAlpha * pulse

        // Mouse proximity glow
        const msx = mouseRef.current.x * w / 2 + w / 2
        const msy = mouseRef.current.y * h / 2 + h / 2
        const mDist = Math.hypot(msx - nx, msy - ny)
        const mGlow = mDist < 200 ? (1 - mDist / 200) * 0.4 : 0

        const totalAlpha = nodeAlpha + mGlow

        // Nodes are ALWAYS gold
        const nodeSize = n.r * Math.min(ns, 2)

        // Outer glow circle (gold)
        const rg = ctx.createRadialGradient(nx, ny, 0, nx, ny, nodeSize * 4)
        rg.addColorStop(0, `rgba(255,215,0,${totalAlpha * 0.4})`)
        rg.addColorStop(0.5, `rgba(255,215,0,${totalAlpha * 0.1})`)
        rg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = rg
        ctx.beginPath()
        ctx.arc(nx, ny, nodeSize * 4, 0, Math.PI * 2)
        ctx.fill()

        // Circle outline (cyan ring around gold node)
        if (n.ring <= 2) {
          ctx.strokeStyle = `rgba(0,200,255,${totalAlpha * 0.2})`
          ctx.lineWidth = Math.max(0.5, ns * 0.6)
          ctx.beginPath()
          ctx.arc(nx, ny, nodeSize * 2.5, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Core glowing dot (gold)
        ctx.fillStyle = `rgba(255,215,0,${totalAlpha})`
        ctx.shadowColor = '#FFD700'
        ctx.shadowBlur = Math.max(6, ns * 10)
        ctx.beginPath()
        ctx.arc(nx, ny, nodeSize, 0, Math.PI * 2)
        ctx.fill()

        // Bright white center
        if (n.ring === 0) {
          ctx.fillStyle = `rgba(255,255,255,${totalAlpha * 0.8})`
          ctx.beginPath()
          ctx.arc(nx, ny, nodeSize * 0.3, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.shadowBlur = 0
      }
    }

    function loop(t: number) {
      animRef.current = requestAnimationFrame(loop)
      if (t - lastT < 33) return // ~30fps
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
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}
