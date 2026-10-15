'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CAPABILITIES } from '@/content/home'
import { SystemScene } from './SystemScene'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * One method, different answers, read by scrolling: the capabilities are a list of steps beside one living system
 * that stays in view (sticky) and changes shape to the step at the reading line. Ordinary scrolling, no pin and no
 * snap, so the page never holds the visitor. Every step is in the HTML, readable without JS and by search engines.
 * The progress ticks jump to a step.
 */
export function Capabilities({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const items = CAPABILITIES.items
  const [active, setActive] = useState(0)
  const base = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const H = headingLevel === 2 ? 'h2' : 'h3'
  const Hs = headingLevel === 2 ? 'h3' : 'h4'

  // The reading line: 45% down on wide screens. On phones and tablets the system is stuck above the list, so the line
  // is a third of the way into the space below the panel AS STUCK (header plus panel height), not where the panel is
  // now: one fixed line for scrolling and for jumps, whether or not the panel has reached the header yet.
  const readingLine = () => {
    const panel = panelRef.current
    if (!panel || !window.matchMedia('(max-width: 959.98px)').matches) return window.innerHeight * 0.45
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64
    const bottom = headerH + panel.offsetHeight
    return bottom + (window.innerHeight - bottom) / 3
  }

  useEffect(() => {
    const panel = panelRef.current
    const list = listRef.current
    if (!panel || !list) return
    const steps = Array.from(list.children) as HTMLElement[]
    const root = document.documentElement
    let raf = 0
    const pick = () => {
      raf = 0
      const line = readingLine()
      let i = 0
      steps.forEach((s, k) => {
        if (s.getBoundingClientRect().top <= line) i = k
      })
      setActive(i)
      // Stuck under the header on phones: the panel covers the see-through band around the floating header, so steps
      // scrolled under it do not show again above it. Only while stuck: unstuck, that band holds the section intro.
      const headerH = parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 64
      panel.toggleAttribute('data-stuck', getComputedStyle(panel).position === 'sticky' && panel.getBoundingClientRect().top <= headerH + 1)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(pick)
    }
    // Listen only while the section is near the viewport.
    const io = new IntersectionObserver((entries) => {
      if (entries[entries.length - 1].isIntersecting) {
        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', schedule)
        schedule()
      } else {
        window.removeEventListener('scroll', schedule)
        window.removeEventListener('resize', schedule)
      }
    }, { rootMargin: '25% 0px 25% 0px' })
    io.observe(list.parentElement ?? list)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  // Bring a step to the reading line (smooth unless reduced motion, via the html scroll-behavior rule) and move focus
  // to it, so the next Tab continues from that step instead of jumping back to the first one.
  const jump = (i: number) => {
    const step = listRef.current?.children[i] as HTMLElement | undefined
    if (!step) return
    window.scrollTo({ top: window.scrollY + step.getBoundingClientRect().top - readingLine() + 2 })
    step.focus({ preventScroll: true })
  }

  return (
    <section id="services" className="section caps" aria-labelledby={`${base}-title`}>
      <div className="wrap">
        <div className="caps__head">
          <H id={`${base}-title`} className="t-h2">
            {CAPABILITIES.title}
          </H>
          <p className="t-lead">{CAPABILITIES.intro}</p>
        </div>
        <div className="caps__grid">
          <div ref={panelRef} className="caps__panel">
            <SystemScene variant={items[active].id} className="caps__scene" />
            <div className="caps__progress">
              <p className="caps__count t-mono" aria-hidden="true">
                <span className="caps__index">{pad(active + 1)}</span> / {pad(items.length)}
                <span className="caps__current">
                  {items.map((item, i) => (
                    <span key={item.id} data-on={i === active ? 'true' : undefined}>
                      {item.name}
                    </span>
                  ))}
                </span>
              </p>
              <div className="caps__ticks" role="group" aria-label="Jump to a capability">
                {items.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    className="caps__tick"
                    aria-label={item.name}
                    aria-current={i === active ? 'step' : undefined}
                    data-state={i < active ? 'done' : i === active ? 'current' : 'todo'}
                    onClick={() => jump(i)}
                  />
                ))}
              </div>
            </div>
          </div>
          <ol ref={listRef} className="caps__steps" aria-label="Capabilities">
            {items.map((item, i) => (
              <li key={item.id} id={`${base}-${item.id}`} className="caps__step" tabIndex={-1} data-active={i === active ? 'true' : undefined}>
                <span className="caps__num t-mono" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <div className="caps__body">
                  <Hs className="caps__name">{item.name}</Hs>
                  <p className="caps__line">{item.line}</p>
                  <p className="caps__stack t-mono">{item.stack}</p>
                  <Link href={item.href} className="link-arrow">
                    {item.linkLabel}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
