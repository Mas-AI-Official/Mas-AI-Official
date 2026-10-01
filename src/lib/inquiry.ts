/**
 * Pure logic for the /start/ inquiry: options, validation, payload, response interpretation, mailto.
 * No React and no DOM, so it runs under node:test (src/lib/inquiry.test.ts).
 *
 * The rule that matters: an inquiry counts as SENT only when the HTTP response is 2xx AND the body
 * parses as JSON AND `success` is true or 'true'. Everything else is a failure that keeps the
 * visitor's input and offers a way to still reach us.
 */
import { COMPANY } from '../content/facts.ts'

export const INQUIRY_ENDPOINT = `https://formsubmit.co/ajax/${COMPANY.email}`
export const INQUIRY_SUBJECT = 'New inquiry from mas-ai.co'
export const STEP_COUNT = 4

export type Option = { id: string; label: string }

export const TOOL_OPTIONS: Option[] = [
  { id: 'email', label: 'Email' },
  { id: 'spreadsheets', label: 'Spreadsheets' },
  { id: 'crm', label: 'CRM' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'accounting', label: 'Accounting' },
  { id: 'website', label: 'Website' },
  { id: 'database', label: 'Custom database' },
  { id: 'erp', label: 'ERP or inventory' },
  { id: 'documents', label: 'Shared files and documents' },
  { id: 'other', label: 'Other' },
]

export const DATA_OPTIONS: Option[] = [
  { id: 'own', label: 'On our own servers or devices' },
  { id: 'private', label: 'In our own cloud account' },
  { id: 'cloud', label: 'A cloud service is fine' },
  { id: 'hybrid', label: 'A mix of both' },
  { id: 'unsure', label: 'Help me decide' },
]

export const HARDWARE_OPTIONS: Option[] = [
  { id: 'have', label: 'We have hardware to use' },
  { id: 'need', label: 'We may need new hardware' },
  { id: 'none', label: 'No hardware needed' },
  { id: 'unsure', label: 'Help me decide' },
]

export const TIMELINE_OPTIONS: Option[] = [
  { id: 'exploring', label: 'Exploring' },
  { id: '3-months', label: 'Within 3 months' },
  { id: '1-month', label: 'Within a month' },
]

export type Inquiry = {
  /** Id of the chosen "what are you trying to improve" chip. */
  needId: string
  /** Human label of that chip, as shown to the visitor. */
  need: string
  today: string
  tools: string[]
  /** Optional free text: systems not covered by the tool chips. */
  systems: string
  dataId: string
  hardwareId: string
  timelineId: string
  company: string
  size: string
  name: string
  email: string
  phone: string
  /** utm_* labels of the link that brought the visitor (lib/attribution), or ''. */
  campaign: string
}

export const EMPTY_INQUIRY: Inquiry = {
  needId: '',
  need: '',
  today: '',
  tools: [],
  systems: '',
  dataId: '',
  hardwareId: '',
  timelineId: '',
  company: '',
  size: '',
  name: '',
  email: '',
  phone: '',
  campaign: '',
}

export type FieldKey = 'need' | 'today' | 'name' | 'email'
export type FieldErrors = Partial<Record<FieldKey, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

/** The four required fields, by step. Steps are zero based. Step 2 (context) has none. */
export function validateStep(step: number, d: Inquiry): FieldErrors {
  const errors: FieldErrors = {}
  if (step === 0 && !d.needId) {
    errors.need = 'Choose the closest match. "Not sure yet" is a fine answer.'
  }
  if (step === 1 && !d.today.trim()) {
    errors.today = 'Describe what happens today in a sentence or two.'
  }
  if (step === 3) {
    if (!d.name.trim()) errors.name = 'Enter your name.'
    if (!d.email.trim()) errors.email = 'Enter your email so we can reply.'
    else if (!isValidEmail(d.email)) errors.email = 'That email address does not look right. Check it for typos.'
  }
  return errors
}

/** Every required field across all steps. Returns the first step that has an error, or -1. */
export function validateAll(d: Inquiry): { errors: FieldErrors; firstStep: number } {
  const errors: FieldErrors = {}
  let firstStep = -1
  for (let s = 0; s < STEP_COUNT; s++) {
    const e = validateStep(s, d)
    if (Object.keys(e).length > 0) {
      Object.assign(errors, e)
      if (firstStep === -1) firstStep = s
    }
  }
  return { errors, firstStep }
}

function labelFor(options: Option[], id: string): string {
  return options.find((o) => o.id === id)?.label ?? ''
}

const NOT_GIVEN = 'Not given'

/** Readable, ordered rows shared by the payload, the mailto body and the clipboard text. */
export function summaryRows(d: Inquiry): [string, string][] {
  const tools = d.tools.map((id) => labelFor(TOOL_OPTIONS, id)).filter(Boolean)
  return [
    ['Name', d.name.trim()],
    ['Email', d.email.trim()],
    ['Phone', d.phone.trim() || NOT_GIVEN],
    ['What they want to improve', d.need.trim()],
    ['What happens today', d.today.trim()],
    ['Tools involved', tools.length ? tools.join(', ') : NOT_GIVEN],
    ['Other systems', d.systems.trim() || NOT_GIVEN],
    ['Where data may run', labelFor(DATA_OPTIONS, d.dataId) || NOT_GIVEN],
    ['Hardware', labelFor(HARDWARE_OPTIONS, d.hardwareId) || NOT_GIVEN],
    ['Timeline', labelFor(TIMELINE_OPTIONS, d.timelineId) || NOT_GIVEN],
    ['Company', d.company.trim() || NOT_GIVEN],
    ['Company size', d.size.trim() || NOT_GIVEN],
    ...(d.campaign ? ([['Campaign', d.campaign]] as [string, string][]) : []),
  ]
}

/** Plain-text version of the whole inquiry. */
export function summaryText(d: Inquiry): string {
  const lines = summaryRows(d).map(([k, v]) => `${k}: ${v}`)
  return [`${INQUIRY_SUBJECT}`, '', ...lines, '', 'Sent from https://mas-ai.co/start/'].join('\n')
}

/** JSON body for FormSubmit. Keys starting with "_" are FormSubmit options; `email` becomes reply-to. */
export function buildPayload(d: Inquiry): Record<string, string> {
  const payload: Record<string, string> = {
    _subject: INQUIRY_SUBJECT,
    _template: 'table',
  }
  for (const [k, v] of summaryRows(d)) payload[k === 'Name' ? 'name' : k === 'Email' ? 'email' : k] = v
  payload['Page'] = 'https://mas-ai.co/start/'
  return payload
}

/** mailto link that carries the whole inquiry in the body, for when the form service fails. */
export function buildMailto(d: Inquiry, to: string = COMPANY.email): string {
  const body = summaryText(d).replace(/\n/g, '\r\n')
  return `mailto:${to}?subject=${encodeURIComponent(INQUIRY_SUBJECT)}&body=${encodeURIComponent(body)}`
}

export type FailReason = 'network' | 'http' | 'parse' | 'rejected'
export type SubmitResult = { status: 'sent' } | { status: 'failed'; reason: FailReason; httpStatus?: number }

/**
 * Turn an HTTP response into sent or failed. `ok` is the fetch Response.ok flag (2xx).
 * Success needs BOTH a 2xx and a parsed body whose success is true or 'true'.
 */
export function interpretResponse(ok: boolean, httpStatus: number, bodyText: string): SubmitResult {
  if (!ok) return { status: 'failed', reason: 'http', httpStatus }
  let parsed: unknown
  try {
    parsed = JSON.parse(bodyText)
  } catch {
    return { status: 'failed', reason: 'parse', httpStatus }
  }
  if (typeof parsed === 'object' && parsed !== null && 'success' in parsed) {
    const s = (parsed as { success: unknown }).success
    if (s === true || s === 'true') return { status: 'sent' }
  }
  return { status: 'failed', reason: 'rejected', httpStatus }
}

/** What the visitor reads when a send fails. Plain, and honest about what we do not know. */
export function failureMessage(r: Extract<SubmitResult, { status: 'failed' }>): string {
  switch (r.reason) {
    case 'network':
      return 'We could not reach the form service. Check your connection, then try again.'
    case 'http':
      return `The form service returned an error${r.httpStatus ? ` (status ${r.httpStatus})` : ''}, so your message was not delivered.`
    case 'parse':
      return 'The form service replied in a way we could not read. We cannot confirm your message arrived, so please email it instead of retrying.'
    case 'rejected':
      return 'The form service did not accept the message, so it was not delivered.'
  }
}

export type FetchLike = (
  url: string,
  init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal },
) => Promise<{ ok: boolean; status: number; text: () => Promise<string> }>

/** POST the inquiry. Never throws: every failure path returns a `failed` result. */
export async function submitInquiry(
  d: Inquiry,
  opts: { fetchImpl?: FetchLike; endpoint?: string; timeoutMs?: number } = {},
): Promise<SubmitResult> {
  const doFetch: FetchLike = opts.fetchImpl ?? ((url, init) => fetch(url, init))
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined
  const timer = controller ? setTimeout(() => controller.abort(), opts.timeoutMs ?? 20000) : undefined
  try {
    const res = await doFetch(opts.endpoint ?? INQUIRY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(buildPayload(d)),
      signal: controller?.signal,
    })
    const text = await res.text()
    return interpretResponse(res.ok, res.status, text)
  } catch {
    return { status: 'failed', reason: 'network' }
  } finally {
    if (timer) clearTimeout(timer)
  }
}
