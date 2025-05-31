import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PrayerSession } from "@/types/prayer-session"
import { Map, Clock, Users, MessageSquare, Info, Navigation, Globe, ExternalLink, MapPin } from "lucide-react"
import { Button } from "./ui/button"

interface PrayerSessionCardProps {
  session: PrayerSession
  distance?: number
}

export function PrayerSessionCard({ session, distance }: PrayerSessionCardProps) {
  // Helper function to render khutbah sessions
  const renderKhutbahSessions = () => {
    return (
      <div className="space-y-2 mt-2">
        {session.sessions.map((s, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center text-sm gap-1 sm:gap-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary shrink-0" />
              <span className="font-medium whitespace-nowrap">{s.time}{s.language && s.language !== "-" ? ` (${s.language} Khutbah)` : ""}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Helper function to get badge color based on district
  const getDistrictColor = (district: string) => {
    switch (district) {
      case "North":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "South":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "East":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "West":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Function to create Google Maps URL
  const getGoogleMapsUrl = (locationName: string) => {
    // Append "Singapore" to ensure accurate results
    const searchQuery = encodeURIComponent(`${locationName} Singapore`)
    return `https://www.google.com/maps/search/?api=1&query=${searchQuery}`
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg border-0 card-accent bg-white/80 backdrop-blur-sm shadow-md hover:bg-white hover:scale-[1.02]">
      <CardHeader className="pb-2 bg-white/95 border-b">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="secondary"
                className={`font-medium ${getDistrictColor(session.district)}`}
              >
                {session.district}
              </Badge>
              {distance !== undefined && (
                <Badge
                  variant="outline"
                  className="bg-white text-gray-500 border-gray-200 hover:bg-white gap-1 font-normal"
                >
                  <MapPin className="h-3 w-3" />
                  {distance.toFixed(1)}km away
                </Badge>
              )}
              {session.isLessCrowded && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 gap-1"
                >
                  <Users className="h-3 w-3" />
                  Less Crowded
                </Badge>
              )}
            </div>
            <Button
              variant="link"
              size="sm"
              onClick={() => window.open(getGoogleMapsUrl(session.locationName), '_blank')}
              title="View on Google Maps"
              className="text-gray-500 hover:text-gray-700 px-0 h-auto font-normal text-xs decoration-gray-300 hover:decoration-gray-500 inline-flex items-center gap-1"
            >
              <Map className="h-4 w-4" />
              Mapview
            </Button>
          </div>
          <CardTitle className="text-gray-800 text-lg w-full">{session.locationName}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 bg-white/95">
        <div className="border-b border-gray-100 pb-4">{renderKhutbahSessions()}</div>
        <div className="flex items-center mt-4">
          <Users className="h-4 w-4 mr-2 text-primary" />
          <span className="text-sm">Muslimah Space:</span>
          <Badge
            variant={"outline"}
            className={`ml-2 ${"text-gray-600 border-gray-200"}`}
          >
            {session.hasMuslimahPrayerSpace ? (
              <span>✅ Available</span>
            ) : (
              <span>❌ Not Available</span>
            )}
          </Badge>
        </div>

        {session.remarks && (
          <div className="mt-3 text-sm flex items-start">
            <Info className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
            <p className="text-gray-600 italic">{session.remarks}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

