'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ExternalLink } from 'lucide-react'
import { useSectionState } from '@/hooks/useSectionState'

/**
 * DaenaPresence: A "living" portrait that reacts to sections and follows the cursor.
 *
 * Techniques for bringing a 2D portrait to life:
 * 1. Perspective + rotateX/Y driven by mouse position = holographic card effect
 * 2. Subtle breathing scale animation = alive idle state
 * 3. Mood-based glow color and overlay intensity = expression changes
 * 4. Thought bubbles ABOVE the portrait = her inner monologue
 * 5. Eye-follow simulation: slight translateX/Y shift toward cursor
 *
 * When a Spline 3D model is ready, replace the Image block with SplineScene.
 * The mood state architecture stays identical.
 */

const MOOD_CONFIG: Record<string, {
  glowColor: string
  overlayColor: string
  overlayOpacity: number
  brightness: number
  caption: string
}> = {
  hero:        { glowColor: '#00c8ff', overlayColor: '#00c8ff', overlayOpacity: 0.05, brightness: 1.0,  caption: '' },
  'what-we-do':{ glowColor: '#7c3aed', overlayColor: '#7c3aed', overlayOpacity: 0.06, brightness: 1.05, caption: 'This is what we build.' },
  daena:       { glowColor: '#00c8ff', overlayColor: '#00c8ff', overlayOpacity: 0.08, brightness: 1.1,  caption: "That's me." },
  portfolio:   { glowColor: '#d4a853', overlayColor: '#d4a853', overlayOpacity: 0.06, brightness: 1.05, caption: 'We ship real products.' },
  enterprise:  { glowColor: '#d4a853', overlayColor: '#d4a853', overlayOpacity: 0.04, brightness: 0.95, caption: 'Enterprise governance.' },
  credibility: { glowColor: '#00c8ff', overlayColor: '#00c8ff', overlayOpacity: 0.03, brightness: 0.9,  caption: 'Real engineering.' },
  contact:     { glowColor: '#7c3aed', overlayColor: '#7c3aed', overlayOpacity: 0.07, brightness: 1.05, caption: "Let's build something." },
  faq:         { glowColor: '#00c8ff', overlayColor: '#00c8ff', overlayOpacity: 0.02, brightness: 0.85, caption: '' },
}

export default function DaenaPresence() {
  const { activeSection, scrollProgress } = useSectionState()
  const [expanded, setExpanded] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isReduced, setIsReduced] = useState(false)

  // Mouse tracking for 3D tilt
  const containerRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 })
  const targetTiltRef = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    setIsReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    const t = setTimeout(() => setVisible(true), 1200)
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t) }
  }, [])

  // Mouse-follow 3D tilt animation loop
  useEffect(() => {
    if (isMobile || isReduced) return

    const onMouse = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      // Normalize mouse position relative to portrait center (-1 to 1)
      const nx = (e.clientX - cx) / (window.innerWidth / 2)
      const ny = (e.clientY - cy) / (window.innerHeight / 2)

      // Target tilt (max 12 degrees rotation, 6px translation for eye-follow)
      targetTiltRef.current = {
        ry: nx * 12,
        rx: -ny * 8,
        tx: nx * 6,
        ty: ny * 4,
      }
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    // Smooth lerp animation
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const animate = () => {
      const c = tiltRef.current
      const t = targetTiltRef.current
      c.rx = lerp(c.rx, t.rx, 0.08)
      c.ry = lerp(c.ry, t.ry, 0.08)
      c.tx = lerp(c.tx, t.tx, 0.08)
      c.ty = lerp(c.ty, t.ty, 0.08)

      const el = containerRef.current?.querySelector('.daena-portrait') as HTMLElement | null
      if (el) {
        el.style.transform = `perspective(600px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) translateX(${c.tx}px) translateY(${c.ty}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile, isReduced])

  const mood = MOOD_CONFIG[activeSection] || MOOD_CONFIG.hero

  if (!visible) return null

  // Mobile: compact bottom-right avatar
  if (isMobile) {
    return (
      <>
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setExpanded(!expanded)}
          className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-2xl overflow-hidden border-2 transition-all duration-500"
          style={{
            borderColor: mood.glowColor + '50',
            boxShadow: `0 0 24px ${mood.glowColor}25`,
          }}
        >
          <Image src="/assets/img/daena-nobg.png" alt="Daena AI" width={56} height={56} className="object-cover" />
        </motion.button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.9 }}
              transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
              className="fixed bottom-22 right-5 z-50 w-64 rounded-2xl p-4"
              style={{ background: 'rgba(8,11,20,0.95)', border: `1px solid ${mood.glowColor}20`, backdropFilter: 'blur(20px)' }}
            >
              <button onClick={() => setExpanded(false)} className="absolute top-3 right-3 text-gray-500 hover:text-white"><X size={14} /></button>
              <p className="text-sm text-gray-300 mb-3">Governance-first AI agent orchestration by MAS-AI.</p>
              <a href="https://daena.mas-ai.co" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color: mood.glowColor }}>
                Explore Daena <ExternalLink size={14} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Desktop: Full 3D portrait with mouse-follow
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 1.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
      className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3"
    >
      {/* Thought bubble ABOVE portrait */}
      <AnimatePresence mode="wait">
        {mood.caption && (
          <motion.div
            key={mood.caption}
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
            className="relative mb-1"
          >
            {/* Thought cloud */}
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
            {/* Thought bubble connector dots */}
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ background: mood.glowColor + '40' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: mood.glowColor + '25' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portrait container with 3D transforms */}
      <div
        className="relative cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Ambient glow behind portrait */}
        <div
          className="absolute -inset-4 rounded-3xl transition-all duration-700 blur-2xl"
          style={{
            background: `radial-gradient(circle, ${mood.glowColor}20, transparent 70%)`,
          }}
        />

        {/* The portrait with 3D tilt */}
        <div
          className="daena-portrait relative w-24 h-28 rounded-2xl overflow-hidden transition-[filter] duration-500"
          style={{
            filter: `brightness(${mood.brightness})`,
            boxShadow: `0 0 30px ${mood.glowColor}20, 0 8px 32px rgba(0,0,0,0.5)`,
            border: `1px solid ${mood.glowColor}30`,
            willChange: 'transform',
          }}
        >
          {/* Expression overlay (color tint that shifts per mood) */}
          <div
            className="absolute inset-0 z-20 pointer-events-none transition-all duration-700 mix-blend-overlay"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, ${mood.overlayColor}${Math.round(mood.overlayOpacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`,
            }}
          />

          {/* Breathing animation wrapper */}
          <motion.div
            animate={isReduced ? {} : {
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1] as [number, number, number, number],
            }}
            className="w-full h-full"
          >
            <Image
              src="/assets/img/daena-nobg.png"
              alt="Daena, AI VP of MAS-AI Technologies"
              width={200}
              height={240}
              className="object-cover object-top w-full h-full"
              priority
            />
          </motion.div>
        </div>
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

      {/* Expanded info panel */}
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
    </motion.div>
  )
}
