import { ServicePage } from '@/components/services/ServicePage'
import { SERVICES } from '@/content/services'
import { pageMetadata } from '@/lib/seo'

const c = SERVICES['software']

export const metadata = pageMetadata({ title: c.meta.title, description: c.meta.description, path: c.path })

export default function Page() {
  return <ServicePage content={c} />
}
