// Route-level loading state. Next.js renders this between the moment the
// user clicks a link and the moment the new route's static HTML is ready
// in the browser. On mobile, this is the difference between "tap CTA →
// black screen → page" and "tap CTA → branded splash → page".
//
// Intentionally tiny: no client components, no JS, no animations that need
// hydration. Pure CSS keyframes so it's painted on the very first frame.

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(0,200,255,0.10) 0%, transparent 55%), #080b14',
        color: '#e8eaf0',
      }}
    >
      <div
        aria-hidden
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: '2px solid rgba(0, 200, 255, 0.18)',
          borderTopColor: '#00c8ff',
          animation: 'mas-spin 0.9s linear infinite',
          boxShadow: '0 0 24px rgba(0, 200, 255, 0.25)',
        }}
      />
      <div
        style={{
          fontFamily: 'var(--font-mono), ui-monospace, monospace',
          fontSize: 11,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#94a3b8',
          opacity: 0.85,
        }}
      >
        MAS-AI
      </div>
      <style>{`
        @keyframes mas-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
