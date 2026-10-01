import { faqJsonLd, ld } from '@/lib/seo'

type Item = { q: string; a: string }

/** FAQ with native disclosure and FAQPage JSON-LD built from the same strings. */
export function Faq({ items, title = 'Questions', id = 'faq' }: { items: Item[]; title?: string; id?: string }) {
  return (
    <section id={id} className="section faq" aria-labelledby={`${id}-title`}>
      <div className="wrap faq__grid">
        <h2 id={`${id}-title`} className="t-h2">
          {title}
        </h2>
        <div className="faq__list">
          {items.map((f) => (
            <details key={f.q} className="faq__item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(faqJsonLd(items)) }} />
    </section>
  )
}
