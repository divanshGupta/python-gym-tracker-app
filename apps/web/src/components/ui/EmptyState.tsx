import { type ReactNode } from "react";

interface EmptyStateProps {
  icon?:        ReactNode;
  title:        string;
  description?: string;
  action?:      ReactNode;
  className?:   string;
}

/**
 * EmptyState — shown when a list or section has no data yet.
 *
 * Usage:
 *   <EmptyState
 *     icon={<Dumbbell size={28} />}
 *     title="No workouts yet"
 *     description="Log your first session to start tracking progress."
 *     action={<Button>Start workout</Button>}
 *   />
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center",
        "py-16 px-6",
        className,
      ].join(" ")}
    >
      {icon && (
        <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-2xl bg-elevated border border-border-default text-text-tertiary">
          {icon}
        </div>
      )}

      <h3 className="text-[15px] font-semibold text-text-primary mb-1">{title}</h3>

      {description && (
        <p className="text-[13px] text-text-secondary max-w-[280px] leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}