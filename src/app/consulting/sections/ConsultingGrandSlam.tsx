'use client'

import GrandSlamOffer, { type GrandSlamOfferProps } from '@/components/GrandSlamOffer'

// =========================================================
// TODO(Masoud). Same three decisions as the automation GSO.
// See AutomationGrandSlam.tsx and PIVOT_STRATEGY.md.
// =========================================================

const consultingOffer: GrandSlamOfferProps = {
  accent: 'red',
  eyebrow: 'The Security Grand Slam',

  // DREAM OUTCOME + TIMEFRAME + RISK REVERSAL
  headline: 'Every exposed hole in your stack, found, proved, priced, in 5 business days.',

  // WHO + NAMED ENEMY
  subhead:
    'For dev-led SaaS teams who haven\'t had a real audit in 12+ months. No 100-page scanner dumps. Every finding comes with a working exploit, or it doesn\'t make the report.',

  stack: [
    {
      label: 'Full-stack Klyntar scan (web + API + auth flows)',
      anchor: '$8,500',
      detail: 'SQLi · XSS · CMDi · SSRF · XXE · Log4Shell · broken auth',
    },
    {
      label: 'Mobile app audit (APK + IPA, static + runtime)',
      anchor: '$6,000',
      detail: 'Hardcoded secrets, insecure storage, cert pinning, SDK risk',
    },
    {
      label: 'External attack surface map + credential leak hunt',
      anchor: '$5,500',
      detail: 'GitHub · pastebin · dangling DNS · exposed S3 buckets',
    },
    {
      label: 'BeyondMythos enrichment on every finding',
      anchor: '$4,000',
      detail: 'ErrorOracle + AdversarialSimulator + CompositionalPlanner',
    },
    {
      label: 'Zero-FP gate, no false alarms',
      anchor: '$3,500',
      detail: 'OPERATOR+ findings without a working exploit are dropped',
    },
    {
      label: 'Executive summary + technical deep-dive report',
      anchor: '$3,500',
      detail: 'CFO-readable risk scoring · CVE refs · exploit traces',
    },
    {
      label: 'Remediation guide with working code snippets',
      anchor: '$4,500',
      detail: 'Your engineers can patch it tomorrow, not ticket it',
    },
  ],

  bonuses: [
    { label: 'One full round of re-test after fixes', value: 'worth $2,500' },
    { label: '30-day Klyntar continuous monitoring trial', value: 'worth $4,500' },
    { label: 'Quarterly threat intel brief for 12 months', value: 'worth $1,800' },
  ],

  anchorTotal: '$44,300',
  yourPrice: '$12,500',
  priceSubtext: 'fixed scope · 5 business days · free recon first',

  // Locked per 2026-04-19 plan: free audit → retained work model.
  guarantee:
    'Start with a free 2-hour Klyntar recon. I\'ll send you the 3 highest-impact exposures I\'d fix first, no meeting required, 48-hour turnaround. Book the paid audit only if what I send you justifies it. If I can\'t find anything material, you owe us nothing and I\'ll tell you why your stack is tight.',

  // TODO(Masoud), set slot scarcity honestly.
  urgency: 'Limited to 2 full audits per month · Free recons unlimited this week',

  ctaLabel: 'Book Free Recon',
  ctaHref: '#contact-consulting',
}

export default function ConsultingGrandSlam() {
  return <GrandSlamOffer {...consultingOffer} />
}
