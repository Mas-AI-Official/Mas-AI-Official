/**
 * MAS-AI Growth page content (/growth/). Draft for owner review on branch feat/growth-service-2026-11, not deployed.
 *
 * Sources. The audit and pilot terms are DR-004 (D:/Ideas/creative/campaigns/masai-launch-2026-10/growth/2026-10-21/dr004/
 * DR-004-APPENDIX.md AP5 and AP6, PLAN-GATED.md S03 and S13), unchanged except that no price is printed: rule Y1 in
 * OWNER-BRIEF.md keeps card prices for a named buyer, in writing. The loop, the six parts, the ownership list and the
 * questions are new wording from the 2026-11-11 gap review (D:/MAS-AI/growth/research/2026-11-11-chatgpt-plan-gap/)
 * and need the owner's approval like everything else here.
 * No client result, customer quote, price, deadline or ranking promise appears on purpose. Banned claim words
 * (tenant.json) stay out of this file: no guarantee, certified, compliant, best, testimonial, uptime, engineer, case study.
 * A part is tagged "live" only when it runs on mas-ai.co today: the inquiry form, and the crawl and structured-data check.
 *
 * INDEXABLE is the one switch for search listing. While false the page carries noindex and is left out of the
 * sitemap, so it is reachable only by a direct link (a post, an ad, a message the owner sends).
 */

export const GROWTH_INDEXABLE = false

const NAME = 'MAS-AI Growth'

export const GROWTH = {
  name: NAME,
  path: '/growth/',
  /** The line under the name, locked by the owner with the name on 2026-11-11. */
  line: 'AI marketing and advertising for local businesses',
  serviceType: 'Marketing and advertising service',
  meta: {
    /** Full title, used as is (no site suffix): the name already carries MAS-AI. */
    title: `${NAME}: AI marketing and advertising for local businesses`,
    description:
      'AI marketing and advertising for Ontario trades and local service businesses: posts, short videos, ad drafts and lead follow-up. You approve every item.',
  },
  h1: 'We make your marketing every week. You say yes or no.',
  lead: `${NAME} is AI marketing and advertising for owner-run trades and local service businesses in Ontario. We make the posts, short videos and ad drafts, capture the inquiries and follow up, as one weekly loop. A person checks every item, and nothing goes out until you approve it.`,
  startLink: 'See how it starts',

  /** Page-head illustration: one week's approval list for an example business. Not a client, and labelled so. */
  board: {
    label: 'This week',
    count: '3 items',
    kinds: { video: 'Short video', post: 'Post', ad: 'Ad draft' },
    states: { wait: 'Waiting for your yes', ok: 'Approved', edit: 'Sent back with your change' },
    actions: ['Approve', 'Change'],
    items: [
      { kind: 'video', meta: '15 seconds', title: 'Why a quote takes two days', state: 'wait' },
      { kind: 'post', meta: 'Checklist', title: 'Three checks before the first cold week', state: 'ok' },
      { kind: 'ad', meta: 'No budget set', title: 'Furnace quiet since March?', state: 'edit' },
    ],
    foot: 'Nothing is published, sent or spent before you approve it.',
    note: 'Illustration. Example business, not a client.',
    alt: 'Illustration of one week’s approval list for an example business: a short video waiting for approval, a post already approved, and an ad draft sent back for a change.',
  },

  problems: {
    title: 'Does this sound like your week?',
    intro: 'It is not for you if you want a person answering the phone after hours, or a promise of a number of new jobs. We offer neither.',
    items: [
      {
        said: 'I was on a job when they called. When I rang back, they had hired someone else.',
        means:
          'A missed call during a job is normal. Not knowing how many there are, or how long the call back takes, is the part you can fix. The audit counts both from your own phone records.',
      },
      {
        said: 'I sent the quote and never heard back.',
        means:
          'Quotes go quiet when nobody follows up on a set day. We count how many are still open after 7 days and what they are worth, using your figures.',
      },
      {
        said: 'I post when I have time, which means I do not post.',
        means: 'Posting stops when the work gets busy. A weekly loop that needs your approval, not your evenings, keeps it going.',
      },
    ],
  },

  loop: {
    title: 'One loop, every week',
    intro: 'Software does the repetitive part. A person checks it. You approve it before anything leaves the building.',
    steps: [
      {
        name: 'Find',
        gate: false,
        line: 'We read your own numbers and your market: where calls, inquiries and quotes go quiet, and what people near you search for.',
      },
      { name: 'Make', gate: false, line: 'We draft the posts, short videos, ad text and page changes for the week.' },
      {
        name: 'You approve',
        gate: true,
        line: 'Nothing is published, sent or spent until you say yes. You can change or reject any item.',
      },
      { name: 'Publish', gate: false, line: 'Approved items go out on your own accounts, on the days we agreed.' },
      {
        name: 'Capture and answer',
        gate: false,
        line: 'Inquiries land in one place, so none sits unanswered. If you chose automatic first replies, they use wording you approved, and anything unclear goes to your phone.',
      },
      {
        name: 'Measure and decide',
        gate: false,
        line: 'Each month you get the counts: inquiries, replies, quotes, jobs. We keep what worked, drop what did not, and tell you which is which.',
      },
    ],
  },

  /**
   * Three sample pieces for an INVENTED heating business. Source, masters and render script:
   * D:/MAS-AI/growth-engine/var/renders/growth-page-samples-2026-11-11. Not a client and never posted. Every image
   * carries a SAMPLE tag, and the phone number on the ad is in the 555-01xx range reserved for fiction.
   * The 15-second video (public/growth/sample-video.mp4, 0.9 MB) is built in that folder by video/build.py. The owner
   * approved keeping this one file in the site repo on 2026-11-11 so the page can play it; its poster is a frame of the video at 2.5 s. They are the same three items as the approval list in the page head (board.items above).
   */
  examples: {
    title: 'What a week’s pieces look like',
    intro:
      'Three sample pieces for an invented heating business: a short video, a post and an ad. They are the same three items as the approval list at the top of this page.',
    label: 'Sample pieces',
    items: [
      {
        src: '/growth/sample-video-poster.webp',
        w: 720,
        h: 1280,
        kind: 'Short video, 15 seconds',
        video: '/growth/sample-video.mp4',
        alt: 'Sample short video for an invented business, Example Heating. A synthetic voice asks why a furnace quote takes two days. Day one, we come out and measure the house. Day two, you get one price, in writing. No guessing over the phone. Book a visit today. Every spoken word is also shown on screen.',
      },
      {
        src: '/growth/sample-post.webp',
        w: 864,
        h: 1080,
        kind: 'Post',
        alt: 'Sample post for Example Heating. Headline: Three checks before the first cold week. One, swap the furnace filter. Two, clear every vent and return. Three, run the heat for ten minutes now.',
      },
      {
        src: '/growth/sample-ad.webp',
        w: 864,
        h: 1080,
        kind: 'Ad draft',
        alt: 'Sample ad for Example Heating. Headline: Furnace quiet since March? Get it checked before the first cold night, not during it. Button: Book a furnace check today. One call or one short form. We text you a visit time. The phone number is made up.',
      },
    ],
    note: 'Samples, made to show the format. The business is invented, and the 15-second video uses a synthetic voice. We have no client pieces to show yet.',
  },

  parts: {
    title: 'What the service covers',
    intro: 'Six parts. You can start with one. Each is scoped in writing before it starts.',
    states: { live: 'Running on mas-ai.co', scope: 'By written scope' },
    items: [
      {
        name: 'Offer and plan',
        state: 'scope',
        line: 'Who you want more of, what you offer them, and the one number we watch. Written on one page before any content is made.',
      },
      {
        name: 'Content and short video',
        state: 'scope',
        line: 'Posts and short videos about your real work, made from your photos, your jobs and your answers. A voice, face or image made by AI is labelled as AI.',
      },
      {
        name: 'Ad drafts',
        state: 'scope',
        line: 'Ad text and video for the platforms you choose. You hold the ad account and pay the platform yourself. No budget is set or raised without your written yes.',
      },
      {
        name: 'Lead capture',
        state: 'live',
        line: 'A page and a form that ask the few questions that matter and put every inquiry in one place. The form on this site is that kind of form.',
      },
      {
        name: 'Follow-up',
        state: 'scope',
        line: 'A first reply to missed calls and a set day to chase open quotes. Automatic texts need a legal check and carrier registration first, so the start date is confirmed in writing.',
      },
      {
        name: 'Search and AI assistants',
        state: 'live',
        line: 'The technical basics that let search engines and AI assistants read your site: crawl access, a sitemap, clear page titles, structured data. We run the same check on this site. It makes a site readable. It does not promise a ranking or a mention.',
      },
    ],
    note: 'The two tags are the whole truth today. Two parts run on our own site. The other four are built to your written scope, and we have no client results for them yet.',
  },

  own: {
    title: 'What stays yours',
    intro: 'You should be able to stop working with us and keep everything.',
    handoverTitle: 'Your accounts, your card',
    handover:
      'Your social pages, ad accounts, website and phone number stay in your name. Ad spend goes from your card to the platform. We never hold your ad money.',
    items: [
      'We work as an invited user on your accounts. You can remove us at any time.',
      'Your customer list and inquiry records are yours. We use them only for the work in the written scope.',
      'You see every post, ad and message wording before it goes out.',
      'If you stop, you get an export of your content and your records. The written scope says how notice works.',
    ],
  },

  audit: {
    tag: 'Start here',
    name: 'Leak Audit',
    for: 'For when you are not sure where jobs leak. One report from your own records, and you decide what happens next.',
    price: 'Fixed price',
    priceNote: 'One price, sent to you in writing with the scope, before you agree to anything.',
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
    tag: 'If you already know the gap',
    name: 'Lead Response pilot',
    for: 'For when you already know calls go unanswered and want it handled.',
    price: 'Fixed price',
    priceNote: 'One month, one price, in writing. You pay when the work starts, not before.',
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
        k: 'You confirm',
        v: 'That you hold the registrations your trade needs. We ask. We do not verify.',
      },
    ],
  },

  approveTitle: 'What you approve',
  approveIntro: 'You decide at each point. We do not move on without you.',
  approve: [
    { name: 'The written scope', line: 'Price, deliverable, start condition. Before any work or invoice.' },
    { name: 'The counts', line: 'In the audit, you confirm in writing that they match your records.' },
    { name: 'Any data beyond counts', line: 'Only with your written permission that names the purpose, the tools (and whether any of them is a cloud AI tool), 30 days of retention, deletion, and an incident contact.' },
    { name: 'Every item that goes out', line: 'Posts, ads, page changes and the wording of automatic texts. You see each one before it is live.' },
    { name: 'What happens next', line: 'After the audit, you choose: do it yourself, hire us, or do nothing.' },
  ],

  aiTitle: 'How we use AI',
  ai: [
    'We use AI software to help prepare and analyse work. The founder reads what you receive before it reaches you.',
    'The audit works from counts. Nothing is recorded or transcribed by AI, and no customer names, messages or call recordings are needed.',
    'In the pilot, the automatic texts are sent by software that uses AI. Before you agree, we tell you which AI tools handle your data and whether any of them runs in the cloud.',
    'When a voice, a face or an image in your content is made by AI, it is labelled as AI.',
  ],

  honestTitle: 'What this page does not show',
  honest: [
    'No client results. We have none to show yet, so we show none. The audit exists so you see numbers from your own records, not ours.',
    'No customer quotes, no countdown and no price list. Your price is sent to you in writing with the scope, and nothing starts until you have agreed to it.',
    'No promise of leads, jobs, search rankings or mentions by AI assistants. Nobody controls those. We control the work, and you see the counts each month.',
  ],

  faqTitle: 'Questions',
  faq: [
    {
      q: `What does ${NAME} do?`,
      a: 'It is AI marketing and advertising for owner-run trades and local service businesses in Ontario. We find where calls, inquiries and quotes go quiet, then make and run the content, ad drafts, lead capture and follow-up that you approve. It starts with a fixed-price audit of your own numbers.',
    },
    {
      q: 'What happens after I send the form?',
      a: 'We reply by email and set up a short call. If the audit or the pilot fits, you get a one-page written scope: the price, what is included, what we need from you and the start condition. Nothing starts and no invoice is sent until you agree to it in writing.',
    },
    {
      q: 'How much does it cost?',
      a: 'The Leak Audit and the Lead Response pilot each have one fixed price. We send it to you in writing, with the scope, before you agree to anything. Asking costs nothing.',
    },
    {
      q: 'Who owns the accounts and pays for the ads?',
      a: 'You do. Your pages, ad accounts and phone number stay in your name, and ad spend goes from your card to the platform. We work as an invited user and you can remove us.',
    },
    {
      q: 'Will this get me more jobs?',
      a: 'We do not promise a number of leads, jobs or a search ranking. We promise the work in the written scope and a monthly count from your own records, so you can decide whether to continue.',
    },
    {
      q: 'Does AI post or reply for me without asking?',
      a: 'No. Posts, ads and message wording go out only after you approve them. If you choose automatic first replies to missed calls, they use the wording you approved, never give a quote or safety advice, and pass anything unclear to your phone.',
    },
    {
      q: 'Can you get ChatGPT or other AI assistants to recommend my business?',
      a: 'Nobody can promise that. What we can do is make your site easy for search engines and AI assistants to read and quote: clear pages about what you do and where, crawl access, structured data and the same business details everywhere. Whether an assistant mentions you is its decision.',
    },
    {
      q: 'Where do you work?',
      a: 'This service is for businesses in Ontario for now. The audit is done by email and one short call, so you do not need to be near us.',
    },
  ],

  cta: {
    title: 'Tell us where jobs slip.',
    line: 'On the form, choose “Find where our leads leak” for the audit, “Response time to customers” for the pilot, or “Short videos for my business, approved by me” for content. We reply by email, and you pay nothing until you have approved a written scope.',
  },
} as const
