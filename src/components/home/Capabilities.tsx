'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CAPABILITIES, type CapabilityVariant } from '@/content/home'
import { SystemScene } from './SystemScene'

/**
 * One method, different answers: a vertical tablist of capabilities beside one living system that changes
 * shape to match the selected tab. Hover previews on fine pointers; arrows, Home and End move between tabs.
 */
export function Capabilities({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const [active, setActive] = useState<CapabilityVariant>(CAPABILITIES.items[0].id)
  const base = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const hoverTimer = useRef<number>(0)
  const items = CAPABILITIES.items
  const current = items.find((i) => i.id === active) ?? items[0]
  const H = headingLevel === 2 ? 'h2' : 'h3'

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    const j = (next + items.length) % items.length
    setActive(items[j].id)
    tabs.current[j]?.focus()
  }
  const preview = (id: CapabilityVariant) => {
    window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => setActive(id), 110)
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
          <div className="caps__list" role="tablist" aria-orientation="vertical" aria-label="Capabilities">
            {items.map((item, i) => (
              <button
                key={item.id}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                id={`${base}-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={active === item.id}
                aria-controls={`${base}-panel`}
                tabIndex={active === item.id ? 0 : -1}
                className="caps__tab"
                onClick={() => setActive(item.id)}
                onKeyDown={(e) => onKey(e, i)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && preview(item.id)}
                onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
              >
                <span className="caps__name">{item.name}</span>
              </button>
            ))}
          </div>
          <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${current.id}`} className="caps__panel">
            <SystemScene variant={current.id} className="caps__scene" />
            <div className="caps__detail">
              <p className="caps__line">{current.line}</p>
              <p className="caps__stack t-mono">{current.stack}</p>
              <Link href={current.href} className="link-arrow">
                {current.linkLabel}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
