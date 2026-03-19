'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'

/**
 * DaenaGuide: 3D interactive avatar with section-reactive mood changes.
 *
 * 3D effect: CSS perspective + rotateX/Y following cursor position.
 * The portrait tilts toward the mouse (max 20deg), creating depth.
 *
 * Section reactivity: IntersectionObserver tracks which section is
 * currently in view. Each section has a different glow color and
 * speech bubble. Reactions fire EVERY time you scroll into a section
 * (not just once), so scrolling up re-triggers previous reactions.
 *
 * The glow ring around the avatar continuously reflects the current
 * section's mood color (cyan for tech, gold for enterprise, purple
 * for contact).
 */

interface SectionMood {
  glow: string
  caption: string
  brightness: number
}

const SECTION_MOODS: Record<string, SectionMood> = {
  hero:         { glow: '#00c8ff', caption: '',                    brightness: 1.0 },
  'what-we-do': { glow: '#7c3aed', caption: 'This is what we do.', brightness: 1.05 },
  daena:        { glow: '#00c8ff', caption: "That's me!",          brightness: 1.1 },
  portfolio:    { glow: '#d4a853', caption: 'We ship real products.', brightness: 1.05 },
  enterprise:   { glow: '#d4a853', caption: 'Enterprise ready.',   brightness: 0.95 },
  credibility:  { glow: '#00c8ff', caption: 'Real engineering.',   brightness: 0.9 },
  contact:      { glow: '#7c3aed', caption: "Let's talk!",         brightness: 1.0 },
  faq:          { glow: '#00c8ff', caption: '',                    brightness: 0.9 },
}

const DEFAULT_MOOD: SectionMood = { glow: '#00c8ff', caption: '', brightness: 1.0 }

export default function DaenaGuide() {
  const [activeSection, setActiveSection] = useState('hero')
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isReduced, setIsReduced] = useState(false)
  const [showBubble, setShowBubble] = useState(false)

  const portraitRef = useRef<HTMLDivElement>(null)
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevSection = useRef('hero')

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    setIsReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Section tracking with IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll('section[id], div[id="hero"]')

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        let best: IntersectionObserverEntry | null = null
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry
            }
          }
        }
        if (best) {
          const id = best.target.id
          if (id && id !== prevSection.current) {
            prevSection.current = id
            setActiveSection(id)

            // Show bubble for sections that have captions
            const mood = SECTION_MOODS[id]
            if (mood?.caption && !isMobile) {
              setShowBubble(true)
              if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
              bubbleTimer.current = setTimeout(() => setShowBubble(false), 2500)
            } else {
              setShowBubble(false)
            }
          }
        }
      },
      { threshold: [0.2, 0.5, 0.8] }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [isMobile])

  const mood = SECTION_MOODS[activeSection] || DEFAULT_MOOD
  const avatarSize = isMobile ? 'w-12 h-16' : 'w-20 h-28'

  return (
    <>
      <div
        className={`fixed z-50 flex flex-col items-center gap-2 ${
          isMobile ? 'bottom-4 right-3' : 'bottom-6 right-6'
        }`}
      >
        {/* Speech bubble ABOVE avatar */}
        <AnimatePresence mode="wait">
          {showBubble && mood.caption && !isMobile && (
            <motion.div
              key={mood.caption}
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
            >
              <div
                className="rounded-xl px-4 py-2 text-xs font-medium text-center leading-snug max-w-[140px]"
                style={{
                  background: 'rgba(8,11,20,0.92)',
                  border: `1px solid ${mood.glow}30`,
                  color: mood.glow,
                  boxShadow: `0 0 20px ${mood.glow}15`,
                }}
              >
                {mood.caption}
              </div>
              {/* Thought bubble dots */}
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full" style={{ background: mood.glow + '40' }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: mood.glow + '25' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Portrait */}
        {/* Solid portrait: no frame, no tilt, no wobble */}
        <div
          ref={portraitRef}
          onClick={() => setExpanded(!expanded)}
          className={`${avatarSize} cursor-pointer`}
          style={{
            filter: `brightness(${mood.brightness}) drop-shadow(0 0 12px ${mood.glow}30)`,
            transition: 'filter 0.6s ease',
          }}
        >
          <Image
            src="/assets/img/daena-nobg.png"
            alt="Daena, AI VP of MAS-AI Technologies"
            width={200}
            height={280}
            className="object-cover object-top w-full h-full"
            priority
          />
        </div>
      </div>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
            className={`fixed z-50 bg-[#0a0e1a]/95 border rounded-2xl shadow-2xl [-webkit-backdrop-filter:blur(20px)] backdrop-blur-xl ${
              isMobile
                ? 'bottom-24 right-3 w-64 p-4'
                : 'bottom-40 right-6 w-72 p-5'
            }`}
            style={{
              borderColor: `${mood.glow}20`,
              boxShadow: `0 0 40px ${mood.glow}10`,
            }}
          >
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-3 right-3 text-[var(--color-mas-text-muted)] hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border shrink-0" style={{ borderColor: `${mood.glow}30` }}>
                <Image src="/assets/img/daena-nobg.png" alt="Daena" width={40} height={40} className="object-cover object-top" />
              </div>
              <div>
                <p className="text-sm font-[family-name:var(--font-syne)] font-semibold text-white">Daena</p>
                <p className="text-xs font-[family-name:var(--font-jetbrains)]" style={{ color: mood.glow }}>
                  MAS-AI Flagship Platform
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--color-mas-text-secondary)] mb-4">
              Governance-first AI agent orchestration platform. Want to see what I can do?
            </p>

            <a
              href="https://daena.mas-ai.co"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center font-[family-name:var(--font-syne)] font-semibold text-sm py-2.5 rounded-lg transition-all hover:brightness-110"
              style={{
                backgroundColor: mood.glow,
                color: 'var(--color-mas-bg)',
              }}
            >
              Explore Daena
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
