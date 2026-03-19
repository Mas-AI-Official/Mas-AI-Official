'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'

const SECTION_REACTIONS: Record<string, string> = {
  daena: "That's me!",
  portfolio: 'We build a lot!',
  contact: "Let's talk!",
}

export default function DaenaGuide() {
  const [bubble, setBubble] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isReduced, setIsReduced] = useState(false)
  const bubbleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shownSections = useRef<Set<string>>(new Set())

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    setIsReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Observe sections for reactions
  useEffect(() => {
    if (isMobile) return

    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id
            const reaction = SECTION_REACTIONS[id]
            if (reaction && !shownSections.current.has(id)) {
              shownSections.current.add(id)
              setBubble(reaction)
              if (bubbleTimeout.current) clearTimeout(bubbleTimeout.current)
              bubbleTimeout.current = setTimeout(() => setBubble(null), 2500)
            }
          }
        }
      },
      { threshold: 0.3 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [isMobile])

  const avatarSize = isMobile ? 'w-10 h-10' : 'w-14 h-14'

  return (
    <>
      <div className={`fixed z-50 flex flex-col items-end gap-2 ${isMobile ? 'bottom-4 right-3' : 'bottom-6 right-6'}`}>
        {/* Speech bubble */}
        <AnimatePresence>
          {bubble && !isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.85 }}
              transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
              className="rounded-xl bg-[#0f1629]/95 border border-[var(--color-mas-cyan)]/20 px-4 py-2 text-sm text-[var(--color-mas-text)] shadow-lg shadow-cyan-500/10"
            >
              {bubble}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar */}
        <motion.button
          onClick={() => setExpanded(!expanded)}
          className={`relative ${avatarSize} rounded-full overflow-hidden border-2 border-[var(--color-mas-cyan)]/30 shadow-lg shadow-cyan-500/15 hover:border-[var(--color-mas-cyan)]/60 transition-colors`}
          whileHover={isReduced ? {} : { scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Meet Daena"
        >
          {!isReduced && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: '0 0 20px rgba(0,200,255,0.2)' }}
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
            />
          )}
          <Image
            src="/assets/img/daena-nobg.png"
            alt="Daena AI"
            width={56}
            height={56}
            className="object-cover object-top relative z-10 w-full h-full"
          />
        </motion.button>
      </div>

      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] as [number, number, number, number] }}
            className={`fixed z-50 bg-[#0a0e1a]/95 border border-[var(--color-mas-cyan)]/15 rounded-2xl shadow-2xl shadow-cyan-500/10 [-webkit-backdrop-filter:blur(20px)] backdrop-blur-xl ${
              isMobile ? 'bottom-16 right-3 w-64 p-4' : 'bottom-24 right-6 w-72 p-5'
            }`}
          >
            <button onClick={() => setExpanded(false)} className="absolute top-3 right-3 text-[var(--color-mas-text-muted)] hover:text-white" aria-label="Close">
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--color-mas-cyan)]/20 shrink-0">
                <Image src="/assets/img/daena-nobg.png" alt="Daena" width={40} height={40} className="object-cover object-top" />
              </div>
              <div>
                <p className="text-sm font-[family-name:var(--font-syne)] font-semibold text-white">Daena</p>
                <p className="text-xs text-[var(--color-mas-text-muted)] font-[family-name:var(--font-jetbrains)]">MAS-AI Flagship Platform</p>
              </div>
            </div>

            <p className="text-sm text-[var(--color-mas-text-secondary)] mb-4">
              Governance-first AI agent orchestration platform. Want to see what I can do?
            </p>

            <a
              href="https://daena.mas-ai.co"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-[var(--color-mas-cyan)] text-[var(--color-mas-bg)] font-[family-name:var(--font-syne)] font-semibold text-sm py-2.5 rounded-lg hover:brightness-110 transition-all"
            >
              Explore Daena
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
