// apps/web/src/components/contributions/RangeSelector.tsx

import {
  ContributionRange,
  CONTRIBUTION_RANGES,
  DEFAULT_CONTRIBUTION_RANGE
} from '@gymtracker/constants'

interface RangeSelectorProps {
  selected: ContributionRange
  onChange: (range: ContributionRange) => void
}

export function RangeSelector({ selected, onChange }: RangeSelectorProps) {
  return (
    <div className="flex gap-1 p-1 bg-surface-secondary rounded-lg">
      {(Object.keys(CONTRIBUTION_RANGES) as ContributionRange[]).map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`
            px-3 py-1 rounded-md text-sm font-medium
            transition-colors duration-150
            ${selected === key
              ? 'bg-surface text-primary shadow-sm'
              : 'text-muted hover:text-primary'
            }
          `}
        >
          {CONTRIBUTION_RANGES[key].label}
        </button>
      ))}
    </div>
  )
}