import Link from 'next/link'

/**
 * GitHub Pages has no server redirects. A zero-delay meta refresh is read by Google as a permanent
 * redirect; the page also carries the destination canonical (set in the route's metadata) and a
 * visible link for people and crawlers without refresh support. Use only when the destination
 * substantially covers the old page's intent (Codex astra-review D8).
 */
export function RedirectStub({ to, label }: { to: string; label: string }) {
  return (
    <section className="section">
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <div className="wrap">
        <h1 className="t-h2">This page has moved.</h1>
        <p className="t-lead">
          It now lives at{' '}
          <Link href={to} className="link">
            {label}
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
