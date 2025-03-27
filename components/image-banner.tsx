"use client"

import { useState } from "react"

export function ImageBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="flex justify-center">
      <div className="w-[728px] h-[90px] bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center">
        <span className="text-white/40 text-sm">Image Space (728 × 90)</span>
      </div>
    </div>
  )
} 