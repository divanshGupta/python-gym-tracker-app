import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export function EmptyState({ icon, title, description, action, className = "", }) {
    return (_jsxs("div", { className: [
            "flex flex-col items-center justify-center text-center",
            "py-16 px-6",
            className,
        ].join(" "), children: [icon && (_jsx("div", { className: "mb-4 flex items-center justify-center w-14 h-14 rounded-2xl bg-elevated border border-border-default text-text-tertiary", children: icon })), _jsx("h3", { className: "text-[15px] font-semibold text-text-primary mb-1", children: title }), description && (_jsx("p", { className: "text-[13px] text-text-secondary max-w-[280px] leading-relaxed", children: description })), action && _jsx("div", { className: "mt-5", children: action })] }));
}
