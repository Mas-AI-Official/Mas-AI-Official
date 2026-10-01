import type { ReactNode } from 'react'

/** A body section: a plain H2 and crawlable prose. */
export function Section({ h2, children }: { h2: string; children: ReactNode }) {
  return (
    <section className="answer-sec">
      <h2 className="t-h3">{h2}</h2>
      <div className="prose">{children}</div>
    </section>
  )
}

/** Ordered steps, used for the request pipeline. Collapses to one column under 768px. */
export function Steps({ items, label }: { items: string[]; label: string }) {
  return (
    <ol className="answer-steps" aria-label={label}>
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ol>
  )
}

/** Inline list of short terms as chips. */
export function Terms({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className="answer-terms" aria-label={label}>
      {items.map((t) => (
        <li key={t} className="chip">
          {t}
        </li>
      ))}
    </ul>
  )
}

/** External sources for a claim about a third party. Links the original, not a summary. */
export function Sources({ items }: { items: { label: string; href: string }[] }) {
  return (
    <section className="answer-sec answer-sources" aria-labelledby="answer-sources-title">
      <h2 id="answer-sources-title" className="t-h4">
        Sources
      </h2>
      <ul className="prose">
        {items.map((s) => (
          <li key={s.href}>
            <a href={s.href} rel="noopener">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
