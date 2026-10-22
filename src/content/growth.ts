/**
 * MAS-AI Growth page content (/growth/). Draft for owner review, not deployed.
 *
 * Source of every term below: D:/Ideas/creative/campaigns/masai-launch-2026-10/growth/2026-10-21/dr004/
 * DR-004-APPENDIX.md AP5 (Leak Audit scope, direct pilot) and AP6 (Lead Response terms), PLAN-GATED.md S03 and S13.
 * Amounts are before HST. MAS-AI's HST status is an open owner decision (Y15), so the page says "if it applies".
 * No client result, no customer quote and no deadline appears here on purpose. Banned claim words (tenant.json)
 * stay out of this file: no guarantee, certified, compliant, best, testimonial, uptime, engineer, case study.
 *
 * INDEXABLE is the one switch for search listing. While false the page carries noindex and is left out of the
 * sitemap, so it is reachable only by a direct link (a post, an ad, a message the owner sends).
 */

export const GROWTH_INDEXABLE = false

export const GROWTH = {
  name: 'MAS-AI Growth',
  path: '/growth/',
  meta: {
    title: 'MAS-AI Growth',
    description:
      'Two fixed-price offers for owner-run trades and local service businesses in Ontario: a CAD 800 Leak Audit and a CAD 1,500 Lead Response pilot. Amounts are before HST.',
  },
  lead: 'Fixed-price help for owner-run trades and local service businesses in Ontario. Find where calls and quotes go quiet, then decide whether to fix it yourself, hire us, or leave it alone.',

  who: [
    'You run a trades or local service business in Ontario. You, or a small office, take the calls, send the quotes and chase the follow-up between jobs.',
    'You think some calls are missed and some quotes go quiet, but you do not have the numbers. Or you already know it is happening and want it handled.',
    'It is not for you if you want a person answering the phone after hours, or a promise of a number of new jobs. We offer neither.',
  ],

  offersIntro: 'Two offers. Pick by what you know today. Each has one price and a written scope you approve before anything starts.',

  audit: {
    tag: 'Offer 1 of 2',
    name: 'Leak Audit',
    for: 'For when you are not sure where jobs leak.',
    price: 'CAD 800',
    hst: 'plus HST if it applies. At Ontario’s 13 percent rate, CAD 800 becomes CAD 904.00.',
    terms: [
      {
        k: 'Time',
        v: 'Five business days. The clock starts the business day after your last input and your payment have both arrived. If an input is missing, the clock stops and the report says which one.',
      },
      {
        k: 'You send',
        v: 'Counts for the last 30 days from your own records, with customer names and phone numbers removed: calls in, calls answered, calls returned and how long that took; web and message inquiries and the time to the first reply; quotes sent, quotes accepted and quotes still open after 7 days, with job values. Also your average job value, the tools you use and what they cost, and one 20-minute call.',
      },
      {
        k: 'You confirm',
        v: 'Within 5 business days, in writing, that the counts match your records and that all four parts of the report are there. If not, we fix it within 3 business days or refund the fee.',
      },
      {
        k: 'If there is no gap',
        v: 'The report says so, shows your measured numbers against your own targets, and names three numbers to watch. That is a delivered report and the fee is still due. We say this before you agree, so no result is promised.',
      },
      {
        k: 'Not included',
        v: 'We do not change any of your systems, contact your customers, give technical or safety advice, or promise recovered jobs. The fee is not credited against the pilot.',
      },
    ],
    reportTitle: 'What the report holds',
    reportIntro: 'A written report of up to three pages. You can use it without buying anything else from us.',
    report: [
      { name: 'Your counts', line: 'One table, with the source of each number.' },
      { name: 'Up to three gaps', line: 'Ranked by the job value they put at risk, as ranges built from your own numbers. No prediction.' },
      { name: 'What to do about each', line: 'Steps you can take yourself, for free, and a fixed quote if you want us to do it. A quote, not an obligation.' },
      { name: 'A decision sheet', line: 'One page: do it yourself, hire us, or do nothing.' },
    ],
  },

  pilot: {
    tag: 'Offer 2 of 2',
    name: 'Lead Response pilot',
    for: 'For when you already know calls go unanswered and want it handled.',
    price: 'CAD 1,500',
    hst: 'plus HST if it applies, one price for a one-month pilot. At Ontario’s 13 percent rate, CAD 1,500 becomes CAD 1,695.00.',
    terms: [
      {
        k: 'What it does',
        v: 'When a call to your business number goes unanswered, an automatic text goes to the caller. The target is within 60 seconds of the missed call.',
      },
      {
        k: 'What 60 seconds means',
        v: 'The time from the missed call to our send request being accepted by the mobile carrier, read from our own log. When the text reaches the phone depends on the carrier and is not promised.',
      },
      {
        k: 'When a person steps in',
        v: 'A reply the automation cannot sort, such as a price question, something urgent or about safety, a complaint, or a request to stop, goes at once to your own phone. We read the log with you every week. No after-hours human response is promised.',
      },
      {
        k: 'What the texts never do',
        v: 'The automation never sends a quote, technical advice or safety advice. A request to stop is honoured. Before any text goes out, we record the legal basis for it under Canada’s anti-spam law (CASL).',
      },
      {
        k: 'Size of the pilot',
        v: 'One month, with a cap of 6 hours of our work in total, setup included.',
      },
      {
        k: 'When it starts',
        v: 'Not before two things are done: a legal review of the message wording, and carrier registration for business texting. We cannot give you those dates yet. The written scope names the start condition. If we cannot confirm a start date, you owe nothing.',
      },
      {
        k: 'When you pay',
        v: 'When the work starts, not before.',
      },
      {
        k: 'You confirm',
        v: 'That you hold the registrations your trade needs. We ask. We do not verify.',
      },
    ],
  },

  stepsTitle: 'How it works',
  steps: [
    {
      name: 'Talk',
      line: 'A short call. We ask where calls, inquiries and quotes go today, and say which offer fits, or neither. The price is confirmed in writing.',
    },
    {
      name: 'Approve a written scope',
      line: 'One page: the price, what is included, what we need from you, and the start condition. Nothing starts and no invoice is sent until you have said yes to it in writing.',
    },
    {
      name: 'Delivery',
      line: 'The audit report arrives within five business days of your inputs and payment. The pilot starts when its start condition is met. Either way, the scope on the page is the scope you get.',
    },
  ],

  approveTitle: 'What you approve',
  approveIntro: 'You decide at each point. We do not move on without you.',
  approve: [
    { name: 'The written scope', line: 'Price, deliverable, start condition. Before any work or invoice.' },
    { name: 'The counts', line: 'In the audit, you confirm in writing that they match your records.' },
    { name: 'Any data beyond counts', line: 'Only with your written permission that names the purpose, the tools (and whether any of them is a cloud AI tool), 30 days of retention, deletion, and an incident contact.' },
    { name: 'The wording of the texts', line: 'In the pilot, you see the wording of the automatic replies before any goes live.' },
    { name: 'What happens next', line: 'After the audit, you choose: do it yourself, hire us, or do nothing.' },
  ],

  aiTitle: 'How we use AI',
  ai: [
    'We use AI software to help prepare and analyse work. The founder reads what you receive before it reaches you.',
    'The audit works from counts. Nothing is recorded or transcribed by AI, and no customer names, messages or call recordings are needed.',
    'In the pilot, the automatic texts are sent by software that uses AI. Before you agree, we tell you which AI tools handle your data and whether any of them runs in the cloud.',
  ],

  honestTitle: 'What this page does not show',
  honest: [
    'No client results. We have none to show yet, so we show none. The audit exists so you see numbers from your own records, not ours.',
    'No customer quotes, and no countdown. The prices above are the prices. If one changes, we say so in writing before you agree to anything.',
  ],

  cta: {
    title: 'Tell us where jobs slip.',
    line: 'On the form, choose “Find where our leads leak” for the audit, or “Response time to customers” for the pilot. We reply by email, and you pay nothing until you have approved a written scope.',
  },
} as const
