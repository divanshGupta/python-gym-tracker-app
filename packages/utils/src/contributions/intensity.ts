// packages/utils/src/contributions/intensity.ts

import { ContributionDay, ContributionEntry } from './types'

// Exported so consumers can render a legend
// "what does each level mean visually"
export const INTENSITY_LEVELS = 4

export function calculateIntensity(
  count: number,
  max: number
): ContributionEntry['intensity'] {
  if (count === 0 || max === 0) return 0

  // Normalize to 0–1 range relative to user's personal maximum
  const ratio = count / max

  if (ratio <= 0.25) return 1
  if (ratio <= 0.50) return 2
  if (ratio <= 0.75) return 3
  return 4
}

// Applies intensity to an entire dense array in one pass
// Calculates max once — O(n) not O(n²)
export function applyIntensity(
  days: ContributionDay[]
): ContributionEntry[] {
  // Single pass to find max — never recalculate inside the loop
  const max = Math.max(...days.map((d) => d.count))

  return days.map((day) => ({
    ...day,
    intensity: calculateIntensity(day.count, max),
  }))
}