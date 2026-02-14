"use client"

import type { TarawihVenue } from "@/types/tarawih-venue"
import { TarawihCard } from "@/components/tarawih/tarawih-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, RefObject, useEffect } from "react"
import { calculateDistance } from "@/lib/utils"

interface TarawihListProps {
  venues: TarawihVenue[]
  scrollRef: RefObject<HTMLDivElement>
  userCoords?: { lat: number; lng: number } | null
}

export function TarawihList({ venues, scrollRef, userCoords }: TarawihListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    setCurrentPage(1)
  }, [venues])

  const totalPages = Math.ceil(venues.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVenues = venues.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  if (venues.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-800">No venues found</h3>
        <p className="text-gray-600 mt-2">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentVenues.map((venue) => (
          <TarawihCard
            key={`${venue.type}-${venue.locationName}`}
            venue={venue}
            distance={userCoords && venue.coordinates ?
              calculateDistance(
                userCoords.lat,
                userCoords.lng,
                venue.coordinates.lat,
                venue.coordinates.lng
              ) : undefined
            }
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="text-primary hover:text-primary-dark"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-gray-500 px-4">
            Page {currentPage} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="text-primary hover:text-primary-dark"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
