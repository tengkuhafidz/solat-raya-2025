"use client"

import { FilterPanel } from "@/components/filter-panel"
import { InfoDialog } from "@/components/info-dialog"
import { PrayerSessionList } from "@/components/prayer-session-list"
import { SortPanel } from "@/components/sort-panel"
import prayerSessionsData from "@/data/prayer-sessions.json"
import { calculateDistance } from "@/lib/utils"
import type { PrayerSession } from "@/types/prayer-session"
import { Info, Map, ExternalLink } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

function getInitialParams() {
  if (typeof window === "undefined") return {}
  const params = new URLSearchParams(window.location.search)
  return {
    district: params.get("district") || "all",
    session: params.get("session") || "all",
    language: params.get("language") || "all",
    type: params.get("type") || "all",
    search: params.get("search") || "",
    postal: params.get("postal") || "",
    crowded: params.get("crowded") === "1",
  }
}

export default function Home() {
  const [filteredSessions, setFilteredSessions] = useState<PrayerSession[]>([])
  const listContainerRef = useRef<HTMLDivElement>(null)
  const initialParams = useRef(getInitialParams())

  // Filter states — initialized from URL params
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialParams.current.district || "all")
  const [selectedSession, setSelectedSession] = useState<string>(initialParams.current.session || "all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialParams.current.language || "all")
  const [locationType, setLocationType] = useState<string>(initialParams.current.type || "all")
  const [searchTerm, setSearchTerm] = useState(initialParams.current.search || "")
  const [postalCode, setPostalCode] = useState(initialParams.current.postal || "")
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null)
  const [isSortedByDistance, setIsSortedByDistance] = useState(false)
  const [sortedPostalCode, setSortedPostalCode] = useState("")
  const [isGeolocating, setIsGeolocating] = useState(false)
  const [geoError, setGeoError] = useState("")
  const [sortedByGeolocation, setSortedByGeolocation] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [showLessCrowded, setShowLessCrowded] = useState(initialParams.current.crowded || false)

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

  // Sync filter state to URL query params
  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams()
    if (selectedDistrict !== "all") params.set("district", selectedDistrict)
    if (selectedSession !== "all") params.set("session", selectedSession)
    if (selectedLanguage !== "all") params.set("language", selectedLanguage)
    if (locationType !== "all") params.set("type", locationType)
    if (searchTerm) params.set("search", searchTerm)
    if (sortedPostalCode) params.set("postal", sortedPostalCode)
    if (showLessCrowded) params.set("crowded", "1")

    const qs = params.toString()
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    window.history.replaceState(null, "", newUrl)
  }, [selectedDistrict, selectedSession, selectedLanguage, locationType, searchTerm, sortedPostalCode, showLessCrowded])

  useEffect(() => {
    updateQueryParams()
  }, [updateQueryParams])

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

  // Auto-trigger postal code sort if postal param is present on mount
  const hasAutoSorted = useRef(false)
  useEffect(() => {
    if (hasAutoSorted.current) return
    const postal = initialParams.current.postal
    if (postal && postal.length === 6) {
      hasAutoSorted.current = true
      geocodePostalCode(postal).then((success) => {
        if (success) {
          setIsSortedByDistance(true)
          setSortedPostalCode(postal)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSortByDistance = async () => {
    if (!postalCode) return

    const success = await geocodePostalCode(postalCode)
    if (!success) return

    setIsSortedByDistance(true)
    setSortedPostalCode(postalCode)
    setSortedByGeolocation(false)
    setGeoError("")
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser")
      return
    }

    setIsGeolocating(true)
    setGeoError("")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsSortedByDistance(true)
        setSortedByGeolocation(true)
        setSortedPostalCode("")
        setIsGeolocating(false)
      },
      (error) => {
        let message = "Unable to get your location"
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location permission denied. Please use postal code instead."
        } else if (error.code === error.TIMEOUT) {
          message = "Location request timed out. Please try again or use postal code."
        }
        setGeoError(message)
        setIsGeolocating(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
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
                Solat Raya Aidiladha 2026
              </h1>
              <p className="text-white/80 max-w-md mx-auto mb-6">
                Find prayer sessions across various locations
              </p>

              <div className="mt-8">
                <SortPanel
                  postalCode={postalCode}
                  setPostalCode={setPostalCode}
                  onSortByDistance={handleSortByDistance}
                  onUseMyLocation={handleUseMyLocation}
                  isLoading={isGeocoding}
                  isGeolocating={isGeolocating}
                  isSorted={isSortedByDistance}
                  sortedPostalCode={sortedPostalCode}
                  sortedByGeolocation={sortedByGeolocation}
                  geoError={geoError}
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
              Source: <a href="https://www.muis.gov.sg/community/mosque/"
                className="underline hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >muis.sg</a> · 2026
            </div>
          </div>

          <PrayerSessionList
            sessions={filteredSessions}
            scrollRef={listContainerRef}
            userCoords={userCoords}
          />
        </div>

        {/* Map view callout */}
        <div className="text-center mt-10">
          <a
            href="https://mapiry.com/m/solat-raya-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/15 text-sm text-primary hover:bg-primary/10 transition-colors"
          >
            <Map className="w-4 h-4" />
            Prefer a rich map view?
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
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

