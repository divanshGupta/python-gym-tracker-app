import { type HTMLAttributes, type ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children:   ReactNode;
  /** Add extra padding (default true) */
  padded?:    boolean;
  /** Highlight border on hover */
  hoverable?: boolean;
  /** Remove the border entirely */
  borderless?: boolean;
}

export function Card({
  children,
  padded     = true,
  hoverable  = false,
  borderless = false,
  className  = "",
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "bg-surface rounded-xl",
        borderless ? "" : "border border-border-default",
        padded     ? "p-5"  : "",
        hoverable  ? "transition-colors duration-150 hover:border-border-strong cursor-pointer" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

// ── Sub-components for structured layouts ──────────────────────────────────

interface CardHeaderProps {
  title:    ReactNode;
  subtitle?: ReactNode;
  action?:  ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className = "" }: CardHeaderProps) {
  return (
    <div className={["flex items-start justify-between gap-4 mb-4", className].join(" ")}>
      <div className="min-w-0">
        <h3 className="text-[14px] font-semibold text-text-primary leading-snug">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[12px] text-text-tertiary mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardDivider({ className = "" }: { className?: string }) {
  return <hr className={["border-border-default my-4", className].join(" ")} />;
}