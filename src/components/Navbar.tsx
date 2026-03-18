'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

const navLinks = [
  { label: 'Platform', href: '#solution' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Use Cases', href: '#pipeline' },
  { label: 'Investors', href: '/investors.html' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-mas-bg)]/80 backdrop-blur-xl border-b border-[var(--color-mas-border)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/Mas-ai Logo.png"
            alt="MAS-AI Technologies"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <MagneticLink key={link.label} href={link.href}>
              {link.label}
            </MagneticLink>
          ))}
          <a
            href="https://daena.mas-ai.co"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[var(--color-mas-cyan)] px-5 py-2 text-sm font-semibold text-[var(--color-mas-bg)] transition-all hover:shadow-[0_0_20px_var(--color-mas-cyan-glow)] hover:scale-105"
          >
            Explore Daena
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-[var(--color-mas-text)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--color-mas-bg)]/95 backdrop-blur-xl border-b border-[var(--color-mas-border)]"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[var(--color-mas-text-secondary)] hover:text-[var(--color-mas-text)] transition-colors py-2 text-lg"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://daena.mas-ai.co"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[var(--color-mas-cyan)] px-5 py-3 text-center text-sm font-semibold text-[var(--color-mas-bg)]"
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

function MagneticLink({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = Math.max(-5, Math.min(5, (e.clientX - cx) * 0.1))
    const dy = Math.max(-3, Math.min(3, (e.clientY - cy) * 0.1))
    ref.current.style.transform = `translate(${dx}px, ${dy}px)`
    ref.current.style.textShadow = '0 0 8px rgba(0,200,255,0.25)'
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0, 0)'
    ref.current.style.textShadow = 'none'
    ref.current.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), text-shadow 0.3s ease'
  }

  const handleMouseEnter = () => {
    if (!ref.current) return
    ref.current.style.transition = 'transform 0.08s ease, text-shadow 0.15s ease'
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="text-sm text-[var(--color-mas-text-secondary)] hover:text-[var(--color-mas-text)] transition-colors will-change-transform"
    >
      {children}
    </a>
  )
}
