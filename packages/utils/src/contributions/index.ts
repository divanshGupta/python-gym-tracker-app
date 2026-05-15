// packages/utils/src/contributions/index.ts

import { ContributionDay, ContributionSummary } from './types'
import { normalizeContributions } from './normalize'
import { fillContributionGaps } from './fill'
import { applyIntensity } from './intensity'
import { calculateStreaks } from './streaks'
import { buildHeatmapGrid } from './heatmap'

export function processContributions(
  raw: ContributionDay[],
  from: string,
  to: string
): ContributionSummary {
  // Each step is explicit — easy to debug, easy to test individually
  const normalized = normalizeContributions(raw)
  const filled = fillContributionGaps(normalized, from, to)
  const withIntensity = applyIntensity(filled)
  const { currentStreak, longestStreak } = calculateStreaks(filled)
  const weeks = buildHeatmapGrid(withIntensity)

  return {
    weeks,
    currentStreak,
    longestStreak,
    totalCount: filled.reduce((sum, d) => sum + d.count, 0),
    totalActiveDays: filled.filter((d) => d.count > 0).length,
  }
}

// Named exports for consumers who need individual functions
export * from './types'
export * from './normalize'
export * from './fill'
export * from './streaks'
export * from './intensity'
export * from './heatmap'
export * from './range'
export * from './dateUtils'