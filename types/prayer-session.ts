export interface Session {
  time: string
  language: string | null
}

export interface PrayerSession {
  district: string
  locationName: string
  sessions: Session[]
  hasMuslimahPrayerSpace: boolean
  remarks: string | null
  isLessCrowded: boolean
  coordinates?: {
    lat: number
    lng: number
  }
  type: string
}

