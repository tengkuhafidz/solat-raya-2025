import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: 'Solat Raya Aidiladha 2025 Singapore | Prayer Locations & Timings',
  description: 'Find Hari Raya Aidiladha prayer locations across Singapore mosques. View prayer times, khutbah languages, and directions to all mosques and supplementary prayer spaces.',
  keywords: 'solat raya, hari raya prayers, singapore mosques, aidiladha prayers, raya prayer times, masjid singapore',
  openGraph: {
    title: 'Solat Raya Aidiladha 2025 Singapore | Prayer Locations & Timings',
    description: 'Find Hari Raya Aidiladha prayers across Singapore mosques. View prayer times, khutbah languages & directions.',
    type: 'website',
    locale: 'en_SG',
    url: 'https://solat-raya.usemeem.com/aidiladha',
    siteName: 'Solat Raya Singapore',
    images: [
      {
        url: "/preview.jpg",
        width: 1200,
        height: 630,
        alt: "Solat Raya 2025 Singapore"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Solat Raya Aidiladha 2025 Prayer Sessions",
    description: "Find prayer sessions across various locations for Hari Raya Aidiladha 2025",
    images: ["/preview.jpg"]
  }
}

export default function AidiladhaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
