import { Check, Minus, X } from 'lucide-react'
import { FIT_LABEL, MODES, type Fit, type ServiceContent } from '@/content/services'

const ICON: Record<Fit, React.ReactNode> = {
  fits: <Check aria-hidden="true" />,
  limits: <Minus aria-hidden="true" />,
  no: <X aria-hidden="true" />,
}

/** Deployment-mode row: five modes on one rail. Status is always words plus an icon, never colour alone. */
export function Runs({ runs }: { runs: ServiceContent['runs'] }) {
  return (
    <section id="runs" className="section svp-runs" aria-labelledby="runs-title">
      <div className="wrap">
        <div className="svp-head svp-head--wide">
          <h2 id="runs-title" className="t-h2" data-reveal>
            {runs.title}
          </h2>
          <p className="t-lead">{runs.intro}</p>
        </div>
        <ol className="svp-modes">
          {MODES.map((m, i) => {
            const r = runs.modes[m.id]
            return (
              <li key={m.id} className="svp-mode" data-fit={r.fit} data-reveal style={{ ['--i' as string]: i }}>
                <span className="svp-mode__dot" aria-hidden="true" />
                <h3 className="t-h4">{m.name}</h3>
                <p className="svp-mode__fit">
                  {ICON[r.fit]}
                  {FIT_LABEL[r.fit]}
                </p>
                <p className="t-small">{r.note}</p>
              </li>
            )
          })}
        </ol>
        {runs.note ? <p className="t-small svp-runs__note">{runs.note}</p> : null}
      </div>
    </section>
  )
}
