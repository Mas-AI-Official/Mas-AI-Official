'use client'

import { useEffect } from 'react'
import { rememberCampaign, tabStore } from '@/lib/attribution'

/** Remembers the utm_* labels of the landing link for this tab, so an inquiry sent later can carry them. */
export function CampaignMemo() {
  useEffect(() => {
    rememberCampaign(window.location.search, tabStore())
  }, [])
  return null
}
