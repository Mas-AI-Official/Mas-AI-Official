'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

type Bubble = { text: string; id: number } | null

export default function DaenaGuide() {
  const [bubble, setBubble] = useState<Bubble>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [isWaving, setIsWaving] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bubbleIdRef = useRef(0)

  // Detect reduced motion and mobile on mount
  useEffect(() => {
    setReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
    setIsMobile(window.innerWidth < 768)

    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Show a speech bubble for a duration, then clear it
  const showBubble = useCallback(
    (text: string, duration = 2500) => {
      if (isMobile || panelOpen) return
      // Clear any existing bubble timer
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current)

      bubbleIdRef.current += 1
      setBubble({ text, id: bubbleIdRef.current })
      bubbleTimerRef.current = setTimeout(() => {
        setBubble(null)
      }, duration)
    },
    [isMobile, panelOpen],
  )

  // IntersectionObserver for section reactions
  useEffect(() => {
    if (reducedMotion) return

    const sections: { id: string; text: string }[] = [
      { id: 'daena', text: "That's me!" },
      { id: 'contact', text: "Let's talk!" },
    ]

    const observers: IntersectionObserver[] = []
    const firedSet = new Set<string>()

    sections.forEach(({ id, text }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !firedSet.has(id)) {
              firedSet.add(id)
              showBubble(text, 2500)
            }
          })
        },
        { threshold: 0.3 },
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [reducedMotion, showBubble])

  // Idle wave detection
  useEffect(() => {
    if (reducedMotion || isMobile) return

    const resetIdle = () => {
      setIsWaving(false)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        if (!panelOpen) setIsWaving(true)
      }, 10000)
    }

    resetIdle()
    window.addEventListener('scroll', resetIdle, { passive: true })
    window.addEventListener('mousemove', resetIdle, { passive: true })

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      window.removeEventListener('scroll', resetIdle)
      window.removeEventListener('mousemove', resetIdle)
    }
  }, [reducedMotion, isMobile, panelOpen])

  // Clean up bubble timer on unmount
  useEffect(() => {
    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current)
    }
  }, [])

  const avatarSize = isMobile ? 36 : 48

  const breathingAnimation = reducedMotion
    ? {}
    : {
        animate: {
          scale: [1, 1.03, 1],
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: [0, 0, 0.2, 1] as [number, number, number, number],
        },
      }

  const wavingAnimation =
    isWaving && !reducedMotion
      ? {
          animate: {
            rotate: [-5, 5, -5],
          },
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: [0, 0, 0.2, 1] as [number, number, number, number],
          },
        }
      : {}

  return (
    <div
      className="fixed z-50"
      style={{ bottom: 24, right: 24 }}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {bubble && !panelOpen && (
          <motion.div
            key={bubble.id}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{
              duration: 0.3,
              ease: [0, 0, 0.2, 1] as [number, number, number, number],
            }}
            className="absolute rounded-lg bg-[var(--color-mas-bg-card)] px-3 py-2 text-xs font-medium text-[var(--color-mas-text)] shadow-lg"
            style={{
              bottom: avatarSize + 12,
              right: 0,
              border: '1px solid var(--color-mas-border)',
              whiteSpace: 'nowrap',
            }}
          >
            {bubble.text}
            {/* Tail */}
            <div
              className="absolute"
              style={{
                bottom: -5,
                right: 16,
                width: 10,
                height: 10,
                backgroundColor: 'var(--color-mas-bg-card)',
                borderRight: '1px solid var(--color-mas-border)',
                borderBottom: '1px solid var(--color-mas-border)',
                transform: 'rotate(45deg)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.3,
              ease: [0, 0, 0.2, 1] as [number, number, number, number],
            }}
            className="absolute rounded-xl bg-[var(--color-mas-bg-card)] p-4 shadow-xl"
            style={{
              bottom: avatarSize + 12,
              right: 0,
              width: 260,
              border: '1px solid var(--color-mas-border)',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setPanelOpen(false)}
              className="absolute right-2 top-2 rounded-md p-1 text-[var(--color-mas-text-muted)] transition-colors hover:text-[var(--color-mas-text)]"
              aria-label="Close Daena panel"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="mb-3 pr-6 text-sm leading-relaxed text-[var(--color-mas-text-secondary)]">
              Hi! I&apos;m Daena, the AI platform behind MAS-AI.
            </p>
            <a
              href="https://daena.mas-ai.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-mas-cyan)] px-4 py-1.5 text-xs font-semibold text-[var(--color-mas-bg)] transition-shadow hover:shadow-[0_0_16px_var(--color-mas-cyan-glow)]"
            >
              Visit Daena
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar button */}
      <motion.button
        onClick={() => {
          setPanelOpen((prev) => !prev)
          setBubble(null)
        }}
        aria-label="Talk to Daena"
        className="relative block rounded-full"
        style={{
          width: avatarSize,
          height: avatarSize,
          boxShadow: reducedMotion
            ? 'none'
            : '0 0 12px var(--color-mas-cyan-glow), 0 0 24px var(--color-mas-cyan-glow)',
        }}
        {...breathingAnimation}
        {...wavingAnimation}
      >
        <Image
          src="/assets/img/daena-avatar.png"
          alt="Daena AI assistant"
          width={avatarSize}
          height={avatarSize}
          className="rounded-full"
          style={{ objectFit: 'cover' }}
        />
      </motion.button>
    </div>
  )
}
