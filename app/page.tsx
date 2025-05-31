"use client"

import { FilterPanel } from "@/components/filter-panel"
import { InfoDialog } from "@/components/info-dialog"
import { PrayerSessionList } from "@/components/prayer-session-list"
import { SortPanel } from "@/components/sort-panel"
import prayerSessionsData from "@/data/prayer-sessions.json"
import { calculateDistance } from "@/lib/utils"
import type { PrayerSession } from "@/types/prayer-session"
import { Info } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const [filteredSessions, setFilteredSessions] = useState<PrayerSession[]>([])
  const listContainerRef = useRef<HTMLDivElement>(null)

  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
  const [selectedSession, setSelectedSession] = useState<string>("all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [locationType, setLocationType] = useState<string>("all")  // changed from showMosquesOnly
  const [searchTerm, setSearchTerm] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null)
  const [isSortedByDistance, setIsSortedByDistance] = useState(false)
  const [sortedPostalCode, setSortedPostalCode] = useState("")
  const [infoOpen, setInfoOpen] = useState(false)
  const [showLessCrowded, setShowLessCrowded] = useState(false)

  // Get unique districts for filter dropdown
  const districts = ["all", ...new Set(prayerSessionsData.map((session) => session.district))]

  // Get unique session times for filter dropdown
  const sessionTimes = [
    "all",
    ...Array.from(
      new Set(
        prayerSessionsData.flatMap((session) => session.sessions.map((s) => s.time))
      )
    ).sort((a, b) => {
      // Sort times in ascending order
      const parseTime = (t: string) => {
        const [h, m, period] = t.match(/(\d+):(\d+)\s*(AM|PM)/i)?.slice(1) || []
        let hour = parseInt(h)
        if (period?.toUpperCase() === "PM" && hour !== 12) hour += 12
        if (period?.toUpperCase() === "AM" && hour === 12) hour = 0
        return hour * 60 + parseInt(m)
      }
      return parseTime(a) - parseTime(b)
    })
  ]

  useEffect(() => {
    let result = [...prayerSessionsData]
    console.log("result", result)

    // Apply all filters first
    if (searchTerm) {
      result = result.filter((session) =>
        session.locationName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply district filter
    if (selectedDistrict !== "all") {
      result = result.filter((session) => session.district === selectedDistrict)
    }

    // Apply session time filter
    if (selectedSession !== "all") {
      result = result.filter((session) =>
        session.sessions.some((s) => s.time === selectedSession)
      )
    }

    // Apply location type filter
    switch (locationType) {
      case "mosques":
        result = result.filter((session) => session.type === "Mosque")
        break
      case "supplementary":
        result = result.filter((session) => session.type === "Qaryah")
        break
      // "all" case doesn't need filtering
    }

    // Apply language filter
    if (selectedLanguage !== "all") {
      result = result.filter((session) =>
        session.sessions.some(s => s.language?.includes(selectedLanguage))
      )
    }
    console.log("isSortedByDistance", isSortedByDistance)
    // Apply sorting based on state
    if (isSortedByDistance && userCoords) {
      console.log("sorting by distance", result)

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
        console.log("distanceA", a.locationName, distanceA)
        console.log("distanceB", b.locationName, distanceB)
        return distanceA - distanceB
      })
      console.log("sorted result", result)
    } else {
      console.log("sorting by location name", result)

      // Default sort by location name
      result.sort((a, b) => b.locationName.localeCompare(a.locationName))
      console.log("sorted by location name", result)

    }

    // Add Less Crowded filter
    if (showLessCrowded) {
      result = result.filter((session) => session.isLessCrowded)
    }

    setFilteredSessions(result as PrayerSession[])
  }, [selectedDistrict, selectedSession, selectedLanguage, locationType, searchTerm, userCoords, isSortedByDistance, showLessCrowded])

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
    setSortedPostalCode(postalCode)
  }

  return (
    <main className="min-h-screen bg-white hari-raya-pattern">
      {/* Hero section with purple gradient */}
      <div className="bg-gradient-to-b from-primary-dark to-primary">
        {/* Masthead with darker background */}
        <div className="bg-black/30 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center h-[30px]">
              <div className="flex items-center gap-2 text-[13px] text-white/60">
                <a href="https://meem.to/from-solat-raya" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/meem-logo.webp"
                    alt="Meem"
                    className="h-[16px] w-auto brightness-0 invert opacity-60"
                  />
                </a>
              </div>

              <button
                onClick={() => setInfoOpen(true)}
                className="text-[13px] text-white/60 hover:text-white/80 flex items-center gap-1 ml-auto"
              >
                More info
                <Info className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Text Banner - New addition */}
        {/* <ImageBanner /> */}

        {/* Hero content */}
        {/* <div className="mt-2 mx-2">
              <ImageBanner />
              </div> */}
        <div className="pb-8">
          <div className="container mx-auto px-4">

            <header className="text-center">
              <div className="flex items-center justify-center mb-3 mt-8">
                🕌 🌙 🇸🇬
              </div>
              <h1 className="text-4xl md:text-4xl font-bold text-white mb-2">
                Solat Raya Aidiladha 2025
              </h1>
              <p className="text-white/80 max-w-md mx-auto mb-6">
                Find prayer sessions across various locations
              </p>

              <div className="mt-8">
                <SortPanel
                  postalCode={postalCode}
                  setPostalCode={setPostalCode}
                  onSortByDistance={handleSortByDistance}
                  isLoading={isGeocoding}
                  isSorted={isSortedByDistance}
                  sortedPostalCode={sortedPostalCode}
                />
              </div>
            </header>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <FilterPanel
          districts={districts}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          sessionTimes={sessionTimes}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          locationType={locationType}
          setLocationType={setLocationType}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showLessCrowded={showLessCrowded}
          setShowLessCrowded={setShowLessCrowded}
        />

        <div ref={listContainerRef}>
          <div className="mt-8 mb-4 text-sm text-gray-500 flex items-center justify-between">
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
              {filteredSessions.length} locations
            </div>
            <div className="text-xs text-gray-400">
              Source: <a href="https://www.instagram.com/p/DKRYAejuyTH/?igsh=bzExZjVtczNybHl1"
                className="underline hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >muis.sg</a> · 31/5/2025
            </div>
          </div>

          <PrayerSessionList
            sessions={filteredSessions}
            scrollRef={listContainerRef}
            userCoords={userCoords}
          />
        </div>

        {/* Add subtle Meem plug */}
        <div className="text-center mt-12 pt-8 border-t text-sm text-gray-400">
          <p>
            Built with 💜 by the team at{" "}
            <a
              href="https://meem.to/from-solat-raya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-light transition-colors underline underline-offset-2"
            >
              Meem
            </a>
            {" "}· Singapore's trusted platform to find ARS-certified asatizah
          </p>
          <a
            href="https://meem.to/from-solat-raya"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-light transition-colors underline underline-offset-2"
          >
            <img
              src="/meem-logo.webp"
              alt="Meem Logo"
              width={32}
              height={32}
              className="mx-auto mt-4"
            />
          </a>
        </div>
      </div>

      <InfoDialog open={infoOpen} onOpenChange={setInfoOpen} />
    </main>
  )
}

