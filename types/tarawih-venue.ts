export interface TarawihVenue {
  type: "Mosque" | "Qaryah"
  locationName: string
  address: string
  district: string
  venueType?: string
  rakaat: string
  hasMuslimahSpace: boolean
  buburDistribution: string | null
  childmindingServices: string | null
  qiyamullail: string | null
  isTentative: boolean
  remarks: string | null
  coordinates: { lat: number; lng: number } | null
}
