import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"
import { GoogleAnalytics } from "@/components/google-analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Solat Raya 2025 Prayer Sessions",
  description: "Find prayer sessions across various locations for Hari Raya 2025",
  openGraph: {
    title: "Solat Raya 2025 Prayer Sessions",
    description: "Find prayer sessions across various locations for Hari Raya 2025",
    images: [
      {
        url: "/preview.jpg",
        width: 1200,
        height: 630,
        alt: "Solat Raya 2025 Prayer Sessions"
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
      <head />
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
