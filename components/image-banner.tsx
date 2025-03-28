"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

export function ImageBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="flex justify-center mt-2 px-4">
      <div
        className="w-full max-w-lg relative rounded overflow-hidden shadow-sm opacity-80 hover:opacity-100 transition-opacity duration-300"
        style={{ aspectRatio: '728/90' }}
      >
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-0 right-0 z-10 bg-black/30 hover:bg-black/70 text-white p-0.5 md:p-1 transition-colors"
          aria-label="Close banner"
        >
          <X className="h-2.5 w-2.5 md:h-3 md:w-3" />
        </button>
        <a href="https://go.usemeem.com/donate-mfta-from-solat-raya-text-banner" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
          <div className="absolute inset-0 bg-black/5"></div>
          <Image
            src="/mtfa-banner.jpg"
            alt="MTFA Zakat - Support vulnerable children with your Zakat"
            fill
            sizes="(max-width: 768px) 100vw, 512px"
            className="object-cover"
            priority
          />
        </a>
      </div>
    </div>
  )
} 