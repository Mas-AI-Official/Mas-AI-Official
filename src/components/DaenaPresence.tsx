'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ExternalLink } from 'lucide-react'
import { useSectionState } from '@/hooks/useSectionState'

const MOOD_CONFIG: Record<string, {
  glowColor: string
  brightness: number
  caption: string
}> = {
  hero:         { glowColor: '#00c8ff', brightness: 1.0,  caption: '' },
  'what-we-do': { glowColor: '#7c3aed', brightness: 1.05, caption: 'This is what we build.' },
  daena:        { glowColor: '#00c8ff', brightness: 1.1,  caption: "That's me." },
  portfolio:    { glowColor: '#d4a853', brightness: 1.05, caption: 'We ship real products.' },
  enterprise:   { glowColor: '#d4a853', brightness: 0.95, caption: 'Enterprise governance.' },
  credibility:  { glowColor: '#00c8ff', brightness: 0.9,  caption: 'Real engineering.' },
  contact:      { glowColor: '#7c3aed', brightness: 1.05, caption: "Let's build something." },
  faq:          { glowColor: '#00c8ff', brightness: 0.85, caption: '' },
}

export default function DaenaPresence() {
  const { activeSection, scrollProgress } = useSectionState()
  const [expanded, setExpanded] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(true) // default true to prevent flash
  const [isReduced, setIsReduced] = useState(false)
  const portraitRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef({ rx: 0, ry: 0 })
  const targetRef = useRef({ rx: 0, ry: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    // Detect mobile: check both width AND touch capability
    const checkMobile = () => {
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isNarrow = window.innerWidth < 768
      setIsMobile(isNarrow || hasTouchScreen)
    }
    checkMobile()
    setIsReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    window.addEventListener('resize', checkMobile)
    const t = setTimeout(() => setVisible(true), 1200)
    return () => { window.removeEventListener('resize', checkMobile); clearTimeout(t) }
  }, [])

  // Mouse-follow 3D tilt (desktop only, no touch devices)
  useEffect(() => {
    if (isMobile || isReduced) return

    const onMouse = (e: MouseEvent) => {
      const el = portraitRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const elCx = rect.left + rect.width / 2
      const elCy = rect.top + rect.height / 2
      const nx = Math.max(-1, Math.min(1, (e.clientX - elCx) / 400))
      const ny = Math.max(-1, Math.min(1, (e.clientY - elCy) / 400))
      targetRef.current = { ry: nx * 15, rx: -ny * 10 }
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    const loop = () => {
      const c = tiltRef.current
      const t = targetRef.current
      c.rx += (t.rx - c.rx) * 0.06
      c.ry += (t.ry - c.ry) * 0.06
      if (portraitRef.current) {
        portraitRef.current.style.transform =
          `perspective(800px) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile, isReduced])

  const mood = MOOD_CONFIG[activeSection] || MOOD_CONFIG.hero

  if (!visible) return null

  // Mobile/tablet: simple avatar button with expand panel
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setExpanded(!expanded)}
          className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-2xl overflow-hidden"
          style={{
            border: `2px solid ${mood.glowColor}50`,
            boxShadow: `0 0 20px ${mood.glowColor}20`,
            WebkitTapHighlightColor: 'transparent',
          }}
          aria-label="Open Daena info"
        >
          <Image
            src="/assets/img/daena-nobg.png"
            alt="Daena AI"
            width={56}
            height={56}
            className="object-cover object-top w-full h-full"
            loading="lazy"
          />
        </button>

        {expanded && (
          <div
            className="fixed bottom-20 right-5 z-50 w-64 rounded-2xl p-4"
            style={{
              background: 'rgba(8,11,20,0.95)',
              border: `1px solid ${mood.glowColor}20`,
              WebkitBackdropFilter: 'blur(20px)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            }}
          >
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-3 right-3 text-gray-500 p-1"
              aria-label="Close"
            >
              <X size={16} />
            </button>
            <p className="text-sm text-gray-300 mb-3 pr-6">
              Governance-first AI agent orchestration by MAS-AI.
            </p>
            <a
              href="https://daena.mas-ai.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold"
              style={{ color: mood.glowColor }}
            >
              Explore Daena <ExternalLink size={14} />
            </a>
          </div>
        )}
      </>
    )
  }

  // Desktop: portrait with 3D tilt + thought bubbles
  return (
    <div
      className="fixed z-40 flex flex-col items-center gap-3"
      style={{
        right: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '7rem',
      }}
    >
      {/* Thought bubble ABOVE */}
      <AnimatePresence mode="wait">
        {mood.caption && (
          <motion.div
            key={mood.caption}
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
            className="mb-1"
          >
            <div
              className="rounded-xl px-4 py-2 text-xs font-medium text-center"
              style={{
                maxWidth: '140px',
                lineHeight: '1.4',
                background: 'rgba(8,11,20,0.9)',
                border: `1px solid ${mood.glowColor}30`,
                color: mood.glowColor,
                boxShadow: `0 0 20px ${mood.glowColor}15`,
              }}
            >
              {mood.caption}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: mood.glowColor + '40' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: mood.glowColor + '25' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portrait with 3D tilt */}
      <div
        ref={portraitRef}
        onClick={() => setExpanded(!expanded)}
        style={{
          position: 'relative',
          width: '96px',
          height: '128px',
          cursor: 'pointer',
          filter: `brightness(${mood.brightness})`,
          WebkitFilter: `brightness(${mood.brightness})`,
          willChange: 'transform',
          transition: 'filter 0.5s ease',
        }}
      >
        {/* Glow behind portrait */}
        <div
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '16px',
            background: `radial-gradient(circle, ${mood.glowColor}15, transparent 70%)`,
            transition: 'background 0.7s ease',
            pointerEvents: 'none',
          }}
        />
        <Image
          src="/assets/img/daena-nobg.png"
          alt="Daena, AI VP of MAS-AI Technologies"
          width={200}
          height={280}
          className="object-cover object-top"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            zIndex: 1,
          }}
          priority
        />
      </div>

      {/* Scroll depth bar */}
      <div style={{ width: '1px', height: '48px', background: 'rgba(107,114,128,0.3)', position: 'relative', borderRadius: '1px', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: '1px',
            background: mood.glowColor,
            height: `${scrollProgress * 100}%`,
            transition: 'height 0.1s linear, background 0.5s ease',
          }}
        />
      </div>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 10 }}
            transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
            style={{
              position: 'absolute',
              right: '100%',
              marginRight: '16px',
              top: 0,
              width: '288px',
              borderRadius: '16px',
              padding: '20px',
              background: 'rgba(8,11,20,0.95)',
              border: `1px solid ${mood.glowColor}20`,
              WebkitBackdropFilter: 'blur(24px)',
              backdropFilter: 'blur(24px)',
              boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${mood.glowColor}10`,
            }}
          >
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors p-1"
              aria-label="Close panel"
            >
              <X size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: `1px solid ${mood.glowColor}30`,
                  flexShrink: 0,
                }}
              >
                <Image src="/assets/img/daena-nobg.png" alt="Daena" width={40} height={40} className="object-cover object-top" />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Daena</p>
                <p style={{ fontSize: '12px', color: mood.glowColor, fontFamily: 'monospace' }}>MAS-AI Flagship Platform</p>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px', lineHeight: '1.6' }}>
              Governance-first AI agent orchestration. Every agent governed, every decision traced, every action auditable.
            </p>
            <a
              href="https://daena.mas-ai.co"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                background: mood.glowColor,
                color: '#080b14',
                textDecoration: 'none',
                transition: 'transform 0.2s ease',
              }}
            >
              Explore Daena <ExternalLink size={14} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
