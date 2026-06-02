import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
export const Input = forwardRef(({ label, error, hint, iconLeft, iconRight, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (_jsxs("div", { className: "flex flex-col gap-1.5", children: [label && (_jsx("label", { htmlFor: inputId, className: "text-[12px] font-medium text-text-secondary", children: label })), _jsxs("div", { className: "relative flex items-center", children: [iconLeft && (_jsx("span", { className: "absolute left-3 flex items-center text-text-tertiary pointer-events-none", children: iconLeft })), _jsx("input", { ref: ref, id: inputId, className: [
                            "w-full h-9 bg-elevated border rounded-md text-[13px] text-text-primary placeholder:text-text-tertiary",
                            "transition-colors duration-150 outline-none",
                            "focus:border-accent focus:ring-2 focus:ring-accent/20",
                            error
                                ? "border-danger focus:border-danger focus:ring-danger/20"
                                : "border-border-default hover:border-border-strong",
                            iconLeft ? "pl-9" : "pl-3",
                            iconRight ? "pr-9" : "pr-3",
                            "disabled:opacity-40 disabled:cursor-not-allowed",
                            className,
                        ].join(" "), ...props }), iconRight && (_jsx("span", { className: "absolute right-3 flex items-center text-text-tertiary", children: iconRight }))] }), error && (_jsx("p", { className: "text-[11px] text-danger", children: error })), !error && hint && (_jsx("p", { className: "text-[11px] text-text-tertiary", children: hint }))] }));
});
Input.displayName = "Input";
export const Textarea = forwardRef(({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (_jsxs("div", { className: "flex flex-col gap-1.5", children: [label && (_jsx("label", { htmlFor: inputId, className: "text-[12px] font-medium text-text-secondary", children: label })), _jsx("textarea", { ref: ref, id: inputId, className: [
                    "w-full bg-elevated border rounded-md text-[13px] text-text-primary placeholder:text-text-tertiary",
                    "px-3 py-2.5 resize-none transition-colors duration-150 outline-none",
                    "focus:border-accent focus:ring-2 focus:ring-accent/20",
                    error
                        ? "border-danger focus:border-danger focus:ring-danger/20"
                        : "border-border-default hover:border-border-strong",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                    className,
                ].join(" "), ...props }), error && _jsx("p", { className: "text-[11px] text-danger", children: error }), !error && hint && _jsx("p", { className: "text-[11px] text-text-tertiary", children: hint })] }));
});
Textarea.displayName = "Textarea";
import { ChevronDown } from "lucide-react";
export const Select = forwardRef(({ label, error, hint, className = "", id, children, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (_jsxs("div", { className: "flex flex-col gap-1.5", children: [label && (_jsx("label", { htmlFor: inputId, className: "text-[12px] font-medium text-text-secondary", children: label })), _jsxs("div", { className: "relative", children: [_jsx("select", { ref: ref, id: inputId, className: [
                            "w-full h-9 bg-elevated border rounded-md text-[13px] text-text-primary appearance-none",
                            "pl-3 pr-8 transition-colors duration-150 outline-none",
                            "focus:border-accent focus:ring-2 focus:ring-accent/20",
                            error
                                ? "border-danger"
                                : "border-border-default hover:border-border-strong",
                            "disabled:opacity-40 disabled:cursor-not-allowed",
                            className,
                        ].join(" "), ...props, children: children }), _jsx(ChevronDown, { size: 14, className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" })] }), error && _jsx("p", { className: "text-[11px] text-danger", children: error }), !error && hint && _jsx("p", { className: "text-[11px] text-text-tertiary", children: hint })] }));
});
Select.displayName = "Select";
