import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, } from "recharts";
import { Flame, Trophy } from "lucide-react";
import { useWorkoutStats, usePersonalBests, useStreak, useExerciseProgress, useExercises, } from "@gymtracker/hooks";
import { StatCard, PageSkeleton } from "../components/ui";
// ── Design tokens (match CSS vars) ────────────────────────────────────────
const ACCENT = "#7C5CFC";
const ACCENT_L = "#9B7EFD";
const BORDER = "#2C2C2E";
const HINT = "#636366";
// Bar colour per type — consistent with Workouts page accent bars
const TYPE_COLOUR = {
    strength: ACCENT,
    cardio: "#22C55E",
    flexibility: "#F59E0B",
    core: "#EF4444",
};
// ── Shared chart style props ───────────────────────────────────────────────
const AXIS_TICK = { fill: HINT, fontSize: 11 };
const GRID_PROPS = { strokeDasharray: "3 3", stroke: BORDER };
// ── Sub-components ─────────────────────────────────────────────────────────
function SectionLabel({ children }) {
    return (_jsx("p", { className: "text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.09em] mb-3", children: children }));
}
function StreakCard({ value, label, icon, iconBg, }) {
    return (_jsxs("div", { className: "flex items-center gap-4 bg-surface border border-border-default rounded-xl p-4", children: [_jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`, children: icon }), _jsxs("div", { children: [_jsxs("p", { className: "text-[26px] font-bold text-text-primary leading-none tracking-tight", children: [value, _jsx("span", { className: "text-[13px] font-normal text-text-tertiary ml-1.5", children: "days" })] }), _jsx("p", { className: "text-[11px] text-text-tertiary mt-1", children: label })] })] }));
}
function BarTooltip({ active, payload, label }) {
    if (!active || !payload?.length)
        return null;
    return (_jsxs("div", { className: "bg-surface border border-border-default rounded-lg px-3 py-2 text-[12px]", children: [_jsx("p", { className: "text-text-secondary capitalize mb-0.5", children: label }), _jsxs("p", { className: "text-text-primary font-semibold", children: [payload[0].value, " sessions"] })] }));
}
function LineTooltip({ active, payload, label, unit }) {
    if (!active || !payload?.length)
        return null;
    return (_jsxs("div", { className: "bg-surface border border-border-default rounded-lg px-3 py-2 text-[12px]", children: [_jsx("p", { className: "text-text-tertiary mb-0.5", children: label }), _jsxs("p", { className: "text-text-primary font-semibold", children: [payload[0].value, " ", unit] })] }));
}
function EmptyChart({ message }) {
    return (_jsxs("div", { className: "flex flex-col items-center py-10 text-center", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-elevated border border-border-default flex items-center justify-center text-text-tertiary mb-3", children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("path", { d: "M3 3v18h18" }), _jsx("path", { d: "m19 9-5 5-4-4-3 3" })] }) }), _jsx("p", { className: "text-[13px] text-text-secondary max-w-[220px]", children: message })] }));
}
// ── Page ───────────────────────────────────────────────────────────────────
export default function Progress() {
    const [selectedExerciseId, setSelectedExerciseId] = useState("");
    const { data: stats, isLoading: statsLoading } = useWorkoutStats();
    const { data: pbData, isLoading: pbLoading } = usePersonalBests();
    const { data: exercises = [] } = useExercises();
    const { data: exerciseProgress, isLoading: progressLoading } = useExerciseProgress(selectedExerciseId ? Number(selectedExerciseId) : 0);
    const { currentStreak, longestStreak, isLoading: streakLoading, error: streakError, } = useStreak();
    const personalBests = pbData?.personal_bests ?? [];
    const typeChartData = stats?.workouts_by_type
        ? Object.entries(stats.workouts_by_type).map(([type, count]) => ({ type, count }))
        : [];
    if (statsLoading && streakLoading)
        return _jsx(PageSkeleton, { stats: 4, rows: 0 });
    return (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-[24px] font-bold text-text-primary tracking-tight", children: "Progress" }), _jsx("p", { className: "text-[13px] text-text-secondary mt-1", children: "Your training stats at a glance" })] }), !statsLoading && stats && (_jsxs("section", { children: [_jsx(SectionLabel, { children: "Overview" }), _jsxs("div", { className: "grid grid-cols-2 xl:grid-cols-4 gap-3", children: [_jsx(StatCard, { label: "Total workouts", value: stats.total_workouts ?? "--" }), _jsx(StatCard, { label: "Total duration", value: stats.total_duration_minutes ?? "--", unit: "min" }), _jsx(StatCard, { label: "Calories burned", value: stats.total_calories_burned ?? "--", unit: "kcal" }), _jsx(StatCard, { label: "Top exercise", value: stats.most_logged_exercise ?? "—" })] })] })), !streakLoading && !streakError && (_jsxs("section", { children: [_jsx(SectionLabel, { children: "Streak" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsx(StreakCard, { value: currentStreak ?? 0, label: "Current streak", iconBg: "bg-warning/10", icon: _jsx(Flame, { size: 18, className: "text-warning" }) }), _jsx(StreakCard, { value: longestStreak ?? 0, label: "Longest streak", iconBg: "bg-accent/10", icon: _jsx(Trophy, { size: 18, className: "text-accent" }) })] })] })), (typeChartData.length > 0 || (!pbLoading && personalBests.length > 0)) && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [typeChartData.length > 0 && (_jsxs("section", { className: "bg-surface border border-border-default rounded-xl p-5", children: [_jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Workouts by type" }), _jsx("p", { className: "text-[11px] text-text-tertiary mt-0.5 mb-4", children: "Session count per category" }), _jsx(ResponsiveContainer, { width: "100%", height: 180, children: _jsxs(BarChart, { data: typeChartData, barCategoryGap: "35%", children: [_jsx(CartesianGrid, { ...GRID_PROPS, vertical: false }), _jsx(XAxis, { dataKey: "type", tick: AXIS_TICK, axisLine: false, tickLine: false }), _jsx(YAxis, { tick: AXIS_TICK, axisLine: false, tickLine: false, allowDecimals: false }), _jsx(Tooltip, { content: _jsx(BarTooltip, {}), cursor: { fill: "rgba(255,255,255,0.03)" } }), _jsx(Bar, { dataKey: "count", radius: [4, 4, 0, 0], children: typeChartData.map((entry) => (_jsx(Cell, { fill: TYPE_COLOUR[entry.type.toLowerCase()] ?? ACCENT, fillOpacity: 0.85 }, entry.type))) })] }) })] })), !pbLoading && personalBests.length > 0 && (_jsxs("section", { className: "bg-surface border border-border-default rounded-xl overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-border-default", children: [_jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Personal bests" }), _jsx("p", { className: "text-[11px] text-text-tertiary", children: "Max weight" })] }), _jsx("div", { children: personalBests.map((pb, i) => (_jsxs("div", { className: [
                                        "flex items-center justify-between px-5 py-3 hover:bg-elevated/40 transition-colors",
                                        i < personalBests.length - 1 ? "border-b border-border-default/50" : "",
                                    ].join(" "), children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-[11px] font-semibold text-text-tertiary w-4 tabular-nums", children: i + 1 }), _jsx("span", { className: "text-[13px] font-medium text-text-primary capitalize", children: pb.exercise })] }), _jsxs("span", { className: "text-[13px] font-bold text-accent tabular-nums", children: [pb.max_weight_kg, " kg"] })] }, pb.exercise))) })] }))] })), _jsxs("section", { className: "bg-surface border border-border-default rounded-xl p-5", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3 mb-5", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Exercise progress" }), _jsx("p", { className: "text-[11px] text-text-tertiary mt-0.5", children: "Weight and volume over time" })] }), _jsxs("div", { className: "sm:ml-auto relative", children: [_jsxs("select", { value: selectedExerciseId, onChange: (e) => setSelectedExerciseId(e.target.value ? Number(e.target.value) : ""), className: "h-9 bg-elevated border border-border-default rounded-lg pl-3 pr-8 text-[13px] text-text-primary appearance-none outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors min-w-[200px]", children: [_jsx("option", { value: "", children: "Select an exercise\u2026" }), exercises.map((ex) => (_jsx("option", { value: ex.id, children: ex.name.charAt(0).toUpperCase() + ex.name.slice(1) }, ex.id)))] }), _jsx("svg", { className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none", width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "m6 9 6 6 6-6" }) })] })] }), !selectedExerciseId ? (_jsx(EmptyChart, { message: "Select an exercise above to see your progress over time." })) : progressLoading ? (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx("div", { className: "h-[180px] bg-elevated rounded-xl animate-pulse" }), _jsx("div", { className: "h-[180px] bg-elevated rounded-xl animate-pulse" })] })) : !exerciseProgress || exerciseProgress.max_weight_over_time.length === 0 ? (_jsx(EmptyChart, { message: "No data yet. Log this exercise in a workout to start tracking." })) : (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[11px] text-text-tertiary mb-3", children: "Max weight (kg)" }), _jsx(ResponsiveContainer, { width: "100%", height: 180, children: _jsxs(LineChart, { data: exerciseProgress.max_weight_over_time, children: [_jsx(CartesianGrid, { ...GRID_PROPS }), _jsx(XAxis, { dataKey: "date", tick: AXIS_TICK, axisLine: false, tickLine: false }), _jsx(YAxis, { tick: AXIS_TICK, axisLine: false, tickLine: false }), _jsx(Tooltip, { content: _jsx(LineTooltip, { unit: "kg" }) }), _jsx(Line, { type: "monotone", dataKey: "max_weight", stroke: ACCENT, strokeWidth: 2, dot: { fill: ACCENT, r: 3, strokeWidth: 0 }, activeDot: { r: 5, fill: ACCENT } })] }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[11px] text-text-tertiary mb-3", children: "Volume (sets \u00D7 reps \u00D7 weight)" }), _jsx(ResponsiveContainer, { width: "100%", height: 180, children: _jsxs(LineChart, { data: exerciseProgress.volume_over_time, children: [_jsx(CartesianGrid, { ...GRID_PROPS }), _jsx(XAxis, { dataKey: "date", tick: AXIS_TICK, axisLine: false, tickLine: false }), _jsx(YAxis, { tick: AXIS_TICK, axisLine: false, tickLine: false }), _jsx(Tooltip, { content: _jsx(LineTooltip, { unit: "" }) }), _jsx(Line, { type: "monotone", dataKey: "volume", stroke: ACCENT_L, strokeWidth: 2, dot: { fill: ACCENT_L, r: 3, strokeWidth: 0 }, activeDot: { r: 5, fill: ACCENT_L } })] }) })] })] }))] })] }));
}
