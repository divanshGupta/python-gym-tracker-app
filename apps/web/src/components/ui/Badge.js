import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const variantClasses = {
    success: "bg-success/10 text-success border-success/20",
    danger: "bg-danger/10  text-danger  border-danger/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    accent: "bg-accent/10  text-accent  border-accent/20",
    neutral: "bg-elevated   text-text-secondary border-border-default",
};
const dotClasses = {
    success: "bg-success",
    danger: "bg-danger",
    warning: "bg-warning",
    accent: "bg-accent",
    neutral: "bg-text-tertiary",
};
const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1",
    md: "text-[11px] px-2   py-0.5 gap-1.5",
};
export function Badge({ variant = "neutral", size = "md", dot = false, children, className = "", }) {
    return (_jsxs("span", { className: [
            "inline-flex items-center font-medium rounded-full border",
            variantClasses[variant],
            sizeClasses[size],
            className,
        ].join(" "), children: [dot && (_jsx("span", { className: [
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    dotClasses[variant],
                ].join(" ") })), children] }));
}
