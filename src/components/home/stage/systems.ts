/**
 * The same operation, transformed per capability. Home's capability panel and every service page draw
 * from here, so a visitor sees one system change shape instead of eight unrelated illustrations.
 * Stations keep their identity across variants: switching variant moves them, it never swaps them.
 * Colour is state (see field.ts): gold = what MAS-AI adds, cyan = information moving, ok = operational.
 */
import type { CapabilityVariant } from '@/content/home'
import { clamp, glyph, lerp, roundRect, smooth, station, stationSize, withAlpha, type Palette, type Vec } from './field'

export type SceneView = { w: number; h: number; phone: boolean }
type Id = 'leads' | 'inbox' | 'sheet' | 'cal' | 'inv'
type Layout = Record<Id, Vec>

const W = 1000, H = 620
const LABELS: Record<Id, string> = { leads: 'Leads', inbox: 'Inbox', sheet: 'Spreadsheet', cal: 'Calendar', inv: 'Invoices' }
const BASE: Layout = { leads: { x: 90, y: 330 }, inbox: { x: 285, y: 330 }, sheet: { x: 700, y: 330 }, cal: { x: 905, y: 225 }, inv: { x: 905, y: 435 } }

const scaled = (l: Layout, k: number, c: Vec = { x: W / 2, y: 320 }): Layout =>
  Object.fromEntries(Object.entries(l).map(([id, p]) => [id, { x: c.x + (p.x - c.x) * k, y: c.y + (p.y - c.y) * k }])) as Layout

const LAYOUTS: Record<CapabilityVariant, Layout> = {
  ai: BASE,
  integration: { leads: { x: 110, y: 220 }, inbox: { x: 305, y: 220 }, sheet: { x: 500, y: 220 }, cal: { x: 695, y: 220 }, inv: { x: 890, y: 220 } },
  software: { leads: { x: 245, y: 200 }, inbox: { x: 245, y: 262 }, sheet: { x: 245, y: 324 }, cal: { x: 245, y: 386 }, inv: { x: 245, y: 448 } },
  agents: BASE,
  websites: { leads: { x: 470, y: 330 }, inbox: { x: 620, y: 330 }, sheet: { x: 775, y: 330 }, cal: { x: 925, y: 235 }, inv: { x: 925, y: 425 } },
  private: scaled(BASE, 0.8),
  governance: BASE,
  ongoing: BASE,
}
/** Phones: stations keep a readable minimum size, so the stacked software column needs more room per row. */
const PHONE_LAYOUTS: Partial<Record<CapabilityVariant, Layout>> = {
  software: { leads: { x: 300, y: 185 }, inbox: { x: 300, y: 260 }, sheet: { x: 300, y: 335 }, cal: { x: 300, y: 410 }, inv: { x: 300, y: 485 } },
}
const layoutFor = (v: CapabilityVariant, phone: boolean) => (phone && PHONE_LAYOUTS[v]) || LAYOUTS[v]

/** Paths items flow along, per variant (world coordinates). */
function flows(v: CapabilityVariant, L: Layout): Vec[][] {
  const mid = { x: 492, y: L.inbox.y }
  switch (v) {
    case 'integration':
      return [[{ x: L.leads.x, y: 430 }, { x: L.inv.x, y: 430 }], [{ x: L.inbox.x, y: L.inbox.y + 20 }, { x: L.inbox.x, y: 430 }], [{ x: L.sheet.x, y: 430 }, { x: L.sheet.x, y: L.sheet.y + 20 }]]
    case 'software':
      return []
    case 'websites':
      return [[{ x: 300, y: 402 }, { x: 390, y: 402 }, { x: 390, y: L.leads.y }, L.leads], [L.leads, L.inbox, L.sheet], [L.sheet, L.cal]]
    case 'ai':
      return [[L.inbox, mid], [{ x: 492, y: 150 }, mid], [mid, L.sheet]]
    case 'agents':
      return [[{ x: 492, y: 175 }, L.inbox], [{ x: 492, y: 175 }, L.sheet], [{ x: 492, y: 175 }, L.cal]]
    default:
      return [[L.leads, L.inbox, mid, L.sheet], [L.sheet, L.cal], [L.sheet, L.inv]]
  }
}

function along(path: Vec[], u: number): Vec {
  const segs = path.slice(1).map((p, i) => Math.hypot(p.x - path[i].x, p.y - path[i].y))
  let d = u * segs.reduce((a, b) => a + b, 0)
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i]) {
      const t = segs[i] ? d / segs[i] : 0
      return { x: lerp(path[i].x, path[i + 1].x, t), y: lerp(path[i].y, path[i + 1].y, t) }
    }
    d -= segs[i]
  }
  return path[path.length - 1]
}

type Cam = { s: number; ox: number; oy: number }
const S = (c: Cam, p: Vec): Vec => ({ x: c.ox + p.x * c.s, y: c.oy + p.y * c.s })

function line(ctx: CanvasRenderingContext2D, c: Cam, pts: Vec[], stroke: string, width = 1, dash: number[] = []) {
  ctx.strokeStyle = stroke
  ctx.lineWidth = width
  ctx.setLineDash(dash)
  ctx.beginPath()
  pts.forEach((p, i) => {
    const q = S(c, p)
    if (i) ctx.lineTo(q.x, q.y)
    else ctx.moveTo(q.x, q.y)
  })
  ctx.stroke()
  ctx.setLineDash([])
}

function label(ctx: CanvasRenderingContext2D, pal: Palette, text: string, p: Vec, color: string, px: number, align: CanvasTextAlign = 'center') {
  ctx.font = `500 ${px}px ${pal.mono}`
  ctx.textAlign = align
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  ctx.fillText(text, p.x, p.y)
}

/**
 * Draw the operation in variant `to`, arriving from `from` (blend 0..1 moves stations and crossfades the
 * overlays). `time` in seconds drives the flowing items; pass a constant for a still.
 */
export function drawSystem(ctx: CanvasRenderingContext2D, view: SceneView, pal: Palette, from: CapabilityVariant, to: CapabilityVariant, blend: number, time: number) {
  const pad = view.phone ? 10 : 18
  const s = Math.min((view.w - pad * 2) / W, (view.h - pad * 2) / H)
  const cam = { s, ox: (view.w - W * s) / 2, oy: (view.h - H * s) / 2 }
  const e = smooth(0, 1, blend)
  const A = layoutFor(from, view.phone), B = layoutFor(to, view.phone)
  const L = Object.fromEntries((Object.keys(LABELS) as Id[]).map((id) => [id, { x: lerp(A[id].x, B[id].x, e), y: lerp(A[id].y, B[id].y, e) }])) as Layout
  if (view.phone) separate(ctx, pal, L, cam, view)
  const mono = view.phone ? 9.5 : 11
  ctx.clearRect(0, 0, view.w, view.h)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Base wiring the stations always keep (the business still runs on its own tools).
  if (to !== 'software' || e < 1) {
    ctx.save()
    ctx.globalAlpha = to === 'software' ? 1 - e : 1
    line(ctx, cam, [L.leads, L.inbox], withAlpha(pal.text2, 0.45))
    line(ctx, cam, [L.sheet, { x: (L.sheet.x + L.cal.x) / 2, y: L.sheet.y }, { x: (L.sheet.x + L.cal.x) / 2, y: L.cal.y }, L.cal], withAlpha(pal.text2, 0.45))
    line(ctx, cam, [L.sheet, { x: (L.sheet.x + L.inv.x) / 2, y: L.sheet.y }, { x: (L.sheet.x + L.inv.x) / 2, y: L.inv.y }, L.inv], withAlpha(pal.text2, 0.45))
    ctx.restore()
  }

  // Overlays: the outgoing variant fades out while the incoming one fades in.
  if (from !== to && e < 1) overlay(ctx, view, pal, from, L, cam, 1 - e, time, mono)
  overlay(ctx, view, pal, to, L, cam, e, time, mono)

  // Flowing work (information in cyan once it moves through what was built).
  const itemW = clamp(s * 19, 7, 18)
  flows(to, L).forEach((path, i) => {
    for (let k = 0; k < 2; k++) {
      const u = (time * 0.18 + i * 0.31 + k * 0.5) % 1
      ctx.save()
      ctx.globalAlpha = e * Math.min(1, u * 8, (1 - u) * 8)
      glyph(ctx, pal, i === 0 ? 'message' : 'row', S(cam, along(path, u)), itemW, pal.cyan)
      ctx.restore()
    }
  })

  // Stations last, so they sit above their connections.
  for (const id of Object.keys(LABELS) as Id[]) {
    station(ctx, pal, LABELS[id], S(cam, L[id]), s, view.phone, { status: to === 'ongoing' || to === 'governance' ? e : 0 })
  }
}

function overlay(ctx: CanvasRenderingContext2D, view: SceneView, pal: Palette, v: CapabilityVariant, L: Layout, cam: Cam, a: number, time: number, mono: number) {
  if (a <= 0.01) return
  ctx.save()
  ctx.globalAlpha = a
  const P = (p: Vec) => S(cam, p)
  const mid = { x: 492, y: L.inbox.y }
  switch (v) {
    case 'ai': {
      // A model where it earns its place: it reads your documents and answers, cited.
      const docs = { x: 492, y: 150 }
      line(ctx, cam, [docs, mid], withAlpha(pal.cyan, 0.8), 1.2, [4, 4])
      line(ctx, cam, [L.inbox, mid, L.sheet], pal.gold, 1.6)
      const d = P(docs)
      for (let i = 2; i >= 0; i--) {
        roundRect(ctx, d.x - 22 + i * 4, d.y - 26 + i * 4, 44, 52, 4)
        ctx.fillStyle = pal.panel
        ctx.fill()
        ctx.strokeStyle = pal.line2
        ctx.stroke()
      }
      if (view.phone) label(ctx, pal, 'your documents', { x: d.x - 32, y: d.y }, pal.text3, mono, 'right')
      else label(ctx, pal, 'your documents', { x: d.x, y: d.y + 44 }, pal.text3, mono)
      hexNode(ctx, pal, P(mid), Math.max(16, 30 * cam.s), 'model')
      label(ctx, pal, 'answers, cited', { x: P(mid).x, y: P(mid).y + Math.max(28, 50 * cam.s) }, pal.gold, mono)
      break
    }
    case 'integration': {
      // One layer joins the tools; each keeps doing its job.
      const y = 430
      const l = P({ x: 60, y: y - 17 }), r = P({ x: 940, y: y + 17 })
      roundRect(ctx, l.x, l.y, r.x - l.x, r.y - l.y, 8)
      ctx.fillStyle = pal.panel
      ctx.fill()
      ctx.strokeStyle = pal.gold
      ctx.lineWidth = 1.4
      ctx.stroke()
      for (const id of Object.keys(L) as Id[]) line(ctx, cam, [{ x: L[id].x, y: L[id].y + 20 }, { x: L[id].x, y: y - 17 }], pal.gold, 1.2)
      label(ctx, pal, 'one integration layer', P({ x: 500, y: y + 40 }), pal.gold, mono)
      break
    }
    case 'software': {
      // The system becomes one application: the tools turn into its sections, the work into its rows.
      const tl = P({ x: 150, y: 110 }), br = P({ x: 870, y: 530 })
      roundRect(ctx, tl.x, tl.y, br.x - tl.x, br.y - tl.y, 10)
      ctx.fillStyle = pal.panel
      ctx.fill()
      ctx.strokeStyle = pal.gold
      ctx.lineWidth = 1.4
      ctx.stroke()
      const bar = Math.max(14, 30 * cam.s)
      ctx.beginPath()
      ctx.roundRect(tl.x, tl.y, br.x - tl.x, bar, [10, 10, 0, 0])
      ctx.fillStyle = pal.panelHi
      ctx.fill()
      const side = view.phone
        ? Math.max(P({ x: 345, y: 0 }).x, P(L.sheet).x + stationSize(ctx, pal, LABELS.sheet, cam.s, true).w / 2 + 8)
        : P({ x: 345, y: 0 }).x
      line(ctx, { s: 1, ox: 0, oy: 0 }, [{ x: side, y: tl.y + bar }, { x: side, y: br.y }], pal.line2)
      const rows = 5
      const rh = (br.y - tl.y - bar - 24) / rows
      for (let i = 0; i < rows; i++) {
        const y = tl.y + bar + 12 + rh * i + rh / 2
        const w = (br.x - side - 32) * (i % 2 ? 0.55 : 0.72)
        roundRect(ctx, side + 16, y - 3, w, 6, 3)
        ctx.fillStyle = withAlpha(pal.text3, 0.55)
        ctx.fill()
        const done = (Math.floor(time * 0.9) + i) % 5 !== 0
        const cw = Math.max(26, 54 * cam.s), ch = Math.max(9, 16 * cam.s)
        roundRect(ctx, br.x - 16 - cw, y - ch / 2, cw, ch, 4)
        ctx.fillStyle = done ? pal.ok : pal.panel
        ctx.fill()
        ctx.strokeStyle = done ? pal.ok : pal.gold
        ctx.stroke()
      }
      label(ctx, pal, 'one application', { x: (tl.x + br.x) / 2, y: br.y + 18 }, pal.gold, mono)
      break
    }
    case 'agents': {
      // An agent acts through your tools, inside an approval step, with knowledge wired in.
      const agent = { x: 492, y: 175 }
      for (const id of ['inbox', 'sheet', 'cal'] as Id[]) line(ctx, cam, [agent, L[id]], withAlpha(pal.cyan, 0.7), 1.1)
      const know = { x: 300, y: 130 }
      line(ctx, cam, [know, agent], withAlpha(pal.cyan, 0.7), 1.1, [4, 4])
      const k = P(know)
      roundRect(ctx, k.x - 34, k.y - 14, 68, 28, 6)
      ctx.fillStyle = pal.panel
      ctx.fill()
      ctx.strokeStyle = pal.line2
      ctx.stroke()
      label(ctx, pal, 'knowledge', k, pal.text2, mono)
      hexNode(ctx, pal, P(agent), Math.max(16, 30 * cam.s), 'agent')
      const gate = P({ x: 600, y: L.sheet.y - 70 })
      ctx.strokeStyle = pal.gold
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.arc(gate.x, gate.y, Math.max(8, 13 * cam.s), 0, Math.PI * 2)
      ctx.stroke()
      const gr = Math.max(8, 13 * cam.s)
      if (view.phone) label(ctx, pal, 'approval', { x: gate.x + gr + 5, y: gate.y }, pal.gold, mono, 'left')
      else label(ctx, pal, 'approval', { x: gate.x, y: gate.y + Math.max(18, 26 * cam.s) }, pal.gold, mono)
      break
    }
    case 'websites': {
      // The website is where the work starts, not a brochure beside it.
      const tl = P({ x: 40, y: 190 }), br = P({ x: 350, y: 480 })
      roundRect(ctx, tl.x, tl.y, br.x - tl.x, br.y - tl.y, 10)
      ctx.fillStyle = pal.panel
      ctx.fill()
      ctx.strokeStyle = pal.gold
      ctx.lineWidth = 1.4
      ctx.stroke()
      const bar = Math.max(12, 24 * cam.s)
      ctx.beginPath()
      ctx.roundRect(tl.x, tl.y, br.x - tl.x, bar, [10, 10, 0, 0])
      ctx.fillStyle = pal.panelHi
      ctx.fill()
      for (let i = 0; i < 3; i++) {
        roundRect(ctx, tl.x + 14, tl.y + bar + 16 + i * Math.max(14, 30 * cam.s), (br.x - tl.x) * 0.7, Math.max(6, 12 * cam.s), 3)
        ctx.strokeStyle = pal.line2
        ctx.stroke()
      }
      const btn = P({ x: 250, y: 402 })
      roundRect(ctx, btn.x - Math.max(20, 44 * cam.s), btn.y - Math.max(6, 12 * cam.s), Math.max(40, 88 * cam.s), Math.max(12, 24 * cam.s), 5)
      ctx.fillStyle = pal.gold
      ctx.fill()
      line(ctx, cam, [{ x: 300, y: 402 }, { x: 390, y: 402 }, { x: 390, y: L.leads.y }, L.leads], pal.gold, 1.5)
      label(ctx, pal, 'your website', { x: (tl.x + br.x) / 2, y: br.y + 16 }, pal.gold, mono)
      break
    }
    case 'private': {
      // Same system, inside your walls: nothing crosses to a public service.
      const tl = P({ x: 50, y: 120 }), br = P({ x: 950, y: 520 })
      roundRect(ctx, tl.x, tl.y, br.x - tl.x, br.y - tl.y, 14)
      ctx.strokeStyle = pal.gold
      ctx.lineWidth = 1.4
      ctx.setLineDash([6, 5])
      ctx.stroke()
      ctx.setLineDash([])
      label(ctx, pal, 'your network', { x: tl.x + 12, y: tl.y + 14 }, pal.gold, mono, 'left')
      line(ctx, cam, [L.inbox, mid, L.sheet], pal.gold, 1.6)
      const cloud = P({ x: 870, y: 70 })
      ctx.strokeStyle = pal.text3
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(cloud.x - 10, cloud.y, 9, Math.PI * 0.5, Math.PI * 1.5)
      ctx.arc(cloud.x, cloud.y - 7, 11, Math.PI, 0)
      ctx.arc(cloud.x + 11, cloud.y, 9, Math.PI * 1.5, Math.PI * 0.5)
      ctx.closePath()
      ctx.stroke()
      const x = P({ x: 870, y: 108 })
      ctx.strokeStyle = pal.friction
      ctx.beginPath()
      ctx.moveTo(x.x - 5, x.y - 5)
      ctx.lineTo(x.x + 5, x.y + 5)
      ctx.moveTo(x.x + 5, x.y - 5)
      ctx.lineTo(x.x - 5, x.y + 5)
      ctx.stroke()
      label(ctx, pal, 'public service', { x: cloud.x - 24, y: cloud.y - 2 }, pal.text3, mono, 'right')
      break
    }
    case 'governance': {
      // Tests on every path, a person on the uncertain ones, a log of everything.
      line(ctx, cam, [L.inbox, mid, L.sheet], pal.gold, 1.6)
      for (const p of [{ x: 390, y: L.inbox.y }, { x: 600, y: L.inbox.y }]) {
        const q = P(p)
        ctx.fillStyle = pal.ground
        ctx.strokeStyle = pal.gold
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.arc(q.x, q.y, Math.max(6, 10 * cam.s), 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      }
      const lift = Math.max(20, 34 * cam.s)
      label(ctx, pal, 'tested', { x: P({ x: 390, y: 0 }).x, y: P(L.inbox).y - lift }, pal.gold, mono)
      label(ctx, pal, 'approved', { x: P({ x: 600, y: 0 }).x, y: P(L.inbox).y - lift }, pal.gold, mono)
      // One answer failed a check: it stops at the gate, in friction colour, and never reaches the sheet.
      const held = P({ x: 390, y: L.inbox.y + 48 })
      line(ctx, cam, [{ x: 390, y: L.inbox.y + 12 }, { x: 390, y: L.inbox.y + 34 }], pal.friction, 1.2, [3, 3])
      glyph(ctx, pal, 'message', held, clamp(cam.s * 19, 7, 18), pal.friction)
      label(ctx, pal, 'failed a check, held', { x: held.x, y: held.y + Math.max(16, 26 * cam.s) }, pal.friction, mono)
      if (!view.phone) {
        const lines = ['intake   filed a quote request', 'person   approved an invoice question', 'eval     answers checked against sources']
        const start = P({ x: 120, y: 520 })
        lines.forEach((t, i) => label(ctx, pal, t, { x: start.x, y: start.y + i * 16 }, i === 0 ? pal.text2 : pal.text3, mono, 'left'))
      }
      break
    }
    case 'ongoing': {
      // Launched, measured, improved: after go-live the waiting time is watched and the system grows a part.
      line(ctx, cam, [L.inbox, mid, L.sheet], pal.gold, 1.6)
      const spark = [0.9, 0.86, 0.7, 0.72, 0.5, 0.42, 0.3, 0.26].map((v, i) => ({ x: 150 + i * 46, y: 120 + (1 - v) * 90 }))  // falls to the right: less waiting
      line(ctx, cam, spark, pal.ok, 1.6)
      label(ctx, pal, 'time work waits', P({ x: 150, y: 100 }), pal.text3, mono, 'left')
      // A part added after launch: reminders, wired to the calendar, pulsing while it is new.
      const r = { x: L.cal.x, y: (L.cal.y + L.inv.y) / 2 - 8 }
      let rt = P({ x: r.x - 60, y: r.y - 20 }), rb = P({ x: r.x + 60, y: r.y + 20 })
      let link = [P({ x: r.x, y: r.y - 20 }), P({ x: L.cal.x, y: L.cal.y + 20 })]
      let note = P({ x: r.x - 10, y: r.y + 36 })
      if (view.phone) {
        // Phones: the gap between Calendar and Invoices is narrower than the label, so the new part sits on
        // the calendar's row, between the waiting-time chart and the calendar, wired to its left side.
        ctx.font = `500 ${mono + 1}px ${pal.mono}`
        const bw = ctx.measureText('reminders').width + 16, bh = mono + 12
        const c = P(L.cal), calLeft = c.x - stationSize(ctx, pal, LABELS.cal, cam.s, true).w / 2
        const lo = P(spark[spark.length - 1]).x + 6 + bw / 2, hi = calLeft - 12 - bw / 2
        const cx = Math.min(hi, (lo + hi) / 2)
        rt = { x: cx - bw / 2, y: c.y - bh / 2 }
        rb = { x: cx + bw / 2, y: c.y + bh / 2 }
        link = [{ x: rb.x, y: c.y }, { x: calLeft, y: c.y }]
        note = { x: cx, y: rt.y - 9 }
      }
      line(ctx, { s: 1, ox: 0, oy: 0 }, link, pal.gold, 1.3)
      ctx.save()
      ctx.globalAlpha *= 0.75 + 0.25 * Math.sin(time * 2)
      roundRect(ctx, rt.x, rt.y, rb.x - rt.x, rb.y - rt.y, 6)
      ctx.fillStyle = pal.panel
      ctx.fill()
      ctx.strokeStyle = pal.gold
      ctx.setLineDash([4, 3])
      ctx.lineWidth = 1.3
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()
      label(ctx, pal, 'reminders', { x: (rt.x + rb.x) / 2, y: (rt.y + rb.y) / 2 }, pal.text, mono + 1)
      label(ctx, pal, 'added after launch', note, pal.gold, mono)
      const y = 530
      line(ctx, cam, [{ x: 150, y }, { x: 850, y }], pal.line2)
      const marks = ['launch', 'measure', 'improve', 'next release']
      marks.forEach((m, i) => {
        const p = P({ x: 150 + i * (700 / 3), y })
        const live = i === marks.length - 1
        ctx.beginPath()
        ctx.arc(p.x, p.y, live ? 5 + Math.sin(time * 2) * 0.8 : 4, 0, Math.PI * 2)
        ctx.fillStyle = live ? pal.ok : pal.text3
        ctx.fill()
        label(ctx, pal, m, { x: p.x, y: p.y + 16 }, live ? pal.ok : pal.text3, mono)
      })
      break
    }
  }
  ctx.restore()
}

/**
 * Phones: station boxes keep a readable minimum size, so at small scales neighbours overlap (Inbox under
 * Spreadsheet in the websites layout at 390 px). Push overlapping boxes apart along the axis that needs the
 * smaller move, inside the canvas. L moves with them, so every line and overlay that reads it follows.
 */
function separate(ctx: CanvasRenderingContext2D, pal: Palette, L: Layout, cam: Cam, view: SceneView) {
  const gap = 2, pad = 4
  const ids = Object.keys(LABELS) as Id[]
  const size = Object.fromEntries(ids.map((id) => [id, stationSize(ctx, pal, LABELS[id], cam.s, true)])) as Record<Id, ReturnType<typeof stationSize>>
  const pos = Object.fromEntries(ids.map((id) => [id, S(cam, L[id])])) as Record<Id, Vec>
  const keepIn = (id: Id) => {
    pos[id].x = clamp(pos[id].x, pad + size[id].w / 2, view.w - pad - size[id].w / 2)
    pos[id].y = clamp(pos[id].y, pad + size[id].h / 2, view.h - pad - size[id].h / 2)
  }
  for (let pass = 0; pass < 12; pass++) {
    let moved = false
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = pos[ids[i]], b = pos[ids[j]]
        const ox = (size[ids[i]].w + size[ids[j]].w) / 2 + gap - Math.abs(a.x - b.x)
        const oy = (size[ids[i]].h + size[ids[j]].h) / 2 + gap - Math.abs(a.y - b.y)
        if (ox <= 0.5 || oy <= 0.5) continue
        moved = true
        if (ox <= oy) {
          const d = (ox / 2) * (a.x <= b.x ? 1 : -1)
          a.x -= d
          b.x += d
        } else {
          const d = (oy / 2) * (a.y <= b.y ? 1 : -1)
          a.y -= d
          b.y += d
        }
        keepIn(ids[i])
        keepIn(ids[j])
      }
    }
    if (!moved) break
  }
  for (const id of ids) L[id] = { x: (pos[id].x - cam.ox) / cam.s, y: (pos[id].y - cam.oy) / cam.s }
}

function hexNode(ctx: CanvasRenderingContext2D, pal: Palette, p: Vec, r: number, text: string) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6
    const x = p.x + Math.cos(a) * r, y = p.y + Math.sin(a) * r
    if (i) ctx.lineTo(x, y)
    else ctx.moveTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = pal.panel
  ctx.fill()
  ctx.strokeStyle = pal.gold
  ctx.lineWidth = 1.6
  ctx.stroke()
  label(ctx, pal, text, p, pal.gold, Math.max(9, Math.min(12, r * 0.42)))
}
