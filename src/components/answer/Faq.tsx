import type { FaqItem } from '@/lib/answer-seo'

// Visible FAQ using native <details> — fully crawlable, zero JS, and the
// rendered text matches the FAQPage JSON-LD 1:1 (no schema-only questions,
// which Google penalizes as spam).
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
        Frequently asked questions
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        {items.map((it, i) => (
          <details key={i} className="glass rounded-xl px-5 py-4">
            <summary className="cursor-pointer font-display text-base font-semibold text-white">
              {it.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-mas-text-secondary)] sm:text-base">
              {it.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
