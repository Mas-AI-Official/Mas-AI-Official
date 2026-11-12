import { Clapperboard, Image as ImageIcon, Megaphone } from 'lucide-react'
import { GROWTH } from '@/content/growth'

const ICONS = { video: Clapperboard, post: ImageIcon, ad: Megaphone } as const

/**
 * Page-head visual for /growth/: the weekly approval list, the thing the service is built around.
 * An illustration with an example business, labelled as one. Read as a single image by assistive tech;
 * the same facts are in the loop section as text.
 */
export function ApprovalBoard() {
  const b = GROWTH.board
  return (
    <figure className="gr-board" role="img" aria-label={b.alt}>
      <div className="gr-board__head" aria-hidden="true">
        <span className="t-label">{b.label}</span>
        <span className="t-mono">{b.count}</span>
      </div>
      <ul className="gr-board__list" aria-hidden="true">
        {b.items.map((it) => {
          const Icon = ICONS[it.kind]
          return (
            <li key={it.title} className="gr-board__item" data-state={it.state}>
              <span className="gr-board__kind">
                <Icon aria-hidden="true" />
                <span className="t-mono">{b.kinds[it.kind]}</span>
                <span className="t-mono gr-board__meta">{it.meta}</span>
              </span>
              <span className="gr-board__title">{it.title}</span>
              <span className="gr-board__foot">
                <span className="t-mono gr-board__state">{b.states[it.state]}</span>
                {it.state === 'wait' ? (
                  <span className="gr-board__acts">
                    <span className="gr-board__act" data-primary="">
                      {b.actions[0]}
                    </span>
                    <span className="gr-board__act">{b.actions[1]}</span>
                  </span>
                ) : null}
              </span>
            </li>
          )
        })}
      </ul>
      <figcaption className="gr-board__cap" aria-hidden="true">
        <span className="t-small">{b.foot}</span>
        <span className="t-mono">{b.note}</span>
      </figcaption>
    </figure>
  )
}
