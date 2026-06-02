import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ContributionStats({ summary }) {
    return (_jsxs("div", { className: "flex gap-6 text-sm", children: [_jsx(Stat, { label: "Current Streak", value: `${summary.currentStreak}d` }), _jsx(Stat, { label: "Longest Streak", value: `${summary.longestStreak}d` }), _jsx(Stat, { label: "Total Workouts", value: summary.totalCount }), _jsx(Stat, { label: "Active Days", value: summary.totalActiveDays })] }));
}
// Internal — not exported, only used here
function Stat({ label, value }) {
    return (_jsxs("div", { className: "hidden md:flex text-text-primary flex-col gap-0.5", children: [_jsx("span", { className: "text-muted text-xs", children: label }), _jsx("span", { className: "font-semibold tabular-nums", children: value })] }));
}
