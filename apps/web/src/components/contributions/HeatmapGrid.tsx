// apps/web/src/components/contributions/HeatmapGrid.tsx

import { ContributionWeek } from '@gymtracker/utils'
import { HeatmapCell } from './HeatmapCell'
import type { ContributionEntry } from '@gymtracker/utils'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface HeatmapGridProps {
  weeks: ContributionWeek[]
}

export function HeatmapGrid({ weeks }: HeatmapGridProps) {
  return (
    <div className="flex gap-1">
      {/* Day labels column */}
      <div className="flex flex-col gap-1 mr-1">
        {DAY_LABELS.map((label, i) => (
          <div
            key={label}
            className="h-3 text-xs text-muted leading-none flex items-center"
          >
            {/* Only render Mon, Wed, Fri labels to avoid crowding */}
            {i % 2 !== 0 ? label : ''}
          </div>
        ))}
      </div>

      {/* Week columns */}
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {week.days.map((entry: ContributionEntry, dayIndex: number) => (
            entry
              ? <HeatmapCell key={entry.date} entry={entry} />
              : <div key={dayIndex} className="w-3 h-3" /> // empty padding
          ))}
        </div>
      ))}
    </div>
  )
}