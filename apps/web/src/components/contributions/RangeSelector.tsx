// apps/web/src/components/contributions/RangeSelector.tsx

import {
  ContributionRange,
  CONTRIBUTION_RANGES,
} from '@gymtracker/constants'

interface RangeSelectorProps {
  selected: ContributionRange
  onChange: (range: ContributionRange) => void
}

export function RangeSelector({ selected, onChange }: RangeSelectorProps) {
  return (
    <div className="flex gap-1 p-1 rounded md:rounded-lg">
      {(Object.keys(CONTRIBUTION_RANGES) as ContributionRange[]).map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`
            text-text-primary border border-text-tertiary px-1 py-1 md:px-3 md:py-1 rounded-md text-sm font-medium
            transition-colors duration-150
            ${selected === key
              ? 'bg-elevated text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-primary'
            }
          `}
        >
          {CONTRIBUTION_RANGES[key].label}
        </button>
      ))}
    </div>
  )
}