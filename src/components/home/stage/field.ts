/**
 * The business system field: one illustrative operation (five tools, work items moving between them)
 * that the homepage evolves through one global timeline G, one pinned stage, one block per act: the business
 * (G 0), the gap (1), the decision (2), the build (3), the deployment (4), the running system (5) and the
 * proof (6). Act n is the block at G = n - 1 (acts 1 to 7); the closing section after the page's other
 * sections is the epilogue, not an act. The hero adds a time-based intro, measured in seconds since the stage started, that runs once.
 *
 * Object permanence: every station and item on the first frame persists, transformed, until the whole
 * operation becomes one node in Daena's graph. Colour is state: gray = what exists, friction = a problem,
 * gold = MAS-AI intervention, cyan = information moving through what was built, ok = operational.
 *
 * Pure module: world data, a seeded simulation, layout by G and canvas drawing. No DOM access, so the live
 * stages and the reduced-motion stills share it.
 */

export type Vec = { x: number; y: number }
export type Rect = { x: number; y: number; w: number; h: number }
export type Kind = 'lead' | 'message' | 'row' | 'booking' | 'invoice'
export type Subject = 'quote request' | 'booking change' | 'invoice question'
export type Palette = Record<
  'ground' | 'panel' | 'panelHi' | 'line' | 'line2' | 'lineUi' | 'text' | 'text2' | 'text3' | 'gold' | 'goldDeep' | 'blue' | 'cyan' | 'ok' | 'friction',
  string
> & { sans: string; mono: string }
export type View = { w: number; h: number; phone: boolean; area: Rect; proof: Rect }
export type Lens = { x: number; y: number; r: number }
export type FieldEvent = { at: number; kind: 'filed' | 'review' | 'approved' | 'booked' | 'invoiced'; subject: Subject }

type StationId = 'leads' | 'inbox' | 'sheet' | 'cal' | 'inv'
type NodeId = StationId | 'svc' | 'person'
type EdgeId = 'e1' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7' | 'hop' | 'in' | 'out' | 'rev' | 'ret'

export const WORLD = { w: 1000, h: 620 }
/** Height over width of the Daena screenshot (public/work/daena-brain-demo-1600.webp, 1600 x 913). */
export const SHOT_ASPECT = 913 / 1600
/** Seconds the hero intro takes; reduced motion and a scrolled page jump straight to it. */
export const INTRO_END = 7.5
/** The rebuilt system takes over (queue drains through the new service) from this G. */
export const BUILT_AT = 2.62
/** From here uncertain cases stop for a person (act 6). */
const RUNS_AT = 4.1
/** Where the built system runs (act 5). The copy's picker sets it; the canvas draws the boundary. */
export type DeployMode = 'local' | 'private' | 'cloud' | 'hybrid'
export type Deploy = { mode: DeployMode; from: DeployMode; t: number }

const STATIONS: Record<StationId, { label: string; chaos: Vec; order: Vec; kind: Kind }> = {
  leads: { label: 'Leads', chaos: { x: 120, y: 150 }, order: { x: 90, y: 310 }, kind: 'lead' },
  inbox: { label: 'Inbox', chaos: { x: 360, y: 330 }, order: { x: 285, y: 310 }, kind: 'message' },
  sheet: { label: 'Spreadsheet', chaos: { x: 730, y: 170 }, order: { x: 700, y: 310 }, kind: 'row' },
  cal: { label: 'Calendar', chaos: { x: 850, y: 460 }, order: { x: 905, y: 205 }, kind: 'booking' },
  inv: { label: 'Invoices', chaos: { x: 480, y: 540 }, order: { x: 905, y: 415 }, kind: 'invoice' },
}
const SVC = { label: 'Intake', chaos: { x: 548, y: 262 }, order: { x: 492, y: 310 }, w: 170, h: 100 }
const PERSON = { x: 492, y: 122 }
const BOX = { w: 108, h: 40 }
const ROWS: [string, 'filed' | 'review'][] = [
  ['Quote', 'filed'],
  ['Booking', 'filed'],
  ['Invoice', 'review'],
]
const SUBJECTS: Subject[] = ['quote request', 'booking change', 'invoice question']

type Edge = { from: NodeId; to: NodeId; bend: [number, number, number, number]; kind: 'keep' | 'drop' | 'hop' | 'built' | 'review'; elbow?: boolean; label?: string }
const EDGES: Record<EdgeId, Edge> = {
  e1: { from: 'leads', to: 'inbox', bend: [170, -130, -150, 140], kind: 'keep', label: 'new lead' },
  e6: { from: 'leads', to: 'sheet', bend: [210, 270, -320, -50], kind: 'drop', label: 'copied by hand' },
  hop: { from: 'inbox', to: 'sheet', bend: [40, -170, -130, -70], kind: 'hop', label: 're-typed by hand' },
  e3: { from: 'sheet', to: 'cal', bend: [150, 40, -70, -210], kind: 'keep', elbow: true, label: 'booking' },
  e4: { from: 'sheet', to: 'inv', bend: [-40, 270, 270, -40], kind: 'keep', elbow: true, label: 'invoice' },
  e5: { from: 'cal', to: 'inv', bend: [-130, 120, 170, 10], kind: 'keep' },
  e7: { from: 'inv', to: 'inbox', bend: [-170, -20, 40, 190], kind: 'drop', label: 'chased by email' },
  in: { from: 'inbox', to: 'svc', bend: [0, 0, 0, 0], kind: 'built' },
  out: { from: 'svc', to: 'sheet', bend: [0, 0, 0, 0], kind: 'built' },
  rev: { from: 'svc', to: 'person', bend: [0, 0, 0, 0], kind: 'review' },
  ret: { from: 'person', to: 'sheet', bend: [0, 0, 0, 0], kind: 'review', elbow: true },
}
/** The order a diagnostic trace walks the wiring in act 2. */
const TRACE_ORDER: EdgeId[] = ['e1', 'e6', 'hop', 'e3', 'e4', 'e5', 'e7']

type Verdict = 'chosen' | 'rejected' | 'leave'
/** Act 3: every option is considered; the work picks the tool. Resolution order is list order; slot is
 *  the position in the decision record, which reads chosen first, ruled out last. */
const OPTIONS: { label: string; verdict: Verdict; slot: number }[] = [
  { label: 'Replace the tools', verdict: 'rejected', slot: 5 },
  { label: 'Build a new app', verdict: 'rejected', slot: 4 },
  { label: 'Add AI', verdict: 'rejected', slot: 3 },
  { label: 'Leave it alone', verdict: 'leave', slot: 2 },
  { label: 'Connect', verdict: 'chosen', slot: 0 },
  { label: 'Automate', verdict: 'chosen', slot: 1 },
]
const LEAVE_AT = OPTIONS.findIndex((o) => o.verdict === 'leave')
/** Phones: height kept free under the system for the two-row decision record. */
const PHONE_RECORD_H = 58

/**
 * Daena's org graph as fractions of the screenshot rect, measured (blob centroids) on the demo capture
 * daena-brain-demo 3200 x 1826: governance core, the six capabilities, the ten departments (Operations is
 * index 5).
 */
const TOPO = {
  core: [0.5812, 0.5906],
  faculties: [[0.5835, 0.5122], [0.624, 0.5539], [0.6243, 0.636], [0.5835, 0.6772], [0.5428, 0.636], [0.5428, 0.5534]],
  departments: [
    [0.5826, 0.4045], [0.6468, 0.4422], [0.6852, 0.5353], [0.686, 0.6527], [0.6467, 0.7471],
    [0.5831, 0.7834], [0.5203, 0.747], [0.4797, 0.6532], [0.4813, 0.5364], [0.5203, 0.4423],
  ],
  rings: [0.155, 0.176],
} as const
const OPS = 5

// ---------------------------------------------------------------- math

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpV = (a: Vec, b: Vec, t: number): Vec => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) })
export function smooth(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0))
  return t * t * (3 - 2 * t)
}
function bez(p0: Vec, p1: Vec, p2: Vec, p3: Vec, t: number): Vec {
  const u = 1 - t
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y }
}
/** Seeded PRNG (mulberry32) so every load and every still shows the same picture. */
function prng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---------------------------------------------------------------- phases

/**
 * Every scroll- and time-driven quantity. G is the story position (block k is centred at G = k). intro is
 * seconds since the hero started.
 */
export function phases(G: number, phone = false, intro = INTRO_END) {
  const push = phone ? 0.3 : 0.35
  return {
    friction: smooth(1.5, 3, intro),
    isolate: 0.45 * smooth(3, 4.5, intro) * (1 - smooth(0.1, 0.5, G)),
    lens: smooth(3, 4, intro) * (1 - smooth(0.8, 1.1, G)),
    trace: smooth(0.15, 0.85, G),
    labels: smooth(0.3, 0.7, G) * (1 - smooth(1.1, 1.4, G)),
    bracket: Math.max(smooth(6.2, 7.2, intro), smooth(0.5, 0.9, G)),
    options: smooth(1.15, 1.4, G) * (1 - smooth(2.25, 2.4, G)),
    judge: smooth(1.4, 1.85, G),
    toBuild: smooth(2.05, 2.35, G),
    focus: push * smooth(0.4, 0.9, G) + (1 - push) * smooth(2.05, 2.3, G) - smooth(3.1, 3.4, G),
    wire: smooth(2.1, 2.35, G),
    parts: smooth(2.35, 2.6, G),
    live: smooth(2.6, 2.78, G),
    order: smooth(2.62, 2.92, G),
    deploy: smooth(3.25, 3.65, G) * (1 - 0.6 * smooth(4.35, 4.7, G)) * (1 - smooth(5.0, 5.2, G)),
    runs: smooth(4.1, 4.45, G),
    shrink: smooth(5.1, 5.45, G),
    grow: smooth(5.2, 5.45, G),
    topo: smooth(5.2, 5.45, G) * (1 - smooth(5.7, 5.9, G)),
    ring: smooth(5.35, 5.55, G),
    world: 1 - smooth(5.4, 5.55, G),
    shot: smooth(5.55, 5.8, G),
  }
}
export type Phases = ReturnType<typeof phases>

// ---------------------------------------------------------------- simulation

type Item = { kind: Kind; subject: Subject; st: 'wait' | 'edge' | 'queue' | 'dwell'; edge: EdgeId; at: NodeId; s: number; timer: number }
export type Sim = { items: Item[]; queue: number[]; release: number; rnd: () => number; clock: number; events: FieldEvent[] }

const QMAX = 11
const SPEED = { chaos: 130, built: 210, hop: 55 }

export function createSim(count: number, seed = 7): Sim {
  const rnd = prng(seed)
  const items: Item[] = Array.from({ length: count }, (_, i) => ({
    kind: 'lead', subject: SUBJECTS[i % 3], st: 'wait', edge: 'e1', at: 'leads', s: 0, timer: i * 0.45 + rnd(),
  }))
  return { items, queue: [], release: 1.5, rnd, clock: 0, events: [] }
}

function send(it: Item, edge: EdgeId) {
  it.st = 'edge'
  it.edge = edge
  it.s = 0
}

function emit(sim: Sim, kind: FieldEvent['kind'], subject: Subject) {
  sim.events.push({ at: sim.clock, kind, subject })
  if (sim.events.length > 24) sim.events.shift()
}

function arrive(sim: Sim, id: number, node: NodeId, built: boolean) {
  const it = sim.items[id]
  if (node in STATIONS) it.kind = STATIONS[node as StationId].kind
  switch (node) {
    case 'inbox':
      if (built) send(it, 'in')
      else {
        it.st = 'queue'
        sim.queue.push(id)
      }
      return
    case 'svc':
    case 'person':
      it.st = 'dwell'
      it.at = node
      it.timer = node === 'svc' ? 0.3 : 0.9
      return
    case 'sheet':
      send(it, sim.rnd() < 0.6 ? 'e3' : 'e4')
      return
    case 'cal':
      if (built) emit(sim, 'booked', it.subject)
      send(it, 'e5')
      return
    case 'inv':
      if (built) emit(sim, 'invoiced', it.subject)
      if (!built && sim.rnd() < 0.25) send(it, 'e7')
      else {
        it.st = 'wait'
        it.timer = 0.4 + sim.rnd() * 1.8
      }
      return
    default:
      return
  }
}

function edgeSpeed(edge: EdgeId, built: boolean) {
  if (edge === 'hop') return SPEED.hop
  return built ? SPEED.built : SPEED.chaos
}

/** Advance the simulation. Geometry lengths come from the current layout so speed reads true on screen. */
export function stepSim(sim: Sim, dt: number, G: number) {
  const built = G >= BUILT_AT
  const lengths = edgeLengthsAt(G)
  sim.clock += dt
  sim.release -= dt
  if (sim.queue.length && sim.release <= 0) {
    const id = sim.queue.shift() as number
    send(sim.items[id], built ? 'in' : 'hop')
    sim.release = built ? 0.12 : 2.6
  }
  sim.items.forEach((it, id) => {
    if (it.st === 'wait') {
      it.timer -= dt
      if (it.timer <= 0 && (built || sim.queue.length < QMAX)) {
        it.kind = 'lead'
        it.subject = SUBJECTS[Math.floor(sim.rnd() * 3)]
        send(it, built || sim.rnd() < 0.72 ? 'e1' : 'e6')
      }
    } else if (it.st === 'dwell') {
      it.timer -= dt
      if (it.timer > 0) return
      it.kind = 'row'
      if (it.at === 'person') {
        emit(sim, 'approved', it.subject)
        send(it, 'ret')
      } else if (it.subject === 'invoice question' && G >= RUNS_AT) {
        emit(sim, 'review', it.subject)
        send(it, 'rev')
      } else {
        emit(sim, 'filed', it.subject)
        send(it, 'out')
      }
    } else if (it.st === 'edge') {
      it.s += (edgeSpeed(it.edge, built) * dt) / Math.max(1, lengths[it.edge])
      if (it.s >= 1) arrive(sim, id, EDGES[it.edge].to, built)
    }
  })
}

/** Run the simulation offline so the first frame (and every still) shows a formed system. */
export function prewarm(sim: Sim, seconds: number, G: number) {
  for (let i = 0; i < seconds * 30; i++) stepSim(sim, 1 / 30, G)
}

// ---------------------------------------------------------------- layout

type Layout = { pos: Record<NodeId, Vec>; k: number }

function layout(G: number): Layout {
  const k = phases(G).order
  const pos = {} as Record<NodeId, Vec>
  for (const id of Object.keys(STATIONS) as StationId[]) pos[id] = lerpV(STATIONS[id].chaos, STATIONS[id].order, k)
  pos.svc = lerpV(SVC.chaos, SVC.order, k)
  pos.person = lerpV({ x: SVC.chaos.x, y: SVC.chaos.y - 122 }, PERSON, k)
  return { pos, k }
}

function controls(L: Layout, e: Edge): [Vec, Vec, Vec, Vec] {
  const a = L.pos[e.from], b = L.pos[e.to]
  const mx = (a.x + b.x) / 2
  const order1 = e.elbow ? { x: mx, y: a.y } : lerpV(a, b, 1 / 3)
  const order2 = e.elbow ? { x: mx, y: b.y } : lerpV(a, b, 2 / 3)
  if (e.kind === 'built' || e.kind === 'review') return [a, order1, order2, b]
  const chaos1 = { x: a.x + e.bend[0], y: a.y + e.bend[1] }
  const chaos2 = { x: b.x + e.bend[2], y: b.y + e.bend[3] }
  return [a, lerpV(chaos1, order1, L.k), lerpV(chaos2, order2, L.k), b]
}

// layout(G) is pure, and prewarm (750 steps per stage at mount) and every frame at rest call stepSim at one G,
// so the edge lengths are computed once per G instead of once per step. Results are identical.
let lengthsG = Number.NaN
let lengthsMemo: Record<EdgeId, number> | null = null
function edgeLengthsAt(G: number): Record<EdgeId, number> {
  if (lengthsMemo === null || G !== lengthsG) {
    lengthsMemo = edgeLengths(layout(G))
    lengthsG = G
  }
  return lengthsMemo
}

function edgeLengths(L: Layout): Record<EdgeId, number> {
  const out = {} as Record<EdgeId, number>
  for (const id of Object.keys(EDGES) as EdgeId[]) {
    const c = controls(L, EDGES[id])
    let len = 0
    let prev = c[0]
    for (let i = 1; i <= 16; i++) {
      const p = bez(c[0], c[1], c[2], c[3], i / 16)
      len += Math.hypot(p.x - prev.x, p.y - prev.y)
      prev = p
    }
    out[id] = len
  }
  return out
}

function queueSlot(L: Layout, i: number): Vec {
  const inbox = L.pos.inbox
  return { x: inbox.x + BOX.w / 2 + 18 + (i % 3) * 21, y: inbox.y - BOX.h / 2 + 6 + Math.floor(i / 3) * 15 }
}

/** World rect around the friction itself: the queue and the start of the hand-off done by hand. */
function gapRect(L: Layout): Rect {
  const hop = controls(L, EDGES.hop)
  const pts = [queueSlot(L, 0), queueSlot(L, 11), ...[0.12, 0.24, 0.36].map((s) => bez(hop[0], hop[1], hop[2], hop[3], s))]
  const pad = 20
  const minX = Math.min(...pts.map((q) => q.x)) - pad, maxX = Math.max(...pts.map((q) => q.x)) + pad
  const minY = Math.min(...pts.map((q) => q.y)) - pad, maxY = Math.max(...pts.map((q) => q.y)) + pad
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
}

// ---------------------------------------------------------------- view and camera

/** Where the world is drawn and where the screenshot lands, for a stage of w x h CSS px. */
export function computeView(w: number, h: number): View {
  const phone = w < 900
  if (phone) {
    // The stage is a short opaque panel on phones (stage.css); the copy slides under it.
    const g = w < 400 ? 16 : 24
    const area = { x: g, y: 8, w: w - 2 * g, h: h - 16 }
    const pw = Math.min(area.w, area.h / SHOT_ASPECT)
    const ph = pw * SHOT_ASPECT
    return { w, h, phone, area, proof: { x: area.x + (area.w - pw) / 2, y: area.y + (area.h - ph) / 2, w: pw, h: ph } }
  }
  // Mirrors .wrap (max 1320, --gutter) and .stage__copy (min(42vw, 560px)) in stage.css.
  const gutter = clamp(9.6 + 0.018 * w, 16, 32)
  const wrapLeft = Math.max(0, (w - 1320) / 2) + gutter
  const copyRight = wrapLeft + Math.min(w * 0.42, 560)
  const area = { x: copyRight + 24, y: 40, w: w - gutter - copyRight - 24, h: h - 80 }
  const pw = Math.min(area.w, 640)
  const ph = pw * SHOT_ASPECT
  return { w, h, phone, area, proof: { x: area.x + (area.w - pw) / 2, y: area.y + (area.h - ph) / 2, w: pw, h: ph } }
}

type Cam = { cx: number; cy: number; s: number; ox: number; oy: number }

function topoPoint(v: View, f: readonly number[]): Vec {
  return { x: v.proof.x + f[0] * v.proof.w, y: v.proof.y + f[1] * v.proof.h }
}

function camera(v: View, P: Phases, L: Layout): Cam {
  const fit = Math.min(v.area.w / WORLD.w, v.area.h / WORLD.h) * 0.94
  const gap = lerpV(L.pos.inbox, L.pos.sheet, 0.5)
  // Phones zoom by a floor, not a ratio: short screens fit by height and would shrink the component.
  const zoom = v.phone ? Math.max(fit * 2, 0.64) : fit * 1.55
  const ox = v.area.x + v.area.w / 2
  // Phones: the system moves up and pulls back a little while the decision record is on screen.
  const room = v.phone ? P.options : 0
  const oy = v.area.y + (v.area.h - PHONE_RECORD_H * room) / 2
  const f = clamp(P.focus + (v.phone ? 0 : 0.2 * P.deploy))
  const cam = { cx: lerp(WORLD.w / 2, gap.x, f), cy: lerp(WORLD.h / 2, gap.y, f), s: lerp(fit, zoom, f) * (1 - 0.16 * room), ox, oy }
  if (P.shrink > 0) {
    // Pull back: the whole operation becomes Daena's Operations node.
    const ops = topoPoint(v, TOPO.departments[OPS])
    cam.s = fit * Math.pow(30 / WORLD.w / fit, P.shrink)
    cam.ox = lerp(ox, ops.x, P.shrink)
    cam.oy = lerp(oy, ops.y, P.shrink)
  }
  return cam
}

const toScreen = (c: Cam, p: Vec): Vec => ({ x: c.ox + (p.x - c.cx) * c.s, y: c.oy + (p.y - c.cy) * c.s })

function frame(v: View, G: number, intro = INTRO_END) {
  const P = phases(G, v.phone, intro)
  const L = layout(G)
  return { P, L, cam: camera(v, P, L) }
}

/** Screen position the lens rests on: the queue and the start of the hand-off done by hand. */
export function restPoint(v: View, G: number): Vec {
  const { L, cam } = frame(v, G)
  const hop = controls(L, EDGES.hop)
  return toScreen(cam, lerpV(queueSlot(L, 4), bez(hop[0], hop[1], hop[2], hop[3], 0.3), 0.4))
}

/** Screen bounds of the drawn system; the lens follows the pointer only inside it. */
export function contentRect(v: View, G: number, pad = 48): Rect {
  const { L, cam } = frame(v, G)
  const pts = (Object.keys(STATIONS) as StationId[]).map((id) => toScreen(cam, L.pos[id]))
  const xs = pts.map((q) => q.x), ys = pts.map((q) => q.y)
  const x = Math.min(...xs) - pad, y = Math.min(...ys) - pad
  return { x, y, w: Math.max(...xs) + pad - x, h: Math.max(...ys) + pad - y }
}

/** Screen rect of the gap bracket, so the DOM trace from the headline can land on it. */
export function gapScreenRect(v: View, G: number): Rect {
  const { L, cam } = frame(v, G)
  const r = gapRect(L)
  const tl = toScreen(cam, { x: r.x, y: r.y })
  return { x: tl.x, y: tl.y, w: r.w * cam.s, h: r.h * cam.s }
}

// ---------------------------------------------------------------- drawing helpers

/** Tokens are #rrggbb; canvas gets rgba() so alpha never depends on color-mix support. */
export function withAlpha(color: string, a: number) {
  const m = /^#([0-9a-f]{6})$/i.exec(color.trim())
  if (!m || a >= 1) return color
  const n = parseInt(m[1], 16)
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${clamp(a).toFixed(3)})`
}

function strokeCurve(ctx: CanvasRenderingContext2D, c: [Vec, Vec, Vec, Vec], cam: Cam, from = 0, to = 1) {
  const n = Math.max(2, Math.ceil(28 * (to - from)))
  ctx.beginPath()
  for (let i = 0; i <= n; i++) {
    const p = toScreen(cam, bez(c[0], c[1], c[2], c[3], from + (i / n) * (to - from)))
    if (i === 0) ctx.moveTo(p.x, p.y)
    else ctx.lineTo(p.x, p.y)
  }
  ctx.stroke()
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

export function glyph(ctx: CanvasRenderingContext2D, pal: Palette, kind: Kind, p: Vec, w: number, ink: string) {
  const h = w * 0.68
  const x = p.x - w / 2, y = p.y - h / 2
  roundRect(ctx, x, y, w, h, Math.min(3, w * 0.15))
  ctx.fillStyle = pal.ground
  ctx.fill()
  ctx.strokeStyle = ink
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.beginPath()
  if (kind === 'lead') {
    ctx.arc(p.x, p.y, w * 0.13, 0, Math.PI * 2)
    ctx.fillStyle = ink
    ctx.fill()
    return
  }
  if (kind === 'message') {
    ctx.moveTo(x + 1.5, y + 1.5)
    ctx.lineTo(p.x, p.y + h * 0.12)
    ctx.lineTo(x + w - 1.5, y + 1.5)
  } else if (kind === 'row') {
    ctx.moveTo(x + w * 0.2, p.y - h * 0.15)
    ctx.lineTo(x + w * 0.8, p.y - h * 0.15)
    ctx.moveTo(x + w * 0.2, p.y + h * 0.18)
    ctx.lineTo(x + w * 0.62, p.y + h * 0.18)
  } else if (kind === 'booking') {
    ctx.moveTo(x, y + h * 0.3)
    ctx.lineTo(x + w, y + h * 0.3)
    ctx.moveTo(p.x + w * 0.12, p.y + h * 0.16)
    ctx.arc(p.x, p.y + h * 0.16, w * 0.12, 0, Math.PI * 2)
  } else {
    for (let i = 0; i < 3; i++) {
      ctx.moveTo(x + w * 0.22, y + h * (0.3 + i * 0.2))
      ctx.lineTo(x + w * (i === 2 ? 0.5 : 0.78), y + h * (0.3 + i * 0.2))
    }
  }
  ctx.stroke()
}

/** A station: fixed-size label in screen space so it stays legible at every zoom. */
/** A station's box in canvas px: the world size at scale s, never smaller than its label needs. */
export function stationSize(ctx: CanvasRenderingContext2D, pal: Palette, label: string, s: number, phone: boolean) {
  const px = phone ? 11 : 12.5
  ctx.save()
  ctx.font = `600 ${px}px ${pal.sans}`
  const w = Math.max(BOX.w * s, ctx.measureText(label).width + 18)
  ctx.restore()
  return { w, h: Math.max(BOX.h * s, px + 12), px }
}

export function station(ctx: CanvasRenderingContext2D, pal: Palette, label: string, p: Vec, s: number, phone: boolean, opts: { alpha?: number; status?: number; stroke?: string } = {}) {
  const { w, h, px } = stationSize(ctx, pal, label, s, phone)
  ctx.save()
  ctx.globalAlpha *= opts.alpha ?? 1
  ctx.font = `600 ${px}px ${pal.sans}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  roundRect(ctx, p.x - w / 2, p.y - h / 2, w, h, 6)
  ctx.fillStyle = pal.panel
  ctx.fill()
  ctx.strokeStyle = opts.stroke ?? pal.line2
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = pal.text
  ctx.fillText(label, p.x, p.y + 0.5)
  if (opts.status && opts.status > 0.01) {
    ctx.globalAlpha *= opts.status
    ctx.beginPath()
    ctx.arc(p.x + w / 2 - 7, p.y - h / 2 + 7, 3, 0, Math.PI * 2)
    ctx.fillStyle = pal.ok
    ctx.fill()
  }
  ctx.restore()
  return { w, h }
}

function check(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + size * 0.35, y + size * 0.35)
  ctx.lineTo(x + size, y - size * 0.45)
  ctx.stroke()
}

// ---------------------------------------------------------------- drawing

type DrawOpts = { lens?: Lens | null; still?: boolean; intro?: number; deploy?: Deploy }

/**
 * Draw one frame of the story at global position G. Returns the phases so the caller can drive DOM
 * layers (the screenshot, the event log, the headline trace) from the same numbers.
 */
export function drawField(ctx: CanvasRenderingContext2D, v: View, pal: Palette, sim: Sim, G: number, opts: DrawOpts = {}): Phases {
  const { P, L, cam } = frame(v, G, opts.intro ?? INTRO_END)
  ctx.clearRect(0, 0, v.w, v.h)

  if (P.world > 0.001) {
    ctx.save()
    ctx.globalAlpha = P.world
    drawWorld(ctx, v, pal, sim, P, L, cam, opts)
    ctx.restore()
    if (!v.phone && !opts.still) {
      // The pushed-in world must never sit behind the copy column: fade it out at the area's left edge.
      const x0 = v.area.x - 56, x1 = v.area.x + 40
      const g = ctx.createLinearGradient(x0, 0, x1, 0)
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = g
      ctx.fillRect(0, 0, x1, v.h)
      ctx.restore()
    }
  }
  if (P.topo > 0.001) drawTopology(ctx, v, pal, P)
  return P
}

const nearGap = (n: NodeId) => n === 'inbox' || n === 'sheet' || n === 'svc' || n === 'person'

function dimFor(P: Phases, a: NodeId, b?: NodeId) {
  if (nearGap(a) && (b === undefined || nearGap(b))) return 1
  return Math.max(0.2, 1 - 0.72 * clamp(P.focus) - P.isolate)
}

function drawWorld(ctx: CanvasRenderingContext2D, v: View, pal: Palette, sim: Sim, P: Phases, L: Layout, cam: Cam, opts: DrawOpts) {
  const lens = opts.lens && P.lens > 0.01 ? opts.lens : null
  const mono = (px: number) => `500 ${px}px ${pal.mono}`
  const sans = (px: number, wt = 600) => `${wt} ${px}px ${pal.sans}`
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Paths. Chaos wiring is faint until the trace reveals it; the rebuilt system is legible.
  const drawEdges = (crisp: boolean) => {
    TRACE_ORDER.forEach((id, j) => {
      const e = EDGES[id]
      const c = controls(L, e)
      const exist = e.kind === 'drop' || e.kind === 'hop' ? 1 - L.k : 1
      if (exist <= 0.01) return
      const traced = clamp(P.trace * TRACE_ORDER.length - j)
      const dim = dimFor(P, e.from, e.to)
      if (e.kind === 'hop') {
        const a = crisp ? 0.95 : 0.1 + 0.25 * P.friction + 0.45 * Math.max(traced, P.bracket)
        ctx.strokeStyle = withAlpha(P.friction > 0.3 || crisp ? pal.friction : pal.text2, a * exist * dim)
        ctx.lineWidth = crisp ? 1.3 : 1.1
        ctx.setLineDash([3, 5])
      } else {
        const base = lerp(0.17, 0.6, L.k)
        const a = crisp ? 0.95 : Math.max(base, 0.5 * traced)
        ctx.strokeStyle = withAlpha(pal.text2, a * exist * dim)
        ctx.lineWidth = crisp ? 1.3 : 1
        ctx.setLineDash([])
      }
      strokeCurve(ctx, c, cam)
      ctx.setLineDash([])
      // The diagnostic trace: a short gold head walks each path once, in order.
      if (!crisp && traced > 0 && traced < 1) {
        ctx.strokeStyle = pal.gold
        ctx.lineWidth = 2
        strokeCurve(ctx, c, cam, Math.max(0, traced - 0.12), traced)
      }
    })
    if (crisp) return
    // What MAS-AI built: gold connections, drawn on when the system goes live.
    for (const id of ['in', 'out'] as EdgeId[]) {
      if (P.live <= 0) continue
      ctx.strokeStyle = pal.gold
      ctx.lineWidth = 1.6
      strokeCurve(ctx, controls(L, EDGES[id]), cam, 0, P.live)
    }
    if (P.runs > 0.01) {
      ctx.strokeStyle = withAlpha(pal.gold, 0.8 * P.runs)
      ctx.lineWidth = 1.2
      ctx.setLineDash([4, 4])
      for (const id of ['rev', 'ret'] as EdgeId[]) strokeCurve(ctx, controls(L, EDGES[id]), cam)
      ctx.setLineDash([])
    }
  }
  drawEdges(false)

  // Path annotations appear while the trace reads the wiring (act 2).
  if (P.labels > 0.01 && L.k < 0.5) {
    ctx.font = mono(v.phone ? 9.5 : 10.5)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    TRACE_ORDER.forEach((id, j) => {
      const e = EDGES[id]
      if (!e.label || clamp(P.trace * TRACE_ORDER.length - j) < 0.6) return
      if (v.phone && e.kind !== 'hop') return
      const c = controls(L, e)
      const p = toScreen(cam, bez(c[0], c[1], c[2], c[3], e.kind === 'hop' ? 0.3 : 0.5))
      ctx.fillStyle = withAlpha(e.kind === 'hop' ? pal.friction : pal.text3, P.labels * dimFor(P, e.from, e.to))
      ctx.fillText(e.label, p.x, p.y - 10)
    })
  }

  // Items travelling, dwelling or queued.
  const itemW = clamp(cam.s * 19, 7, 22)
  const itemPos: (Vec | null)[] = sim.items.map((it, id) => {
    if (it.st === 'wait') return null
    if (it.st === 'queue') {
      const slot = sim.queue.indexOf(id)
      return slot < 12 ? toScreen(cam, queueSlot(L, slot)) : null
    }
    if (it.st === 'dwell') return toScreen(cam, L.pos[it.at])
    const c = controls(L, EDGES[it.edge])
    return toScreen(cam, bez(c[0], c[1], c[2], c[3], clamp(it.s)))
  })
  sim.items.forEach((it, id) => {
    const p = itemPos[id]
    if (!p) return
    const e = EDGES[it.edge]
    const onBuilt = it.st === 'edge' && (e.kind === 'built' || e.kind === 'review')
    let ink = pal.text2
    let a = it.st === 'edge' ? dimFor(P, e.from, e.to) : 1
    if (it.st === 'queue') {
      ink = P.friction > 0.5 ? pal.friction : pal.text2
      a = 1
    } else if (onBuilt) ink = pal.cyan
    glyph(ctx, pal, it.kind, p, itemW, withAlpha(ink, a))
  })

  if (P.deploy > 0.01 && opts.deploy) drawDeploy(ctx, v, pal, P, cam, opts.deploy, mono)

  // Stations. They stay: the build connects to them, it does not replace them.
  for (const id of Object.keys(STATIONS) as StationId[]) {
    // "Leave it alone" marks the two tools that already work, while the record is on screen.
    const left = (id === 'cal' || id === 'inv') && P.options > 0.5 && smooth(LEAVE_AT / OPTIONS.length, (LEAVE_AT + 0.7) / OPTIONS.length, P.judge) > 0.5
    station(ctx, pal, STATIONS[id].label, toScreen(cam, L.pos[id]), cam.s, v.phone, { alpha: dimFor(P, id), status: P.runs, stroke: left ? pal.ok : undefined })
  }

  // Queue count at the stalled hand-off.
  const waiting = sim.queue.length
  if (waiting > 0 && L.k < 0.98) {
    const q = toScreen(cam, queueSlot(L, 0))
    ctx.font = mono(v.phone ? 10 : 11)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = withAlpha(P.friction > 0.5 ? pal.friction : pal.text2, (0.5 + 0.5 * P.friction) * (1 - L.k) * (1 - P.wire))
    ctx.fillText(`${waiting} waiting`, q.x - itemW / 2, q.y - itemW * 0.68 - 8)
  }

  drawBuild(ctx, v, pal, P, L, cam, sans, mono)
  drawPerson(ctx, v, pal, P, L, cam, sim, mono)
  drawOptions(ctx, v, pal, P, L, cam, sans)

  // The lens: clip to a circle and redraw what it reveals.
  if (lens) {
    ctx.save()
    ctx.globalAlpha *= P.lens
    ctx.beginPath()
    ctx.arc(lens.x, lens.y, lens.r, 0, Math.PI * 2)
    ctx.clip()
    drawEdges(true)
    ctx.font = mono(10)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const hop = controls(L, EDGES.hop)
    const mid = toScreen(cam, bez(hop[0], hop[1], hop[2], hop[3], 0.3))
    // Subject labels are placed greedily: one that would touch a placed label (or the hand-off label)
    // is skipped, so items bunched on one edge never print over each other.
    const hopW = ctx.measureText('re-typed by hand').width
    const taken: Rect[] = L.k < 0.9 ? [{ x: mid.x - hopW / 2, y: mid.y - 20, w: hopW, h: 16 }] : []
    const hits = (a: Rect) => taken.some((b) => a.x < b.x + b.w + 4 && b.x < a.x + a.w + 4 && a.y < b.y + b.h + 2 && b.y < a.y + a.h + 2)
    sim.items.forEach((it, id) => {
      const p = itemPos[id]
      if (!p || Math.hypot(p.x - lens.x, p.y - lens.y) > lens.r - 6) return
      glyph(ctx, pal, it.kind, p, itemW, it.st === 'queue' ? pal.friction : pal.text)
      if (it.st !== 'queue' && !v.phone) {
        const box = { x: p.x + itemW / 2 + 5, y: p.y - 8, w: ctx.measureText(it.subject).width, h: 16 }
        if (hits(box)) return
        taken.push(box)
        ctx.fillStyle = pal.text2
        ctx.fillText(it.subject, box.x, p.y)
      }
    })
    if (L.k < 0.9) {
      ctx.fillStyle = pal.friction
      ctx.textAlign = 'center'
      ctx.fillText('re-typed by hand', mid.x, mid.y - 12)
    }
    ctx.restore()

    ctx.save()
    ctx.globalAlpha *= P.lens
    ctx.strokeStyle = pal.lineUi
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(lens.x, lens.y, lens.r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.strokeStyle = pal.gold
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2
      ctx.moveTo(lens.x + Math.cos(a) * (lens.r - 7), lens.y + Math.sin(a) * (lens.r - 7))
      ctx.lineTo(lens.x + Math.cos(a) * (lens.r + 5), lens.y + Math.sin(a) * (lens.r + 5))
    }
    ctx.stroke()
    ctx.restore()
  }
}

/** Gap bracket -> drafting wireframe -> working component. One object, three states. */
function drawBuild(
  ctx: CanvasRenderingContext2D,
  v: View,
  pal: Palette,
  P: Phases,
  L: Layout,
  cam: Cam,
  sans: (px: number, wt?: number) => string,
  mono: (px: number) => string,
) {
  if (P.bracket <= 0.001) return
  const from = gapRect(L)
  const to = { x: L.pos.svc.x - SVC.w / 2, y: L.pos.svc.y - SVC.h / 2, w: SVC.w, h: SVC.h }
  const r = { x: lerp(from.x, to.x, P.wire), y: lerp(from.y, to.y, P.wire), w: lerp(from.w, to.w, P.wire), h: lerp(from.h, to.h, P.wire) }
  const tl = toScreen(cam, { x: r.x, y: r.y })
  const w = r.w * cam.s, h = r.h * cam.s
  const fontPx = cam.s >= 0.4 ? clamp(Math.round(cam.s * 12), 9, 12) : 0

  // Corner brackets draw on, then the wireframe outline takes over.
  const arm = Math.max(10, 20 * cam.s) * P.bracket
  ctx.strokeStyle = pal.gold
  ctx.lineWidth = 1.6
  ctx.setLineDash([])
  ctx.beginPath()
  const corners: [number, number, number, number][] = [
    [tl.x, tl.y, 1, 1], [tl.x + w, tl.y, -1, 1], [tl.x, tl.y + h, 1, -1], [tl.x + w, tl.y + h, -1, -1],
  ]
  for (const [x, y, dx, dy] of corners) {
    ctx.moveTo(x + dx * arm, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x, y + dy * arm)
  }
  ctx.stroke()

  if (P.wire < 0.02 && P.bracket > 0.4) {
    ctx.font = mono(v.phone ? 10 : 11)
    ctx.fillStyle = withAlpha(pal.gold, smooth(0.5, 0.8, P.bracket))
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('the gap', tl.x, tl.y - 8)
  }
  if (P.wire <= 0.001) return

  // Drafting wireframe with dimension ticks.
  ctx.save()
  ctx.globalAlpha *= P.wire * (1 - P.live * 0.6)
  ctx.setLineDash([4, 4])
  ctx.lineWidth = 1
  ctx.strokeRect(tl.x, tl.y, w, h)
  ctx.setLineDash([])
  ctx.beginPath()
  const tick = 6
  for (const x of [tl.x, tl.x + w / 2, tl.x + w]) {
    ctx.moveTo(x, tl.y - 10 - tick / 2)
    ctx.lineTo(x, tl.y - 10 + tick / 2)
  }
  ctx.moveTo(tl.x, tl.y - 10)
  ctx.lineTo(tl.x + w, tl.y - 10)
  for (const y of [tl.y, tl.y + h / 2, tl.y + h]) {
    ctx.moveTo(tl.x - 10 - tick / 2, y)
    ctx.lineTo(tl.x - 10 + tick / 2, y)
  }
  ctx.moveTo(tl.x - 10, tl.y)
  ctx.lineTo(tl.x - 10, tl.y + h)
  ctx.moveTo(tl.x + w / 2 - 5, tl.y + h / 2)
  ctx.lineTo(tl.x + w / 2 + 5, tl.y + h / 2)
  ctx.moveTo(tl.x + w / 2, tl.y + h / 2 - 5)
  ctx.lineTo(tl.x + w / 2, tl.y + h / 2 + 5)
  ctx.stroke()
  ctx.restore()
  if (P.parts <= 0.001) return

  // The component: header, three rows with status chips, then a solid gold outline once live.
  ctx.save()
  ctx.globalAlpha *= P.parts
  roundRect(ctx, tl.x, tl.y, w, h, 8)
  ctx.fillStyle = pal.panel
  ctx.fill()
  const head = Math.max(16, 24 * cam.s)
  ctx.beginPath()
  ctx.roundRect(tl.x, tl.y, w, head, [8, 8, 0, 0])
  ctx.fillStyle = pal.panelHi
  ctx.fill()
  ctx.restore()

  const rowH = (h - head) / 3
  if (fontPx >= 8) {
    ctx.save()
    ctx.globalAlpha *= P.parts
    ctx.font = sans(fontPx)
    ctx.fillStyle = pal.text
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(SVC.label, tl.x + 10, tl.y + head / 2 + 0.5)
    // Live status in the header once it runs.
    if (P.runs > 0.01) {
      ctx.globalAlpha *= P.runs
      ctx.font = mono(Math.max(8, fontPx - 2.5))
      ctx.fillStyle = pal.ok
      ctx.textAlign = 'right'
      ctx.fillText('running', tl.x + w - 10, tl.y + head / 2 + 0.5)
    }
    ctx.restore()
  }
  ROWS.forEach(([label, status], i) => {
    const a = smooth(0.2 + i * 0.22, 0.55 + i * 0.22, P.parts)
    if (a <= 0) return
    const y = tl.y + head + rowH * i + rowH / 2
    ctx.save()
    ctx.globalAlpha *= a
    if (i > 0) {
      ctx.strokeStyle = pal.line2
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(tl.x + 8, y - rowH / 2)
      ctx.lineTo(tl.x + w - 8, y - rowH / 2)
      ctx.stroke()
    }
    if (fontPx >= 8) {
      ctx.font = sans(fontPx - 1, 500)
      ctx.fillStyle = pal.text2
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, tl.x + 10, y + 0.5)
      ctx.font = mono(Math.max(8, fontPx - 2.5))
      const cw = ctx.measureText(status).width + 12
      const ch = fontPx + 4
      roundRect(ctx, tl.x + w - 10 - cw, y - ch / 2, cw, ch, 4)
      const done = status === 'filed' && P.live > 0.5
      ctx.fillStyle = done ? pal.ok : pal.panel
      ctx.fill()
      ctx.strokeStyle = done ? pal.ok : status === 'review' && P.live > 0.5 ? pal.gold : pal.lineUi
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = done ? pal.ground : pal.text2
      ctx.textAlign = 'center'
      ctx.fillText(status, tl.x + w - 10 - cw / 2, y + 0.5)
    }
    ctx.restore()
  })

  ctx.save()
  roundRect(ctx, tl.x, tl.y, w, h, 8)
  ctx.strokeStyle = withAlpha(pal.gold, 0.35 + 0.65 * P.live)
  ctx.lineWidth = 1.4
  ctx.stroke()
  ctx.restore()
}

/** Act 6: uncertain work stops for a person before it continues. */
function drawPerson(ctx: CanvasRenderingContext2D, v: View, pal: Palette, P: Phases, L: Layout, cam: Cam, sim: Sim, mono: (px: number) => string) {
  if (P.runs <= 0.01) return
  const p = toScreen(cam, L.pos.person)
  const r = Math.max(11, 15 * cam.s)
  const busy = sim.items.some((it) => it.st === 'dwell' && it.at === 'person')
  ctx.save()
  ctx.globalAlpha *= P.runs
  ctx.beginPath()
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
  ctx.fillStyle = pal.panel
  ctx.fill()
  ctx.strokeStyle = busy ? pal.gold : pal.lineUi
  ctx.lineWidth = busy ? 1.6 : 1
  ctx.stroke()
  // Head and shoulders.
  ctx.strokeStyle = pal.text
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.arc(p.x, p.y - r * 0.22, r * 0.26, 0, Math.PI * 2)
  ctx.moveTo(p.x - r * 0.5, p.y + r * 0.55)
  ctx.quadraticCurveTo(p.x, p.y + r * 0.02, p.x + r * 0.5, p.y + r * 0.55)
  ctx.stroke()
  ctx.font = mono(v.phone ? 9.5 : 10.5)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = busy ? pal.gold : pal.text3
  ctx.fillText(busy ? 'a person approves' : 'approval step', p.x + r + 8, p.y)
  ctx.restore()
}

/**
 * Act 3: a decision record under the system. Six options appear, are judged one by one (ruled out,
 * left alone, chosen), and the chosen ones move into the build. One row when it fits, else two.
 */
function drawOptions(ctx: CanvasRenderingContext2D, v: View, pal: Palette, P: Phases, L: Layout, cam: Cam, sans: (px: number, wt?: number) => string) {
  if (P.options <= 0.001) return
  const svc = toScreen(cam, L.pos.svc)
  const px = v.phone ? 10 : 12
  const pad = v.phone ? 7 : 9, gap = v.phone ? 6 : 10, h = px + 12, rowGap = 8
  const markW = px + 4
  ctx.save()
  ctx.font = sans(px)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  // Final widths from the start (check mark included), so nothing shifts when a verdict lands.
  const bySlot = [...OPTIONS].sort((a, b) => a.slot - b.slot)
  const widths = bySlot.map((o) => ctx.measureText(o.label).width + pad * 2 + (o.verdict === 'rejected' ? 0 : markW))
  const cols = widths.reduce((a, b) => a + b, 0) + gap * 5 <= v.area.w - 32 ? 6 : 3
  const rows = OPTIONS.length / cols
  const rowW = (r: number) => widths.slice(r * cols, r * cols + cols).reduce((a, b) => a + b, 0) + gap * (cols - 1)
  const bottom = v.area.y + v.area.h - (v.phone ? 2 : 16)
  OPTIONS.forEach((o, i) => {
    const appear = smooth(o.slot * 0.1, o.slot * 0.1 + 0.5, P.options)
    if (appear <= 0) return
    const resolved = smooth(i / OPTIONS.length, (i + 0.7) / OPTIONS.length, P.judge)
    const r = Math.floor(o.slot / cols)
    let x = v.area.x + (v.area.w - rowW(r)) / 2
    for (let k = r * cols; k < o.slot; k++) x += widths[k] + gap
    let y = bottom - (rows - 1 - r) * (h + rowGap) - h / 2
    const w = widths[o.slot]
    let alpha = appear * P.options
    if (o.verdict === 'chosen') {
      // Desktop: the chosen options travel into the gap as the build starts. Phones: they fade in place.
      if (!v.phone) {
        x = lerp(x, svc.x - w / 2, P.toBuild)
        y = lerp(y, svc.y, P.toBuild)
      }
      alpha *= 1 - P.toBuild
    }
    if (o.verdict === 'rejected') alpha *= 1 - 0.45 * resolved
    if (alpha <= 0.01) return
    const chosen = o.verdict === 'chosen' && resolved > 0.5
    const leave = o.verdict === 'leave' && resolved > 0.5
    const rejected = o.verdict === 'rejected' && resolved > 0.5
    const tw = ctx.measureText(o.label).width
    ctx.save()
    ctx.globalAlpha *= alpha
    roundRect(ctx, x, y - h / 2, w, h, 6)
    ctx.fillStyle = chosen ? pal.gold : pal.ground
    ctx.fill()
    ctx.strokeStyle = chosen ? pal.gold : leave ? pal.ok : rejected ? pal.line2 : pal.lineUi
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = chosen ? pal.ground : leave ? pal.ok : rejected ? pal.text3 : pal.text
    ctx.fillText(o.label, chosen || leave ? x + pad + markW : x + (w - tw) / 2, y + 0.5)
    if (chosen || leave) check(ctx, x + pad, y, px * 0.7, chosen ? pal.ground : pal.ok)
    if (rejected) {
      ctx.strokeStyle = pal.text3
      ctx.beginPath()
      ctx.moveTo(x + 7, y)
      ctx.lineTo(x + w - 7, y)
      ctx.stroke()
    }
    ctx.restore()
  })
  ctx.restore()
}

/** A flat-bottomed cloud inside (x, y, w, h), screen space. */
function cloudPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const b = y + h
  ctx.beginPath()
  ctx.moveTo(x + w * 0.12, b)
  ctx.lineTo(x + w * 0.88, b)
  ctx.bezierCurveTo(x + w * 1.02, b, x + w * 1.03, y + h * 0.42, x + w * 0.85, y + h * 0.4)
  ctx.bezierCurveTo(x + w * 0.86, y + h * 0.02, x + w * 0.57, y - h * 0.06, x + w * 0.5, y + h * 0.17)
  ctx.bezierCurveTo(x + w * 0.41, y - h * 0.02, x + w * 0.15, y + h * 0.08, x + w * 0.17, y + h * 0.42)
  ctx.bezierCurveTo(x - w * 0.02, y + h * 0.44, x - w * 0.03, b, x + w * 0.12, b)
  ctx.closePath()
}

function padlock(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.3
  ctx.strokeRect(x, y + s * 0.45, s, s * 0.55)
  ctx.beginPath()
  ctx.arc(x + s / 2, y + s * 0.45, s * 0.3, Math.PI, 0)
  ctx.stroke()
}

/**
 * Act 5: where the built system runs. Each mode has its own shape so the four read apart at a glance:
 * local = a solid boundary (your premises), private cloud = a cloud with a lock (your account), cloud = a
 * dashed cloud (public), hybrid = data and model inside your boundary, the rest in a cloud, one gated link.
 */
function drawDeploy(ctx: CanvasRenderingContext2D, v: View, pal: Palette, P: Phases, cam: Cam, d: Deploy, mono: (px: number) => string) {
  const px = v.phone ? 9.5 : 11
  const S = (p: Vec) => toScreen(cam, p)
  const o = SVC.order
  const one = (mode: DeployMode, a: number) => {
    if (a <= 0.01) return
    ctx.save()
    ctx.globalAlpha *= a * P.deploy
    ctx.font = mono(px)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.lineWidth = 1.4
    const label = (text: string, x: number, y: number, color = pal.text2) => {
      ctx.fillStyle = color
      ctx.fillText(text, x, y)
    }
    if (mode === 'local') {
      const tl = S({ x: o.x - 125, y: o.y - 88 }), br = S({ x: o.x + 125, y: o.y + 82 })
      roundRect(ctx, tl.x, tl.y, br.x - tl.x, br.y - tl.y, 10)
      ctx.strokeStyle = pal.lineUi
      ctx.stroke()
      label('your devices', tl.x + 2, tl.y - px - 6)
    } else if (mode === 'private' || mode === 'cloud') {
      const tl = S({ x: o.x - 170, y: o.y - 150 }), br = S({ x: o.x + 170, y: o.y + 80 })
      cloudPath(ctx, tl.x, tl.y, br.x - tl.x, br.y - tl.y)
      ctx.strokeStyle = mode === 'private' ? pal.lineUi : pal.cyan
      ctx.setLineDash(mode === 'cloud' ? [5, 5] : [])
      ctx.stroke()
      ctx.setLineDash([])
      const cx = (tl.x + br.x) / 2, ty = tl.y - px - 8
      ctx.textAlign = 'center'
      if (mode === 'private') {
        const w = ctx.measureText('your cloud account').width
        padlock(ctx, cx - w / 2 - 15, ty - 1, 10, pal.text2)
        label('your cloud account', cx, ty)
      } else label('public cloud', cx, ty, pal.cyan)
    } else {
      // Hybrid: the intake runs in a cloud; data and model stay in a boundary below, through one gate.
      const tl = S({ x: o.x - 150, y: o.y - 132 }), br = S({ x: o.x + 150, y: o.y + 72 })
      cloudPath(ctx, tl.x, tl.y, br.x - tl.x, br.y - tl.y)
      ctx.strokeStyle = pal.cyan
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])
      ctx.textAlign = 'center'
      label('cloud', (tl.x + br.x) / 2, tl.y - px - 8, pal.cyan)
      const chip = S({ x: o.x, y: o.y + 205 })
      const lt = S({ x: o.x - 120, y: o.y + 160 }), lb = S({ x: o.x + 120, y: o.y + 250 })
      roundRect(ctx, lt.x, lt.y, lb.x - lt.x, lb.y - lt.y, 10)
      ctx.strokeStyle = pal.lineUi
      ctx.stroke()
      ctx.textAlign = 'left'
      label('your devices', lt.x + 2, lb.y + 5)
      ctx.font = `600 ${v.phone ? 10 : 11.5}px ${pal.sans}`
      const cw = ctx.measureText('data + model').width + 18, ch = v.phone ? 20 : 24
      roundRect(ctx, chip.x - cw / 2, chip.y - ch / 2 + 4, cw, ch, 6)
      ctx.fillStyle = pal.panel
      ctx.fill()
      ctx.strokeStyle = pal.line2
      ctx.stroke()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      label('data + model', chip.x, chip.y + 4.5, pal.text)
      // The gated link: the only way between the two sides.
      const top = S({ x: o.x, y: o.y + SVC.h / 2 }), gate = S({ x: o.x, y: o.y + 118 })
      ctx.strokeStyle = pal.cyan
      ctx.beginPath()
      ctx.moveTo(top.x, top.y)
      ctx.lineTo(chip.x, chip.y - ch / 2 + 4)
      ctx.stroke()
      const g = v.phone ? 9 : 12
      roundRect(ctx, gate.x - g / 2, gate.y - g / 2, g, g, 2)
      ctx.fillStyle = pal.ground
      ctx.fill()
      ctx.strokeStyle = pal.gold
      ctx.stroke()
      check(ctx, gate.x - g * 0.3, gate.y, g * 0.6, pal.gold)
    }
    ctx.restore()
  }
  one(d.from, d.from === d.mode ? 0 : 1 - d.t)
  one(d.mode, d.from === d.mode ? 1 : d.t)
}

/** Daena's org graph drawn at the exact positions of the screenshot, so the photo can take over. */
function drawTopology(ctx: CanvasRenderingContext2D, v: View, pal: Palette, P: Phases) {
  const pt = (f: readonly number[]) => topoPoint(v, f)
  const core = pt(TOPO.core)
  const unit = v.proof.w / 960
  ctx.save()
  ctx.globalAlpha = P.topo
  ctx.lineCap = 'round'

  const ringDots: Vec[] = []
  TOPO.rings.forEach((rf, ri) => {
    const n = ri === 0 ? 38 : 46
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ri * 0.07
      ringDots.push({ x: core.x + Math.cos(a) * rf * v.proof.w, y: core.y + Math.sin(a) * rf * v.proof.w * 0.94 })
    }
  })

  ctx.strokeStyle = withAlpha(pal.text2, 0.16 * P.ring)
  ctx.lineWidth = 0.8
  ctx.beginPath()
  TOPO.departments.forEach((d) => {
    const p = pt(d)
    ringDots
      .map((r) => ({ r, d: Math.hypot(r.x - p.x, r.y - p.y) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 4)
      .forEach(({ r }) => {
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(r.x, r.y)
      })
  })
  ctx.stroke()
  ctx.fillStyle = withAlpha(pal.text3, P.ring)
  for (const r of ringDots) {
    ctx.beginPath()
    ctx.arc(r.x, r.y, Math.max(1.2, 2.2 * unit), 0, Math.PI * 2)
    ctx.fill()
  }

  const grow = smooth(0, 0.7, P.grow)
  ctx.strokeStyle = withAlpha(pal.gold, 0.45)
  ctx.lineWidth = 1
  ctx.beginPath()
  for (const f of [...TOPO.faculties, ...TOPO.departments]) {
    const p = pt(f)
    ctx.moveTo(core.x, core.y)
    ctx.lineTo(lerp(core.x, p.x, grow), lerp(core.y, p.y, grow))
  }
  ctx.stroke()

  TOPO.departments.forEach((d, i) => {
    const p = pt(d)
    ctx.beginPath()
    ctx.arc(p.x, p.y, Math.max(3.5, (i === OPS ? 8 : 6) * unit), 0, Math.PI * 2)
    ctx.fillStyle = pal.ground
    ctx.fill()
    ctx.strokeStyle = i === OPS ? pal.gold : pal.text2
    ctx.lineWidth = i === OPS ? 1.6 : 1
    ctx.stroke()
  })
  ctx.fillStyle = pal.gold
  for (const f of TOPO.faculties) {
    const p = pt(f)
    ctx.beginPath()
    ctx.arc(p.x, p.y, Math.max(2.5, 5 * unit), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.beginPath()
  ctx.arc(core.x, core.y, Math.max(5, 12 * unit), 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}
