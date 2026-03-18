'use client'

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  alpha: number
}

export default function MetatronBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const scrollRef = useRef(0)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Check reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    // Create nodes
    const nodeCount = Math.min(50, Math.floor((width * height) / 25000))
    const nodes: Node[] = []
    const cyanColor = 'rgba(0, 200, 255,'
    const goldColor = 'rgba(212, 168, 67,'

    for (let i = 0; i < nodeCount; i++) {
      const isGold = i % 7 === 0
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: isGold ? goldColor : cyanColor,
        alpha: isGold ? 0.08 : 0.12,
      })
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    let lastTime = 0
    const frameInterval = 1000 / 30 // 30fps cap

    const draw = (time: number) => {
      if (reducedMotion) {
        // Draw single static frame
        drawFrame(ctx, nodes, width, height)
        return
      }

      animRef.current = requestAnimationFrame(draw)

      if (time - lastTime < frameInterval) return
      lastTime = time

      drawFrame(ctx, nodes, width, height)
    }

    function drawFrame(ctx: CanvasRenderingContext2D, nodes: Node[], w: number, h: number) {
      ctx.clearRect(0, 0, w, h)

      const scrollFade = Math.max(0, 1 - scrollRef.current / (h * 1.5))
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]

        if (!reducedMotion) {
          n.x += n.vx
          n.y += n.vy

          // Bounce off edges
          if (n.x < 0 || n.x > w) n.vx *= -1
          if (n.y < 0 || n.y > h) n.vy *= -1
          n.x = Math.max(0, Math.min(w, n.x))
          n.y = Math.max(0, Math.min(h, n.y))
        }

        // Mouse proximity glow
        const dx = mx - n.x
        const dy = my - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const mouseInfluence = dist < 200 ? (1 - dist / 200) * 0.15 : 0
        const alpha = (n.alpha + mouseInfluence) * scrollFade

        // Draw node
        ctx.beginPath()
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = n.color + alpha + ')'
        ctx.fill()

        // Draw connections to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j]
          const cx = n.x - m.x
          const cy = n.y - m.y
          const d = Math.sqrt(cx * cx + cy * cy)
          if (d < 160) {
            const lineAlpha = (1 - d / 160) * 0.06 * scrollFade
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(m.x, m.y)
            ctx.strokeStyle = cyanColor + lineAlpha + ')'
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    if (reducedMotion) {
      drawFrame(ctx, nodes, width, height)
    } else {
      animRef.current = requestAnimationFrame(draw)
    }

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
