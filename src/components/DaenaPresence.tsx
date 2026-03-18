'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ExternalLink } from 'lucide-react'
import { useSectionState, type SectionMood } from '@/hooks/useSectionState'

/**
 * DaenaPresence: Section-reactive AI character presence.
 *
 * Positioned as a floating panel on the right side of the viewport (desktop)
 * or bottom strip (mobile). Reacts to active section with:
 * - Glow color shift matching section mood
 * - Tilt/scale transforms based on mood
 * - Caption text that fades in/out at section boundaries
 * - Click to expand for more info
 *
 * Architecture note: When a Spline 3D model of Daena is available,
 * replace the <Image> block with <SplineScene> and map mood states
 * to Spline animation triggers via the Spline runtime API.
 */

const MOOD_TRANSFORMS: Record<SectionMood['mood'], {
  scale: number
  rotateY: number
  rotateX: number
  brightness: number
}> = {
  welcoming:  { scale: 1.0,  rotateY: 0,   rotateX: 0,  brightness: 1.0 },
  proud:      { scale: 1.05, rotateY: -3,  rotateX: 0,  brightness: 1.1 },
  warm:       { scale: 1.02, rotateY: 5,   rotateX: 2,  brightness: 1.05 },
  serious:    { scale: 0.98, rotateY: 0,   rotateX: -2, brightness: 0.9 },
  sharp:      { scale: 1.0,  rotateY: -5,  rotateX: 0,  brightness: 1.15 },
  inviting:   { scale: 1.03, rotateY: 3,   rotateX: 3,  brightness: 1.1 },
  resting:    { scale: 0.97, rotateY: 0,   rotateX: 0,  brightness: 0.85 },
}

export default function DaenaPresence() {
  const { currentMood, scrollDirection, scrollProgress } = useSectionState()
  const [expanded, setExpanded] = useState(false)
  const [visible, setVisible] = useState(false)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setPrefersReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setIsMobile(window.innerWidth < 768)

    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)

    // Show after initial load delay
    const timer = setTimeout(() => setVisible(true), 1500)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(timer)
    }
  }, [])

  const transforms = MOOD_TRANSFORMS[currentMood.mood]

  if (!visible) return null

  // Mobile: compact bottom-right avatar
  if (isMobile) {
    return (
      <>
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setExpanded(!expanded)}
          className="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full overflow-hidden border-2 transition-colors duration-500"
          style={{
            borderColor: currentMood.glowColor + '60',
            boxShadow: `0 0 20px ${currentMood.glowColor}30`,
          }}
        >
          <Image
            src="/assets/img/daena-nobg.png"
            alt="Daena AI"
            width={48}
            height={48}
            className="object-cover"
          />
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
              className="fixed bottom-20 right-5 z-50 w-64 rounded-2xl p-4"
              style={{
                background: 'rgba(8, 11, 20, 0.95)',
                border: `1px solid ${currentMood.glowColor}20`,
                backdropFilter: 'blur(20px)',
              }}
            >
              <button onClick={() => setExpanded(false)} className="absolute top-3 right-3 text-gray-500 hover:text-white">
                <X size={16} />
              </button>
              <p className="text-sm text-gray-300 mb-3">
                I am Daena, the governance-first AI agent orchestration platform by MAS-AI.
              </p>
              <a
                href="https://daena.mas-ai.co"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-[var(--color-mas-cyan)] hover:underline"
              >
                Explore Daena <ExternalLink size={14} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Desktop: side panel presence
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-4"
      style={{ perspective: '800px' }}
    >
      {/* Character container */}
      <motion.div
        animate={prefersReduced ? {} : {
          scale: transforms.scale,
          rotateY: transforms.rotateY,
          rotateX: transforms.rotateX,
        }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        className="relative w-20 h-20 rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        style={{
          boxShadow: `0 0 30px ${currentMood.glowColor}25, 0 0 60px ${currentMood.glowColor}10`,
          border: `1px solid ${currentMood.glowColor}30`,
          filter: `brightness(${transforms.brightness})`,
          transition: 'box-shadow 0.6s ease, border-color 0.6s ease, filter 0.6s ease',
        }}
      >
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 opacity-30 transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${currentMood.glowColor}40, transparent 70%)`,
          }}
        />
        <Image
          src="/assets/img/daena-nobg.png"
          alt="Daena, AI VP of MAS-AI Technologies"
          width={80}
          height={80}
          className="relative z-10 object-cover w-full h-full"
        />
      </motion.div>

      {/* Caption */}
      <AnimatePresence mode="wait">
        {currentMood.caption && (
          <motion.p
            key={currentMood.caption}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
            className="max-w-[120px] text-center text-xs leading-snug"
            style={{ color: currentMood.glowColor }}
          >
            {currentMood.caption}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Scroll depth indicator */}
      <div className="w-px h-16 bg-gray-800 relative rounded-full overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-full"
          style={{ background: currentMood.glowColor }}
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
              background: 'rgba(8, 11, 20, 0.95)',
              border: `1px solid ${currentMood.glowColor}20`,
              backdropFilter: 'blur(20px)',
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${currentMood.glowColor}10`,
            }}
          >
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl overflow-hidden border"
                style={{ borderColor: currentMood.glowColor + '30' }}
              >
                <Image src="/assets/img/daena-nobg.png" alt="Daena" width={40} height={40} className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-white font-[family-name:var(--font-display)]">Daena</p>
                <p className="text-xs font-[family-name:var(--font-mono)]" style={{ color: currentMood.glowColor }}>
                  MAS-AI Flagship Platform
                </p>
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
              style={{
                background: currentMood.glowColor,
                color: '#080b14',
              }}
            >
              Explore Daena <ExternalLink size={14} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
