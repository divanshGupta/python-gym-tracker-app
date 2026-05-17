import { type HTMLAttributes } from "react";

// ── Base skeleton pulse ────────────────────────────────────────────────────

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Tailwind width class, e.g. "w-32" or "w-full" */
  width?:  string;
  /** Tailwind height class, e.g. "h-4" or "h-9" */
  height?: string;
  rounded?: string;
}

export function Skeleton({
  width   = "w-full",
  height  = "h-4",
  rounded = "rounded-md",
  className = "",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={[
        "bg-elevated animate-pulse",
        width,
        height,
        rounded,
        className,
      ].join(" ")}
      {...props}
    />
  );
}

// ── Composed skeletons for common patterns ─────────────────────────────────

/** Mimics a StatCard */
export function StatCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={["bg-surface border border-border-default rounded-xl p-4 flex flex-col gap-3", className].join(" ")}>
      <div className="flex items-center justify-between">
        <Skeleton width="w-20" height="h-3" />
        <Skeleton width="w-6" height="h-6" rounded="rounded-md" />
      </div>
      <Skeleton width="w-24" height="h-8" />
      <Skeleton width="w-28" height="h-3" />
    </div>
  );
}

/** Mimics a single list row / workout card */
export function CardRowSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={["bg-surface border border-border-default rounded-xl p-4 flex items-center gap-4", className].join(" ")}>
      <Skeleton width="w-10" height="h-10" rounded="rounded-lg" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton width="w-40" height="h-3.5" />
        <Skeleton width="w-24" height="h-3" />
      </div>
      <Skeleton width="w-16" height="h-3" />
    </div>
  );
}

/** Mimics a PageHeader */
export function PageHeaderSkeleton() {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex flex-col gap-2">
        <Skeleton width="w-44" height="h-7" />
        <Skeleton width="w-60" height="h-3.5" />
      </div>
      <Skeleton width="w-28" height="h-9" rounded="rounded-md" />
    </div>
  );
}

/** Full page loading — stat grid + list rows */
interface PageSkeletonProps {
  /** Number of stat cards in the top grid */
  stats?: number;
  /** Number of list rows below */
  rows?:  number;
}

export function PageSkeleton({ stats = 4, rows = 5 }: PageSkeletonProps) {
  return (
    <div>
      <PageHeaderSkeleton />

      {stats > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: stats }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <CardRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}