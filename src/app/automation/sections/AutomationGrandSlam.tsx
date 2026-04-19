'use client'

import GrandSlamOffer, { type GrandSlamOfferProps } from '@/components/GrandSlamOffer'

// =========================================================
// TODO(Masoud). Three decisions only you can make.
// Search this file for "TODO(Masoud)" and replace the placeholder
// with what you're actually willing to stand behind. These three
// lines drive the entire conversion rate of this page.
// =========================================================

const automationOffer: GrandSlamOfferProps = {
  accent: 'cyan',
  eyebrow: 'The Automation Grand Slam',

  // DREAM OUTCOME + TIMEFRAME + RISK REVERSAL in one sentence
  headline: 'A governed AI employee, installed in 21 days, or you don\'t pay.',

  // WHO it's for + WHAT they avoid (the named enemy)
  // TODO(Masoud), pick your primary avatar (see PIVOT_STRATEGY.md).
  // Options I drafted:
  //   A) "For dev-led SaaS founders whose eng team wants Claude Code but the CISO said no."
  //   B) "For ops VPs at mid-market companies who see AI hype but have no deployment plan."
  //   C) "For CTOs at regulated fintech/healthtech who need governance, not demos."
  subhead:
    'For teams who want Claude Code, OpenClaw, voice assistants, or a custom agent, but can\'t afford the CISO saying no. Skip the 12-week consultancy that ships a PDF.',

  stack: [
    {
      label: 'Full agent deployment on your hardware or cloud',
      anchor: '$12,000',
      detail: 'OpenClaw, Claude Code, voice assistant, or custom, your pick',
    },
    {
      label: 'Daena governance wrapper with approval queues',
      anchor: '$8,500',
      detail: '10-stage pipeline · Shield always on · audit trail forever',
    },
    {
      label: 'MCP connectors to your internal tools',
      anchor: '$9,000',
      detail: 'Secure bridges to your DB, CRM, ticketing, ERP. OAuth/SSO scoped',
    },
    {
      label: 'Klyntar security wrap on every deployment',
      anchor: '$6,500',
      detail: '25+ exploit signatures guard the agent\'s blast radius',
    },
    {
      label: '2-week hypercare + team onboarding',
      anchor: '$4,500',
      detail: 'We\'re on-call while your team takes the wheel',
    },
    {
      label: 'Full source code + runbook, you own it',
      anchor: '$15,000',
      detail: 'No vendor lock-in. Ever. We can walk away and you still ship.',
    },
  ],

  bonuses: [
    { label: 'Free 45-min AI architecture strategy session', value: 'worth $500' },
    { label: 'First Klyntar security scan included', value: 'worth $2,500' },
    { label: '30-day Slack access to Masoud (founder)', value: 'worth $3,000' },
  ],

  anchorTotal: '$61,500',
  yourPrice: '$18,000',
  priceSubtext: 'one-time · fixed scope · source yours · free audit first',

  // Locked per 2026-04-19 plan: free audit → retained work model.
  guarantee:
    'Start with a free 45-minute install audit. I\'ll tell you exactly which agent to install, how long, and what it costs. Pay nothing until I start building. If after the audit you don\'t see the path clearly, we shake hands and walk.',

  // TODO(Masoud), set slot scarcity honestly. 3/month is the default until
  // you tell us otherwise.
  urgency: 'Limited to 3 installs per month · Free audits available this week',

  ctaLabel: 'Book Free Install Audit',
  ctaHref: '#contact-automation',
}

export default function AutomationGrandSlam() {
  return <GrandSlamOffer {...automationOffer} />
}
