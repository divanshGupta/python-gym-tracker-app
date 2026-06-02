import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function SectionTitle({ children }) {
    return (_jsx("h2", { className: "mb-4 text-xs font-mediumn uppercase tracking-[0.14em] text-text-tertiary", children: children }));
}
export default function StreakSkeleton() {
    return (_jsxs("div", { className: "mb-10", children: [_jsx(SectionTitle, { children: "Streak" }), _jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [1, 2].map((item) => (_jsxs("div", { className: "flex items-center gap-4 rounded-2xl border border-border-default bg-surface p-5", children: [_jsx("div", { className: "h-12 w-12 animate-pulse rounded-full bg-elevated" }), _jsxs("div", { className: "flex-1 space-y-3", children: [_jsx("div", { className: "h-3 w-24 animate-pulse rounded bg-elevated" }), _jsx("div", { className: "h-8 w-32 animate-pulse rounded bg-elevated" })] })] }, item))) })] }));
}
