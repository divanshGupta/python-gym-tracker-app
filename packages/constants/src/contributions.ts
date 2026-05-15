// packages/constants/src/contributions.ts

export type ContributionRange = 'monthly' | '3months' | '6months' | 'yearly'

export const CONTRIBUTION_RANGES: Record<
  ContributionRange,
  { label: string; days: number }
> = {
  monthly:  { label: '1 Month',  days: 30  },
  '3months':{ label: '3 Months', days: 90  },
  '6months':{ label: '6 Months', days: 180 },
  yearly:   { label: '1 Year',   days: 365 },
}

export const DEFAULT_CONTRIBUTION_RANGE: ContributionRange = 'monthly' 