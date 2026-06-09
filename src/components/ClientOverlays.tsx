'use client'

import dynamic from 'next/dynamic'

// Decorative / interactive chrome that is NOT needed for first paint or SEO.
// Loading these with next/dynamic (ssr:false) keeps them out of the initial
// JS chunk, so mobile downloads + renders the actual content first and pulls
// the canvas, custom cursor, and chatbot in afterwards. This is the cold-load
// win for phones: the 756-line DaenaGuide chatbot (framer-motion) and the
// PhiLattice canvas no longer block the critical path.
const PhiLatticeBackground = dynamic(() => import('./PhiLatticeBackground'), { ssr: false })
const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false })
const DaenaGuide = dynamic(() => import('./DaenaGuide'), { ssr: false })

export default function ClientOverlays() {
  return (
    <>
      <PhiLatticeBackground />
      <CustomCursor />
      <DaenaGuide />
    </>
  )
}
