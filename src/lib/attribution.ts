/**
 * Campaign labels (utm_*) from the link that brought a visitor, kept in this browser tab only and sent with an
 * inquiry the visitor chooses to send. No cookies and no tags; the privacy page describes this.
 */
export const CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const
const STORE_KEY = 'masai.campaign'

type Store = Pick<Storage, 'getItem' | 'setItem'>

const clean = (v: string) => v.toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 64)

/** "source / medium / campaign / content" from a query string, or '' when it has no utm_source. */
export function campaignFrom(search: string): string {
  const q = new URLSearchParams(search)
  const source = clean(q.get('utm_source') ?? '')
  if (!source) return ''
  return CAMPAIGN_KEYS.map((k) => clean(q.get(k) ?? '') || '-').join(' / ')
}

/** Keeps the first campaign seen in this tab; later links do not overwrite it. Never throws. */
export function rememberCampaign(search: string, store: Store | undefined): void {
  const c = campaignFrom(search)
  if (!c || !store) return
  try {
    if (!store.getItem(STORE_KEY)) store.setItem(STORE_KEY, c)
  } catch {
    /* storage blocked: the inquiry goes without campaign labels */
  }
}

export function recalledCampaign(store: Store | undefined): string {
  try {
    return store?.getItem(STORE_KEY) ?? ''
  } catch {
    return ''
  }
}

/** sessionStorage, or undefined where reading it throws (blocked storage, some private modes). */
export function tabStore(): Store | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.sessionStorage
  } catch {
    return undefined
  }
}
