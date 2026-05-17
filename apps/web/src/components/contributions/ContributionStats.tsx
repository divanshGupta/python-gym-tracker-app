// apps/web/src/components/contributions/ContributionStats.tsx

import { ContributionSummary } from '@gymtracker/utils'

interface ContributionStatsProps {
  summary: ContributionSummary
}

export function ContributionStats({ summary }: ContributionStatsProps) {
  return (
    <div className="flex gap-6 text-sm">
      <Stat label="Current Streak" value={`${summary.currentStreak}d`} />
      <Stat label="Longest Streak" value={`${summary.longestStreak}d`} />
      <Stat label="Total Workouts" value={summary.totalCount} />
      <Stat label="Active Days"    value={summary.totalActiveDays} />
    </div>
  )
}

// Internal — not exported, only used here
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="hidden md:flex text-text-primary flex-col gap-0.5">
      <span className="text-muted text-xs">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  )
}