import { Hub } from '@/components/services/Hub'
import { HUB } from '@/content/services'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({ title: HUB.meta.title, description: HUB.meta.description, path: '/services/' })

export default function Page() {
  return <Hub />
}
