'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, ArrowRight, ArrowUpRight, Copy, Mail } from 'lucide-react'
import { COMPANY } from '@/content/facts'
import { START } from '@/content/home'
import { recalledCampaign, rememberCampaign, tabStore } from '@/lib/attribution'
import {
  DATA_OPTIONS,
  HARDWARE_OPTIONS,
  EMPTY_INQUIRY,
  STEP_COUNT,
  TIMELINE_OPTIONS,
  TOOL_OPTIONS,
  buildMailto,
  failureMessage,
  submitInquiry,
  summaryText,
  validateAll,
  validateStep,
  type FieldErrors,
  type FieldKey,
  type Inquiry,
  type SubmitResult,
} from '@/lib/inquiry'

const STEPS = [
  { title: START.prompt, short: 'Goal' },
  { title: 'What happens today?', short: 'Today' },
  { title: 'A little context', short: 'Context' },
  { title: 'How do we reach you?', short: 'Contact' },
] as const

type Phase = 'editing' | 'sending' | 'sent' | 'failed'
type Failed = Extract<SubmitResult, { status: 'failed' }>

const FOCUS_ID: Record<FieldKey, string> = {
  need: 'inq-need-0',
  today: 'inq-today',
  name: 'inq-name',
  email: 'inq-email',
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="error">
      <AlertCircle aria-hidden="true" width={16} height={16} style={{ flex: 'none', marginTop: '0.15rem' }} />
      <span>{message}</span>
    </p>
  )
}

export function InquiryFlow() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<Inquiry>(EMPTY_INQUIRY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [phase, setPhase] = useState<Phase>('editing')
  const [failure, setFailure] = useState<Failed | null>(null)
  // The address actually sent: fields stay editable while sending, so the thank-you must not read live state.
  const [sentTo, setSentTo] = useState('')
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const [announce, setAnnounce] = useState('')

  const headingRef = useRef<HTMLHeadingElement>(null)
  const failRef = useRef<HTMLHeadingElement>(null)
  const copyRef = useRef<HTMLTextAreaElement>(null)
  const mounted = useRef(false)

  // Preselect from ?need= (static export has no server searchParams).
  useEffect(() => {
    try {
      const want = new URLSearchParams(window.location.search).get('need')
      const opt = START.options.find((o) => o.id === want)
      if (opt) setData((d) => (d.needId ? d : { ...d, needId: opt.id, need: opt.label }))
      // This effect runs before the layout's CampaignMemo, so a link that lands here directly is remembered here.
      rememberCampaign(window.location.search, tabStore())
      const campaign = recalledCampaign(tabStore())
      if (campaign) setData((d) => ({ ...d, campaign }))
    } catch {
      /* no query string support: start blank */
    }
  }, [])

  // Move focus and announce on every step or phase change, but not on first render.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (phase === 'failed') {
      failRef.current?.focus()
      setAnnounce('The message was not sent. Your answers are kept.')
    } else if (phase === 'sent') {
      headingRef.current?.focus()
      setAnnounce('Your inquiry was sent.')
    } else if (phase === 'sending') {
      setAnnounce('Sending.')
    } else {
      headingRef.current?.focus()
      setAnnounce(`Step ${step + 1} of ${STEP_COUNT}: ${STEPS[step].title}`)
    }
  }, [step, phase])

  useEffect(() => {
    if (copied === 'fail') copyRef.current?.select()
  }, [copied])

  function patch(p: Partial<Inquiry>, clear?: FieldKey) {
    setData((d) => ({ ...d, ...p }))
    if (clear && errors[clear]) setErrors((e) => ({ ...e, [clear]: undefined }))
    if (phase === 'failed') setCopied('idle')
  }

  function focusField(key: FieldKey) {
    window.setTimeout(() => document.getElementById(FOCUS_ID[key])?.focus(), 0)
  }

  function toggleTool(id: string) {
    patch({ tools: data.tools.includes(id) ? data.tools.filter((t) => t !== id) : [...data.tools, id] })
  }

  function next() {
    const e = validateStep(step, data)
    setErrors(e)
    const first = Object.keys(e)[0] as FieldKey | undefined
    if (first) {
      focusField(first)
      return
    }
    if (phase === 'failed') setPhase('editing')
    setStep((s) => Math.min(s + 1, STEP_COUNT - 1))
  }

  function back() {
    setErrors({})
    if (phase === 'failed') setPhase('editing')
    setStep((s) => Math.max(s - 1, 0))
  }

  async function send() {
    const { errors: all, firstStep } = validateAll(data)
    if (firstStep !== -1) {
      setErrors(all)
      if (phase === 'failed') setPhase('editing')
      if (firstStep !== step) setStep(firstStep)
      const first = Object.keys(all)[0] as FieldKey
      focusField(first)
      return
    }
    setErrors({})
    setCopied('idle')
    setPhase('sending')
    setSentTo(data.email.trim())
    const result = await submitInquiry(data)
    if (result.status === 'sent') {
      setFailure(null)
      setPhase('sent')
    } else {
      setFailure(result)
      setPhase('failed')
    }
  }

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (phase === 'sending') return
    if (step < STEP_COUNT - 1) next()
    else void send()
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(summaryText(data))
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
  }

  const live = (
    <p className="visually-hidden" role="status" aria-live="polite">
      {announce}
    </p>
  )

  if (phase === 'sent') {
    return (
      <div className="surface inq inq-done">
        {live}
        <h2 ref={headingRef} tabIndex={-1} className="t-h2 inq-heading">
          Thank you. We have it.
        </h2>
        <p className="t-lead">
          We will reply by email to <strong>{sentTo}</strong>. If our reply does not arrive, check your spam
          folder.
        </p>
        <p className="t-body">
          If you would rather talk it through now, the fit call is 30 minutes and you can pick a time that suits you.
        </p>
        <p>
          <a className="link-arrow" href={COMPANY.booking} target="_blank" rel="noopener noreferrer">
            Book a 30-minute fit call
            <ArrowUpRight aria-hidden="true" />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    )
  }

  const busy = phase === 'sending'
  const isLast = step === STEP_COUNT - 1
  const mailto = buildMailto(data)

  return (
    <form className="surface inq" onSubmit={onSubmit} noValidate aria-busy={busy}>
      {live}

      <div>
        <p className="t-mono" aria-hidden="true">
          Step {step + 1} of {STEP_COUNT}
        </p>
        <ol className="inq-progress" aria-label="Progress">
          {STEPS.map((s, i) => (
            <li
              key={s.short}
              data-state={i < step ? 'done' : i === step ? 'current' : 'todo'}
              aria-current={i === step ? 'step' : undefined}
            >
              <span className="inq-progress__label">{s.short}</span>
              <span className="visually-hidden">
                {' '}
                {i < step ? 'done' : i === step ? 'current step' : 'not started'}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <h2 ref={headingRef} tabIndex={-1} id="inq-heading" className="t-h2 inq-heading">
        {STEPS[step].title}
      </h2>

      {step === 0 && (
        <div className="field">
          <div
            role="radiogroup"
            aria-labelledby="inq-heading"
            aria-describedby={errors.need ? 'inq-need-error' : undefined}
            aria-invalid={errors.need ? true : undefined}
            aria-required="true"
            className="inq-chips"
          >
            {START.options.map((o, i) => (
              <label key={o.id} className="inq-chip inq-chip--radio">
                <input
                  type="radio"
                  name="need"
                  id={`inq-need-${i}`}
                  value={o.id}
                  checked={data.needId === o.id}
                  onChange={() => patch({ needId: o.id, need: o.label }, 'need')}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          <FieldError id="inq-need-error" message={errors.need} />
        </div>
      )}

      {step === 1 && (
        <>
          <div className="field">
            <label htmlFor="inq-today">Walk us through it: who does what, with which tools, and where it slows down.</label>
            <textarea
              id="inq-today"
              className="input inq-textarea"
              rows={6}
              maxLength={4000}
              required
              aria-required="true"
              aria-invalid={errors.today ? true : undefined}
              aria-describedby={errors.today ? 'inq-today-error' : 'inq-today-hint'}
              value={data.today}
              onChange={(e) => patch({ today: e.target.value }, 'today')}
            />
            <p id="inq-today-hint" className="hint">
              Rough is fine. If you know them: how often it happens, what it costs in time or money, and what you have already tried.
            </p>
            <FieldError id="inq-today-error" message={errors.today} />
          </div>
          <fieldset className="field inq-fieldset">
            <legend>Which tools are involved? Optional.</legend>
            <div className="inq-chips">
              {TOOL_OPTIONS.map((o) => (
                <label key={o.id} className="inq-chip inq-chip--check">
                  <input
                    type="checkbox"
                    name="tools"
                    value={o.id}
                    checked={data.tools.includes(o.id)}
                    onChange={() => toggleTool(o.id)}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="field">
            <label htmlFor="inq-systems">Other systems you use, if you want to name them. Optional.</label>
            <input
              id="inq-systems"
              className="input"
              type="text"
              maxLength={400}
              aria-describedby="inq-systems-hint"
              value={data.systems}
              onChange={(e) => patch({ systems: e.target.value })}
            />
            <p id="inq-systems-hint" className="hint">
              For example your CRM, accounting or document system by name.
            </p>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <p className="t-body">Everything on this step is optional. Skip what you do not know yet.</p>
          <fieldset className="field inq-fieldset">
            <legend>Where may the data be processed?</legend>
            <div className="inq-chips">
              {DATA_OPTIONS.map((o) => (
                <label key={o.id} className="inq-chip inq-chip--radio">
                  <input
                    type="radio"
                    name="data"
                    value={o.id}
                    checked={data.dataId === o.id}
                    onChange={() => patch({ dataId: o.id })}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="field inq-fieldset">
            <legend>Hardware for running it on your side</legend>
            <div className="inq-chips">
              {HARDWARE_OPTIONS.map((o) => (
                <label key={o.id} className="inq-chip inq-chip--radio">
                  <input
                    type="radio"
                    name="hardware"
                    value={o.id}
                    checked={data.hardwareId === o.id}
                    onChange={() => patch({ hardwareId: o.id })}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="field inq-fieldset">
            <legend>When would you like to start?</legend>
            <div className="inq-chips">
              {TIMELINE_OPTIONS.map((o) => (
                <label key={o.id} className="inq-chip inq-chip--radio">
                  <input
                    type="radio"
                    name="timeline"
                    value={o.id}
                    checked={data.timelineId === o.id}
                    onChange={() => patch({ timelineId: o.id })}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="inq-row">
            <div className="field">
              <label htmlFor="inq-company">Company name</label>
              <input
                id="inq-company"
                className="input"
                type="text"
                autoComplete="organization"
                maxLength={200}
                value={data.company}
                onChange={(e) => patch({ company: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="inq-size">Company size</label>
              <input
                id="inq-size"
                className="input"
                type="text"
                maxLength={100}
                placeholder="For example, 12 people"
                value={data.size}
                onChange={(e) => patch({ size: e.target.value })}
              />
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="inq-row">
            <div className="field">
              <label htmlFor="inq-name">Your name</label>
              <input
                id="inq-name"
                className="input"
                type="text"
                autoComplete="name"
                required
                aria-required="true"
                maxLength={200}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? 'inq-name-error' : undefined}
                value={data.name}
                onChange={(e) => patch({ name: e.target.value }, 'name')}
              />
              <FieldError id="inq-name-error" message={errors.name} />
            </div>
            <div className="field">
              <label htmlFor="inq-email">Your email</label>
              <input
                id="inq-email"
                className="input"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                aria-required="true"
                maxLength={200}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'inq-email-error' : undefined}
                value={data.email}
                onChange={(e) => patch({ email: e.target.value }, 'email')}
              />
              <FieldError id="inq-email-error" message={errors.email} />
            </div>
          </div>
          <div className="field inq-phone">
            <label htmlFor="inq-phone">Phone, optional</label>
            <input
              id="inq-phone"
              className="input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={60}
              value={data.phone}
              onChange={(e) => patch({ phone: e.target.value })}
            />
            <p className="hint">Only if you would rather we call.</p>
          </div>
        </>
      )}

      {phase === 'failed' && failure ? (
        <div className="inq-failure" role="alert">
          <h3 ref={failRef} tabIndex={-1} className="t-h4 inq-failure__title">
            <AlertCircle aria-hidden="true" width={20} height={20} />
            <span>Your message has not been sent</span>
          </h3>
          <p>{failureMessage(failure)}</p>
          <p>Nothing was lost. Every answer is still in the form. You can:</p>
          <ul className="tick-list">
            <li>try again with the button below,</li>
            <li>email the whole inquiry from your own mail app, already filled in,</li>
            <li>or copy it and send it however you like.</li>
          </ul>
          <div className="inq-failure__actions">
            <a className="btn btn-ghost" href={mailto}>
              <Mail aria-hidden="true" />
              Email it to {COMPANY.email}
            </a>
            <button type="button" className="btn btn-ghost" onClick={copyText}>
              <Copy aria-hidden="true" />
              Copy the inquiry
            </button>
          </div>
          <p role="status" aria-live="polite" className="t-small">
            {copied === 'ok' ? 'Copied to your clipboard.' : ''}
            {copied === 'fail' ? 'Your browser blocked copying. Select the text below and copy it yourself.' : ''}
          </p>
          {copied === 'fail' ? (
            <div className="field">
              <label htmlFor="inq-copy">Your inquiry</label>
              <textarea
                id="inq-copy"
                ref={copyRef}
                className="input inq-textarea"
                rows={8}
                readOnly
                value={summaryText(data)}
                onFocus={(e) => e.currentTarget.select()}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="inq-nav">
        <div>
          {step > 0 ? (
            <button type="button" className="btn btn-ghost" onClick={back} disabled={busy}>
              <ArrowLeft aria-hidden="true" />
              Back
            </button>
          ) : null}
        </div>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Sending' : isLast ? (phase === 'failed' ? 'Try again' : 'Send inquiry') : 'Continue'}
          {!busy && !isLast ? <ArrowRight aria-hidden="true" /> : null}
        </button>
      </div>

      {isLast ? (
        <p className="t-small inq-privacy">
          We use your answers only to reply. See the{' '}
          <Link href="/privacy/" className="link">
            privacy notice
          </Link>
          .
        </p>
      ) : null}
    </form>
  )
}
