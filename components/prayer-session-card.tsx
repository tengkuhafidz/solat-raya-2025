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
  // Helper function to get default timing for a session number
  const getDefaultTiming = (sessionNumber: number) => {
    switch (sessionNumber) {
      case 1: return "7:20 AM"
      case 2: return "8:45 AM"
      case 3: return "9:45 AM"
      default: return null
    }
  }

  // Helper function to render khutbah sessions
  const renderKhutbahSessions = () => {
    const sessions = [
      { 
        number: 1,
        timing: session["Session 1 Timing"] || getDefaultTiming(1),
        language: session["Session 1 Khutbah Language"]
      },
      { 
        number: 2,
        timing: session["Session 2 Timing"] || getDefaultTiming(2),
        language: session["Session 2 Khutbah Language"]
      },
      { 
        number: 3,
        timing: session["Session 3 Timing"] || getDefaultTiming(3),
        language: session["Session 3 Khutbah Language"]
      },
    ].filter((s) => s.language !== null)

    return (
      <div className="space-y-2 mt-2">
        {sessions.map((s, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center text-sm gap-1 sm:gap-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary shrink-0" />
              <span className="font-medium whitespace-nowrap">Session {s.number}: {s.timing}</span>
            </div>
            {s.language !== "-" && (
              <span className="text-gray-600 ml-6 sm:ml-0">({s.language} Khutbah)</span>
            )}
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
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={`font-medium ${getDistrictColor(session.District)}`}
                >
                  {session.District} District
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
              </div>
              <CardTitle className="text-gray-800 text-lg">{session["Location Name"]}</CardTitle>
            </div>
            <Button
              variant="link"
              size="sm"
              onClick={() => window.open(getGoogleMapsUrl(session["Location Name"]), '_blank')}
              title="View on Google Maps"
              className="text-gray-500 hover:text-gray-700 px-0 h-auto font-normal text-xs decoration-gray-300 hover:decoration-gray-500 inline-flex items-center gap-1"
            >
              <Map className="h-4 w-4" />
              Directions
            </Button>
          </div>
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
            {session["Muslimah Prayer Space"] === "Not Available" ? (
              <span>❌ {session["Muslimah Prayer Space"]}</span>
            ) : (
              <span>✅ {session["Muslimah Prayer Space"]}</span>
            )}
          </Badge>
        </div>

        {session.Remarks && (
          <div className="mt-3 text-sm flex items-start">
            <Info className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
            <p className="text-gray-600 italic">{session.Remarks}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

