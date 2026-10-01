import { RedirectStub } from '@/components/site/RedirectStub'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Start a conversation',
  description: 'This page has moved to the inquiry page.',
  path: '/start/',
  noindex: true,
})

export default function BookPage() {
  return <RedirectStub to="/start/" label="Start a conversation" />
}
