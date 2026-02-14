import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"
import { GoogleAnalytics } from "@/components/google-analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Tarawih Places 2026 Singapore | Mosque & Qaryah Venues',
  description: 'Find Tarawih prayer venues across Singapore mosques and qaryah locations during Ramadan 2026. View rakaat, services, and directions.',
  keywords: 'tarawih, ramadan prayers, singapore mosques, tarawih venues, qaryah, ramadan 2026, masjid singapore',
  openGraph: {
    title: 'Tarawih Places 2026 Singapore | Mosque & Qaryah Venues',
    description: 'Find Tarawih prayer venues across Singapore mosques and qaryah locations during Ramadan 2026.',
    type: 'website',
    locale: 'en_SG',
    url: 'https://solat-raya.usemeem.com',
    siteName: 'Tarawih Singapore',
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarawih Places 2026 Singapore | Mosque & Qaryah Venues",
    description: "Find Tarawih prayer venues across Singapore mosques and qaryah locations during Ramadan 2026.",
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
              "name": "Tarawih Places 2026 Singapore",
              "description": "Find Tarawih prayer venues across Singapore mosques and qaryah locations during Ramadan 2026",
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
