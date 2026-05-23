'use client'

import { useEffect, useState } from 'react'

// SSR-safe media query hook. Returns `false` during SSR / first paint and
// updates after mount. Components that gate desktop-only effects on this
// will render the mobile path first, then upgrade to desktop on hydration —
// which is the right direction (mobile clients should never pay for desktop
// effects they don't get to use, but desktop clients tolerate one cheap
// repaint just fine).
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

// Convenience: matches Tailwind's `md` breakpoint (≥768px). Returns `true`
// when the viewport is mobile-sized. Touch-capability is intentionally not
// part of this check — a stylus tablet at 1280px should get the desktop
// treatment, and a touch laptop at 800px should get the mobile treatment.
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}
