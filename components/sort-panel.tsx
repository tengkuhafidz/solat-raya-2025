"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortPanelProps {
  postalCode: string
  setPostalCode: (code: string) => void
  onSortByDistance: () => void
  isLoading: boolean
  isSorted: boolean
  sortedPostalCode?: string
}

export function SortPanel({
  postalCode,
  setPostalCode,
  onSortByDistance,
  isLoading,
  isSorted,
  sortedPostalCode
}: SortPanelProps) {
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setPostalCode(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && postalCode.length === 6 && !isLoading) {
      onSortByDistance()
    }
  }

  return (
    <Card className="bg-white/95 backdrop-blur border-0 shadow-xl max-w-lg mx-auto">
      <CardContent className="py-4">
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <div className="flex-1 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={handlePostalCodeChange}
              onKeyDown={handleKeyDown}
              className="border-white/20 bg-white/50 backdrop-blur focus-visible:ring-primary/20"
              maxLength={6}
            />
            {isSorted && sortedPostalCode && (
              <p className="text-xs text-slate/80 mt-1">
                ✓ Sorted by distance from {sortedPostalCode}
              </p>
            )}
          </div>
          <Button
            variant="default"
            className={cn(
              "w-full sm:w-auto whitespace-nowrap transition-colors relative overflow-hidden sm:mt-0",
              // Only add shine effect when disabled
              (postalCode.length !== 6 || isLoading) && [
                "after:absolute after:inset-0 after:translate-x-[-100%] after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent",
                "after:animate-shine after:duration-1000"
              ],
              postalCode.length === 6 && !isLoading 
                ? isSorted 
                  ? 'bg-gray-700 hover:bg-gray-800' 
                  : 'bg-gray-900 hover:bg-gray-800'
                : 'bg-gray-600 hover:bg-gray-700 text-gray-100'
            )}
            onClick={onSortByDistance}
            disabled={postalCode.length !== 6 || isLoading}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {isLoading 
              ? "Getting location..." 
              : isSorted 
                ? "Update Postal Code"
                : "Sort by Distance"
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 