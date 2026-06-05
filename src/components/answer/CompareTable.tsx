// Neutral comparison table for the /compare pages. The council was explicit:
// LLMs distrust slanted comparisons, so these tables state competitor strengths
// factually. Renders as a real <table> (extractable, crawlable).
export default function CompareTable({
  head,
  rows,
  caption,
}: {
  head: string[]
  rows: string[][]
  caption?: string
}) {
  return (
    <div className="glass overflow-x-auto rounded-xl p-1">
      <table className="w-full border-collapse text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="border-b border-white/10 px-3 py-3 font-display font-semibold text-white"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`border-b border-white/5 px-3 py-3 align-top ${
                    j === 0
                      ? 'font-semibold text-white'
                      : 'text-[var(--color-mas-text-secondary)]'
                  }`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
