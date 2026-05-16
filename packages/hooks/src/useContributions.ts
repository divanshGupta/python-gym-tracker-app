// packages/hooks/src/useContributions.ts

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { statsApi } from '@gymtracker/api-client'
import { queryKeys } from '@gymtracker/constants'
import {
  CONTRIBUTION_RANGES,
  type ContributionRange,
} from '@gymtracker/constants'
import {
  getContributionDateRange,
  processContributions,
} from '@gymtracker/utils'

export function useContributions(range: ContributionRange) {
  // Derive date strings from range — stable across renders
  // for same range value
  const { from, to } = useMemo(
    () => getContributionDateRange(CONTRIBUTION_RANGES[range].days),
    [range]
  )

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.stats.contributions(range),
    queryFn: () =>
      statsApi.getContributions({ from, to, source: 'workouts' })
        .then(r => r.data),
    staleTime: 5 * 60 * 1000, // 5 minutes — contributions don't change often
  })

  // processContributions only reruns when API data or date range changes
  const summary = useMemo(() => {
    if (!data) return null
    return processContributions(data.contributions, from, to)
  }, [data, from, to])

  return {
    summary,
    isLoading,
    error,
    from,
    to,
  }
}