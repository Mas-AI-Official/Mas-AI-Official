'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ExternalLink } from 'lucide-react'
import { useSectionState } from '@/hooks/useSectionState'

/**
 * DaenaPresence: CSS 3D parallax portrait with mouse-follow tilt.
 *
 * Uses CSS preserve-3d + perspective for genuine depth parallax.
 * The portrait tilts toward the cursor (max 15deg) with smooth lerp.
 * Mood-based glow color and brightness shift per section.
 * Thought bubbles appear ABOVE the portrait.
 *
 * Stable, no drift: position is fixed, only rotateX/Y changes.
 */

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
  const [isMobile, setIsMobile] = useState(false)
  const [isReduced, setIsReduced] = useState(false)
  const portraitRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef({ rx: 0, ry: 0 })
  const targetRef = useRef({ rx: 0, ry: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    setIsReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    const t = setTimeout(() => setVisible(true), 1200)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t) }
  }, [])

  // Mouse-follow 3D tilt (desktop only)
  useEffect(() => {
    if (isMobile || isReduced) return

    const onMouse = (e: MouseEvent) => {
      const el = portraitRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const elCx = rect.left + rect.width / 2
      const elCy = rect.top + rect.height / 2
      // Normalize to -1..1 based on distance from portrait center
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

  if (isMobile) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setExpanded(!expanded)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-2xl overflow-hidden border-2 transition-all duration-500"
        style={{ borderColor: mood.glowColor + '50', boxShadow: `0 0 24px ${mood.glowColor}25` }}
      >
        <Image src="/assets/img/daena-nobg.png" alt="Daena AI" width={56} height={56} className="object-cover object-top" />
      </motion.button>
    )
  }

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 w-28">
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
              className="rounded-xl px-4 py-2 text-xs font-medium max-w-[140px] text-center leading-snug"
              style={{
                background: 'rgba(8,11,20,0.9)',
                border: `1px solid ${mood.glowColor}30`,
                color: mood.glowColor,
                boxShadow: `0 0 20px ${mood.glowColor}15`,
              }}
            >
              {mood.caption}
            </div>
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ background: mood.glowColor + '40' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: mood.glowColor + '25' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portrait with 3D tilt */}
      <div
        ref={portraitRef}
        className="relative w-24 h-32 cursor-pointer overflow-visible transition-[filter,box-shadow] duration-500"
        onClick={() => setExpanded(!expanded)}
        style={{
          filter: `brightness(${mood.brightness}) drop-shadow(0 0 15px ${mood.glowColor}30)`,
          willChange: 'transform',
        }}
      >
        {/* Mood glow overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${mood.glowColor}15, transparent 70%)`,
          }}
        />
        <Image
          src="/assets/img/daena-nobg.png"
          alt="Daena, AI VP of MAS-AI Technologies"
          width={200}
          height={280}
          className="object-cover object-top w-full h-full"
          priority
        />
      </div>

      {/* Scroll depth bar */}
      <div className="w-px h-12 bg-gray-800/50 relative rounded-full overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-full"
          style={{ background: mood.glowColor }}
          animate={{ height: `${scrollProgress * 100}%` }}
          transition={{ duration: 0.1 }}
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
            className="absolute right-full mr-4 top-0 w-72 rounded-2xl p-5"
            style={{
              background: 'rgba(8,11,20,0.95)',
              border: `1px solid ${mood.glowColor}20`,
              backdropFilter: 'blur(24px)',
              boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${mood.glowColor}10`,
            }}
          >
            <button onClick={() => setExpanded(false)} className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden border" style={{ borderColor: mood.glowColor + '30' }}>
                <Image src="/assets/img/daena-nobg.png" alt="Daena" width={40} height={40} className="object-cover object-top" />
              </div>
              <div>
                <p className="text-sm font-bold text-white font-[family-name:var(--font-display)]">Daena</p>
                <p className="text-xs font-[family-name:var(--font-mono)]" style={{ color: mood.glowColor }}>MAS-AI Flagship Platform</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Governance-first AI agent orchestration. Every agent governed, every decision traced, every action auditable.
            </p>
            <a
              href="https://daena.mas-ai.co"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="cta"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-[1.02]"
              style={{ background: mood.glowColor, color: '#080b14' }}
            >
              Explore Daena <ExternalLink size={14} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
