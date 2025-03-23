import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"
import { GoogleAnalytics } from "@/components/google-analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Solat Raya 2025 Singapore | Prayer Locations & Timings',
  description: 'Find Hari Raya Aidilfitri prayer locations across Singapore mosques. View prayer times, khutbah languages, and directions to all mosques and supplementary prayer spaces.',
  keywords: 'solat raya, hari raya prayers, singapore mosques, aidilfitri prayers, raya prayer times, masjid singapore',
  openGraph: {
    title: 'Solat Raya 2025 Singapore | Prayer Locations & Timings',
    description: 'Find Hari Raya prayers across Singapore mosques. View prayer times, khutbah languages & directions.',
    type: 'website',
    locale: 'en_SG',
    url: 'https://solat-raya.usemeem.com',
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
    title: "Solat Raya 2025 Prayer Sessions",
    description: "Find prayer sessions across various locations for Hari Raya 2025",
    images: ["/preview.jpg"]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Solat Raya 2025 Singapore",
              "description": "Find Hari Raya prayer locations across Singapore mosques",
              "provider": {
                "@type": "Organization",
                "name": "Meem",
                "url": "https://meem.to"
              }
            })
          }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}



import './globals.css'
