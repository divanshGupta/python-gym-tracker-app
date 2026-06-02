import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Skeleton({ width = "w-full", height = "h-4", rounded = "rounded-md", className = "", ...props }) {
    return (_jsx("div", { className: [
            "bg-elevated animate-pulse",
            width,
            height,
            rounded,
            className,
        ].join(" "), ...props }));
}
// ── Composed skeletons for common patterns ─────────────────────────────────
/** Mimics a StatCard */
export function StatCardSkeleton({ className = "" }) {
    return (_jsxs("div", { className: ["bg-surface border border-border-default rounded-xl p-4 flex flex-col gap-3", className].join(" "), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Skeleton, { width: "w-20", height: "h-3" }), _jsx(Skeleton, { width: "w-6", height: "h-6", rounded: "rounded-md" })] }), _jsx(Skeleton, { width: "w-24", height: "h-8" }), _jsx(Skeleton, { width: "w-28", height: "h-3" })] }));
}
/** Mimics a single list row / workout card */
export function CardRowSkeleton({ className = "" }) {
    return (_jsxs("div", { className: ["bg-surface border border-border-default rounded-xl p-4 flex items-center gap-4", className].join(" "), children: [_jsx(Skeleton, { width: "w-10", height: "h-10", rounded: "rounded-lg" }), _jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [_jsx(Skeleton, { width: "w-40", height: "h-3.5" }), _jsx(Skeleton, { width: "w-24", height: "h-3" })] }), _jsx(Skeleton, { width: "w-16", height: "h-3" })] }));
}
/** Mimics a PageHeader */
export function PageHeaderSkeleton() {
    return (_jsxs("div", { className: "flex items-start justify-between mb-8", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(Skeleton, { width: "w-44", height: "h-7" }), _jsx(Skeleton, { width: "w-60", height: "h-3.5" })] }), _jsx(Skeleton, { width: "w-28", height: "h-9", rounded: "rounded-md" })] }));
}
export function PageSkeleton({ stats = 4, rows = 5 }) {
    return (_jsxs("div", { children: [_jsx(PageHeaderSkeleton, {}), stats > 0 && (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: Array.from({ length: stats }).map((_, i) => (_jsx(StatCardSkeleton, {}, i))) })), _jsx("div", { className: "flex flex-col gap-3", children: Array.from({ length: rows }).map((_, i) => (_jsx(CardRowSkeleton, {}, i))) })] }));
}
