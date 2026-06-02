import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Plus, X, Flag, Trash2 } from "lucide-react";
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal, useLogGoalProgress, } from "@gymtracker/hooks";
import { Button, Input, Select, EmptyState, PageSkeleton } from "../components/ui";
// ── Constants ──────────────────────────────────────────────────────────────
const GOAL_TYPE_LABELS = {
    workout_frequency: "Workout Frequency",
    lift_target: "Lift Target",
    body_weight: "Body Weight",
    progressive_overload: "Progressive Overload",
};
const GOAL_TYPE_UNITS = {
    workout_frequency: "sessions/week",
    lift_target: "kg",
    body_weight: "kg",
    progressive_overload: "%",
};
const STATUS_FILTERS = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "abandoned", label: "Abandoned" },
    { value: "", label: "All" },
];
// ── Helpers ────────────────────────────────────────────────────────────────
function progressPercent(goal) {
    if (!goal.current_value || !goal.target_value)
        return 0;
    return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
}
function formatDeadline(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}
// ── Status badge ───────────────────────────────────────────────────────────
const STATUS_BADGE = {
    active: "bg-success/10 text-success border border-success/15",
    completed: "bg-accent/10 text-accent-light border border-accent/15",
    abandoned: "bg-elevated text-text-tertiary border border-border-default",
};
function StatusBadge({ status }) {
    return (_jsx("span", { className: `text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[status] ?? STATUS_BADGE.abandoned}`, children: status }));
}
// ── Progress bar ───────────────────────────────────────────────────────────
function ProgressBar({ goal }) {
    const pct = progressPercent(goal);
    const isComplete = goal.status === "completed" || pct >= 100;
    const barColor = isComplete ? "bg-success" : "bg-accent";
    return (_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[11px] text-text-tertiary", children: "Progress" }), _jsxs("span", { className: `text-[12px] font-semibold ${isComplete ? "text-success" : "text-text-primary"}`, children: [pct, "%"] })] }), _jsx("div", { className: "h-1.5 bg-elevated rounded-full overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all duration-500 ${barColor}`, style: { width: `${pct}%` } }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-[10px] text-text-tertiary", children: ["0 ", goal.unit] }), _jsxs("span", { className: "text-[10px] text-text-tertiary", children: [goal.target_value, " ", goal.unit] })] })] }));
}
function GoalCard({ goal: g, onLog, onAbandon, onDelete }) {
    const isActive = g.status === "active";
    return (_jsxs("div", { className: [
            "bg-surface border border-border-default rounded-xl p-4 flex flex-col gap-4",
            "hover:border-border-strong transition-colors duration-150",
            !isActive ? "opacity-60" : "",
        ].join(" "), children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex flex-col gap-2 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("span", { className: "text-[14px] font-semibold text-text-primary leading-snug", children: g.title }), _jsx(StatusBadge, { status: g.status })] }), _jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [_jsx("span", { className: "text-[10px] font-medium px-2 py-0.5 rounded-md bg-elevated text-text-secondary", children: GOAL_TYPE_LABELS[g.goal_type] }), _jsx("span", { className: "text-[10px] text-border-strong", children: "\u00B7" }), _jsxs("span", { className: "text-[11px] text-text-tertiary", children: ["Target: ", g.target_value, " ", g.unit] }), g.current_value != null && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-[10px] text-border-strong", children: "\u00B7" }), _jsxs("span", { className: "text-[11px] text-text-tertiary", children: ["Current: ", g.current_value, " ", g.unit] })] })), g.deadline && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-[10px] text-border-strong", children: "\u00B7" }), _jsxs("span", { className: "text-[11px] text-text-tertiary", children: ["Due ", formatDeadline(g.deadline)] })] }))] })] }), _jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [isActive && (_jsxs("button", { onClick: () => onLog(g), className: "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-accent/10 text-accent text-[11px] font-semibold hover:bg-accent/20 transition-colors", children: [_jsx(Plus, { size: 11 }), " Log"] })), isActive && (_jsx("button", { onClick: () => onAbandon(g.id), className: "w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:bg-warning/10 hover:text-warning transition-colors", "aria-label": "Abandon goal", children: _jsx(Flag, { size: 13 }) })), _jsx("button", { onClick: () => onDelete(g.id), className: "w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:bg-danger/10 hover:text-danger transition-colors", "aria-label": "Delete goal", children: _jsx(Trash2, { size: 13 }) })] })] }), _jsx(ProgressBar, { goal: g })] }));
}
function LogModal({ goal, onClose }) {
    const [value, setValue] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const { mutate: logProgress, isPending } = useLogGoalProgress();
    const handleSave = () => {
        if (!value)
            return;
        logProgress({ goalId: goal.id, data: { value: parseFloat(value), date } }, { onSuccess: onClose });
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center px-4 bg-void/70 backdrop-blur-sm", onClick: (e) => e.target === e.currentTarget && onClose(), children: _jsxs("div", { className: "w-full max-w-sm bg-surface border border-border-default rounded-2xl p-6 flex flex-col gap-5 shadow-xl", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-[15px] font-bold text-text-primary", children: "Log progress" }), _jsx("p", { className: "text-[12px] text-text-secondary mt-0.5", children: goal.title })] }), _jsx("button", { onClick: onClose, className: "w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-elevated transition-colors", "aria-label": "Close", children: _jsx(X, { size: 15 }) })] }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(Input, { label: `Current value (${goal.unit ?? ""})`, type: "number", placeholder: `e.g. ${goal.current_value ?? goal.target_value}`, value: value, onChange: (e) => setValue(e.target.value) }), _jsx(Input, { label: "Date", type: "date", value: date, onChange: (e) => setDate(e.target.value) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "secondary", size: "sm", onClick: onClose, children: "Cancel" }), _jsx(Button, { size: "sm", loading: isPending, onClick: handleSave, className: "flex-1", children: "Save progress" })] })] }) }));
}
function CreateGoalForm({ onClose }) {
    const { mutate: create } = useCreateGoal();
    const [form, setForm] = useState({
        title: "",
        goal_type: "workout_frequency",
        target_value: "",
        unit: "",
        deadline: "",
    });
    const handleCreate = () => {
        if (!form.title || !form.target_value)
            return;
        create({
            title: form.title,
            goal_type: form.goal_type,
            target_value: parseFloat(form.target_value),
            unit: form.unit || GOAL_TYPE_UNITS[form.goal_type],
            deadline: form.deadline || undefined,
        }, {
            onSuccess: () => {
                onClose();
                setForm({ title: "", goal_type: "workout_frequency", target_value: "", unit: "", deadline: "" });
            },
        });
    };
    return (_jsxs("div", { className: "bg-surface border border-border-default rounded-xl p-5 flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[14px] font-semibold text-text-primary", children: "New goal" }), _jsx("p", { className: "text-[11px] text-text-tertiary mt-0.5", children: "Set a target to work towards" })] }), _jsx("button", { onClick: onClose, className: "w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-elevated transition-colors", "aria-label": "Close", children: _jsx(X, { size: 15 }) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsx(Input, { label: "Goal title", placeholder: "e.g. Bench Press 100kg", value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }) }), _jsx(Select, { label: "Goal type", value: form.goal_type, onChange: (e) => setForm({ ...form, goal_type: e.target.value }), children: Object.entries(GOAL_TYPE_LABELS).map(([k, v]) => (_jsx("option", { value: k, children: v }, k))) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsx(Input, { label: `Target value (${GOAL_TYPE_UNITS[form.goal_type]})`, type: "number", placeholder: "e.g. 100", value: form.target_value, onChange: (e) => setForm({ ...form, target_value: e.target.value }) }), _jsx(Input, { label: "Deadline (optional)", type: "date", value: form.deadline, onChange: (e) => setForm({ ...form, deadline: e.target.value }) })] }), _jsxs("div", { className: "flex items-center gap-2 pt-1", children: [_jsx(Button, { variant: "secondary", size: "sm", onClick: onClose, children: "Cancel" }), _jsx(Button, { size: "sm", onClick: handleCreate, children: "Create goal" })] })] }));
}
// ── Page ───────────────────────────────────────────────────────────────────
export default function Goals() {
    const [statusFilter, setStatusFilter] = useState("active");
    const [showForm, setShowForm] = useState(false);
    const [logModal, setLogModal] = useState(null);
    const { data: goals = [], isLoading } = useGoals(statusFilter || undefined);
    const { mutate: update } = useUpdateGoal();
    const { mutate: remove } = useDeleteGoal();
    const handleAbandon = (id) => update({ id, data: { status: "abandoned" } });
    const handleDelete = (id) => { if (confirm("Delete this goal?"))
        remove(id); };
    if (isLoading)
        return _jsx(PageSkeleton, { stats: 0, rows: 3 });
    return (_jsxs("div", { className: "flex flex-col gap-5", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-[24px] font-bold text-text-primary tracking-tight", children: "Goals" }), _jsx("p", { className: "text-[13px] text-text-secondary mt-1", children: "Track your targets" })] }), _jsx(Button, { icon: showForm ? _jsx(X, { size: 14 }) : _jsx(Plus, { size: 14 }), variant: showForm ? "secondary" : "primary", onClick: () => setShowForm((v) => !v), children: showForm ? "Cancel" : "New goal" })] }), showForm && _jsx(CreateGoalForm, { onClose: () => setShowForm(false) }), _jsx("div", { className: "flex items-center gap-1 p-1 bg-surface border border-border-default rounded-xl w-fit", children: STATUS_FILTERS.map(({ value, label }) => (_jsx("button", { onClick: () => setStatusFilter(value), className: [
                        "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150",
                        statusFilter === value
                            ? "bg-elevated text-text-primary"
                            : "text-text-tertiary hover:text-text-secondary",
                    ].join(" "), children: label }, label))) }), goals.length === 0 ? (_jsx("div", { className: "bg-surface border border-border-default rounded-xl", children: _jsx(EmptyState, { icon: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("path", { d: "M12 8v4" }), _jsx("path", { d: "M12 16h.01" })] }), title: statusFilter === "active" ? "No active goals" : "No goals found", description: statusFilter === "active"
                        ? "Create a goal to start tracking your progress."
                        : "Try a different filter.", action: statusFilter === "active" ? (_jsx(Button, { size: "sm", onClick: () => setShowForm(true), children: "Create first goal" })) : undefined }) })) : (_jsx("div", { className: "flex flex-col gap-3", children: goals.map((g) => (_jsx(GoalCard, { goal: g, onLog: setLogModal, onAbandon: handleAbandon, onDelete: handleDelete }, g.id))) })), logModal && (_jsx(LogModal, { goal: logModal, onClose: () => setLogModal(null) }))] }));
}
