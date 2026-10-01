import type { Metadata, Viewport } from 'next'
import { Archivo, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { RevealRoot } from '@/components/site/RevealRoot'
import { GuideMount } from '@/components/site/GuideMount'
import { CampaignMemo } from '@/components/site/CampaignMemo'
import { siteGraph, ld, SITE_URL } from '@/lib/seo'

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const DESCRIPTION =
  'MAS-AI maps how your business runs, finds the gap, and builds the software, automation or AI that closes it. Private or cloud. Founder-led, Ontario, Canada.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MAS-AI | We build the system your business is missing',
    template: '%s | MAS-AI',
  },
  description: DESCRIPTION,
  applicationName: 'MAS-AI Technologies',
  authors: [{ name: 'MAS-AI Technologies Inc.' }],
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/`,
    siteName: 'MAS-AI Technologies',
    title: 'MAS-AI | We build the system your business is missing',
    description: DESCRIPTION,
    locale: 'en_CA',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'MAS-AI Technologies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAS-AI | We build the system your business is missing',
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/icon-192.png', type: 'image/png', sizes: '192x192' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.json',
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0b0d0f',
  colorScheme: 'dark',
}

// Marks JS as available before first paint so reveal start states exist only when a script can finish them.
const JS_FLAG = "document.documentElement.classList.add('js')"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(siteGraph()) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <RevealRoot />
        <GuideMount />
        <CampaignMemo />
      </body>
    </html>
  )
}
