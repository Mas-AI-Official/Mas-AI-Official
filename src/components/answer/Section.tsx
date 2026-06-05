import type { ReactNode } from 'react'

// A body section: question/statement H2 + crawlable prose. Used inside AnswerLayout.
export function Section({ h2, children }: { h2: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold text-white sm:text-2xl">{h2}</h2>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-[var(--color-mas-text-secondary)] sm:text-base">
        {children}
      </div>
    </section>
  )
}
