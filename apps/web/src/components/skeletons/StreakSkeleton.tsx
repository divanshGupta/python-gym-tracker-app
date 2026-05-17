function SectionTitle({ children }: { children: React.ReactNode; }) {
  return (
    <h2 className="mb-4 text-xs font-mediumn uppercase tracking-[0.14em] text-text-tertiary">
      {children}
    </h2>
  );
}

export default function StreakSkeleton() {
  return (
    <div className="mb-10">
      <SectionTitle>Streak</SectionTitle>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 rounded-2xl border border-border-default bg-surface p-5"
          >
            {/* Icon Skeleton */}
            <div className="h-12 w-12 animate-pulse rounded-full bg-elevated" />

            <div className="flex-1 space-y-3">
              {/* Label Skeleton */}
              <div className="h-3 w-24 animate-pulse rounded bg-elevated" />

              {/* Value Skeleton */}
              <div className="h-8 w-32 animate-pulse rounded bg-elevated" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}