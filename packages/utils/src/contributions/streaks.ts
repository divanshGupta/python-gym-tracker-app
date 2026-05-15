// packages/utils/src/contributions/streaks.ts

import { ContributionDay } from './types'

export interface StreakResult {
  currentStreak: number
  longestStreak: number
}

export function calculateStreaks(
  // Must be dense (every day present), sorted ascending, ending with today
  days: ContributionDay[]
): StreakResult {
  if (days.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  // ── Longest Streak ─────────────────────────────────────────────
  let longestStreak = 0
  let running = 0
  const lastIndex = days.length - 1

  for (let i = 0; i < days.length; i++) {
    const isLastDay = i === lastIndex
    const isActive = days[i].count > 0

    if (isActive) {
      running++
      longestStreak = Math.max(longestStreak, running)
    } else if (!isLastDay) {
      // Zero-count day that is NOT today → hard break
      running = 0
      // Today's zero → grace, don't reset running
      // (running carries forward in case user works out later)
    }
  }

  // ── Current Streak ─────────────────────────────────────────────
  // Walk backwards so "today" is index 0 of our mental model
  let currentStreak = 0
  let i = days.length - 1

  // Apply grace: skip today if no workout yet
  if (days[i].count === 0) {
    i--
  }

  // Now count backwards while days are active
  while (i >= 0 && days[i].count > 0) {
    currentStreak++
    i--
  }

  return { currentStreak, longestStreak }
}