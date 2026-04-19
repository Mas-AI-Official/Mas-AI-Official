'use client'

import GrandSlamOffer, { type GrandSlamOfferProps } from '@/components/GrandSlamOffer'

const offer: GrandSlamOfferProps = {
  accent: 'cyan',
  eyebrow: 'The AI Act Readiness Sprint',

  headline:
    'From "we\'re not sure if we\'re in scope" to regulator-ready documentation, in 10 business days.',

  subhead:
    'For companies with AI features in the EU market who just realized the August 2, 2026 deadline is real. I do the classification, the documentation, the gap analysis, and the governance wiring, all backed by Daena\'s pipeline so your audit trail starts recording the moment we finish.',

  stack: [
    {
      label: 'High-risk classification review under Annex III',
      anchor: '$7,500',
      detail: 'Article-by-article analysis of your AI features against the Act',
    },
    {
      label: 'Risk management system (Article 9) documented',
      anchor: '$8,000',
      detail: 'Full Article 9 artifact, risk identification, mitigation, residual-risk register',
    },
    {
      label: 'Technical documentation (Article 11 + Annex IV)',
      anchor: '$9,500',
      detail: 'System architecture, training data lineage, accuracy + robustness specs',
    },
    {
      label: 'Record-keeping + audit trail (Article 12) wired via Daena',
      anchor: '$6,000',
      detail: '10-stage governed pipeline logs every AI decision immutably',
    },
    {
      label: 'Human oversight plan (Article 14)',
      anchor: '$4,500',
      detail: 'Approval queues + override mechanisms per department',
    },
    {
      label: 'Conformity assessment dry run',
      anchor: '$5,500',
      detail: 'I pretend to be the notified body and try to fail you',
    },
  ],

  bonuses: [
    { label: 'Quarterly regulatory update for 12 months', value: 'worth $1,800' },
    { label: 'Free Klyntar scan of AI feature attack surface', value: 'worth $2,500' },
    { label: 'CTO/CISO executive briefing deck (your board will ask)', value: 'worth $1,500' },
  ],

  anchorTotal: '$46,800',
  yourPrice: '$18,000',
  priceSubtext: 'fixed scope · 10 business days · regulator-ready artifacts',

  guarantee:
    'If your internal counsel or external notified body reviews the artifacts and flags a material gap I should have caught, I fix it free, unlimited rounds until sign-off.',

  urgency: `Only ${Math.max(1, Math.floor((new Date('2026-08-02').getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 14)))} two-week sprints left before the Aug 2 deadline`,

  ctaLabel: 'Book the Sprint',
  ctaHref: '#contact-aiact',
}

export default function AiActGrandSlam() {
  return <div id="aiact-offer"><GrandSlamOffer {...offer} /></div>
}
