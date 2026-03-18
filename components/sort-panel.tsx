"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, LocateFixed } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortPanelProps {
  postalCode: string
  setPostalCode: (code: string) => void
  onSortByDistance: () => void
  onUseMyLocation: () => void
  isLoading: boolean
  isGeolocating: boolean
  isSorted: boolean
  sortedPostalCode?: string
  sortedByGeolocation: boolean
  geoError?: string
}

export function SortPanel({
  postalCode,
  setPostalCode,
  onSortByDistance,
  onUseMyLocation,
  isLoading,
  isGeolocating,
  isSorted,
  sortedPostalCode,
  sortedByGeolocation,
  geoError,
}: SortPanelProps) {
  const anyLoading = isLoading || isGeolocating

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setPostalCode(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && postalCode.length === 6 && !anyLoading) {
      onSortByDistance()
    }
  }

  return (
    <Card className="bg-white/95 backdrop-blur border-0 shadow-xl max-w-lg mx-auto">
      <CardContent className="py-4">
        <div className="flex flex-col gap-3">
          {/* Postal code row */}
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
              {isSorted && sortedPostalCode && !sortedByGeolocation && (
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
                (postalCode.length !== 6 || anyLoading) && [
                  "after:absolute after:inset-0 after:translate-x-[-100%] after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent",
                  "after:animate-shine after:duration-1000"
                ],
                postalCode.length === 6 && !anyLoading
                  ? isSorted && !sortedByGeolocation
                    ? 'bg-gray-700 hover:bg-gray-800'
                    : 'bg-gray-900 hover:bg-gray-800'
                  : 'bg-gray-600 hover:bg-gray-700 text-gray-100'
              )}
              onClick={onSortByDistance}
              disabled={postalCode.length !== 6 || anyLoading}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {isLoading
                ? "Getting location..."
                : isSorted && !sortedByGeolocation
                  ? "Update Postal Code"
                  : "Sort by Distance"
              }
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Use My Location button */}
          <div>
            <Button
              variant="default"
              className={cn(
                "w-full whitespace-nowrap transition-colors relative overflow-hidden",
                sortedByGeolocation
                  ? 'bg-gray-700 hover:bg-gray-800'
                  : 'bg-gray-900 hover:bg-gray-800'
              )}
              onClick={onUseMyLocation}
              disabled={anyLoading}
            >
              <LocateFixed className="h-4 w-4 mr-2" />
              {isGeolocating
                ? "Getting your location..."
                : sortedByGeolocation
                  ? "Update My Location"
                  : "Nearest to My Location"
              }
            </Button>
            {sortedByGeolocation && isSorted && (
              <p className="text-xs text-slate/80 mt-1">
                ✓ Sorted by your current location
              </p>
            )}
            {geoError && (
              <p className="text-xs text-red-600 mt-1">
                {geoError}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 