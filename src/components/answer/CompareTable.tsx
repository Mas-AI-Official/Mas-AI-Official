// Neutral comparison table for the /compare pages. Competitor strengths are stated factually and every
// competitor claim on the page carries a source. A real <table>: extractable and crawlable.
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
    <div className="answer-table surface" role="region" aria-label={caption} tabIndex={0}>
      <table>
        {caption ? <caption className="visually-hidden">{caption}</caption> : null}
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    {c}
                  </th>
                ) : (
                  <td key={j}>{c}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
