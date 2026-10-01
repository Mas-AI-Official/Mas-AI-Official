/**
 * Build Blueprint page content. Price, duration and credit are rendered from OFFER in facts.ts:
 * they are draft terms until the owner sets OFFER.ownerApproved. Nothing here restates them as literals.
 */
import { OFFER } from './facts'

export const BLUEPRINT = {
  title: OFFER.name,
  lead: 'A short, fixed-price engagement that ends in a build plan or a clear no.',
  who: [
    'You know something in the business is slow, manual or broken. You do not yet know what to build, or whether to build anything.',
    'The Blueprint is the step before a build. It turns a vague problem into a written plan you can act on, with a fixed price and a fixed length.',
    'It is not for you if you already have a scoped specification and only need someone to build it.',
  ],
  map: [
    { name: 'People', line: 'Who does the work, who decides, and who is affected.' },
    { name: 'Workflow', line: 'The steps from request to result, as they really run.' },
    { name: 'Software', line: 'The tools already in use and how they connect.' },
    { name: 'Repeated tasks', line: 'The work someone does again and again.' },
    { name: 'Data', line: 'Where information lives, who can see it and how reliable it is.' },
    { name: 'Handoffs', line: 'Where work passes between people or systems and stalls.' },
    { name: 'Customer interactions', line: 'Where customers wait, ask or drop out.' },
    { name: 'Manual processes', line: 'Copying, re-keying, chasing and checking by hand.' },
    { name: 'Security and privacy', line: 'What must stay private, and which rules apply.' },
    { name: 'Cost', line: 'What the current way costs in time and money.' },
    { name: 'Bottlenecks', line: 'The places where work queues up.' },
  ],
  receive: [
    { name: 'Workflow map', line: 'One clear picture of how the work runs today, with the gaps marked.' },
    { name: 'Ranked opportunities', line: 'Where automation, software or AI would pay back most, in order, and what would not.' },
    { name: 'Recommended architecture', line: 'How the pieces fit together, and which of them should run privately.' },
    { name: 'Constraints', line: 'The security, privacy, data, integration and budget limits that shape what is possible.' },
    { name: 'Scope', line: 'What a first build includes and what it leaves out.' },
    { name: 'Cost range', line: 'A range for the build, with what moves it up or down.' },
    { name: 'Build or no-build decision', line: 'A plain recommendation. If the answer is do not build, it says so and gives the reasons.' },
  ],
  steps: [
    { name: 'Kickoff', line: 'You tell us the problem and introduce the people who do the work. We agree what is in scope and what is not.' },
    { name: 'Mapping', line: 'We ask how the work really runs and collect the tools and data involved.' },
    { name: 'Analysis', line: 'We rank the opportunities, sketch the architecture and estimate the cost.' },
    { name: 'Readout', line: 'We walk you through the document and give the build or no-build recommendation.' },
  ],
  timelineNote: `Kickoff to readout takes ${OFFER.duration}.`,
  outline: [
    { name: 'Summary and recommendation', line: 'Build, build less, or do not build, in one page.' },
    { name: 'How the business runs today', line: 'The workflow map.' },
    { name: 'Where time and money leak', line: 'Bottlenecks, repeated tasks, manual processes and handoffs.' },
    { name: 'Ranked opportunities', line: 'Each with expected benefit, effort and risk.' },
    { name: 'Recommended architecture', line: 'Components, integrations and where each one runs.' },
    { name: 'Constraints', line: 'Security, privacy, data and existing tools.' },
    { name: 'Scope and phases', line: 'What the first build contains and what waits.' },
    { name: 'Cost range', line: 'What drives it up or down.' },
    { name: 'Decision and next step', line: 'What we recommend and what happens if you say yes.' },
    { name: 'Appendix', line: 'Tool inventory and interview notes.' },
  ],
  faq: [
    {
      q: 'What if you recommend not building anything?',
      a: 'Then that is the answer you paid for, and a useful one. The document says so plainly and gives the reasons. You keep the workflow map and the ranked list, and you have not spent build money on something that would not pay back.',
    },
    {
      q: 'Who does the work?',
      a: 'The founder, from the first conversation to the readout. There is no handoff to a team you have not met.',
    },
    {
      q: 'Do we have to hire you to build it afterwards?',
      a: 'No. The document is yours. You can build from it with us, with another team or in house.',
    },
    {
      q: 'How does the credit work?',
      a: OFFER.credit,
    },
    {
      q: 'What do you need from us?',
      a: 'Time with the people who do the work, a view of the tools they use, and any document that describes how things run today. We ask for the least access that lets us map the work.',
    },
    {
      q: 'Is the price fixed?',
      a: `Yes. The price is ${OFFER.price} for ${OFFER.duration}, agreed before we start.`,
    },
  ],
} as const
