"use client"

import { TarawihFilterPanel } from "@/components/tarawih/tarawih-filter-panel"
import { TarawihInfoDialog } from "@/components/tarawih/tarawih-info-dialog"
import { TarawihList } from "@/components/tarawih/tarawih-list"
import { SortPanel } from "@/components/sort-panel"
import tarawihVenuesData from "@/data/tarawih-venues.json"
import { calculateDistance } from "@/lib/utils"
import type { TarawihVenue } from "@/types/tarawih-venue"
import { Info } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function TarawihPage() {
  const [filteredVenues, setFilteredVenues] = useState<TarawihVenue[]>([])
  const listContainerRef = useRef<HTMLDivElement>(null)

  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
  const [venueType, setVenueType] = useState<string>("all")
  const [selectedRakaat, setSelectedRakaat] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null)
  const [isSortedByDistance, setIsSortedByDistance] = useState(false)
  const [sortedPostalCode, setSortedPostalCode] = useState("")
  const [infoOpen, setInfoOpen] = useState(false)
  const [showMuslimahSpace, setShowMuslimahSpace] = useState(false)
  const [showBuburDistribution, setShowBuburDistribution] = useState(false)
  const [showChildminding, setShowChildminding] = useState(false)
  const [showQiyamullail, setShowQiyamullail] = useState(false)

  const districts = ["all", ...new Set((tarawihVenuesData as TarawihVenue[]).map((v) => v.district))]

  useEffect(() => {
    let result = [...tarawihVenuesData] as TarawihVenue[]

    if (searchTerm) {
      result = result.filter((venue) =>
        venue.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedDistrict !== "all") {
      result = result.filter((venue) => venue.district === selectedDistrict)
    }

    switch (venueType) {
      case "mosques":
        result = result.filter((venue) => venue.type === "Mosque")
        break
      case "qaryah":
        result = result.filter((venue) => venue.type === "Qaryah")
        break
    }

    if (selectedRakaat !== "all") {
      result = result.filter((venue) => venue.rakaat.includes(selectedRakaat))
    }

    if (showMuslimahSpace) {
      result = result.filter((venue) => venue.hasMuslimahSpace)
    }

    if (showBuburDistribution) {
      result = result.filter((venue) => !!venue.buburDistribution)
    }

    if (showChildminding) {
      result = result.filter((venue) => !!venue.childmindingServices)
    }

    if (showQiyamullail) {
      result = result.filter((venue) => !!venue.qiyamullail)
    }

    if (isSortedByDistance && userCoords) {
      result.sort((a, b) => {
        if (!a.coordinates && !b.coordinates) return 0
        if (!a.coordinates) return 1
        if (!b.coordinates) return -1
        const distanceA = calculateDistance(userCoords.lat, userCoords.lng, a.coordinates.lat, a.coordinates.lng)
        const distanceB = calculateDistance(userCoords.lat, userCoords.lng, b.coordinates.lat, b.coordinates.lng)
        return distanceA - distanceB
      })
    } else {
      result.sort((a, b) => {
        if (a.type !== b.type) return a.type === "Mosque" ? -1 : 1
        return a.locationName.localeCompare(b.locationName)
      })
    }

    setFilteredVenues(result)
  }, [selectedDistrict, venueType, selectedRakaat, searchTerm, userCoords, isSortedByDistance, showMuslimahSpace, showBuburDistribution, showChildminding, showQiyamullail])

  const geocodePostalCode = async (postalCode: string) => {
    setIsGeocoding(true)
    try {
      const response = await fetch(`/api/geocode?postalCode=${postalCode}`)

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
      <div className="bg-gradient-to-b from-primary-dark to-primary">
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

              <a
                href="https://ramadan.usemeem.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-white/60 hover:text-white/80 ml-auto"
              >
                Imsakiah Calendar ↗
              </a>

              <button
                onClick={() => setInfoOpen(true)}
                className="text-[13px] text-white/60 hover:text-white/80 flex items-center gap-1 ml-3"
              >
                More info
                <Info className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="pb-8">
          <div className="container mx-auto px-4">
            <header className="text-center">
              <div className="flex items-center justify-center mb-3 mt-8">
                🕌 🌙 🇸🇬
              </div>
              <h1 className="text-4xl md:text-4xl font-bold text-white mb-2">
                Tarawih 2026
              </h1>
              <p className="text-white/80 max-w-md mx-auto mb-6">
                Find Tarawih prayer venues across Singapore
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
        <TarawihFilterPanel
          districts={districts}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          venueType={venueType}
          setVenueType={setVenueType}
          selectedRakaat={selectedRakaat}
          setSelectedRakaat={setSelectedRakaat}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showMuslimahSpace={showMuslimahSpace}
          setShowMuslimahSpace={setShowMuslimahSpace}
          showBuburDistribution={showBuburDistribution}
          setShowBuburDistribution={setShowBuburDistribution}
          showChildminding={showChildminding}
          setShowChildminding={setShowChildminding}
          showQiyamullail={showQiyamullail}
          setShowQiyamullail={setShowQiyamullail}
        />

        <div ref={listContainerRef}>
          <div className="mt-8 mb-4 text-sm text-gray-500 flex items-center justify-between">
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
              {filteredVenues.length} venues
            </div>
            <div className="text-xs text-gray-400">
              Source: <a href="https://www.muis.gov.sg/community/ramadan-2026/"
                className="underline hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >muis.gov.sg</a>
            </div>
          </div>

          <TarawihList
            venues={filteredVenues}
            scrollRef={listContainerRef}
            userCoords={userCoords}
          />
        </div>

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
            {" "}· Singapore&apos;s trusted platform to find ARS-certified asatizah
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

      <TarawihInfoDialog open={infoOpen} onOpenChange={setInfoOpen} />
    </main>
  )
}
