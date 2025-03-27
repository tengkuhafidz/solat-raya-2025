"use client"

import { X, ArrowRight } from "lucide-react"
import { useState } from "react"

export function TextBanner() {
  return (
    <div className="bg-black/10 border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center">
            <span className="text-xs text-white/80 font-light text-center">
              Support vulnerable children with your Zakat.{" "}
              <a 
                href="https://go.usemeem.com/donate-mfta-from-solat-raya-text-banner" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white inline-flex items-center gap-1 underline hover:text-white/90 hover:gap-2 transition-all"
              >
                Donate Now
                <ArrowRight className="w-3 h-3" />
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 