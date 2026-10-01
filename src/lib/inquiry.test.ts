// Run: node --test src/lib/inquiry.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  EMPTY_INQUIRY,
  INQUIRY_ENDPOINT,
  buildMailto,
  buildPayload,
  interpretResponse,
  submitInquiry,
  summaryText,
  validateAll,
  validateStep,
  type FetchLike,
  type Inquiry,
} from './inquiry.ts'

const FILLED: Inquiry = {
  ...EMPTY_INQUIRY,
  needId: 'manual',
  need: 'A slow manual process',
  today: 'Quotes are typed twice, once in email and once in the spreadsheet.',
  tools: ['email', 'spreadsheets'],
  dataId: 'own',
  timelineId: '3-months',
  company: 'Example Co',
  size: '12 people',
  name: 'Sam Rivera',
  email: 'sam@example.com',
  phone: '',
}

function fakeFetch(res: { ok: boolean; status: number; body: string }): FetchLike {
  return async () => ({ ok: res.ok, status: res.status, text: async () => res.body })
}

test('ok + success true is sent', async () => {
  const r = await submitInquiry(FILLED, { fetchImpl: fakeFetch({ ok: true, status: 200, body: '{"success":true}' }) })
  assert.deepEqual(r, { status: 'sent' })
})

test("ok + success 'true' (string) is sent", async () => {
  const r = await submitInquiry(FILLED, {
    fetchImpl: fakeFetch({ ok: true, status: 200, body: '{"success":"true","message":"sent"}' }),
  })
  assert.deepEqual(r, { status: 'sent' })
})

test('ok + success false is a failure, never sent', async () => {
  const r = await submitInquiry(FILLED, { fetchImpl: fakeFetch({ ok: true, status: 200, body: '{"success":false}' }) })
  assert.equal(r.status, 'failed')
  assert.equal(r.status === 'failed' && r.reason, 'rejected')
})

test("ok + success 'false' (string) is a failure", () => {
  const r = interpretResponse(true, 200, '{"success":"false"}')
  assert.equal(r.status, 'failed')
})

test('ok + valid JSON without a success key is a failure', () => {
  assert.equal(interpretResponse(true, 200, '{"message":"hi"}').status, 'failed')
  assert.equal(interpretResponse(true, 200, 'null').status, 'failed')
  assert.equal(interpretResponse(true, 200, '[]').status, 'failed')
})

test('non-2xx is a failure even when the body says success', async () => {
  const r = await submitInquiry(FILLED, { fetchImpl: fakeFetch({ ok: false, status: 500, body: '{"success":true}' }) })
  assert.deepEqual(r, { status: 'failed', reason: 'http', httpStatus: 500 })
})

test('invalid JSON on a 200 is a failure with reason parse', async () => {
  const r = await submitInquiry(FILLED, { fetchImpl: fakeFetch({ ok: true, status: 200, body: '<html>oops</html>' }) })
  assert.deepEqual(r, { status: 'failed', reason: 'parse', httpStatus: 200 })
})

test('network error is a failure with reason network and never throws', async () => {
  const boom: FetchLike = async () => {
    throw new TypeError('fetch failed')
  }
  const r = await submitInquiry(FILLED, { fetchImpl: boom })
  assert.deepEqual(r, { status: 'failed', reason: 'network' })
})

test('a body that cannot be read is a failure', async () => {
  const f: FetchLike = async () => ({
    ok: true,
    status: 200,
    text: async () => {
      throw new Error('stream reset')
    },
  })
  const r = await submitInquiry(FILLED, { fetchImpl: f })
  assert.equal(r.status, 'failed')
})

test('the request goes to FormSubmit as JSON with the subject', async () => {
  let seen: { url: string; body: string; headers: Record<string, string>; method: string } | undefined
  const f: FetchLike = async (url, init) => {
    seen = { url, body: init.body, headers: init.headers, method: init.method }
    return { ok: true, status: 200, text: async () => '{"success":"true"}' }
  }
  await submitInquiry(FILLED, { fetchImpl: f })
  assert.ok(seen)
  assert.equal(seen.url, INQUIRY_ENDPOINT)
  assert.match(seen.url, /^https:\/\/formsubmit\.co\/ajax\//)
  assert.equal(seen.method, 'POST')
  assert.equal(seen.headers['Content-Type'], 'application/json')
  const body = JSON.parse(seen.body)
  assert.equal(body._subject, 'New inquiry from mas-ai.co')
  assert.equal(body.name, 'Sam Rivera')
  assert.equal(body.email, 'sam@example.com')
  assert.equal(body['Tools involved'], 'Email, Spreadsheets')
})

test('payload marks optional fields as not given instead of dropping them', () => {
  const p = buildPayload({ ...FILLED, tools: [], dataId: '', timelineId: '', company: '', size: '' })
  assert.equal(p['Tools involved'], 'Not given')
  assert.equal(p['Where data may run'], 'Not given')
  assert.equal(p['Timeline'], 'Not given')
  assert.equal(p['Company'], 'Not given')
  assert.equal(p['Phone'], 'Not given')
})

test('exactly four required fields, checked per step', () => {
  assert.deepEqual(Object.keys(validateStep(0, EMPTY_INQUIRY)), ['need'])
  assert.deepEqual(Object.keys(validateStep(1, EMPTY_INQUIRY)), ['today'])
  assert.deepEqual(validateStep(2, EMPTY_INQUIRY), {})
  assert.deepEqual(Object.keys(validateStep(3, EMPTY_INQUIRY)).sort(), ['email', 'name'])
  const all = validateAll(EMPTY_INQUIRY)
  assert.deepEqual(Object.keys(all.errors).sort(), ['email', 'name', 'need', 'today'])
  assert.equal(all.firstStep, 0)
  assert.deepEqual(validateAll(FILLED), { errors: {}, firstStep: -1 })
})

test('whitespace-only answers and bad emails are rejected', () => {
  assert.ok(validateStep(1, { ...FILLED, today: '   ' }).today)
  assert.ok(validateStep(3, { ...FILLED, name: '  ' }).name)
  assert.ok(validateStep(3, { ...FILLED, email: 'sam@example' }).email)
  assert.ok(validateStep(3, { ...FILLED, email: 'sam example@x.com' }).email)
  assert.deepEqual(validateStep(3, { ...FILLED, email: ' sam@example.com ' }), {})
})

test('mailto carries the whole inquiry in the body', () => {
  const href = buildMailto(FILLED, 'inbox@example.com')
  assert.ok(href.startsWith('mailto:inbox@example.com?subject='))
  const body = decodeURIComponent(href.split('&body=')[1])
  assert.ok(body.includes('Quotes are typed twice'))
  assert.ok(body.includes('sam@example.com'))
  assert.ok(body.includes('Within 3 months'))
  assert.ok(body.includes('\r\n'))
})

test('summary text is the same content the mailto uses', () => {
  const text = summaryText(FILLED)
  assert.ok(text.includes('What they want to improve: A slow manual process'))
  assert.ok(text.includes('Where data may run: On our own servers or devices'))
})

test('the optional systems and hardware answers travel with the inquiry', () => {
  const empty = buildPayload(FILLED)
  assert.equal(empty['Other systems'], 'Not given')
  assert.equal(empty['Hardware'], 'Not given')
  const p = buildPayload({ ...FILLED, systems: 'HubSpot, QuickBooks', hardwareId: 'need', dataId: 'unsure' })
  assert.equal(p['Other systems'], 'HubSpot, QuickBooks')
  assert.equal(p['Hardware'], 'We may need new hardware')
  assert.equal(p['Where data may run'], 'Help me decide')
  assert.deepEqual(validateStep(2, { ...EMPTY_INQUIRY, hardwareId: 'unsure' }), {})
})

test('campaign labels from an ad link travel with the inquiry, and only when present', async () => {
  const { campaignFrom, rememberCampaign, recalledCampaign } = await import('./attribution.ts')
  assert.equal(campaignFrom('?need=manual'), '')
  assert.equal(
    campaignFrom('?utm_source=LinkedIn&utm_medium=paid-social&utm_campaign=masai-launch-2026-10&utm_content=li-ad-1'),
    'linkedin / paid-social / masai-launch-2026-10 / li-ad-1',
  )
  assert.equal(campaignFrom('?utm_source=google&utm_content=<b>x</b>'), 'google / - / - / bxb')
  const mem = new Map<string, string>()
  const store = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) }
  rememberCampaign('?utm_source=linkedin&utm_content=li-ad-2', store)
  rememberCampaign('?utm_source=google&utm_content=gs-sl-home', store)
  assert.equal(recalledCampaign(store), 'linkedin / - / - / li-ad-2')
  const blocked = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('blocked') } }
  assert.doesNotThrow(() => rememberCampaign('?utm_source=linkedin', blocked))
  assert.equal(recalledCampaign(blocked), '')
  assert.equal(buildPayload(FILLED)['Campaign'], undefined)
  assert.equal(buildPayload({ ...FILLED, campaign: 'linkedin / - / - / li-ad-2' })['Campaign'], 'linkedin / - / - / li-ad-2')
  assert.match(summaryText({ ...FILLED, campaign: 'linkedin / - / - / li-ad-2' }), /Campaign: linkedin/)
})
