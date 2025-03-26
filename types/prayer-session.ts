export interface PrayerSession {
  District: string
  "Location Name": string
  "No. of Sessions": string
  "Session 1 Timing"?: string
  "Session 2 Timing"?: string
  "Session 3 Timing"?: string
  "Session 1 Khutbah Language": string | null
  "Session 2 Khutbah Language": string | null
  "Session 3 Khutbah Language": string | null
  "Muslimah Prayer Space": string
  "Less Crowded"?: string
  Remarks: string | null
  coordinates?: {
    lat: number
    lng: number
  }
}

