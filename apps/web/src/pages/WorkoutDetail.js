import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// apps/web/src/pages/WorkoutDetail.tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { useWorkout, useDeleteWorkout } from "@gymtracker/hooks";
export default function WorkoutDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: workout, isLoading } = useWorkout(Number(id));
    const { mutate: deleteWorkout, isPending, error } = useDeleteWorkout();
    if (isLoading)
        return _jsx("div", { className: "min-h-screen bg-void px-6 py-8 text-text-secondary", children: "Loading..." });
    if (!workout)
        return _jsx("div", { className: "min-h-screen bg-void px-6 py-8 text-text-secondary", children: "Workout not found." });
    const handleDelete = () => {
        const confirmed = confirm("Delete this workout?");
        if (!confirmed)
            return;
        deleteWorkout(workout.id, {
            onSuccess: () => {
                navigate("/workouts");
            },
        });
    };
    return (_jsxs("div", { className: "min-h-screen max-w-3xl mx-auto bg-void px-6 py-8 text-text-primary", children: [error && (_jsx("p", { className: "mb-6 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger", children: "Failed to update workout. Try again." })), _jsxs("div", { className: "mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-semibold tracking-tight capitalize text-text-primary", children: [workout.type, " Workout"] }), _jsx("p", { className: "mt-1 text-sm text-text-secondary", children: workout.date })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Link, { to: `/workouts/${workout.id}/edit`, className: "rounded-lg border border-border-default bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-elevated", children: "Edit" }), _jsx("button", { onClick: handleDelete, disabled: isPending, className: "rounded-lg bg-danger px-4 py-2 text-sm font-medium text-text-primary transition-all duration-200 hover:opacity-90 disabled:opacity-50", children: isPending ? "Deleting..." : "Delete" })] })] }), _jsx("div", { className: "mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3", children: [
                    { label: "Duration", value: workout.duration ? `${workout.duration} min` : "--" },
                    { label: "Calories", value: workout.calories ? `${workout.calories} kcal` : "--" },
                    { label: "Exercises", value: workout.workout_exercises.length },
                ].map((s) => (_jsxs("div", { className: "rounded-xl border border-border-default bg-surface p-5 text-center", children: [_jsx("p", { className: "mb-1 text-xs font-medium uppercase tracking-wide text-text-tertiary", children: s.label }), _jsx("p", { className: "text-lg font-semibold text-text-primary", children: s.value })] }, s.label))) }), workout.notes && (_jsxs("div", { className: "mb-8 rounded-xl border border-border-default bg-surface p-5", children: [_jsx("p", { className: "mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary", children: "Notes" }), _jsx("p", { className: "text-sm leading-relaxed text-text-primary", children: workout.notes })] })), _jsxs(Link, { to: "/progress", className: "block rounded-xl border border-border-default bg-surface p-5", children: [_jsx("p", { className: "mb-5 text-sm font-medium text-text-secondary", children: "Exercises" }), workout.workout_exercises.length === 0 ? (_jsx("p", { className: "text-sm text-text-tertiary", children: "No exercises logged." })) : (_jsx("div", { className: "flex flex-col gap-4", children: workout.workout_exercises.map((we) => (_jsxs(Link, { to: `/progress?exercise=${we.exercise.id}`, className: "group block rounded-xl border border-border-default bg-elevated/40 px-5 py-4 transition-all duration-200 hover:border-accent/30 hover:bg-elevated", children: [_jsxs("p", { className: "mb-3 flex items-center justify-between font-medium text-text-primary", children: [_jsxs("span", { children: [we.exercise.name, _jsxs("span", { className: "ml-2 text-xs text-text-tertiary", children: ["(", we.exercise.category, ")"] })] }), _jsx("span", { className: "text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100", children: "View progress \u2192" })] }), _jsxs("div", { className: "flex flex-wrap gap-6 text-sm", children: [we.sets && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-text-tertiary", children: "Sets" }), _jsx("p", { className: "font-semibold text-text-primary", children: we.sets })] })), we.reps && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-text-tertiary", children: "Reps" }), _jsx("p", { className: "font-semibold text-text-primary", children: we.reps })] })), we.weight && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-text-tertiary", children: "Weight" }), _jsxs("p", { className: "font-semibold text-text-primary", children: [we.weight, " kg"] })] }))] })] }, we.id))) }))] }), _jsx("button", { onClick: () => navigate("/workouts"), className: "mt-8 text-sm text-text-secondary transition-colors hover:text-text-primary", children: "\u2190 Back to Workouts" })] }));
}
