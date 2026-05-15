// apps/web/src/components/contributions/ContributionHeatmap.tsx

import { useState } from 'react'
import {
  ContributionRange,
  DEFAULT_CONTRIBUTION_RANGE
} from '@gymtracker/constants'
import { useContributions } from '@gymtracker/hooks'
import { RangeSelector }     from './RangeSelector'
import { HeatmapGrid }       from './HeatmapGrid'
import { ContributionStats } from './ContributionStats'
import { HeatmapSkeleton }   from './HeatmapSkeleton'

export function ContributionHeatmap() {
  const [range, setRange] = useState<ContributionRange>(
    DEFAULT_CONTRIBUTION_RANGE
  )

  const { summary, isLoading, error } = useContributions(range)

  return (
    <div className="flex flex-col gap-4 p-4 bg-surface rounded-xl border border-border">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-primary">Activity</h2>
        <RangeSelector selected={range} onChange={setRange} />
      </div>

      {/* Four explicit states — nothing implicit */}
      {isLoading && !summary && <HeatmapSkeleton />}

      {error && (
        <p className="text-error text-sm">
          Failed to load activity data.
        </p>
      )}

      {summary && summary.totalActiveDays === 0 && (
        <div className="py-8 text-center text-muted text-sm">
          No workouts logged in this period.
          <br />
          <span className="text-xs">Start logging to see your streak!</span>
        </div>
      )}

      {summary && summary.totalActiveDays > 0 && (
        <>
          <HeatmapGrid weeks={summary.weeks} />
          <ContributionStats summary={summary} />
        </>
      )}
    </div>
  )
}