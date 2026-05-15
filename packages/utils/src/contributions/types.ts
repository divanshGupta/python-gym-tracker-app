// The shape coming back from the API (sparse)
export interface ContributionDay {
  date: string   // always "YYYY-MM-DD"
  count: number  // always > 0 (sparse — zeroes are omitted)
}

// The shape after gap-filling (dense)
export interface ContributionEntry {
  date: string
  count: number  // 0 means no activity that day
  intensity: 0 | 1 | 2 | 3 | 4  // GitHub-style levels
}

// A single week column in the heatmap grid
export interface ContributionWeek {
  days: (ContributionEntry | null)[]  // null = padding day
}

// The full processed result — what components consume
export interface ContributionSummary {
  weeks: ContributionWeek[]
  currentStreak: number
  longestStreak: number
  totalCount: number
  totalActiveDays: number
}