'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

const navLinks = [
  { label: 'Platform', href: '#daena' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Enterprise', href: '#enterprise' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`flex items-center justify-between gap-2 transition-all duration-500 ${
          scrolled
            ? 'w-full max-w-6xl rounded-2xl bg-[var(--color-mas-bg)]/80 backdrop-blur-2xl [-webkit-backdrop-filter:blur(40px)] border border-[var(--color-mas-border)] shadow-[0_8px_40px_rgba(0,0,0,0.5)] px-6 py-3'
            : 'w-full max-w-7xl rounded-none bg-transparent px-6 py-5'
        }`}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/Mas-ai Logo.png"
            alt="MAS-AI Technologies"
            width={120}
            height={40}
            className={`transition-all duration-300 ${scrolled ? 'h-7 w-auto' : 'h-9 w-auto'}`}
            priority
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <MagneticLink key={link.label} href={link.href}>
              {link.label}
            </MagneticLink>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://daena.mas-ai.co"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex rounded-full bg-[var(--color-mas-cyan)] px-6 py-2 text-sm font-bold text-[var(--color-mas-bg)] transition-all duration-300 hover:shadow-[0_0_24px_var(--color-mas-cyan-glow)] hover:scale-105"
        >
          Explore Daena
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-[var(--color-mas-text)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-4 right-4 mt-2 rounded-2xl bg-[var(--color-mas-bg)]/95 backdrop-blur-2xl border border-[var(--color-mas-border)] shadow-[0_20px_60px_rgba(0,0,0,0.6)] md:hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[var(--color-mas-text-secondary)] hover:text-[var(--color-mas-text)] transition-colors py-3 text-base border-b border-[var(--color-mas-border)]/30 last:border-0"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://daena.mas-ai.co"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 rounded-full bg-[var(--color-mas-cyan)] px-5 py-3 text-center text-sm font-bold text-[var(--color-mas-bg)]"
              >
                Explore Daena
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function MagneticLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch('ontouchstart' in window)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouch || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = Math.max(-5, Math.min(5, (e.clientX - cx) * 0.12))
      const dy = Math.max(-3, Math.min(3, (e.clientY - cy) * 0.12))
      ref.current.style.transform = `translate(${dx}px, ${dy}px)`
    },
    [isTouch]
  )

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0, 0)'
    ref.current.style.transition =
      'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transition = 'transform 0.08s ease'
  }, [])

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="relative px-4 py-2 text-sm text-[var(--color-mas-text-secondary)] hover:text-[var(--color-mas-text)] transition-colors will-change-transform rounded-lg hover:bg-white/[0.03]"
    >
      {children}
    </a>
  )
}
