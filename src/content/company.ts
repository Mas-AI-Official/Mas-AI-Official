/**
 * Company page content. Facts (legal name, founding date, founder, patents, programs) come from
 * src/content/facts.ts; principles come from src/content/home.ts. Only what is written here is copy.
 * Practices are stated as practices, never as metrics.
 */
import { COMPANY, PATENTS, PROGRAMS } from './facts'
import { COMPANY_SECTION } from './home'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** "2026-01-25" becomes "January 2026". Deterministic, no locale dependence. */
export function monthYear(iso: string): string {
  const year = iso.slice(0, 4)
  const month = Number(iso.slice(5, 7))
  return `${MONTHS[month - 1]} ${year}`
}

export const COMPANY_PAGE = {
  title: `Founder-led, in ${COMPANY.locality}, ${COMPANY.region}.`,
  lead: 'MAS-AI maps how a business runs and builds the software, automation or AI that closes the gap. The person who diagnoses the problem is the person who builds the system.',
  facts: [
    { term: 'Legal name', value: COMPANY.legalName },
    { term: 'Founded', value: monthYear(COMPANY.founded) },
    { term: 'Based in', value: `${COMPANY.locality}, ${COMPANY.region}, ${COMPANY.countryName}` },
    { term: 'Founder', value: `${COMPANY.founder.name}, ${COMPANY.founder.title}` },
  ],
  /** Who does the work. Only facts verified on 2026-09-30 (pass6 evidence record); nothing owner-stated alone. */
  team: {
    title: 'Who does the work',
    rows: [
      { term: 'Founder', value: `${COMPANY.founder.name} scopes and builds every engagement. He builds AI agent, retrieval and automation systems; his earlier career was in IT support, quality assurance and technician roles.` },
      { term: 'Study', value: 'Artificial intelligence, in the Artificial Intelligence graduate certificate program at Seneca College, 2025.' },
      { term: 'How', value: 'The founder works with AI coding and review assistants and reviews their work. Projects are built with automated tests and checks.' },
      { term: 'Public work', value: 'Daena, a governed multi-agent AI platform (source-available under the Business Source License 1.1), and MCP Switchboard and MergeLoop (open source, Apache 2.0).' },
    ],
  },
  principles: COMPANY_SECTION.principles,
  practices: [
    {
      name: 'Checks before release',
      line: 'Tests and deterministic checks run before anything ships. A change is done when a check says so, not when it looks right.',
    },
    {
      name: 'AI output is evaluated',
      line: 'Where a model produces an answer, we measure it against defined cases before it reaches your people or your customers.',
    },
    {
      name: 'Audit logs',
      line: 'Automated actions leave a record of what was done, when, and on whose authority.',
    },
    {
      name: 'Human approval',
      line: 'A person approves any action that cannot be undone.',
    },
    {
      name: 'Secrets in a vault',
      line: 'Keys and passwords live in a vault. They are never written into code or shared documents.',
    },
    {
      name: 'Documented handover',
      line: 'Every build ends with written documentation and a walkthrough, so your team can run it without us.',
    },
  ],
  patents: PATENTS.filter((p) => p.publish).map((p) => ({
    number: p.number,
    title: p.title,
    kind: p.kind,
    filed: monthYear(p.filed),
  })),
  patentNote:
    'A provisional application secures a filing date. It is not a granted patent, and we do not describe it as one.',
  programs: PROGRAMS.filter((p) => p.publish).map((p) => ({ name: p.name, detail: p.detail })),
  investors: 'For investors and partners: write to the founder directly.',
} as const
