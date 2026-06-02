import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
const variantClasses = {
    primary: "bg-accent text-white hover:bg-accent-light active:scale-[0.98] shadow-sm shadow-accent/20",
    secondary: "bg-elevated text-text-primary border border-border-strong hover:bg-elevated/70 active:scale-[0.98]",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-elevated active:scale-[0.98]",
    danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 active:scale-[0.98]",
};
const sizeClasses = {
    sm: "h-7  px-3 text-[12px] gap-1.5 rounded-md",
    md: "h-9  px-4 text-[13px] gap-2   rounded-md",
    lg: "h-11 px-5 text-[14px] gap-2   rounded-lg",
};
export const Button = forwardRef(function Button({ variant = "primary", size = "md", loading = false, icon, children, disabled, className = "", ...props }, ref) {
    const isDisabled = disabled || loading;
    return (_jsxs("button", { ref: ref, disabled: isDisabled, className: [
            "inline-flex items-center justify-center font-medium transition-all duration-150 select-none",
            "disabled:opacity-40 disabled:pointer-events-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
            variantClasses[variant],
            sizeClasses[size],
            className,
        ].join(" "), ...props, children: [loading ? (_jsx(Loader2, { size: 14, className: "animate-spin shrink-0" })) : icon ? (_jsx("span", { className: "shrink-0", children: icon })) : null, children] }));
});
