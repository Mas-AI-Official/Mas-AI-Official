'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { FALLBACK, GREETING, findBestMatch } from '@/lib/guide/legacy'
import { MODES, guideMode } from '@/lib/guide/mode'
import type { GuideModeMeta } from '@/lib/guide/mode'

type Message = {
  id: number
  role: 'user' | 'guide'
  text: string
  link?: string
  linkLabel?: string
  /** Set when the answer's home section is not on the current page. */
}

const TYPING_MS = 300
const HIGHLIGHT_MS = 1500
const CAPTION_MS = 3000
const CAPTION_DEBOUNCE_MS = 200
const HISTORY_KEEP = 48
const PHONE_QUERY = '(max-width: 767px)'
/** Label on every answer link, as in the original guide. */
const LINK_LABEL = 'Visit'

/** Proactive caption by the launcher, keyed by homepage section id. Shell copy, not part of the frozen answers. */
const CAPTIONS: Record<string, string> = {
  hero: 'We build what is missing.',
  services: 'Which gap is yours?',
  work: 'Problem first, then the build.',
  daena: 'Our own agent platform.',
  company: 'Founder-led, start to finish.',
  start: 'Bring us the problem.',
  faq: 'Questions? Ask me.',
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Site guide shell. The answers come from src/lib/guide/legacy.ts, the original matcher and knowledge base,
 * frozen by owner order: this component only renders them. No network, no storage, no cookies: a reload
 * starts a fresh conversation.
 */
export function Guide() {
  const pathname = usePathname()
  // Follows client-side navigation: usePathname re-renders on every route change, not only the first load.
  const mode = MODES[guideMode(pathname)]
  const uid = useId()
  const panelId = `${uid}-panel`
  const titleId = `${uid}-title`
  const inputId = `${uid}-input`

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [caption, setCaption] = useState('')
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: 'guide', text: GREETING }])

  const nextId = useRef(1)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const answerTimers = useRef(new Set<number>())
  const highlightTimers = useRef(new Map<Element, number>())
  const captionTimer = useRef<number>(0)
  const shownCaptions = useRef(new Set<string>())
  const openRef = useRef(open)

  useEffect(() => {
    openRef.current = open
  }, [open])

  // Other parts of the page (the closing act) can open the guide. The guide mounts lazily, so a request
  // made before mount is left on window and honoured here.
  useEffect(() => {
    const w = window as Window & { __guideWantsOpen?: boolean }
    const onOpen = () => setOpen(true)
    if (w.__guideWantsOpen) {
      w.__guideWantsOpen = false
      setOpen(true)
    }
    window.addEventListener('guide:open', onOpen)
    return () => window.removeEventListener('guide:open', onOpen)
  }, [])

  // Clear every pending timer on unmount and drop any highlight we added.
  useEffect(() => {
    const answers = answerTimers.current
    const highlights = highlightTimers.current
    return () => {
      answers.forEach((t) => window.clearTimeout(t))
      answers.clear()
      highlights.forEach((t, el) => {
        window.clearTimeout(t)
        el.classList.remove('section-highlight')
      })
      highlights.clear()
      window.clearTimeout(captionTimer.current)
    }
  }, [])

  // Focus the input whenever the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Keep the newest row in view inside the log (never scrolls the page).
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [messages, typing, open])

  const closePanel = useCallback(() => {
    setOpen(false)
    launcherRef.current?.focus()
  }, [])

  const highlight = useCallback((el: HTMLElement) => {
    el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
    el.classList.add('section-highlight')
    const prior = highlightTimers.current.get(el)
    if (prior) window.clearTimeout(prior)
    highlightTimers.current.set(
      el,
      window.setTimeout(() => {
        el.classList.remove('section-highlight')
        highlightTimers.current.delete(el)
      }, HIGHLIGHT_MS),
    )
  }, [])

  const send = useCallback(() => {
    const text = input.trim()
    if (!text) return
    const userMsg: Message = { id: nextId.current++, role: 'user', text }
    setMessages((prev) => [...prev.slice(-HISTORY_KEEP), userMsg])
    setInput('')
    setTyping(true)

    const timer = window.setTimeout(() => {
      answerTimers.current.delete(timer)
      const match = findBestMatch(text)
      const reply: Message = {
        id: nextId.current++,
        role: 'guide',
        text: match?.answer || FALLBACK,
        link: match?.link,
        linkLabel: match?.link ? LINK_LABEL : undefined,
      }
      const section = match?.section ?? null
      if (section) {
        const el = document.getElementById(section)
        if (el) highlight(el)
      }
      setMessages((prev) => [...prev, reply])
      setTyping(false)
    }, TYPING_MS)
    answerTimers.current.add(timer)
  }, [input, highlight])

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return
    e.preventDefault()
    send()
  }

  const onRootKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation()
      closePanel()
    }
  }

  // Proactive captions: when a new home section becomes active, show a short line by the launcher.
  // Rebinds on every route change. Desktop only, panel closed, once per section per visit.
  useEffect(() => {
    if (open) return
    let observer: IntersectionObserver | null = null
    let debounce = 0
    let retry = 0
    let hideTimer = 0
    let candidate = ''

    const phone = () => window.matchMedia(PHONE_QUERY).matches

    const show = (id: string) => {
      if (openRef.current || phone() || shownCaptions.current.has(id)) return
      const line = CAPTIONS[id]
      if (!line) return
      shownCaptions.current.add(id)
      setCaption(line)
      window.clearTimeout(hideTimer)
      hideTimer = window.setTimeout(() => setCaption(''), CAPTION_MS)
      captionTimer.current = hideTimer
    }

    const bind = (isRetry: boolean) => {
      const sections = document.querySelectorAll<HTMLElement>('main section[id]')
      if (sections.length === 0) {
        if (!isRetry) retry = window.setTimeout(() => bind(true), 300)
        return
      }
      // A section taller than the viewport can never reach a 0.4 ratio, so the score is the visible
      // height over the smaller of the section and the viewport, and the thresholds are stepped.
      const scores = new Map<string, number>()
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const id = (entry.target as HTMLElement).id
            const denom = Math.min(entry.boundingClientRect.height, window.innerHeight) || 1
            scores.set(id, entry.isIntersecting ? entry.intersectionRect.height / denom : 0)
          }
          let best = ''
          let bestScore = 0
          scores.forEach((score, id) => {
            if (score > bestScore) {
              bestScore = score
              best = id
            }
          })
          if (!best || bestScore < 0.4 || best === candidate) return
          candidate = best
          window.clearTimeout(debounce)
          debounce = window.setTimeout(() => show(best), CAPTION_DEBOUNCE_MS)
        },
        { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] },
      )
      sections.forEach((s) => observer?.observe(s))
    }

    if (!phone()) bind(false)

    return () => {
      observer?.disconnect()
      window.clearTimeout(debounce)
      window.clearTimeout(retry)
      window.clearTimeout(hideTimer)
      setCaption('')
    }
  }, [pathname, open])

  return (
    <div
      className="guide"
      data-mode={mode.id}
      style={{ '--guide-accent': mode.accent } as CSSProperties}
      onKeyDown={onRootKeyDown}
    >
      <div className="guide__dock">
        {caption && !open ? (
          <div className="guide__caption" aria-hidden="true">
            {caption}
          </div>
        ) : null}
        <button
          ref={launcherRef}
          type="button"
          className="guide__launcher"
          aria-label={`Ask ${mode.name}, the site guide`}
          aria-expanded={open}
          aria-controls={panelId}
          data-testid="guide-launcher"
          onClick={() => setOpen((v) => !v)}
        >
          <Avatar mode={mode} status />
        </button>
        {!caption ? (
          <div className="guide__hover" aria-hidden="true">
            {mode.hover}
          </div>
        ) : null}
      </div>

      <div
        id={panelId}
        className="guide__panel"
        role="dialog"
        aria-labelledby={titleId}
        hidden={!open}
        data-testid="guide-panel"
      >
        <div className="guide__head">
          <div className="guide__who">
            <Avatar mode={mode} />
            <h2 id={titleId} className="guide__title">
              <span className="guide__name">{mode.name}</span>
              <span className="guide__sub">{mode.subtitle}</span>
            </h2>
          </div>
          <button
            type="button"
            className="guide__close"
            aria-label="Close site guide"
            data-testid="guide-close"
            onClick={closePanel}
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <div
          ref={logRef}
          className="guide__log"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Conversation"
          tabIndex={0}
          data-testid="guide-log"
        >
          {messages.map((m) => (
            <div key={m.id} className={`guide__msg guide__msg--${m.role}`}>
              <p>{m.text}</p>
              {m.role === 'guide' && m.link && m.linkLabel ? <MessageLink href={m.link} label={m.linkLabel} /> : null}
            </div>
          ))}
          {typing ? (
            <div className="guide__typing" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          ) : null}
        </div>

        <div className="guide__form">
          <label htmlFor={inputId} className="guide__label">
            Your question
          </label>
          <div className="guide__row">
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              className="guide__input"
              value={input}
              placeholder="Ask about what we build"
              autoComplete="off"
              enterKeyHint="send"
              data-testid="guide-input"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKeyDown}
            />
            <button
              type="button"
              className="guide__send"
              disabled={!input.trim()}
              data-testid="guide-send"
              onClick={send}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Round face crop for the launcher and the panel header. Keyed on the mode so the image remounts (and fades in
 * under no-preference) when the route flips Daena to Klyntar. width/height are the source's intrinsic size,
 * CSS sizes the crop (object-fit cover, object-position per mode so the face is centred).
 */
function Avatar({ mode, status = false }: { mode: GuideModeMeta; status?: boolean }) {
  return (
    <span className="guide__avatar">
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized */}
      <img
        key={mode.id}
        src={mode.avatar}
        alt={mode.alt}
        width={mode.avatarWidth}
        height={mode.avatarHeight}
        decoding="async"
        draggable={false}
        style={{ objectPosition: mode.avatarPosition }}
      />
      {status ? <span className="guide__status" aria-hidden="true" /> : null}
    </span>
  )
}

function MessageLink({ href, label }: { href: string; label: string }) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className="guide__link">
        {label}
        <ArrowRight aria-hidden="true" />
      </Link>
    )
  }
  return (
    <a href={href} className="guide__link" target="_blank" rel="noopener">
      {label}
      <span className="sr-only"> (opens in a new tab)</span>
      <ArrowUpRight aria-hidden="true" />
    </a>
  )
}
