import type { FaqItem } from '@/lib/answer-seo'

/**
 * Visible FAQ on native <details>: crawlable, no JavaScript, and the text matches the FAQPage JSON-LD in the
 * page graph one to one. The JSON-LD lives in AnswerLayout's graph, so this component emits none.
 */
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section className="answer-sec" aria-labelledby="answer-faq-title">
      <h2 id="answer-faq-title" className="t-h3">
        Questions
      </h2>
      <div className="answer-faq">
        {items.map((it) => (
          <details key={it.q} className="answer-faq__item">
            <summary>{it.q}</summary>
            <p>{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
