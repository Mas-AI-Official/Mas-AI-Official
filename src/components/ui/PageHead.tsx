import Link from 'next/link'
import { breadcrumbJsonLd, ld } from '@/lib/seo'

type Crumb = { name: string; path: string }

/** Standard page header for every non-home page: breadcrumb, H1, lead, optional actions. */
export function PageHead({
  title,
  lead,
  crumbs,
  children,
  visual,
  id = 'page-head',
}: {
  title: string
  lead?: string
  crumbs: Crumb[]
  children?: React.ReactNode
  /** Decorative visual beside the heading on wide screens (service pages: the living system). */
  visual?: React.ReactNode
  id?: string
}) {
  const trail = [{ name: 'Home', path: '/' }, ...crumbs]
  return (
    <section id={id} className={visual ? 'page-head page-head--visual' : 'page-head'} aria-labelledby={`${id}-title`}>
      <div className="wrap page-head__grid">
      <div className="page-head__inner">
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            {trail.map((c, i) => (
              <li key={c.path}>
                {i < trail.length - 1 ? <Link href={c.path}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <h1 id={`${id}-title`} className="t-display page-head__title">
          {title}
        </h1>
        {lead ? <p className="t-lead page-head__lead">{lead}</p> : null}
        {children ? <div className="page-head__actions">{children}</div> : null}
      </div>
      {visual ? <div className="page-head__visual">{visual}</div> : null}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(breadcrumbJsonLd(trail)) }} />
    </section>
  )
}
