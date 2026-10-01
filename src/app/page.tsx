import { Stage } from '@/components/home/Stage'
import { Capabilities } from '@/components/home/Capabilities'
import { SelectedWork } from '@/components/home/SelectedWork'
import { Company } from '@/components/home/Company'
import { Faq } from '@/components/home/Faq'
import { Closing } from '@/components/home/Closing'
import { FAQ } from '@/content/home'

// One pinned scenario (the business, the gap, the decision, the build, the deployment, the running system,
// the proof), then normal flow: capabilities (the same system in each shape), selected work, company,
// questions, the invitation.
// Section ids the site guide scrolls to (src/lib/guide/legacy.ts): hero, services, daena, work, company, start.
export default function Home() {
  return (
    <>
      <Stage />
      <Capabilities />
      <SelectedWork />
      <Company />
      <Faq items={FAQ} />
      <Closing />
    </>
  )
}
