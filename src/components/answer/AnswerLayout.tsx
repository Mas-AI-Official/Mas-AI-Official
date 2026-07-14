import type { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PhiLatticeBackground from '@/components/PhiLatticeBackground'

type RelatedLink = { href: string; label: string }

// Shared shell for the GEO answer pages. Server component (no 'use client') so
// the H1, definitional answer, body, tables and FAQ are all in the static HTML
// that crawlers and LLM fetchers receive — no JS gate, no animation-hidden text.
export default function AnswerLayout({
  eyebrow,
  h1,
  tldr,
  proof,
  jsonLd,
  related,
  children,
}: {
  eyebrow: string
  h1: string
  tldr: string
  proof?: string[]
  jsonLd: object
  related?: RelatedLink[]
  children: ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PhiLatticeBackground />
      <Navbar />
      <main className="relative z-[2]" style={{ background: 'transparent' }}>
        <article className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          {/* Eyebrow + query-style H1 (the user's actual question) */}
          <p className="mb-4 text-sm uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            {eyebrow}
          </p>
          <h1 className="text-gradient font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {h1}
          </h1>

          {/* Definitional answer — the ~40-word sentence LLMs quote verbatim */}
          <div className="glass mt-8 rounded-xl border-l-2 border-l-[var(--color-mas-cyan)] p-6">
            <p className="text-base leading-relaxed text-[var(--color-mas-text-secondary)] sm:text-lg">
              {tldr}
            </p>
          </div>

          {/* Dated proof wall — counters the "too new / unverifiable" objection */}
          {proof && proof.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {proof.map((p) => (
                <li
                  key={p}
                  className="glass rounded-full px-3 py-1 text-xs font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)]"
                >
                  {p}
                </li>
              ))}
            </ul>
          )}

          {/* Body */}
          <div className="mt-12 flex flex-col gap-10">{children}</div>

          {/* CTA — the "after the click" the user converts on */}
          <div className="glass mt-16 rounded-2xl p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-white">
              See Daena&rsquo;s governance pipeline on your stack
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-mas-text-secondary)]">
              Book a 30-minute governed demo, or explore the live platform.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="https://mas-ai.co/book/"
                className="btn-ripple rounded-full bg-[var(--color-mas-cyan)] px-6 py-2.5 text-sm font-semibold text-black"
              >
                Book a demo
              </a>
              <a
                href="https://daena.mas-ai.co"
                className="rounded-full border border-[var(--color-mas-cyan)]/30 px-6 py-2.5 text-sm font-semibold text-[var(--color-mas-cyan)] transition-all hover:bg-[var(--color-mas-cyan)]/10"
              >
                Explore Daena
              </a>
            </div>
          </div>

          {/* Internal links — so these pages are not orphans */}
          {related && related.length > 0 && (
            <nav className="mt-12" aria-label="Related pages">
              <p className="mb-3 text-sm uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-text-muted)]">
                Related
              </p>
              <ul className="flex flex-col gap-2">
                {related.map((r) => (
                  <li key={r.href}>
                    <a href={r.href} className="text-[var(--color-mas-cyan)] hover:underline">
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
