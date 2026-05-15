// packages/utils/src/contributions/normalize.ts

import { ContributionDay } from './types'

// Validates a string is strictly YYYY-MM-DD format
// We do NOT use new Date() here — no timezone risk
export function isValidDateString(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
}

// Normalize: validate, deduplicate, sort
// Input:  raw API response (may be unsorted, may have dupes)
// Output: sorted, deduplicated, validated array
export function normalizeContributions(
  raw: ContributionDay[]
): ContributionDay[] {
  // 1. Filter out anything malformed — defensive, not optimistic
  const valid = raw.filter(
    (c) => isValidDateString(c.date) && c.count > 0
  )

  // 2. Deduplicate by date — last occurrence wins
  // Using a Map preserves insertion order in JS
  const map = new Map<string, ContributionDay>()
  for (const entry of valid) {
    map.set(entry.date, entry)
  }

  // 3. Sort by date string — works because YYYY-MM-DD is lexicographic
  return Array.from(map.values()).sort((a, b) =>
    a.date < b.date ? -1 : 1
  )
}