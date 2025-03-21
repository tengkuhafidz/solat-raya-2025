import type { PrayerSession } from "@/types/prayer-session"
import { PrayerSessionCard } from "./prayer-session-card"

interface PrayerSessionListProps {
  sessions: PrayerSession[]
}

export function PrayerSessionList({ sessions }: PrayerSessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-800">No prayer sessions found</h3>
        <p className="text-gray-600 mt-2">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessions.map((session, index) => (
        <PrayerSessionCard key={index} session={session} />
      ))}
    </div>
  )
}

