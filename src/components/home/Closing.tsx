'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CLOSING } from '@/content/home'
import { CTA } from '@/content/site'

/** Signals from the story, routed into one engineered system: the MAS-AI mark. viewBox 1000 x 360. */
const SIGNALS = [
  { label: 'Leads', d: 'M 0 60 H 250 V 150 H 452', end: 'M 400 150 H 452' },
  { label: 'Inbox', d: 'M 0 180 H 452', end: 'M 400 180 H 452' },
  { label: 'Documents', d: 'M 0 300 H 250 V 210 H 452', end: 'M 400 210 H 452' },
  { label: 'Calendar', d: 'M 1000 60 H 750 V 150 H 548', end: 'M 600 150 H 548', right: true },
  { label: 'Spreadsheet', d: 'M 1000 180 H 548', end: 'M 600 180 H 548', right: true },
  { label: 'Invoices', d: 'M 1000 300 H 750 V 210 H 548', end: 'M 600 210 H 548', right: true },
]

/**
 * Act 7. Every signal from the story routes into one system, then the invitation. Scroll draws the
 * lines (a CSS custom property --p from 0 to 1); reduced motion and no-JS show them drawn.
 */
export function Closing() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    const svg = el?.querySelector<SVGSVGElement>('.closing__svg')
    if (!el || !svg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = svg.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75)))
      svg.style.setProperty('--p', p.toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) window.addEventListener('scroll', onScroll, { passive: true })
      else window.removeEventListener('scroll', onScroll)
      update()
    })
    io.observe(el)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const ask = () => {
    ;(window as Window & { __guideWantsOpen?: boolean }).__guideWantsOpen = true
    window.dispatchEvent(new Event('guide:open'))
  }

  return (
    <section ref={ref} id="start" className="section closing" aria-labelledby="closing-title">
      <div className="wrap closing__inner">
        <svg className="closing__svg" viewBox="0 0 1000 360" aria-hidden="true">
          {SIGNALS.map((s) => (
            <g key={s.label}>
              <path className="closing__path" d={s.d} pathLength={1} />
              <path className="closing__end" d={s.end} pathLength={1} />
              <text className="closing__label" x={s.right ? 992 : 8} y={(Number(s.d.split(' ')[2]) || 0) - 10} textAnchor={s.right ? 'end' : 'start'}>
                {s.label}
              </text>
            </g>
          ))}
          <rect className="closing__core" x="452" y="120" width="96" height="120" rx="14" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <image className="closing__mark" href="/brand/mark-128.png" x="468" y="148" width="64" height="64" />
        </svg>
        <div className="closing__copy">
          <h2 id="closing-title" className="t-display closing__title">
            {CLOSING.title}
          </h2>
          <p className="t-lead">{CLOSING.body}</p>
          <div className="closing__actions">
            <Link href={CTA.href} className="btn btn-primary">
              {CTA.label}
              <ArrowRight aria-hidden="true" />
            </Link>
            <button type="button" className="btn btn-ghost" onClick={ask}>
              {CLOSING.ask}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
