// packages/utils/src/contributions/dateUtils.ts

// This is the ONE place we parse YYYY-MM-DD into a Date
// We need Date objects here because we're doing arithmetic:
// "give me the next day" requires adding 86400000ms (or 1 day)
// String manipulation cannot do this safely
export function parseLocalDate(dateStr: string): Date {
  // CRITICAL: split manually instead of new Date(dateStr)
  // new Date("2026-05-15") → interprets as UTC midnight
  // In UTC-5, that becomes May 14 locally — wrong day
  // Splitting and using Date constructor with parts → local midnight
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day) // month is 0-indexed in JS
}

// Format a Date object back to YYYY-MM-DD in local time
export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}