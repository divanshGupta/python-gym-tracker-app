// apps/web/src/components/contributions/HeatmapSkeleton.tsx

export function HeatmapSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Heatmap Grid Skeleton */}
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-6 rounded bg-elevated"
            />
          ))}
        </div>

        {/* Week columns */}
        {Array.from({ length: 16 }).map((_, weekIndex) => (
          <div
            key={weekIndex}
            className="flex flex-col gap-1"
          >
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <div
                key={dayIndex}
                className="w-3 h-3 rounded-sm bg-elevated"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Stats Skeleton */}
      <div className="flex gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2"
          >
            {/* Label */}
            <div className="h-3 w-20 rounded bg-elevated" />

            {/* Value */}
            <div className="h-5 w-12 rounded bg-elevated" />
          </div>
        ))}
      </div>
    </div>
  )
}