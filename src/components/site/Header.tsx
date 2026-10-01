'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { HomeLink } from './HomeLink'
import { CTA, DEPTH, FAMILIES, NAV, PRACTICES } from '@/content/site'

/**
 * Header: one line at desktop, 64 px. Services is a disclosure menu (not a mega-menu).
 * Phones get a full-screen sheet rendered as a sibling of the bar, so no ancestor
 * becomes its containing block (taste 5.G backdrop-filter trap). No scroll listener:
 * an IntersectionObserver sentinel sets data-scrolled.
 */
export function Header() {
  const pathname = usePathname()
  const [servicesOpen, setServicesOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuId = useId()
  const sheetId = useId()
  const servicesBtn = useRef<HTMLButtonElement>(null)
  const sheetBtn = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close everything on route change.
  useEffect(() => {
    setServicesOpen(false)
    setSheetOpen(false)
  }, [pathname])

  // Scrolled state from a sentinel at the top of the document.
  useEffect(() => {
    const sentinel = document.getElementById('top-sentinel')
    if (!sentinel) return
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting))
    io.observe(sentinel)
    return () => io.disconnect()
  }, [])

  // Escape and outside click close the services menu.
  useEffect(() => {
    if (!servicesOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesOpen(false)
        servicesBtn.current?.focus()
      }
    }
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !servicesBtn.current?.contains(e.target as Node)) setServicesOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [servicesOpen])

  // Sheet: lock page scroll, Escape closes, focus returns to the toggle.
  const closeSheet = useCallback(() => {
    setSheetOpen(false)
    sheetBtn.current?.focus()
  }, [])
  useEffect(() => {
    if (!sheetOpen) return
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeSheet()
    document.addEventListener('keydown', onKey)
    document.getElementById(sheetId)?.querySelector<HTMLElement>('a, button')?.focus()
    return () => {
      root.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [sheetOpen, closeSheet, sheetId])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <>
      <div id="top-sentinel" aria-hidden="true" className="site-sentinel" />
      <header className="site-header" data-scrolled={scrolled || servicesOpen ? 'true' : 'false'}>
        <div className="wrap site-header__row">
          <HomeLink
            className="wordmark"
            label="MAS-AI Technologies, home"
            onHome={() => {
              setServicesOpen(false)
              setSheetOpen(false)
            }}
          >
            <Image src="/brand/mark-64.png" alt="" width={32} height={32} priority />
            <span>MAS-AI</span>
          </HomeLink>

          <nav aria-label="Primary" className="site-nav">
            <ul>
              {NAV.map((item) =>
                'menu' in item && item.menu ? (
                  <li key={item.href}>
                    <Link href={item.href} className="site-nav__link site-nav__nojs">
                      {item.label}
                    </Link>
                    <button
                      ref={servicesBtn}
                      type="button"
                      className="site-nav__link site-nav__menu-btn"
                      aria-expanded={servicesOpen}
                      aria-controls={menuId}
                      data-active={isActive(item.href) || FAMILIES.concat(PRACTICES, DEPTH).some((s) => isActive(s.href))}
                      onClick={() => setServicesOpen((v) => !v)}
                    >
                      {item.label}
                      <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" /></svg>
                    </button>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="site-nav__link"
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      data-active={isActive(item.href)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="site-header__actions">
            <Link href={CTA.href} className="btn btn-primary site-header__cta">
              {CTA.label}
            </Link>
            <button
              ref={sheetBtn}
              type="button"
              className="site-header__toggle"
              aria-expanded={sheetOpen}
              aria-controls={sheetId}
              aria-label={sheetOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setSheetOpen((v) => !v)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>

        <div id={menuId} ref={menuRef} className="services-menu" hidden={!servicesOpen}>
          <div className="wrap services-menu__grid">
            <div>
              <p className="t-label">What we build</p>
              <ul>
                {FAMILIES.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="services-menu__item">
                      <span className="services-menu__name">{s.name}</span>
                      <span className="services-menu__line">{s.line}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="t-label">How we build</p>
              <ul>
                {[...PRACTICES, ...DEPTH].map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="services-menu__item">
                      <span className="services-menu__name">{s.name}</span>
                      <span className="services-menu__line">{s.line}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/services/" className="link-arrow services-menu__all">
                All services
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div id={sheetId} className="site-sheet" hidden={!sheetOpen} role="dialog" aria-modal="true" aria-label="Menu">
        <nav aria-label="Mobile" className="site-sheet__nav">
          <p className="t-label">What we build</p>
          <ul>
            {FAMILIES.map((s) => (
              <li key={s.href}><Link href={s.href} onClick={closeSheet}>{s.name}</Link></li>
            ))}
          </ul>
          <p className="t-label">How we build</p>
          <ul>
            {[...PRACTICES, ...DEPTH].map((s) => (
              <li key={s.href}><Link href={s.href} onClick={closeSheet}>{s.name}</Link></li>
            ))}
          </ul>
          <ul className="site-sheet__main">
            {NAV.filter((n) => !('menu' in n && n.menu)).map((n) => (
              <li key={n.href}><Link href={n.href} onClick={closeSheet}>{n.label}</Link></li>
            ))}
            <li><Link href="/services/" onClick={closeSheet}>All services</Link></li>
          </ul>
        </nav>
        <div className="site-sheet__foot">
          <Link href={CTA.href} className="btn btn-primary" onClick={closeSheet}>{CTA.label}</Link>
          <button type="button" className="btn btn-ghost" onClick={closeSheet}>Close</button>
        </div>
      </div>
    </>
  )
}
