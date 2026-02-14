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

interface TarawihFilterPanelProps {
  districts: string[]
  selectedDistrict: string
  setSelectedDistrict: (district: string) => void
  venueType: string
  setVenueType: (type: string) => void
  selectedRakaat: string
  setSelectedRakaat: (rakaat: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  showMuslimahSpace: boolean
  setShowMuslimahSpace: (value: boolean) => void
  showBuburDistribution: boolean
  setShowBuburDistribution: (value: boolean) => void
  showChildminding: boolean
  setShowChildminding: (value: boolean) => void
  showQiyamullail: boolean
  setShowQiyamullail: (value: boolean) => void
}

export function TarawihFilterPanel({
  districts,
  selectedDistrict,
  setSelectedDistrict,
  venueType,
  setVenueType,
  selectedRakaat,
  setSelectedRakaat,
  searchTerm,
  setSearchTerm,
  showMuslimahSpace,
  setShowMuslimahSpace,
  showBuburDistribution,
  setShowBuburDistribution,
  showChildminding,
  setShowChildminding,
  showQiyamullail,
  setShowQiyamullail,
}: TarawihFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

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
        <div className="md:hidden">
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

        <CollapsibleContent className="md:block">
          <CardContent className="pt-6">
            <div className="hidden md:flex items-center mb-4">
              <Filter className="h-4 w-4 text-primary mr-2" />
              <h2 className="text-lg font-medium">Filter</h2>
            </div>

            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search by mosque name / qaryah address"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-200 focus-visible:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="venue-type" className="text-gray-700">
                  Venue Type
                </Label>
                <Select value={venueType} onValueChange={setVenueType}>
                  <SelectTrigger id="venue-type" className="border-gray-200">
                    <SelectValue placeholder="Select venue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Venues</SelectItem>
                    <SelectItem value="mosques">Mosques</SelectItem>
                    <SelectItem value="qaryah">Qaryah Venues</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rakaat" className="text-gray-700">
                  Rakaat
                </Label>
                <Select value={selectedRakaat} onValueChange={setSelectedRakaat}>
                  <SelectTrigger id="rakaat" className="border-gray-200">
                    <SelectValue placeholder="Select rakaat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rakaat</SelectItem>
                    <SelectItem value="8">8 Rakaat</SelectItem>
                    <SelectItem value="20">20 Rakaat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="muslimah-space"
                  checked={showMuslimahSpace}
                  onCheckedChange={setShowMuslimahSpace}
                />
                <Label htmlFor="muslimah-space" className="text-gray-700 cursor-pointer">
                  Muslimah Space
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="bubur-distribution"
                  checked={showBuburDistribution}
                  onCheckedChange={setShowBuburDistribution}
                />
                <Label htmlFor="bubur-distribution" className="text-gray-700 cursor-pointer">
                  Porridge Distribution
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="childminding"
                  checked={showChildminding}
                  onCheckedChange={setShowChildminding}
                />
                <Label htmlFor="childminding" className="text-gray-700 cursor-pointer">
                  Childminding Services
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="qiyamullail"
                  checked={showQiyamullail}
                  onCheckedChange={setShowQiyamullail}
                />
                <Label htmlFor="qiyamullail" className="text-gray-700 cursor-pointer">
                  Qiyamullail
                </Label>
              </div>
            </div>

          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
