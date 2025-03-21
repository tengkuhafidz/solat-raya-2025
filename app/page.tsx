"use client"

import { FilterPanel } from "@/components/filter-panel"
import { PrayerSessionList } from "@/components/prayer-session-list"
import { SortPanel } from "@/components/sort-panel"
import prayerSessionsData from "@/data/prayer-sessions.json"
import { calculateDistance } from "@/lib/utils"
import type { PrayerSession } from "@/types/prayer-session"
import { useEffect, useState } from "react"

export default function Home() {
  const [filteredSessions, setFilteredSessions] = useState<PrayerSession[]>([])

  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
  const [selectedSession, setSelectedSession] = useState<string>("all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [locationType, setLocationType] = useState<string>("all")  // changed from showMosquesOnly
  const [searchTerm, setSearchTerm] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null)
  const [isSortedByDistance, setIsSortedByDistance] = useState(false)

  // Get unique districts for filter dropdown
  const districts = ["all", ...new Set(prayerSessionsData.map((session) => session.District))]

  useEffect(() => {
    let result = [...prayerSessionsData]

    // Apply all filters first
    if (searchTerm) {
      result = result.filter((session) => 
        session["Location Name"].toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply district filter
    if (selectedDistrict !== "all") {
      result = result.filter((session) => session.District === selectedDistrict)
    }

    // Apply session filter
    if (selectedSession !== "all") {
      switch (selectedSession) {
        case "Session 1":
          result = result.filter((session) => session["Session 1 Khutbah Language"] !== null)
          break
        case "Session 2":
          result = result.filter((session) => session["Session 2 Khutbah Language"] !== null)
          break
        case "Session 3":
          result = result.filter((session) => session["Session 3 Khutbah Language"] !== null)
          break
      }
    }

    // Apply location type filter
    switch (locationType) {
      case "mosques":
        result = result.filter((session) => session["Location Name"].startsWith("Masjid"))
        break
      case "supplementary":
        result = result.filter((session) => !session["Location Name"].startsWith("Masjid"))
        break
      // "all" case doesn't need filtering
    }

    // Apply language filter
    if (selectedLanguage !== "all") {
      result = result.filter((session) => 
        session["Session 1 Khutbah Language"]?.includes(selectedLanguage) ||
        session["Session 2 Khutbah Language"]?.includes(selectedLanguage) ||
        session["Session 3 Khutbah Language"]?.includes(selectedLanguage)
      )
    }

    // Apply sorting based on state
    if (isSortedByDistance && userCoords) {
      result.sort((a, b) => {
        if (!a.coordinates || !b.coordinates) return 0
        
        const distanceA = calculateDistance(
          userCoords.lat,
          userCoords.lng,
          a.coordinates.lat,
          a.coordinates.lng
        )
        const distanceB = calculateDistance(
          userCoords.lat,
          userCoords.lng,
          b.coordinates.lat,
          b.coordinates.lng
        )
        
        return distanceA - distanceB
      })
    } else {
      // Default sort by location name
      result.sort((a, b) => b["Location Name"].localeCompare(a["Location Name"]))
    }

    setFilteredSessions(result as PrayerSession[])
  }, [selectedDistrict, selectedSession, selectedLanguage, locationType, searchTerm, userCoords, isSortedByDistance])

  const geocodePostalCode = async (postalCode: string) => {
    setIsGeocoding(true)
    try {
      const response = await fetch(
        `/api/geocode?postalCode=${postalCode}`,
        {
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        const { LATITUDE, LONGITUDE } = data.results[0]
        setUserCoords({
          lat: parseFloat(LATITUDE),
          lng: parseFloat(LONGITUDE)
        })
        return true
      }
      throw new Error('No results found')
    } catch (error) {
      console.error('Geocoding error:', error)
      return false
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleSortByDistance = async () => {
    if (!postalCode) return
    
    const success = await geocodePostalCode(postalCode)
    if (!success) return
    
    setIsSortedByDistance(true)
  }

  return (
    <main className="min-h-screen bg-white hari-raya-pattern">
      {/* Hero section with purple gradient */}
      <div className="bg-gradient-to-b from-primary-dark to-primary py-8">
        <div className="container mx-auto px-4">
          <header className="text-center mb-8">
            <div className="flex items-center justify-center mb-3">
              🕌 🌙 🇸🇬
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Solat Raya 2025</h1>
            <p className="text-white/80 max-w-md mx-auto">Find prayer sessions across various locations in Singapore</p>
          </header>
          <div className="mt-8">
            <SortPanel
              postalCode={postalCode}
              setPostalCode={setPostalCode}
              onSortByDistance={handleSortByDistance}
              isLoading={isGeocoding}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <FilterPanel
          districts={districts}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          locationType={locationType}
          setLocationType={setLocationType}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="mt-8 mb-4 text-sm text-gray-500 flex items-center justify-between">
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
            {filteredSessions.length} locations
          </div>
          <div className="text-xs text-gray-400">
            Source: <a href="https://ramadan.ourmasjid.sg/hari-raya-puasa-prayer-arrangements/" 
              className="underline hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >SalaamSG</a> · Updated: 22/3/25
          </div>
        </div>

        <PrayerSessionList sessions={filteredSessions} />

        {/* Add subtle Meem plug */}
        <div className="text-center mt-12 pt-8 border-t text-sm text-gray-400">
          <p>
            Built with 💜 by the team at{" "}
            <a 
              href="https://usemeem.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-light transition-colors underline underline-offset-2"
            >
              Meem
            </a>
            {" "}· Singapore's trusted platform for ARS-certified Islamic teachers
          </p>
        </div>
      </div>
    </main>
  )
}

