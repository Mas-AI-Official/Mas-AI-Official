'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Section Mood Configuration ──────────────────────────────────────────────
export interface SectionMood {
  id: string
  mood: 'welcoming' | 'proud' | 'warm' | 'serious' | 'sharp' | 'inviting' | 'resting'
  expression: string
  gesture: string
  caption: string
  glowColor: string
  hexDepth: number // 0 = outermost layer, 1 = core
}

export const SECTION_MOODS: SectionMood[] = [
  {
    id: 'hero',
    mood: 'welcoming',
    expression: 'calm confidence, direct presence',
    gesture: 'greeting',
    caption: '',
    glowColor: '#00c8ff',
    hexDepth: 0,
  },
  {
    id: 'what-we-do',
    mood: 'proud',
    expression: 'energized, open',
    gesture: 'showcase',
    caption: 'This is what we build.',
    glowColor: '#7c3aed',
    hexDepth: 0.15,
  },
  {
    id: 'daena',
    mood: 'warm',
    expression: 'self-referential, genuine smile',
    gesture: 'self-point',
    caption: "That's me.",
    glowColor: '#00c8ff',
    hexDepth: 0.3,
  },
  {
    id: 'portfolio',
    mood: 'proud',
    expression: 'presentational, confident',
    gesture: 'open-palm',
    caption: 'We ship real products.',
    glowColor: '#d4a853',
    hexDepth: 0.45,
  },
  {
    id: 'enterprise',
    mood: 'serious',
    expression: 'composed, authoritative',
    gesture: 'executive-pose',
    caption: 'Enterprise-grade governance.',
    glowColor: '#d4a853',
    hexDepth: 0.6,
  },
  {
    id: 'credibility',
    mood: 'serious',
    expression: 'stable, trustworthy',
    gesture: 'standing',
    caption: 'Built on real engineering.',
    glowColor: '#00c8ff',
    hexDepth: 0.75,
  },
  {
    id: 'contact',
    mood: 'inviting',
    expression: 'encouraging, forward',
    gesture: 'beckoning',
    caption: "Let's build something.",
    glowColor: '#7c3aed',
    hexDepth: 0.88,
  },
  {
    id: 'faq',
    mood: 'resting',
    expression: 'relaxed, elegant',
    gesture: 'idle',
    caption: '',
    glowColor: '#00c8ff',
    hexDepth: 1.0,
  },
]

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useSectionState() {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down')
  const [scrollProgress, setScrollProgress] = useState(0)
  const lastScrollY = useRef(0)

  // Scroll direction + global progress
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrollDirection(y > lastScrollY.current ? 'down' : 'up')
      lastScrollY.current = y

      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docH > 0 ? Math.min(1, y / docH) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // IntersectionObserver for section detection
  useEffect(() => {
    const sectionIds = SECTION_MOODS.map((s) => s.id)
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setActiveSection(id)
            }
          })
        },
        { threshold: [0.3, 0.5, 0.7] }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const currentMood = SECTION_MOODS.find((s) => s.id === activeSection) || SECTION_MOODS[0]
  const sectionIndex = SECTION_MOODS.findIndex((s) => s.id === activeSection)

  return {
    activeSection,
    scrollDirection,
    scrollProgress,
    currentMood,
    sectionIndex,
    totalSections: SECTION_MOODS.length,
  }
}
