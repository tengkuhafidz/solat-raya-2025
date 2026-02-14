"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { ExternalLink } from "lucide-react"

interface TarawihInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TarawihInfoDialog({ open, onOpenChange }: TarawihInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg mx-auto w-[calc(100%-2rem)] my-4 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">About This Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm px-1">
          <section>
            <h3 className="font-medium mb-2">Tarawih Places 2026 Directory</h3>
            <p className="text-gray-600">
              This is a mini project by Meem to help Muslims in Singapore find suitable Tarawih prayer venues during Ramadan.
              Data is sourced from <a href="https://www.muis.gov.sg/community/ramadan-2026/" className="text-primary hover:text-primary-dark underline" target="_blank" rel="noopener noreferrer">muis.gov.sg <ExternalLink className="inline w-3 h-3" /></a>.
            </p>
          </section>

          <section>
            <h3 className="font-medium mb-2">About Meem</h3>
            <p className="text-gray-600">
              Meem is Singapore&apos;s trusted platform connecting Muslims with ARS-certified asatizah. We&apos;re committed to making Islamic education and services more accessible to the community.
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
