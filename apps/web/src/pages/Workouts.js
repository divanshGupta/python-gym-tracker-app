import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronRight, Dumbbell, Wind, Zap, Activity, Calendar, ChevronLeft, } from "lucide-react";
import { useWorkouts, useDeleteWorkout } from "@gymtracker/hooks";
import { Button, EmptyState, PageSkeleton } from "../components/ui";
import { WorkoutRow } from "../components/dashboard/WorkoutRow";
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
function FilterBar({ filters, onChange, totalCount }) {
    const hasDateFilter = !!(filters.date_from || filters.date_to);
    const hasFilter = !!(filters.type || hasDateFilter);
    return (_jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap", children: [_jsx("div", { className: "flex items-center gap-1 p-1 bg-surface border border-border-default rounded-xl overflow-x-auto", children: TYPES.map(({ value, label }) => (_jsx("button", { onClick: () => onChange({ ...filters, type: value || undefined, page: 1 }), className: [
                        "px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-colors duration-150",
                        (filters.type ?? "") === value
                            ? "bg-elevated text-text-primary"
                            : "text-text-tertiary hover:text-text-secondary",
                    ].join(" "), children: label }, label))) }), _jsxs("div", { className: "flex items-center gap-2 px-3 h-9 bg-surface border border-border-default rounded-xl text-[12px] text-text-tertiary", children: [_jsx(Calendar, { size: 13, className: "shrink-0" }), _jsx("input", { type: "date", value: filters.date_from || "", onChange: (e) => onChange({ ...filters, date_from: e.target.value || undefined, page: 1 }), className: "bg-transparent outline-none text-[12px] text-text-secondary w-25 placeholder:text-text-tertiary", placeholder: "From" }), _jsx("span", { className: "text-text-tertiary", children: "\u2014" }), _jsx("input", { type: "date", value: filters.date_to || "", onChange: (e) => onChange({ ...filters, date_to: e.target.value || undefined, page: 1 }), className: "bg-transparent outline-none text-[12px] text-text-secondary w-25", placeholder: "To" })] }), _jsxs("div", { className: "flex items-center gap-3 ml-auto", children: [hasFilter && (_jsx("button", { onClick: () => onChange({ page: 1, limit: 10 }), className: "text-[12px] text-text-tertiary hover:text-text-primary transition-colors", children: "Clear" })), _jsxs("span", { className: "text-[12px] text-text-tertiary tabular-nums", children: [totalCount, " workout", totalCount !== 1 ? "s" : ""] })] })] }));
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
// function WorkoutRow({ workout: w, onDelete }: WorkoutRowProps) {
//   const type        = w.type?.toLowerCase() ?? "strength";
//   const accentClass = ACCENT_CLASS[type]     ?? "bg-elevated";
//   const iconClass   = TYPE_ICON_CLASS[type]  ?? "bg-elevated text-text-tertiary";
//   const badgeClass  = TYPE_BADGE_CLASS[type] ?? "bg-elevated text-text-secondary";
//   const name        = workoutDisplayName(w);
//   return (
//     <div className="flex items-center bg-surface border border-border-default rounded-xl overflow-hidden hover:border-border-strong hover:bg-elevated/30 transition-all duration-150 group">
//       {/* Type accent bar */}
//       <div className={`w-0.75 self-stretch shrink-0 ${accentClass}`} />
//       {/* Icon */}
//       <div className="flex items-center justify-center w-13 shrink-0">
//         <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
//           <WorkoutIcon type={type} />
//         </div>
//       </div>
//       {/* Body — takes remaining space */}
//       <Link to={`/workouts/${w.id}`} className="flex-1 py-3 pr-3 min-w-0">
//         {/* Name + badge */}
//         <div className="flex items-center gap-2 mb-1.5">
//           <span className="text-[13px] font-semibold text-text-primary leading-none">
//             {name}
//           </span>
//           <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
//             {w.type}
//           </span>
//         </div>
//         {/* Meta row */}
//         <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
//           <span className="flex items-center gap-1 text-[11px] text-text-tertiary">
//             <Calendar size={11} />
//             {relativeDay(w.date)}
//           </span>
//           {w.duration && (
//             <span className="flex items-center gap-1 text-[11px] text-text-tertiary">
//               <Clock size={11} />
//               {w.duration} min
//             </span>
//           )}
//           {w.calories && (
//             <span className="flex items-center gap-1 text-[11px] text-text-tertiary">
//               <Flame size={11} />
//               {w.calories} kcal
//             </span>
//           )}
//           {w.workout_exercises?.length > 0 && (
//             <span className="text-[11px] text-text-tertiary">
//               · {w.workout_exercises.length} exercise{w.workout_exercises.length !== 1 ? "s" : ""}
//             </span>
//           )}
//         </div>
//         {/* Notes */}
//         {w.notes && (
//           <p className="mt-1.5 text-[11px] text-text-tertiary truncate max-w-90">
//             {w.notes}
//           </p>
//         )}
//       </Link>
//       {/* Actions */}
//       <div className="flex items-center gap-1 px-3 shrink-0">
//         <Link
//           to={`/workouts/${w.id}`}
//           className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
//           aria-label="View workout"
//         >
//           <ChevronRight size={15} />
//         </Link>
//         <button
//           onClick={(e) => { e.stopPropagation(); onDelete(w.id); }}
//           className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:bg-danger/10 hover:text-danger transition-colors"
//           aria-label="Delete workout"
//         >
//           <Trash2 size={14} />
//         </button>
//       </div>
//     </div>
//   );
// }
// ── Page ───────────────────────────────────────────────────────────────────
export default function Workouts() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({ page: 1, limit: 10 });
    const { data: workouts = [], isLoading } = useWorkouts(filters);
    const { mutate: remove } = useDeleteWorkout();
    const handleDelete = (id) => {
        if (confirm("Delete this workout?"))
            remove(id);
    };
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const canGoNext = workouts.length >= limit;
    const canGoPrev = page > 1;
    if (isLoading)
        return _jsx(PageSkeleton, { stats: 0, rows: 6 });
    return (_jsxs("div", { className: "flex flex-col gap-6 ", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-[24px] font-bold text-text-primary tracking-tight", children: "Workouts" }), workouts.length > 0 && (_jsxs("p", { className: "text-[13px] text-text-secondary mt-1", children: [workouts.length, " session", workouts.length !== 1 ? "s" : "", " logged"] }))] }), _jsx(Button, { icon: _jsx(Plus, { size: 14 }), onClick: () => navigate("/workouts/create"), children: "New workout" })] }), _jsx(FilterBar, { filters: filters, onChange: setFilters, totalCount: workouts.length }), workouts.length === 0 ? (_jsx("div", { className: "bg-surface border border-border-default rounded-xl", children: _jsx(EmptyState, { icon: _jsx(Dumbbell, { size: 22 }), title: "No workouts found", description: filters.type || filters.date_from || filters.date_to
                        ? "Try adjusting your filters."
                        : "Log your first session to start tracking progress.", action: !filters.type && !filters.date_from && !filters.date_to ? (_jsx(Button, { size: "sm", onClick: () => navigate("/workouts/create"), children: "Log first workout" })) : (_jsx(Button, { size: "sm", variant: "secondary", onClick: () => setFilters({ page: 1, limit: 10 }), children: "Clear filters" })) }) })) : (_jsx("div", { className: "flex flex-col gap-2", children: workouts.map((w) => (_jsx(WorkoutRow, { workout: w, onDelete: handleDelete }, w.id))) })), workouts.length > 0 && (_jsxs("div", { className: "flex items-center justify-center gap-3 mt-2", children: [_jsxs("button", { disabled: !canGoPrev, onClick: () => setFilters({ ...filters, page: page - 1 }), className: "flex items-center gap-1.5 h-8 px-3 rounded-lg bg-surface border border-border-default text-[12px] text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors disabled:opacity-35 disabled:pointer-events-none", children: [_jsx(ChevronLeft, { size: 13 }), " Previous"] }), _jsxs("span", { className: "text-[12px] text-text-tertiary tabular-nums", children: ["Page ", page] }), _jsxs("button", { disabled: !canGoNext, onClick: () => setFilters({ ...filters, page: page + 1 }), className: "flex items-center gap-1.5 h-8 px-3 rounded-lg bg-surface border border-border-default text-[12px] text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors disabled:opacity-35 disabled:pointer-events-none", children: ["Next ", _jsx(ChevronRight, { size: 13 })] })] }))] }));
}
