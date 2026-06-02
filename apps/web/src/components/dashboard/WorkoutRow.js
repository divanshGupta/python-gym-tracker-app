import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { ChevronRight, Trash2, Dumbbell, Wind, Zap, Activity, Calendar, Clock, Flame } from "lucide-react";
// ── Constants ──────────────────────────────────────────────────────────────
const TYPES = [
    { value: "", label: "All" },
    { value: "strength", label: "Strength" },
    { value: "cardio", label: "Cardio" },
    { value: "flexibility", label: "Flexibility" },
    { value: "core", label: "Core" },
];
// left accent bar colour per type
const ACCENT_CLASS = {
    strength: "bg-accent",
    cardio: "bg-success",
    flexibility: "bg-warning",
    core: "bg-danger",
};
// icon background tint + icon per type
const TYPE_ICON_CLASS = {
    strength: "bg-accent/10 text-accent",
    cardio: "bg-success/10 text-success",
    flexibility: "bg-warning/10 text-warning",
    core: "bg-danger/10 text-danger",
};
const TYPE_BADGE_CLASS = {
    strength: "bg-accent/10 text-accent-light",
    cardio: "bg-success/10 text-success",
    flexibility: "bg-warning/10 text-warning",
    core: "bg-danger/10 text-danger",
};
function WorkoutIcon({ type }) {
    const cls = "w-4 h-4";
    switch (type.toLowerCase()) {
        case "cardio": return _jsx(Wind, { className: cls });
        case "flexibility": return _jsx(Zap, { className: cls });
        case "core": return _jsx(Activity, { className: cls });
        default: return _jsx(Dumbbell, { className: cls });
    }
}
// ── Helpers ────────────────────────────────────────────────────────────────
function relativeDay(dateStr) {
    const today = new Date();
    const d = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
    if (diff === 0)
        return "Today";
    if (diff === 1)
        return "Yesterday";
    if (diff < 7)
        return `${diff}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
// Derive a human-readable title from the workout's exercises.
// Falls back to capitalised type if no exercises are logged yet.
function workoutDisplayName(w) {
    const exs = w.workout_exercises ?? [];
    if (exs.length === 0) {
        return w.type ? w.type.charAt(0).toUpperCase() + w.type.slice(1) : "Workout";
    }
    const first = exs[0].exercise.name;
    if (exs.length === 1)
        return first;
    if (exs.length === 2)
        return `${first} & ${exs[1].exercise.name}`;
    return `${first}, ${exs[1].exercise.name} +${exs.length - 2} more`;
}
export function WorkoutRow({ workout: w, onDelete }) {
    const type = w.type?.toLowerCase() ?? "strength";
    const accentClass = ACCENT_CLASS[type] ?? "bg-elevated";
    const iconClass = TYPE_ICON_CLASS[type] ?? "bg-elevated text-text-tertiary";
    const badgeClass = TYPE_BADGE_CLASS[type] ?? "bg-elevated text-text-secondary";
    const name = workoutDisplayName(w);
    return (_jsxs("div", { className: "flex items-center bg-surface border border-border-default rounded-xl overflow-hidden hover:border-border-strong hover:bg-elevated/30 transition-all duration-150 group", children: [_jsx("div", { className: `w-0.75 self-stretch shrink-0 ${accentClass}` }), _jsx("div", { className: "flex items-center justify-center w-13 shrink-0", children: _jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`, children: _jsx(WorkoutIcon, { type: type }) }) }), _jsxs(Link, { to: `/workouts/${w.id}`, className: "flex-1 py-3 pr-3 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [_jsx("span", { className: "text-[13px] font-semibold text-text-primary leading-none", children: name }), _jsx("span", { className: `text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeClass}`, children: w.type })] }), _jsxs("div", { className: "flex items-center flex-wrap gap-x-3 gap-y-1", children: [_jsxs("span", { className: "flex items-center gap-1 text-[11px] text-text-tertiary", children: [_jsx(Calendar, { size: 11 }), relativeDay(w.date)] }), w.duration && (_jsxs("span", { className: "flex items-center gap-1 text-[11px] text-text-tertiary", children: [_jsx(Clock, { size: 11 }), w.duration, " min"] })), w.calories && (_jsxs("span", { className: "flex items-center gap-1 text-[11px] text-text-tertiary", children: [_jsx(Flame, { size: 11 }), w.calories, " kcal"] })), w.workout_exercises?.length > 0 && (_jsxs("span", { className: "text-[11px] text-text-tertiary", children: ["\u00B7 ", w.workout_exercises.length, " exercise", w.workout_exercises.length !== 1 ? "s" : ""] }))] }), w.notes && (_jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary truncate max-w-90", children: w.notes }))] }), _jsxs("div", { className: "flex items-center gap-1 px-3 shrink-0", children: [_jsx(Link, { to: `/workouts/${w.id}`, className: "w-8 h-8 rounded-lg flex items-center justify-center bg-accent/10 text-accent hover:bg-accent/20 transition-colors", "aria-label": "View workout", children: _jsx(ChevronRight, { size: 15 }) }), onDelete && (_jsx("button", { onClick: (e) => { e.stopPropagation(); onDelete(w.id); }, className: "w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:bg-danger/10 hover:text-danger transition-colors", "aria-label": "Delete workout", children: _jsx(Trash2, { size: 14 }) }))] })] }));
}
