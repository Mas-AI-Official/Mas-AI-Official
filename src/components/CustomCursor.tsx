'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

type CursorMode = 'default' | 'cta' | 'explore' | 'click'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const ringPosRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const modeRef = useRef<CursorMode>('default')
  const [hidden, setHidden] = useState(false)
  const [shouldRender, setShouldRender] = useState(true)

  // Check for touch device and reduced motion on mount
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) {
      setShouldRender(false)
      return
    }

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) {
      setShouldRender(false)
      return
    }

    document.body.classList.add('custom-cursor-active')
    return () => {
      document.body.classList.remove('custom-cursor-active')
    }
  }, [])

  // Apply cursor mode styles imperatively to avoid re-renders
  const applyCursorMode = useCallback((mode: CursorMode) => {
    const ring = ringRef.current
    const label = labelRef.current
    if (!ring || !label) return

    switch (mode) {
      case 'cta':
        ring.style.width = '48px'
        ring.style.height = '48px'
        ring.style.borderColor = 'transparent'
        ring.style.backgroundColor = 'var(--color-mas-cyan)'
        ring.style.opacity = '0.35'
        label.textContent = ''
        break
      case 'explore':
        ring.style.width = '48px'
        ring.style.height = '48px'
        ring.style.borderColor = 'var(--color-mas-cyan)'
        ring.style.backgroundColor = 'transparent'
        ring.style.opacity = '1'
        label.textContent = 'Explore'
        break
      case 'click':
        ring.style.width = '36px'
        ring.style.height = '36px'
        ring.style.borderColor = 'var(--color-mas-cyan)'
        ring.style.backgroundColor = 'transparent'
        ring.style.opacity = '1'
        label.textContent = ''
        break
      default:
        ring.style.width = '32px'
        ring.style.height = '32px'
        ring.style.borderColor = 'var(--color-mas-cyan)'
        ring.style.backgroundColor = 'transparent'
        ring.style.opacity = '0.6'
        label.textContent = ''
        break
    }
  }, [])

  // RAF animation loop
  useEffect(() => {
    if (!shouldRender) return

    const LERP = 0.15

    const tick = () => {
      const dot = dotRef.current
      const ring = ringRef.current
      if (dot && ring) {
        // Dot follows cursor directly
        dot.style.transform = `translate(${posRef.current.x - 4}px, ${posRef.current.y - 4}px)`

        // Ring follows with lerp
        ringPosRef.current.x +=
          (posRef.current.x - ringPosRef.current.x) * LERP
        ringPosRef.current.y +=
          (posRef.current.y - ringPosRef.current.y) * LERP

        const rw = ring.offsetWidth / 2
        const rh = ring.offsetHeight / 2
        ring.style.transform = `translate(${ringPosRef.current.x - rw}px, ${ringPosRef.current.y - rh}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [shouldRender])

  // Mouse move + hover target tracking
  useEffect(() => {
    if (!shouldRender) return

    const onMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX
      posRef.current.y = e.clientY
      if (hidden) setHidden(false)
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        '[data-cursor]',
      )
      const mode = (target?.dataset.cursor as CursorMode) || 'default'
      if (mode !== modeRef.current) {
        modeRef.current = mode
        applyCursorMode(mode)
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null
      if (!related || !related.closest?.('[data-cursor]')) {
        if (modeRef.current !== 'default') {
          modeRef.current = 'default'
          applyCursorMode('default')
        }
      }
    }

    const onMouseLeave = () => setHidden(true)
    const onMouseEnter = () => setHidden(false)

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseover', onMouseOver, { passive: true })
    document.addEventListener('mouseout', onMouseOut, { passive: true })
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    document.documentElement.addEventListener('mouseenter', onMouseEnter)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      document.documentElement.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [shouldRender, hidden, applyCursorMode])

  if (!shouldRender) return null

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'var(--color-mas-cyan)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: hidden ? 0 : 1,
          transition: 'opacity 0.2s',
          willChange: 'transform',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1.5px solid var(--color-mas-cyan)',
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: hidden ? 0 : 0.6,
          transition: 'width 0.25s, height 0.25s, opacity 0.2s, background-color 0.25s, border-color 0.25s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--color-mas-cyan)',
            letterSpacing: '0.05em',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        />
      </div>
    </>
  )
}
