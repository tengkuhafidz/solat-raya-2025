"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { ExternalLink } from "lucide-react"

interface InfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InfoDialog({ open, onOpenChange }: InfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg mx-auto w-[calc(100%-2rem)] my-4 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">About This Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm px-1">
          <section>
            <h3 className="font-medium mb-2">Solat Raya 2025 Prayer Sessions</h3>
            <p className="text-gray-600">
              This is a mini project by Meem to help Muslims in Singapore find suitable Solat Raya prayer venues.
              Data is sourced from <a href="https://www.instagram.com/p/DKRYAejuyTH/?igsh=bzExZjVtczNybHl1" className="text-primary hover:text-primary-dark underline" target="_blank" rel="noopener noreferrer">muis.sg <ExternalLink className="inline w-3 h-3" /></a>, Last updated on 31 May 2025.
            </p>
          </section>

          <section>
            <h3 className="font-medium mb-2">About Meem</h3>
            <p className="text-gray-600">
              Meem is Singapore's trusted platform connecting Muslims with ARS-certified asatizah. We're committed to making Islamic education and services more accessible to the community.
            </p>
            <div className="mt-2">
              <a
                href="https://meem.to/from-solat-raya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary-dark"
              >
                Visit Meem <ExternalLink className="ml-1 w-3 h-3" />
              </a>
            </div>
          </section>

        </div>
      </DialogContent>
    </Dialog>
  )
} 