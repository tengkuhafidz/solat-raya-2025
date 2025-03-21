"use client"

import { useState, useEffect } from "react"
import { FilterPanel } from "@/components/filter-panel"
import { PrayerSessionList } from "@/components/prayer-session-list"
import prayerSessionsData from "@/data/prayer-sessions.json"
import type { PrayerSession } from "@/types/prayer-session"
import { Moon, ChurchIcon as Mosque } from "lucide-react"

export default function Home() {
  const [filteredSessions, setFilteredSessions] = useState<PrayerSession[]>([])

  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
  const [selectedSession, setSelectedSession] = useState<string>("all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [locationType, setLocationType] = useState<string>("all")  // changed from showMosquesOnly
  const [searchTerm, setSearchTerm] = useState("")

  // Get unique districts for filter dropdown
  const districts = ["all", ...new Set(prayerSessionsData.map((session) => session.District))]

  useEffect(() => {
    let result = [...prayerSessionsData]

    // Apply search filter
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

    // Sort by location name in reverse order
    result.sort((a, b) => b["Location Name"].localeCompare(a["Location Name"]))

    setFilteredSessions(result as PrayerSession[]) // Type assertion to fix TS error
  }, [selectedDistrict, selectedSession, selectedLanguage, locationType, searchTerm]) // Add searchTerm to dependencies

  return (
    <main className="min-h-screen bg-white hari-raya-pattern">
      <div className="hari-raya-header py-8">
        <div className="container mx-auto px-4">
          <header className="text-center mb-8">
            <div className="flex items-center justify-center mb-3">
            🕌 🌙 
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Solat Raya 2025</h1>
            <p className="text-white/80 max-w-md mx-auto">Find prayer sessions across various locations</p>
          </header>
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

        <div className="mt-4 mb-2 text-sm text-gray-500 flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
          Showing {filteredSessions.length} locations
        </div>

        <PrayerSessionList sessions={filteredSessions} />
      </div>
    </main>
  )
}

