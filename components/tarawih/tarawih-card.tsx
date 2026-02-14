import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TarawihVenue } from "@/types/tarawih-venue"
import { Map, Info, MapPin, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TarawihCardProps {
  venue: TarawihVenue
  distance?: number
}

function parseRakaatLines(rakaat: string): { days: string; detail: string }[] {
  // Split by comma but only when followed by a day/period keyword
  const parts = rakaat.split(/,\s*(?=(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|First|Last|Daily))/i)

  return parts.map(part => {
    const trimmed = part.trim()
    // Match "Days: rakaat" pattern
    const match = trimmed.match(/^(.+?):\s*(.+)$/)
    if (match) {
      return { days: match[1].trim(), detail: match[2].trim() }
    }
    return { days: "Daily", detail: trimmed }
  })
}

export function TarawihCard({ venue, distance }: TarawihCardProps) {
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

  const getGoogleMapsUrl = (address: string) => {
    const searchQuery = encodeURIComponent(`${address} Singapore`)
    return `https://www.google.com/maps/search/?api=1&query=${searchQuery}`
  }

  const rakaatLines = parseRakaatLines(venue.rakaat)

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg border-0 card-accent bg-white/80 backdrop-blur-sm shadow-md hover:bg-white hover:scale-[1.02]">
      <CardHeader className="pb-2 bg-white/95 border-b">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="secondary"
                className={`font-medium ${getDistrictColor(venue.district)}`}
              >
                {venue.district}
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
              {venue.isTentative && (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 gap-1"
                >
                  * Tentative
                </Badge>
              )}
            </div>
            <Button
              variant="link"
              size="sm"
              onClick={() => window.open(getGoogleMapsUrl(venue.address), '_blank')}
              title="View on Google Maps"
              className="text-gray-500 hover:text-gray-700 px-0 h-auto font-normal text-xs decoration-gray-300 hover:decoration-gray-500 inline-flex items-center gap-1"
            >
              <Map className="h-4 w-4" />
              Mapview
            </Button>
          </div>
          <CardTitle className="text-gray-800 text-lg w-full">
            {venue.type === "Mosque" ? `Masjid ${venue.locationName}` : venue.locationName}
          </CardTitle>
          {venue.type === "Qaryah" && venue.venueType && (
            <p className="text-sm text-gray-500">{venue.venueType}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 bg-white/95">
        {/* Rakaat Schedule */}
        <div className="rounded-lg border border-gray-100 bg-gray-50/50 overflow-hidden mb-3">
          {rakaatLines.map((line, i) => (
            <div
              key={i}
              className={`flex items-baseline gap-2 px-3 py-1.5 text-sm ${i > 0 ? "border-t border-gray-100" : ""}`}
            >
              {line.days && (
                <span className="text-gray-500 text-xs font-medium shrink-0 min-w-[80px]">{line.days}</span>
              )}
              <span className="text-gray-800 font-medium">{line.detail}</span>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
          <ServiceChip
            emoji="🧕"
            label="Muslimah Space"
            available={venue.hasMuslimahSpace}
          />
          <ServiceChip
            emoji="🍲"
            label="Porridge Distribution"
            available={!!venue.buburDistribution}
            detail={venue.buburDistribution}
          />
          <ServiceChip
            emoji="🌙"
            label="Qiyamullail"
            available={!!venue.qiyamullail}
            detail={venue.qiyamullail}
          />
          <ServiceChip
            emoji="👶"
            label="Childminding"
            available={!!venue.childmindingServices}
            detail={venue.childmindingServices}
          />
        </div>

        {venue.remarks && (
          <div className="mt-3 text-sm flex items-start">
            <Info className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
            <p className="text-gray-600 italic">{venue.remarks}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ServiceChip({ emoji, label, available, detail }: {
  emoji: string
  label: string
  available: boolean
  detail?: string | null
}) {
  if (!available) {
    return (
      <div className="rounded-lg bg-gray-50 px-2.5 py-2 flex items-center gap-1.5 opacity-40">
        <span className="text-sm shrink-0 grayscale">{emoji}</span>
        <span className="text-xs text-gray-400 line-through">{label}</span>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-green-50 border border-green-100 px-2.5 py-2">
      <div className="flex items-center gap-1.5">
        <span className="text-sm shrink-0">{emoji}</span>
        <span className="text-xs font-medium text-green-800">{label}</span>
        <Check className="h-3 w-3 text-green-600 shrink-0 ml-auto" />
      </div>
      {detail && (
        <p className="text-[11px] text-green-700/70 mt-0.5 ml-5 leading-tight">{detail}</p>
      )}
    </div>
  )
}
