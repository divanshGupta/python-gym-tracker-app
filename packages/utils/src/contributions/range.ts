// packages/utils/src/contributions/range.ts

import { formatDate } from './dateUtils'

export function getContributionDateRange(days: number): {
  from: string
  to: string
} {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - days)

  return {
    from: formatDate(from), // same formatDate from fill.ts
    to: formatDate(to),
  }
}