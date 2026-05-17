import { type ReactNode } from "react";

interface PageHeaderProps {
  title:     string;
  subtitle?: string;
  /** Button / action rendered on the right */
  action?:   ReactNode;
  /** Optional breadcrumb or back element rendered above title */
  eyebrow?:  ReactNode;
  className?: string;
}

/**
 * PageHeader — consistent top-of-page heading across all routes.
 *
 * Usage:
 *   <PageHeader
 *     title="Workouts"
 *     subtitle="Track and manage your training sessions"
 *     action={<Button icon={<Plus size={14} />}>New workout</Button>}
 *   />
 */
export function PageHeader({
  title,
  subtitle,
  action,
  eyebrow,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={["flex items-start justify-between gap-4 mb-8", className].join(" ")}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-1.5 text-[12px] text-text-tertiary">{eyebrow}</div>
        )}
        <h1 className="text-[24px] font-bold text-text-primary tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[13px] text-text-secondary">{subtitle}</p>
        )}
      </div>

      {action && (
        <div className="flex-shrink-0 pt-0.5">{action}</div>
      )}
    </div>
  );
}