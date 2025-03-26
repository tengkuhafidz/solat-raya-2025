"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"

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
  searchTerm: string
  setSearchTerm: (term: string) => void
  showLessCrowded: boolean
  setShowLessCrowded: (value: boolean) => void
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
  searchTerm,
  setSearchTerm,
  showLessCrowded,
  setShowLessCrowded,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

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
      <Collapsible
        open={isMobile ? isOpen : true}
        onOpenChange={setIsOpen}
      >
        <div className="md:hidden"> {/* Mobile trigger */}
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full p-4 flex items-center justify-between hover:text-primary transition-colors"
            >
              <div className="flex items-center">
                <Filter className="h-4 w-4 text-primary mr-2" />
                <h2 className="text-lg font-medium">Filter</h2>
              </div>
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent
          className="md:block" // Always show on desktop
        >
          <CardContent className="pt-6">
            <div className="hidden md:flex items-center mb-4"> {/* Desktop header */}
              <Filter className="h-4 w-4 text-primary mr-2" />
              <h2 className="text-lg font-medium">Filter</h2>
            </div>

            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search by mosque name / qoryah address"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-200 focus-visible:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="district" className="text-gray-700">
                  District
                </Label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger 
                    id="district" 
                    className="border-gray-200 focus:ring-primary/20"
                  >
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

            <div className="mt-4 flex items-center space-x-2">
              <Switch
                id="less-crowded"
                checked={showLessCrowded}
                onCheckedChange={setShowLessCrowded}
              />
              <Label 
                htmlFor="less-crowded" 
                className="text-gray-700 cursor-pointer"
              >
                Less crowded locations
              </Label>
            </div>

          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

