import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?:    Size;
  loading?: boolean;
  icon?:    ReactNode;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-light active:scale-[0.98] shadow-sm shadow-accent/20",
  secondary:
    "bg-elevated text-text-primary border border-border-strong hover:bg-elevated/70 active:scale-[0.98]",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-elevated active:scale-[0.98]",
  danger:
    "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 active:scale-[0.98]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-7  px-3 text-[12px] gap-1.5 rounded-md",
  md: "h-9  px-4 text-[13px] gap-2   rounded-md",
  lg: "h-11 px-5 text-[14px] gap-2   rounded-lg",
};

export function Button({
  variant  = "primary",
  size     = "md",
  loading  = false,
  icon,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center font-medium transition-all duration-150 select-none",
        "disabled:opacity-40 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}