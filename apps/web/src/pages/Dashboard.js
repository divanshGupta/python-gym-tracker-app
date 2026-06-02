import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useWorkouts, useStreak } from "@gymtracker/hooks";
import { useAuthStore } from "@gymtracker/stores";
import { ContributionHeatmap } from "../components/contributions/ContributionHeatmap";
import { Button } from "../components/ui";
import { PageSkeleton } from "../components/ui";
import { WorkoutRow } from "../components/dashboard/WorkoutRow";
// ── Helpers ────────────────────────────────────────────────────────────────
function greeting() {
    const h = new Date().getHours();
    if (h < 12)
        return "Good morning";
    if (h < 17)
        return "Good afternoon";
    return "Good evening";
}
function formatDate() {
    return new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
// ── Sub-components ─────────────────────────────────────────────────────────
function StreakPill({ count }) {
    if (!count)
        return null;
    return (_jsxs("span", { className: "inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-warning/8 border border-warning/18 text-warning text-[13px] font-semibold", children: [_jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M12 2c0 6-6 8-6 14a6 6 0 0 0 12 0c0-3-1.5-5-3-7-1 2-2 3-3 7-1-2-1-4 0-7z" }) }), count, _jsx("span", { className: "font-normal text-text-secondary text-[12px]", children: "day streak" })] }));
}
function FriendsPlaceholder() {
    return (_jsxs("div", { className: "flex items-center justify-between px-1 py-1 opacity-40 select-none", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex", children: ["A", "K", "R"].map((l, i) => (_jsx("div", { className: "w-6 h-6 rounded-full bg-elevated border-2 border-void flex items-center justify-center text-[9px] font-semibold text-text-tertiary", style: { marginLeft: i === 0 ? 0 : -6 }, children: l }, l))) }), _jsx("span", { className: "text-[13px] text-text-tertiary", children: "Friends activity" })] }), _jsx("span", { className: "text-[10px] font-semibold px-2.5 py-1 rounded-full bg-elevated text-text-tertiary border border-border-default", children: "Coming soon" })] }));
}
// ── Page ───────────────────────────────────────────────────────────────────
export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { data: recentWorkouts = [], isLoading: wLoading } = useWorkouts({ page: 1, limit: 3 });
    const { currentStreak, isLoading: sLoading } = useStreak();
    const firstName = user?.username
        ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
        : "Athlete";
    const isLoading = wLoading || sLoading;
    if (isLoading)
        return _jsx(PageSkeleton, { stats: 0, rows: 3 });
    return (_jsxs("div", { className: "flex flex-col gap-5", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-medium text-text-tertiary uppercase tracking-widest mb-1.5", children: formatDate() }), _jsxs("h1", { className: "text-[24px] md:text-[30px] font-bold text-text-primary tracking-tight leading-tight", children: [greeting(), ",", " ", _jsx("span", { className: "text-accent", children: firstName })] }), _jsx(StreakPill, { count: currentStreak ?? 0 })] }), _jsx("div", { className: "shrink-0 pt-1", children: _jsx(Button, { icon: _jsx(Plus, { size: 14 }), onClick: () => navigate("/workouts/create"), children: "Log workout" }) })] }), _jsx(ContributionHeatmap, {}), _jsxs("div", { className: "bg-surface border border-border-default rounded-xl overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 pt-4 pb-2", children: [_jsx("h2", { className: "text-[13px] font-semibold text-text-primary", children: "Recent workouts" }), _jsx(Link, { to: "/workouts", className: "text-[12px] text-accent font-medium hover:text-accent-light transition-colors", children: "View all" })] }), recentWorkouts.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center text-center px-6 py-10", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-elevated flex items-center justify-center text-text-tertiary mb-3", children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("rect", { x: "2", y: "9", width: "4", height: "6", rx: "1" }), _jsx("rect", { x: "18", y: "9", width: "4", height: "6", rx: "1" }), _jsx("path", { d: "M6 12h12" }), _jsx("path", { d: "M6 5v14" }), _jsx("path", { d: "M18 5v14" })] }) }), _jsx("p", { className: "text-[14px] font-semibold text-text-primary mb-1", children: "No workouts yet" }), _jsx("p", { className: "text-[12px] text-text-secondary mb-4 max-w-55", children: "Log your first session to start tracking progress." }), _jsx(Button, { size: "sm", onClick: () => navigate("/workouts/create"), children: "Log first workout" })] })) : (_jsx("div", { className: "px-2 pb-2", children: recentWorkouts.map((w, i) => (_jsxs("div", { children: [_jsx(WorkoutRow, { workout: w }, w.id), i < recentWorkouts.length - 1 && (_jsx("div", { className: "h-px bg-border-default mx-3" }))] }, w.id))) }))] }), _jsx("div", { className: "bg-surface border border-border-default rounded-xl px-5 py-4", children: _jsx(FriendsPlaceholder, {}) })] }));
}
