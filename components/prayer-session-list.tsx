"use client"

import type { PrayerSession } from "@/types/prayer-session"
import { PrayerSessionCard } from "@/components/prayer-session-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef, RefObject, useEffect } from "react"
import { calculateDistance } from "@/lib/utils"

interface PrayerSessionListProps {
  sessions: PrayerSession[]
  scrollRef: RefObject<HTMLDivElement>
  userCoords?: { lat: number; lng: number } | null
}

export function PrayerSessionList({ sessions, scrollRef, userCoords }: PrayerSessionListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 // Show 6 cards per page

  // Reset to page 1 when sessions array changes (i.e., when filters change)
  useEffect(() => {
    setCurrentPage(1)
  }, [sessions])

  const totalPages = Math.ceil(sessions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSessions = sessions.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Scroll to the container that includes the locations count
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-800">No prayer sessions found</h3>
        <p className="text-gray-600 mt-2">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentSessions.map((session) => (
          <PrayerSessionCard 
            key={session["Location Name"]} 
            session={session} 
            distance={userCoords && session.coordinates ? 
              calculateDistance(
                userCoords.lat,
                userCoords.lng,
                session.coordinates.lat,
                session.coordinates.lng
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

