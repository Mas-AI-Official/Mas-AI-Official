'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { STAGE_ONE, STAGE_TWO, type DeployMode } from '@/content/home'
import { CTA, WORK_CTA } from '@/content/site'
import { DAENA } from '@/content/facts'
import {
  BUILT_AT,
  INTRO_END,
  computeView,
  contentRect,
  createSim,
  drawField,
  gapScreenRect,
  prewarm,
  restPoint,
  smooth,
  stepSim,
  type Deploy,
  type FieldEvent,
  type Palette,
  type Sim,
} from './stage/field'

/** One block per act; block k is centred at G = k. Stills are each act's end frame (the proof is an image). */
const BLOCKS = 7
const STILLS = [0, 0.95, 1.95, 2.95, 3.95, 4.95]
// Public-safe capture: demo identity, synthetic graph, marked DEMO DATA (the original stays in public/work).
const SHOT = { src: '/work/daena-brain-demo-1600.webp', srcSet: '/work/daena-brain-demo-960.webp 960w, /work/daena-brain-demo-1600.webp 1600w' }
const LOG_WINDOW = [4.15, 5.3]
/** Past this the world is gone and only the screenshot shows: the loop stops until the next scroll. */
const WORLD_END = 5.92
/** Phones keep the pinned panel only while the tallest copy block still fits under a panel this tall. */
const PANEL_MIN = 150
/** The fade under the phone panel (stage.css .stage__sticky::after) and the hysteresis back to pinned. */
const PANEL_FADE = 28
const FLOW_BACK = 32

export function readPalette(el: Element): Palette {
  const cs = getComputedStyle(el)
  const v = (name: string) => cs.getPropertyValue(name).trim()
  return {
    ground: v('--ground'), panel: v('--panel'), panelHi: v('--panel-hi'), line: v('--line'), line2: v('--line-2'),
    lineUi: v('--line-ui'), text: v('--text'), text2: v('--text-2'), text3: v('--text-3'), gold: v('--gold'),
    goldDeep: v('--gold-deep'), blue: v('--blue'), cyan: v('--cyan'), ok: v('--ok'), friction: v('--friction'),
    sans: getComputedStyle(document.body).fontFamily,
    mono: v('--font-mono') || 'ui-monospace, monospace',
  }
}

export function sizeCanvas(canvas: HTMLCanvasElement, w: number, h: number, offsetX = 0) {
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  const ctx = canvas.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, -offsetX * dpr, 0)
  return ctx
}

function logLine(e: FieldEvent): [string, string] {
  switch (e.kind) {
    // Messages stay at 16 characters or fewer (21 with an "(x9)" merge), so the log never truncates; the
    // narrow-log container queries in stage.css drop columns instead of cutting text.
    case 'filed':
      return ['intake', e.subject]
    case 'review':
      return ['intake', 'needs a person']
    case 'approved':
      return ['person', 'approved it']
    case 'booked':
      return ['calendar', 'booking made']
    default:
      return ['invoices', 'invoice issued']
  }
}

function warmSim(count: number, G: number): Sim {
  const sim = createSim(count)
  prewarm(sim, 25, Math.min(G, 2))
  if (G >= BUILT_AT) prewarm(sim, 12, G)
  return sim
}

/**
 * The homepage scenario: one pinned stage. A sticky canvas holds the operation; seven copy blocks scroll
 * over it and the scroll position (block k centred at G = k) drives every change: the business (timed
 * intro, cursor lens, headline trace), the gap, the decision, the build, the deployment, the running
 * system (live log) and the proof (Daena screenshot). Then the page releases into normal flow.
 * Reduced motion, no-JS and phones whose text does not fit under the panel get still frames in normal
 * flow (CSS for the first two, data-flow for the third).
 */
export function Stage() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = root?.querySelector<HTMLCanvasElement>('.stage__canvas')
    if (!root || !canvas) return
    const sticky = canvas.parentElement as HTMLElement
    const pal = readPalette(root)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fill = root.querySelector<HTMLElement>('[data-gapfill]')
    const ruled = root.querySelector<HTMLElement>('[data-ruled]')
    const gapWord = root.querySelector<HTMLElement>('[data-gapword]')

    // The rule under the first headline line breaks under the word "gap" (measured, not guessed).
    const measureGap = () => {
      if (!ruled || !gapWord) return
      const rr = ruled.getBoundingClientRect(), wr = gapWord.getBoundingClientRect()
      ruled.style.setProperty('--gap-l', `${wr.left - rr.left - 2}px`)
      ruled.style.setProperty('--gap-w', `${wr.width + 4}px`)
    }

    // Where the built system runs: the picker in the copy writes data-deploy and fires stage:deploy.
    const deploy = { from: (root.dataset.deploy as DeployMode) || 'private', to: (root.dataset.deploy as DeployMode) || 'private', start: 0 }
    const deployAt = (now: number): Deploy => ({ mode: deploy.to, from: deploy.from, t: deploy.start ? Math.min(1, (now - deploy.start) / 320) : 1 })

    const stills = Array.from(root.querySelectorAll<HTMLCanvasElement>('canvas[data-still]'))
    const drawStills = () => {
      measureGap()
      stills.forEach((c) => {
        const G = STILLS[Number(c.dataset.still)]
        const { width, height } = c.getBoundingClientRect()
        if (!width || !height) return
        const ctx = sizeCanvas(c, width, height)
        if (!ctx) return
        const v = computeView(width, height)
        const view = { ...v, phone: width < 600, area: { x: 8, y: 8, w: width - 16, h: height - 16 } }
        drawField(ctx, view, pal, warmSim(width < 600 ? 15 : 24, G), G, { still: true, deploy: { mode: deploy.to, from: deploy.to, t: 1 } })
      })
    }
    let flow = false
    let redraw: () => void = () => undefined
    const onDeploy = () => {
      const m = root.dataset.deploy as DeployMode
      if (!m || m === deploy.to) return
      deploy.from = deploy.to
      deploy.to = m
      deploy.start = performance.now()
      if (reduce.matches || flow) drawStills()
      else redraw()
    }
    root.addEventListener('stage:deploy', onDeploy)

    if (reduce.matches) {
      if (fill) fill.style.transform = 'scaleX(1)'
      document.fonts.ready.then(drawStills)
      drawStills()
      let stillRaf = 0
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(stillRaf)
        stillRaf = requestAnimationFrame(drawStills)
      })
      stills.forEach((c) => ro.observe(c))
      return () => {
        cancelAnimationFrame(stillRaf)
        ro.disconnect()
        root.removeEventListener('stage:deploy', onDeploy)
      }
    }

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64
    const blocks = Array.from(root.querySelectorAll<HTMLElement>(':scope > .stage__block'))
    const shot = root.querySelector<HTMLImageElement>('.stage__shot')
    const trace = root.querySelector<SVGPathElement>('[data-trace]')
    const traceSvg = trace?.ownerSVGElement ?? null
    const log = root.querySelector<HTMLOListElement>('[data-log]')
    let ctx: CanvasRenderingContext2D | null = null
    let view = computeView(1, 1)
    // Block tops and heights relative to the stage, so blocks of unequal height (large text) still map
    // to their own act.
    let tops: number[] = []
    let heights: number[] = []
    let sim = warmSim(26, 0)
    let introStart = 0
    let introDone = false
    let lastEvent = 0

    const lens = { x: 0, y: 0, tx: 0, ty: 0, active: false, until: 0 }
    const measureBlocks = () => {
      tops = blocks.map((b) => b.offsetTop)
      heights = blocks.map((b) => b.offsetHeight || 1)
    }
    const progress = () => {
      const y = headerH - root.getBoundingClientRect().top
      if (!tops.length || y <= tops[0]) return 0
      for (let k = 0; k < BLOCKS; k++) {
        if (y < tops[k] + heights[k]) return Math.min(BLOCKS - 1, k + (y - tops[k]) / heights[k])
      }
      return BLOCKS - 1
    }
    const introAt = (now: number) => (introDone ? INTRO_END : introStart ? Math.min(INTRO_END, (now - introStart) / 1000) : 0)

    // Canvas to DOM: aim the gold trace from the end of the headline rule at the canvas bracket.
    const placeTrace = () => {
      measureGap()
      if (!ruled || !trace) return
      const rr = ruled.getBoundingClientRect(), sr = sticky.getBoundingClientRect()
      const b = gapScreenRect(view, 0)
      const x0 = rr.right - sr.left + 6, y0 = rr.bottom - sr.top - 1
      if (view.phone) {
        // Phones: the headline sits below the stage panel, so the trace rises into it along the right
        // margin, clear of the eyebrow and the first line (it used to cut straight up through both).
        const xr = sr.width - 14, bx = b.x + b.w / 2, by = b.y + b.h
        trace.setAttribute('d', `M ${x0} ${y0} C ${xr} ${y0}, ${xr} ${by + 40}, ${bx} ${by}`)
        return
      }
      const x1 = b.x, y1 = b.y + b.h / 2
      const dx = Math.max(60, (x1 - x0) * 0.5)
      trace.setAttribute('d', `M ${x0} ${y0} C ${x0 + dx} ${y0}, ${x1 - dx} ${y1}, ${x1} ${y1}`)
    }

    // Phones: the panel gives up height to the tallest copy block, so no line sits under it (or under its
    // 28 px fade) at rest. When even a PANEL_MIN panel leaves too little room (large text, short screens) the
    // stage stops pinning: data-flow puts every act in normal flow with its still, the text keeps its size.
    // Heights are measured as in pinned mode (flow hides the live log, so its height is added back) and the
    // way back to pinned needs FLOW_BACK px of extra room: without both, the choice flipped every frame.
    const copies = [...root.querySelectorAll<HTMLElement>('.stage__copy')]
    const logwrap = root.querySelector<HTMLElement>('.stage__logwrap')
    let logExtra = 0
    const setFlow = (on: boolean) => {
      if (on === flow) return
      flow = on
      root.toggleAttribute('data-flow', on)
      if (on) {
        cancelAnimationFrame(raf)
        raf = 0
        if (fill) fill.style.transform = 'scaleX(1)'
        drawStills()
      } else redraw()
    }
    const fitPanel = () => {
      if (window.innerWidth >= 900) {
        root.style.removeProperty('--panel-fit')
        setFlow(false)
        return
      }
      if (!flow && logwrap?.offsetHeight) logExtra = logwrap.offsetHeight + parseFloat(getComputedStyle(logwrap.parentElement as Element).rowGap || '0')
      const tallest = Math.max(...copies.map((c) => c.offsetHeight + (flow && logwrap && c.contains(logwrap) ? logExtra : 0)))
      const avail = document.documentElement.clientHeight - headerH
      const room = Math.floor(avail * 0.95 - tallest - PANEL_FADE - 8)
      root.style.setProperty('--panel-fit', `${Math.max(PANEL_MIN, room)}px`)
      setFlow(flow ? room < PANEL_MIN + FLOW_BACK : room < PANEL_MIN)
    }

    const resize = () => {
      fitPanel()
      if (flow) return drawStills()
      const r = sticky.getBoundingClientRect()
      const wasPhone = view.phone
      view = computeView(r.width, r.height)
      // Desktop: stage.css places the canvas over the world area only (fewer pixels to raster per
      // frame). Read its offset, never write it: moving it after paint would be a layout shift.
      const c = canvas.getBoundingClientRect()
      ctx = sizeCanvas(canvas, c.width, c.height, c.left - r.left)
      measureBlocks()
      if (view.phone !== wasPhone) sim = warmSim(view.phone ? 15 : 26, 0)
      if (shot) Object.assign(shot.style, { left: `${view.proof.x}px`, top: `${view.proof.y}px`, width: `${view.proof.w}px` })
      if (!lens.x) {
        // The lens enters from the area's top right and settles on the queue.
        lens.x = view.area.x + view.area.w * 0.92
        lens.y = view.area.y + view.area.h * 0.1
      }
      placeTrace()
      draw(0)
    }

    let raf = 0
    let last = 0
    let visible = false
    const draw = (dt: number) => {
      if (!ctx) return 0
      const G = progress()
      const now = performance.now()
      if (!introDone && G > 0.02) introDone = true
      const intro = introAt(now)
      if (dt > 0) stepSim(sim, dt, G)
      if (lens.until && now > lens.until) {
        lens.active = false
        lens.until = 0
      }
      const rest = restPoint(view, G)
      const k = dt > 0 ? 1 - Math.exp(-dt / (lens.active ? 0.09 : 0.35)) : 1
      lens.x += ((lens.active ? lens.tx : rest.x) - lens.x) * k
      lens.y += ((lens.active ? lens.ty : rest.y) - lens.y) * k
      const P = drawField(ctx, view, pal, sim, G, { intro, lens: { x: lens.x, y: lens.y, r: view.phone ? 80 : 118 }, deploy: deployAt(now) })
      if (shot) {
        if (G > 4.4 && !shot.getAttribute('src')) {
          shot.srcset = SHOT.srcSet
          shot.src = SHOT.src
        }
        shot.style.opacity = P.shot.toFixed(3)
      }
      if (fill) fill.style.transform = `scaleX(${smooth(5, 5.6, intro).toFixed(3)})`
      if (trace && traceSvg) {
        trace.style.strokeDashoffset = String(1 - smooth(5.5, 6.4, intro))
        traceSvg.style.opacity = String(1 - smooth(0.02, 0.12, G))
      }
      if (log && G >= LOG_WINDOW[0] && G <= LOG_WINDOW[1]) {
        for (const e of sim.events) {
          if (e.at <= lastEvent) continue
          lastEvent = e.at
          // Four fixed rows whose text rolls down: prepending new rows moved the old ones, and every move
          // counted as a layout shift (CLS 0.08 at 375 px).
          if (!log.children.length) {
            for (let i = 0; i < 4; i++) {
              const li = document.createElement('li')
              li.append(document.createElement('time'), document.createElement('span'), document.createElement('span'))
              log.append(li)
            }
          }
          const rows = Array.from(log.children) as HTMLElement[]
          const [who, what] = logLine(e)
          const [time, a, b] = Array.from(rows[0].children) as HTMLElement[]
          const same = a.textContent === who && b.dataset.what === what
          if (!same) {
            for (let i = rows.length - 1; i > 0; i--) {
              Array.from(rows[i].children).forEach((c, j) => {
                const src = rows[i - 1].children[j] as HTMLElement
                c.textContent = src.textContent
                if (j === 2) (c as HTMLElement).dataset.what = src.dataset.what ?? ''
              })
            }
          }
          const n = same ? Number(b.dataset.n || '1') + 1 : 1
          time.textContent = new Date().toTimeString().slice(0, 8)
          a.textContent = who
          b.dataset.what = what
          b.dataset.n = String(n)
          b.textContent = n > 1 ? `${what} (x${n})` : what
        }
      } else if (sim.events.length) lastEvent = sim.events[sim.events.length - 1].at
      return G
    }
    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      const G = draw(dt)
      raf = visible && !flow && G < WORLD_END && !document.hidden ? requestAnimationFrame(frame) : 0
      if (!raf) last = 0
    }
    const wake = () => {
      if (!raf && visible && !flow && !document.hidden) raf = requestAnimationFrame(frame)
    }
    redraw = wake

    const toLocal = (e: PointerEvent) => {
      const r = sticky.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      const a = view.area
      const c = contentRect(view, progress())
      const inArea = x >= a.x && x <= a.x + a.w && y >= a.y && y <= a.y + a.h
      return { x, y, inside: inArea && x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h }
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !fine.matches) return
      const p = toLocal(e)
      lens.active = p.inside
      lens.until = 0
      if (p.inside) {
        lens.tx = p.x
        lens.ty = p.y
      }
      wake()
    }
    const onLeave = () => {
      lens.active = false
    }
    let down: { x: number; y: number; at: number } | null = null
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') down = { x: e.clientX, y: e.clientY, at: e.timeStamp }
    }
    const onUp = (e: PointerEvent) => {
      if (!down) return
      const tap = Math.hypot(e.clientX - down.x, e.clientY - down.y) < 10 && e.timeStamp - down.at < 400
      down = null
      const p = toLocal(e)
      if (!tap || !p.inside) return
      lens.active = true
      lens.tx = p.x
      lens.ty = p.y
      lens.until = performance.now() + 3500
      wake()
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) wake()
    })
    // Resizing runs on the next frame, outside the observer callback: resize() refits the sticky panel it
    // observes, and WebKit reported "ResizeObserver loop completed with undelivered notifications".
    let sizeRaf = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(sizeRaf)
      sizeRaf = requestAnimationFrame(resize)
    })
    // Copy height changes (text zoom, font swap) re-fit the panel on the next frame, outside the
    // observer callback, so resizing the sticky never trips a ResizeObserver loop.
    let fitRaf = 0
    const refit = () => {
      cancelAnimationFrame(fitRaf)
      fitRaf = requestAnimationFrame(() => {
        fitPanel()
        measureBlocks()
        if (flow) drawStills()
      })
    }
    const copyRo = new ResizeObserver(refit)
    const onVis = () => (document.hidden ? undefined : wake())
    io.observe(root)
    ro.observe(sticky)
    copies.forEach((c) => copyRo.observe(c))
    stills.forEach((c) => copyRo.observe(c))
    window.addEventListener('resize', refit, { passive: true })
    let disposed = false
    document.fonts.ready.then(() => {
      if (disposed) return
      measureBlocks()
      placeTrace()
      introStart = performance.now()
      wake()
    })
    root.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerleave', onLeave, { passive: true })
    root.addEventListener('pointerdown', onDown, { passive: true })
    root.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('scroll', wake, { passive: true })
    document.addEventListener('visibilitychange', onVis)
    return () => {
      disposed = true
      visible = false
      cancelAnimationFrame(sizeRaf)
      cancelAnimationFrame(fitRaf)
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      copyRo.disconnect()
      cancelAnimationFrame(fitRaf)
      window.removeEventListener('resize', refit)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('pointerup', onUp)
      root.removeEventListener('stage:deploy', onDeploy)
      window.removeEventListener('scroll', wake)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <section ref={rootRef} className="stage" aria-labelledby="hero-title" data-deploy={STAGE_TWO.deploy.initial}>
      <div className="stage__sticky" aria-hidden="true">
        <canvas className="stage__canvas" />
        <svg className="stage__trace" width="100%" height="100%">
          <path data-trace pathLength={1} />
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="stage__shot" sizes="(min-width: 900px) 640px, 92vw" width={1600} height={913} alt="" decoding="async" />
      </div>
      <Acts />
    </section>
  )
}

function Still({ i }: { i: number }) {
  return <canvas className="stage__still" data-still={i} aria-hidden="true" />
}

function Acts() {
  const { hero, gap, decision } = STAGE_ONE
  const { build, deploy, runs, proof } = STAGE_TWO
  const [before, after] = hero.title[0].split(hero.gapWord)
  return (
    <>
      <div id="hero" className="stage__block">
        <div className="wrap stage__inner">
          <div className="stage__copy">
            <p className="stage__eyebrow">{hero.eyebrow}</p>
            <h1 id="hero-title" className="t-display stage__title">
              <span className="stage__line">
                <span className="stage__ruled" data-ruled>
                  {before}
                  <span data-gapword>{hero.gapWord}</span>
                  {after}
                  <span className="stage__gapfill" data-gapfill aria-hidden="true" />
                </span>
              </span>
              <span className="stage__line">{hero.title[1]}</span>
            </h1>
            <p className="t-lead">{hero.sub}</p>
            <div className="stage__actions">
              <Link href={CTA.href} className="btn btn-primary">
                {CTA.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <p className="stage__note">{hero.proof}</p>
            <p className="visually-hidden">{hero.alt}</p>
          </div>
          <Still i={0} />
        </div>
      </div>

      <div id="gap" className="stage__block">
        <div className="wrap stage__inner">
          <div className="stage__copy">
            <h2 className="t-h2">{gap.title}</h2>
            <p className="t-lead">{gap.body}</p>
            <p className="stage__close">{gap.close}</p>
            <p className="visually-hidden">{gap.alt}</p>
          </div>
          <Still i={1} />
        </div>
      </div>

      <div id="decision" className="stage__block">
        <div className="wrap stage__inner">
          <div className="stage__copy">
            <h2 className="t-h2">{decision.title}</h2>
            <p className="t-lead">{decision.body}</p>
            <p className="stage__note stage__note--wide">{decision.detail}</p>
            <p className="visually-hidden">{decision.alt}</p>
          </div>
          <Still i={2} />
        </div>
      </div>

      <div id="build" className="stage__block">
        <div className="wrap stage__inner">
          <div className="stage__copy">
            <h2 className="t-display stage__statement">{build.title}</h2>
            <p className="t-lead">{build.body}</p>
            <Link href={build.link.href} className="link-arrow">
              {build.link.label}
              <ArrowRight aria-hidden="true" />
            </Link>
            <p className="visually-hidden">{build.alt}</p>
          </div>
          <Still i={3} />
        </div>
      </div>

      <div id="deploy" className="stage__block">
        <div className="wrap stage__inner">
          <div className="stage__copy">
            <h2 className="t-h2">{deploy.title}</h2>
            <p className="t-lead">{deploy.body}</p>
            <DeployPicker />
            <p className="visually-hidden">{deploy.alt}</p>
          </div>
          <Still i={4} />
        </div>
      </div>

      <div id="runs" className="stage__block">
        <div className="wrap stage__inner">
          <div className="stage__copy">
            <h2 className="t-h2">{runs.title}</h2>
            <p className="t-lead">{runs.body}</p>
            <div className="stage__logwrap">
              <p className="stage__loglabel">{runs.logLabel}</p>
              <ol className="stage__log" data-log aria-hidden="true" />
            </div>
            <p className="visually-hidden">{runs.alt}</p>
          </div>
          <Still i={5} />
        </div>
      </div>

      <div id="daena" className="stage__block">
        <div className="wrap stage__inner">
          <div className="stage__copy">
            <p className="stage__eyebrow">{proof.label}</p>
            <h2 className="t-h2">{proof.title}</h2>
            <p className="t-lead">
              Daena is our governed multi-agent platform: {DAENA.agents.display}, under {DAENA.hardLaws.display}.
            </p>
            <div className="stage__links">
              <Link href="/what-is-daena/" className="link-arrow">
                What is Daena
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link href={WORK_CTA.href} className="link-arrow">
                {WORK_CTA.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <p className="stage__note">{proof.caption}</p>
            <p className="visually-hidden">{proof.imageAlt}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="stage__still-shot" src={SHOT.src} srcSet={SHOT.srcSet} sizes="(min-width: 900px) 640px, 92vw" width={1600} height={913} alt="" loading="lazy" decoding="async" />
        </div>
      </div>
    </>
  )
}

/** Where the example system runs. Writes data-deploy on the stage and tells the canvas to redraw. */
function DeployPicker() {
  const { deploy } = STAGE_TWO
  const [mode, setMode] = useState<DeployMode>(deploy.initial)
  const ref = useRef<HTMLDivElement>(null)
  const pick = (m: DeployMode) => {
    setMode(m)
    const stage = ref.current?.closest<HTMLElement>('.stage')
    if (!stage) return
    stage.dataset.deploy = m
    stage.dispatchEvent(new Event('stage:deploy'))
  }
  const current = deploy.modes.find((m) => m.id === mode) ?? deploy.modes[0]
  return (
    <div ref={ref} className="stage__deploy">
      <div className="stage__modes" role="group" aria-label={deploy.pickLabel}>
        {deploy.modes.map((m) => (
          <button key={m.id} type="button" className="stage__mode" aria-pressed={mode === m.id} onClick={() => pick(m.id)}>
            {m.label}
          </button>
        ))}
      </div>
      <p className="stage__modeline" aria-live="polite">
        {current.line}
      </p>
    </div>
  )
}
