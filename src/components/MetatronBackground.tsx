'use client'

import { useEffect, useRef } from 'react'

/**
 * MetatronBackground: Full-scale Metatron's Cube with SVG glow filters,
 * large golden circles, flowing dash-animated connections, and scroll depth-dive.
 *
 * Based on the original metatron-viz.js SVG implementation but ported to
 * React with scroll-driven zoom and cursor reactivity.
 *
 * 13 circles: 1 center (radius 30) + 6 inner (radius 25) + 6 outer (radius 25)
 * All connected with flowing golden light lines.
 */

export default function MetatronBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const timeRef = useRef(0)
  const animRef = useRef<number>(0)
  const scrollRef = useRef(0)
  const mouseRef = useRef({ x: 500, y: 500 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Build the SVG Metatron's Cube
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 1000 1000')
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:visible;'
    svgRef.current = svg

    // Defs: filters + gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

    // Glow filter
    const addFilter = (id: string, blur: number) => {
      const f = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
      f.setAttribute('id', id)
      f.setAttribute('x', '-100%'); f.setAttribute('y', '-100%')
      f.setAttribute('width', '300%'); f.setAttribute('height', '300%')
      const gb = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur')
      gb.setAttribute('stdDeviation', String(blur))
      gb.setAttribute('result', 'glow')
      f.appendChild(gb)
      const mg = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge')
      const mn1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode')
      mn1.setAttribute('in', 'glow')
      const mn2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode')
      mn2.setAttribute('in', 'SourceGraphic')
      mg.appendChild(mn1); mg.appendChild(mn2)
      f.appendChild(mg)
      defs.appendChild(f)
    }
    addFilter('nodeGlow', 6)
    addFilter('centerGlow', 12)

    // Radial gradient for nodes
    const rg = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient')
    rg.setAttribute('id', 'nodeGrad')
    rg.setAttribute('cx', '50%'); rg.setAttribute('cy', '50%'); rg.setAttribute('r', '50%')
    const stops = [
      ['0%', '#ffffff', '1'], ['30%', '#ffed4e', '1'],
      ['60%', '#ffd700', '0.8'], ['100%', '#ffa500', '0.3']
    ]
    stops.forEach(([off, col, op]) => {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
      s.setAttribute('offset', off); s.setAttribute('stop-color', col); s.setAttribute('stop-opacity', op)
      rg.appendChild(s)
    })
    defs.appendChild(rg)
    svg.appendChild(defs)

    // Metatron nodes
    const CX = 500, CY = 500, IR = 180, OR = 360
    interface MNode { x: number; y: number; r: number; isCenter: boolean }
    const nodes: MNode[] = []

    nodes.push({ x: CX, y: CY, r: 30, isCenter: true })
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6 - Math.PI / 2
      nodes.push({ x: CX + IR * Math.cos(a), y: CY + IR * Math.sin(a), r: 25, isCenter: false })
    }
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6 - Math.PI / 2 + Math.PI / 6
      nodes.push({ x: CX + OR * Math.cos(a), y: CY + OR * Math.sin(a), r: 25, isCenter: false })
    }

    // Connections (Metatron's Cube pattern)
    const conns: [number, number, number][] = []
    // Center to inner
    for (let i = 1; i <= 6; i++) conns.push([0, i, 0.5 + Math.random() * 0.3])
    // Inner hexagon
    for (let i = 1; i <= 6; i++) conns.push([i, i === 6 ? 1 : i + 1, 0.4 + Math.random() * 0.2])
    // Inner to outer
    for (let i = 1; i <= 6; i++) {
      conns.push([i, 7 + ((i - 1) % 6), 0.6 + Math.random() * 0.2])
      conns.push([i, 7 + (i % 6), 0.6 + Math.random() * 0.2])
    }
    // Outer hexagon
    for (let i = 7; i <= 12; i++) conns.push([i, i === 12 ? 7 : i + 1, 0.5 + Math.random() * 0.3])
    // Cross connections (star pattern)
    for (let i = 0; i < 6; i++) {
      conns.push([1 + i, 1 + ((i + 2) % 6), 0.3 + Math.random() * 0.2])
      conns.push([1 + i, 1 + ((i + 3) % 6), 0.3 + Math.random() * 0.2])
    }
    // Center to outer
    for (let i = 7; i <= 12; i++) conns.push([0, i, 0.4 + Math.random() * 0.3])

    // Draw connections
    const connGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    connGroup.setAttribute('id', 'metatron-conns')
    const pathEls: SVGPathElement[] = []

    conns.forEach(([fi, ti, speed]) => {
      const f = nodes[fi], t = nodes[ti]
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const d = `M ${f.x} ${f.y} L ${t.x} ${t.y}`
      path.setAttribute('d', d)
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', '#ffd700')
      path.setAttribute('stroke-width', '2.5')
      path.setAttribute('opacity', '0.5')
      path.setAttribute('filter', 'url(#nodeGlow)')

      const len = Math.hypot(t.x - f.x, t.y - f.y)
      path.setAttribute('stroke-dasharray', `${len * 0.25} ${len * 0.75}`)
      path.dataset.speed = String(speed)
      path.dataset.len = String(len)

      connGroup.appendChild(path)
      pathEls.push(path)
    })
    svg.appendChild(connGroup)

    // Draw nodes
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    nodeGroup.setAttribute('id', 'metatron-nodes')

    nodes.forEach((n) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      g.setAttribute('transform', `translate(${n.x}, ${n.y})`)

      // Outer glow
      const gc = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      gc.setAttribute('r', String(n.r * 1.8))
      gc.setAttribute('fill', 'url(#nodeGrad)')
      gc.setAttribute('opacity', '0.35')
      gc.setAttribute('filter', n.isCenter ? 'url(#centerGlow)' : 'url(#nodeGlow)')
      g.appendChild(gc)

      // Main circle
      const mc = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      mc.setAttribute('r', String(n.r))
      mc.setAttribute('fill', 'url(#nodeGrad)')
      mc.setAttribute('stroke', '#ffd700')
      mc.setAttribute('stroke-width', '2')
      mc.setAttribute('opacity', '0.8')
      mc.setAttribute('filter', n.isCenter ? 'url(#centerGlow)' : 'url(#nodeGlow)')
      g.appendChild(mc)

      // Bright center
      const ic = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      ic.setAttribute('r', String(n.r * 0.25))
      ic.setAttribute('fill', '#ffffff')
      ic.setAttribute('opacity', '0.9')
      g.appendChild(ic)

      nodeGroup.appendChild(g)
    })
    svg.appendChild(nodeGroup)
    container.appendChild(svg)

    // Scroll + mouse
    const onScroll = () => {
      scrollRef.current = window.scrollY
    }
    const onMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 1000,
        y: ((e.clientY - rect.top) / rect.height) * 1000,
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016

      const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const depth = Math.min(1, scrollRef.current / docH)
      const zoom = 1 + depth * 2.5
      const baseOpacity = Math.max(0.15, 0.6 - depth * 0.3)

      // Apply zoom via SVG transform
      const tx = 500 - 500 * zoom
      const ty = 500 - 500 * zoom
      svg.setAttribute('viewBox', `${tx} ${ty} ${1000 / zoom * zoom} ${1000 / zoom * zoom}`)
      // Actually, let's use transform on the groups for proper zoom-into-center
      const transformStr = `translate(${500}, ${500}) scale(${zoom}) translate(${-500}, ${-500})`
      connGroup.setAttribute('transform', transformStr)
      nodeGroup.setAttribute('transform', transformStr)

      // Animate flowing lines
      pathEls.forEach((path, idx) => {
        const speed = parseFloat(path.dataset.speed || '0.5')
        const len = parseFloat(path.dataset.len || '100')
        const offset = (timeRef.current * speed * 120) % (len * 2)
        path.setAttribute('stroke-dashoffset', String(-offset))
        const op = (0.3 + Math.sin(timeRef.current * 2 + idx * 0.7) * 0.25) * baseOpacity
        path.setAttribute('opacity', String(Math.max(0.1, Math.min(0.8, op))))
      })

      // Animate node pulse
      const nodeEls = nodeGroup.querySelectorAll('g')
      nodeEls.forEach((g, idx) => {
        const pulse = 0.7 + Math.sin(timeRef.current * 2 + idx * 0.8) * 0.2
        const circles = g.querySelectorAll('circle')
        circles.forEach(c => {
          const baseOp = parseFloat(c.getAttribute('opacity') || '0.5')
          // Don't override the bright center dot
          if (c.getAttribute('fill') === '#ffffff') return
        })
        g.style.opacity = String(pulse * baseOpacity * 1.5)
      })

      if (!reduced) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    if (reduced) {
      // Static render
      svg.style.opacity = '0.3'
    } else {
      animRef.current = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
      if (svg.parentNode) svg.parentNode.removeChild(svg)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
