import { RedirectStub } from '@/components/site/RedirectStub'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Security, evaluation and governance',
  description: 'This page has moved to the security page.',
  path: '/security/',
  noindex: true,
})

export default function ConsultingPage() {
  return <RedirectStub to="/security/" label="Security, evaluation and governance" />
}
