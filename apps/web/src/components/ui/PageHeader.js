import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export function PageHeader({ title, subtitle, action, eyebrow, className = "", }) {
    return (_jsxs("div", { className: ["flex items-start justify-between gap-4 mb-8", className].join(" "), children: [_jsxs("div", { className: "min-w-0", children: [eyebrow && (_jsx("div", { className: "mb-1.5 text-[12px] text-text-tertiary", children: eyebrow })), _jsx("h1", { className: "text-[24px] font-bold text-text-primary tracking-tight leading-tight", children: title }), subtitle && (_jsx("p", { className: "mt-1 text-[13px] text-text-secondary", children: subtitle }))] }), action && (_jsx("div", { className: "flex-shrink-0 pt-0.5", children: action }))] }));
}
