// apps/web/src/components/contributions/HeatmapCell.tsx

import { ContributionEntry } from '@gymtracker/utils'

interface HeatmapCellProps {
  entry: ContributionEntry
}

// Intensity → Tailwind class mapping
// Defined outside component — never recreated on render
const INTENSITY_CLASSES: Record<ContributionEntry['intensity'], string> = {
  0: 'bg-contribution-0',
  1: 'bg-contribution-1',
  2: 'bg-contribution-2',
  3: 'bg-contribution-3',
  4: 'bg-contribution-4',
}

export function HeatmapCell({ entry }: HeatmapCellProps) {
  const colorClass = INTENSITY_CLASSES[entry.intensity]

  const tooltip =
    entry.count === 0
      ? `No workouts on ${entry.date}`
      : `${entry.count} workout${entry.count > 1 ? 's' : ''} on ${entry.date}`

  return (
    <div
      className={`
        w-3 h-3 md:w-4 md:h-4 rounded cursor-pointer border border-text-tertiary
        transition-opacity duration-100
        hover:opacity-80
        ${colorClass}
      `}
      title={tooltip}
      aria-label={tooltip}
      role="gridcell"
    />
  )
}