"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

interface FilterPanelProps {
  districts: string[]
  selectedDistrict: string
  setSelectedDistrict: (district: string) => void
  selectedSession: string
  setSelectedSession: (session: string) => void
  selectedLanguage: string
  setSelectedLanguage: (language: string) => void
  locationType: string
  setLocationType: (type: string) => void
}

export function FilterPanel({
  districts,
  selectedDistrict,
  setSelectedDistrict,
  selectedSession,
  setSelectedSession,
  selectedLanguage,
  setSelectedLanguage,
  locationType,
  setLocationType,
}: FilterPanelProps) {
  // Helper function to get district color (same as in prayer-session-card)
  const getDistrictColor = (district: string) => {
    switch (district) {
      case "North":
        return "bg-blue-100"
      case "South":
        return "bg-red-100"
      case "East":
        return "bg-green-100"
      case "West":
        return "bg-orange-100"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <Card className="bg-white shadow-md border-0 card-accent">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <Filter className="h-4 w-4 text-primary mr-2" />
          <h2 className="text-lg font-medium">Filter Sessions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="district" className="text-gray-700">
              District
            </Label>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger id="district" className="border-gray-200">
                <SelectValue placeholder="Select district">
                  {selectedDistrict === "all" ? (
                    "All Districts"
                  ) : (
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getDistrictColor(selectedDistrict)}`} />
                      {selectedDistrict} District
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.filter(d => d !== "all").map((district) => (
                  <SelectItem key={district} value={district}>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getDistrictColor(district)}`} />
                      {district} District
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session" className="text-gray-700">
              Prayer Session
            </Label>
            <div className="space-y-1">
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger id="session" className="border-gray-200">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  <SelectItem value="Session 1">Session 1</SelectItem>
                  <SelectItem value="Session 2">Session 2</SelectItem>
                  <SelectItem value="Session 3">Session 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location-type" className="text-gray-700">
              Location Type
            </Label>
            <Select value={locationType} onValueChange={setLocationType}>
              <SelectTrigger id="location-type" className="border-gray-200">
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="mosques">Mosques</SelectItem>
                <SelectItem value="supplementary">Qoryah Venues</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language" className="text-gray-700">
              Khutbah Language
            </Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger id="language" className="border-gray-200">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Malay">Malay</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="Tamil">Tamil</SelectItem>
                <SelectItem value="Bengali">Bengali</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

