import Image from 'next/image'

/**
 * MAS-AI Growth lockup: the existing MAS-AI mark, the parent name, the service name.
 * It is the parent logo plus one plain word, not a second logo. The line under it is optional.
 */
export function GrowthLockup({ line }: { line?: string }) {
  return (
    <p className="gr-lockup">
      <span className="gr-lockup__row">
        <Image src="/brand/mark-128.png" alt="" width={44} height={44} priority />
        <span className="gr-lockup__name">
          MAS-AI <span className="gr-lockup__sub">Growth</span>
        </span>
      </span>
      {line ? <span className="gr-lockup__line">{line}</span> : null}
    </p>
  )
}
