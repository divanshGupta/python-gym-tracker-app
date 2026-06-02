import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Card({ children, padded = true, hoverable = false, borderless = false, className = "", ...props }) {
    return (_jsx("div", { className: [
            "bg-surface rounded-xl",
            borderless ? "" : "border border-border-default",
            padded ? "p-5" : "",
            hoverable ? "transition-colors duration-150 hover:border-border-strong cursor-pointer" : "",
            className,
        ].join(" "), ...props, children: children }));
}
export function CardHeader({ title, subtitle, action, className = "" }) {
    return (_jsxs("div", { className: ["flex items-start justify-between gap-4 mb-4", className].join(" "), children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h3", { className: "text-[14px] font-semibold text-text-primary leading-snug", children: title }), subtitle && (_jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: subtitle }))] }), action && _jsx("div", { className: "flex-shrink-0", children: action })] }));
}
export function CardDivider({ className = "" }) {
    return _jsx("hr", { className: ["border-border-default my-4", className].join(" ") });
}
