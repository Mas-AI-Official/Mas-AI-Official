import type { WorkLabel, WorkTier } from '@/content/work'

/** Order of the label key at the foot of /work/. Each label is explained in one honest sentence. */
export const LABEL_ORDER: WorkLabel[] = ['System we operate', 'Open source', 'R&D', 'Website we shipped']

export const LABEL_COPY: Record<WorkLabel, string> = {
  'System we operate': 'Software we built and use ourselves. Each entry says what state it is in.',
  'Open source': 'Code we have released publicly on GitHub, so you can read it before you trust it.',
  'R&D': 'Research still in progress. It is not a finished product, and the entry says how far along it is.',
  'Website we shipped': 'Sites we designed, wrote, built and deployed ourselves, for our own products.',
}

/** The three tiers of /work/. */
export const TIER_ORDER: WorkTier[] = ['A', 'B', 'C']

export const TIER_COPY: Record<WorkTier, { id: string; heading: string; explain: string }> = {
  A: {
    id: 'featured',
    heading: 'Featured systems',
    explain: 'Each one starts from the problem it was built to solve, then says what we engineered and what state it is in.',
  },
  B: {
    id: 'built',
    heading: 'Also built by MAS-AI',
    explain: 'The rest of what we have built, with the label that says what kind of work it is.',
  },
  C: {
    id: 'lab',
    heading: 'Lab',
    explain: 'These are experiments. They are research in progress, not finished products, and each entry says how far along it is.',
  },
}
