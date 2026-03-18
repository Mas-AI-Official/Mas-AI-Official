import type { Metadata } from 'next'
import InvestorContent from './InvestorContent'

export const metadata: Metadata = {
  title: 'Investor Overview',
  description:
    'MAS-AI Technologies investor information. Governance-first AI agent platform with two patent-pending architectures.',
}

export default function InvestorsPage() {
  return <InvestorContent />
}
