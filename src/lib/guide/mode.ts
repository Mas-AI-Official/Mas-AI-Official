// Guide persona modes. Pure, no imports, so `node --test` can run it.
//
// Restores the original two-mode guide (git tag pre-redesign-2026-09-30, src/components/DaenaGuide.tsx):
// Daena ("AI Guide") everywhere, Klyntar ("Security Mode") on the security surfaces. The original rule was
// `pathname.startsWith('/security') || pathname.startsWith('/ai-act-readiness')`; it is kept verbatim.
// (The original's second trigger, a red section mood, could never fire: no SECTION_MOODS glow starts with #ff4.)

export type GuideModeId = 'daena' | 'klyntar'

export type GuideModeMeta = {
  id: GuideModeId
  name: 'Daena' | 'Klyntar'
  subtitle: 'AI Guide' | 'Security Mode'
  /** Face crop. Daena: the portrait the owner asked for in the collapsed state. Klyntar: the original symbiote half-face. */
  avatar: string
  avatarWidth: number
  avatarHeight: number
  /** object-position that centres the face in a square crop (Klyntar's face sits at the middle-right of its frame). */
  avatarPosition: string
  /** Alt text, as in the original. */
  alt: string
  /** CSS colour for the accent. Daena uses the cyan token; Klyntar keeps the original red, exactly. */
  accent: string
  /** Line in the hover bubble beside the launcher (desktop pointer only). */
  hover: string
}

export const MODES: Record<GuideModeId, GuideModeMeta> = {
  daena: {
    id: 'daena',
    name: 'Daena',
    subtitle: 'AI Guide',
    avatar: '/assets/img/daena-avatar-new.png',
    avatarWidth: 600,
    avatarHeight: 381,
    avatarPosition: '52% 0%',
    alt: 'Daena, AI guide',
    accent: 'var(--cyan)',
    hover: 'Bring me a problem.',
  },
  klyntar: {
    id: 'klyntar',
    name: 'Klyntar',
    subtitle: 'Security Mode',
    avatar: '/assets/img/klyntar-avatar.png',
    avatarWidth: 600,
    avatarHeight: 356,
    avatarPosition: '50% 0%',
    alt: 'Klyntar, security mode',
    accent: '#ff4060',
    hover: 'Show me what you run.',
  },
}

/** Klyntar on /security* and /ai-act-readiness*, Daena everywhere else. */
export function guideMode(pathname: string): GuideModeId {
  return pathname.startsWith('/security') || pathname.startsWith('/ai-act-readiness') ? 'klyntar' : 'daena'
}
