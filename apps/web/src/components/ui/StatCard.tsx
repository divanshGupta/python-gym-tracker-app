import { type ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";

interface StatCardProps {
  label:     string;
  value:     string | number;
  unit?:     string;
  /** Icon element rendered top-left */
  icon?:     ReactNode;
  /** e.g. "+12% vs last week" */
  trend?:    string;
  trendDir?: TrendDirection;
  className?: string;
}

const trendColors: Record<TrendDirection, string> = {
  up:      "text-success",
  down:    "text-danger",
  neutral: "text-text-tertiary",
};

const TrendIcons: Record<TrendDirection, typeof TrendingUp> = {
  up:      TrendingUp,
  down:    TrendingDown,
  neutral: Minus,
};

export function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  trendDir = "neutral",
  className = "",
}: StatCardProps) {
  const TrendIcon = TrendIcons[trendDir];

  return (
    <div
      className={[
        "bg-surface border border-border-default rounded-xl p-4 flex flex-col gap-3",
        className,
      ].join(" ")}
    >
      {/* Top row: label + icon */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-text-tertiary uppercase tracking-wide">
          {label}
        </span>
        {icon && (
          <span className="text-text-tertiary">{icon}</span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-[28px] font-bold text-text-primary leading-none tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-[13px] text-text-tertiary font-medium">{unit}</span>
        )}
      </div>

      {/* Trend */}
      {trend && (
        <div className={["flex items-center gap-1", trendColors[trendDir]].join(" ")}>
          <TrendIcon size={12} strokeWidth={2.5} />
          <span className="text-[11px] font-medium">{trend}</span>
        </div>
      )}
    </div>
  );
}