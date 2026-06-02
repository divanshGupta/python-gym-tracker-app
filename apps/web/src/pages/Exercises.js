import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Search, Dumbbell, Wind, Zap, Activity } from "lucide-react";
import { useExercises, useCreateExercise } from "@gymtracker/hooks";
import { Button, Input, Select, EmptyState } from "../components/ui";
// ── Constants ──────────────────────────────────────────────────────────────
const CATEGORIES = ["strength", "cardio", "flexibility", "core"];
const MUSCLE_GROUPS = ["chest", "back", "shoulders", "arms", "legs", "core", "full_body"];
const EQUIPMENT = ["barbell", "dumbbell", "bodyweight", "machine", "cable", "kettlebell", "none"];
// ── Design maps ────────────────────────────────────────────────────────────
const ACCENT_BAR = {
    strength: "bg-accent",
    cardio: "bg-success",
    flexibility: "bg-warning",
    core: "bg-danger",
};
const ICON_BOX = {
    strength: "bg-accent/10 text-accent",
    cardio: "bg-success/10 text-success",
    flexibility: "bg-warning/10 text-warning",
    core: "bg-danger/10 text-danger",
};
const BADGE = {
    strength: "bg-accent/10 text-accent-light",
    cardio: "bg-success/10 text-success",
    flexibility: "bg-warning/10 text-warning",
    core: "bg-danger/10 text-danger",
};
function ExerciseIcon({ category }) {
    const cls = "w-[15px] h-[15px]";
    switch (category) {
        case "cardio": return _jsx(Wind, { className: cls });
        case "flexibility": return _jsx(Zap, { className: cls });
        case "core": return _jsx(Activity, { className: cls });
        default: return _jsx(Dumbbell, { className: cls });
    }
}
function cap(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ") : "";
}
// ── Form schema ────────────────────────────────────────────────────────────
const schema = z.object({
    name: z.string().min(2, "Minimum 2 characters"),
    category: z.string().min(1, "Select a category"),
    muscle_group: z.string().optional(),
    equipment: z.string().optional(),
});
function AddExerciseForm({ onClose }) {
    const { mutate, isPending, error, reset: resetMutation } = useCreateExercise();
    const { register, handleSubmit, reset, watch, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });
    const selectedCategory = watch("category");
    const showMuscleGroup = selectedCategory === "strength";
    const onSubmit = (data) => {
        mutate({
            name: data.name.trim().toLowerCase(),
            category: data.category,
            muscle_group: showMuscleGroup ? (data.muscle_group || null) : null,
            equipment: data.equipment || null,
        }, {
            onSuccess: () => {
                reset();
                resetMutation();
                onClose();
            },
        });
    };
    return (_jsxs("div", { className: "bg-surface border border-border-default rounded-xl p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[14px] font-semibold text-text-primary", children: "New exercise" }), _jsx("p", { className: "text-[11px] text-text-tertiary mt-0.5", children: "It will be available in all future workouts" })] }), _jsx("button", { onClick: onClose, className: "w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-elevated transition-colors", "aria-label": "Close form", children: _jsx(X, { size: 15 }) })] }), error && (_jsx("div", { className: "mb-4 px-4 py-3 rounded-lg border border-danger/20 bg-danger/10 text-[13px] text-danger", children: error?.response?.data?.detail ?? "Failed to create exercise" })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(Input, { label: "Exercise name", placeholder: "e.g. Bench Press, Running", error: errors.name?.message, ...register("name") }), _jsxs(Select, { label: "Category", error: errors.category?.message, ...register("category"), children: [_jsx("option", { value: "", children: "Select category" }), CATEGORIES.map((c) => (_jsx("option", { value: c, children: cap(c) }, c)))] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [showMuscleGroup && (_jsxs(Select, { label: "Muscle group", ...register("muscle_group"), children: [_jsx("option", { value: "", children: "Optional" }), MUSCLE_GROUPS.map((m) => (_jsx("option", { value: m, children: cap(m) }, m)))] })), _jsxs(Select, { label: "Equipment", ...register("equipment"), children: [_jsx("option", { value: "", children: "Optional" }), EQUIPMENT.map((eq) => (_jsx("option", { value: eq, children: cap(eq) }, eq)))] })] }), _jsxs("div", { className: "flex items-center gap-2 pt-1", children: [_jsx(Button, { type: "button", variant: "secondary", size: "sm", onClick: onClose, children: "Cancel" }), _jsx(Button, { type: "submit", size: "sm", loading: isPending, children: "Add exercise" })] })] })] }));
}
// ── Exercise row ───────────────────────────────────────────────────────────
function ExerciseRow({ exercise }) {
    const cat = exercise.category?.toLowerCase() ?? "strength";
    const accentBar = ACCENT_BAR[cat] ?? "bg-elevated";
    const iconBox = ICON_BOX[cat] ?? "bg-elevated text-text-tertiary";
    const badgeClass = BADGE[cat] ?? "bg-elevated text-text-secondary";
    return (_jsxs("div", { className: "flex items-center bg-surface border border-border-default rounded-xl overflow-hidden hover:border-border-strong hover:bg-elevated/20 transition-all duration-150", children: [_jsx("div", { className: `w-[3px] self-stretch flex-shrink-0 ${accentBar}` }), _jsx("div", { className: "flex items-center justify-center w-[48px] flex-shrink-0", children: _jsx("div", { className: `w-[30px] h-[30px] rounded-lg flex items-center justify-center ${iconBox}`, children: _jsx(ExerciseIcon, { category: cat }) }) }), _jsxs("div", { className: "flex-1 py-3 pr-3 min-w-0", children: [_jsx("p", { className: "text-[13px] font-semibold text-text-primary capitalize leading-snug", children: exercise.name }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [exercise.muscle_group && exercise.muscle_group !== "none" && (_jsx("span", { className: "text-[11px] text-text-tertiary capitalize", children: exercise.muscle_group.replace(/_/g, " ") })), _jsx("span", { className: `text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${badgeClass}`, children: exercise.category })] })] }), exercise.equipment && exercise.equipment !== "none" && (_jsx("div", { className: "px-4 flex-shrink-0", children: _jsx("span", { className: "text-[11px] text-text-tertiary capitalize", children: exercise.equipment }) }))] }));
}
// ── Page ───────────────────────────────────────────────────────────────────
export default function Exercises() {
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [showForm, setShowForm] = useState(false);
    const { data: exercises = [], isLoading } = useExercises();
    const filtered = exercises.filter((e) => {
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
        const matchCategory = filterCategory
            ? e.category.toLowerCase() === filterCategory.toLowerCase()
            : true;
        return matchSearch && matchCategory;
    });
    return (_jsxs("div", { className: "flex flex-col gap-5", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-[24px] font-bold text-text-primary tracking-tight", children: "Exercises" }), _jsx("p", { className: "text-[13px] text-text-secondary mt-1", children: "Your exercise library" })] }), _jsx(Button, { icon: showForm ? _jsx(X, { size: 14 }) : _jsx(Plus, { size: 14 }), variant: showForm ? "secondary" : "primary", onClick: () => setShowForm((v) => !v), children: showForm ? "Cancel" : "Add exercise" })] }), showForm && _jsx(AddExerciseForm, { onClose: () => setShowForm(false) }), _jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [_jsxs("div", { className: "relative flex items-center flex-1 min-w-[180px]", children: [_jsx(Search, { size: 14, className: "absolute left-3 text-text-tertiary pointer-events-none" }), _jsx("input", { type: "text", placeholder: "Search exercises\u2026", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full h-9 bg-surface border border-border-default rounded-xl pl-9 pr-3 text-[13px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors" })] }), _jsxs("div", { className: "flex items-center gap-1 p-1 bg-surface border border-border-default rounded-xl", children: [_jsx("button", { onClick: () => setFilterCategory(""), className: [
                                    "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors",
                                    filterCategory === "" ? "bg-elevated text-text-primary" : "text-text-tertiary hover:text-text-secondary",
                                ].join(" "), children: "All" }), CATEGORIES.map((c) => (_jsx("button", { onClick: () => setFilterCategory(filterCategory === c ? "" : c), className: [
                                    "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors capitalize",
                                    filterCategory === c ? "bg-elevated text-text-primary" : "text-text-tertiary hover:text-text-secondary",
                                ].join(" "), children: cap(c) }, c)))] }), _jsxs("span", { className: "text-[12px] text-text-tertiary tabular-nums ml-auto", children: [filtered.length, " exercise", filtered.length !== 1 ? "s" : ""] })] }), isLoading ? (_jsx("div", { className: "flex flex-col gap-2", children: Array.from({ length: 6 }).map((_, i) => (_jsx("div", { className: "h-[58px] bg-surface border border-border-default rounded-xl animate-pulse" }, i))) })) : filtered.length === 0 ? (_jsx("div", { className: "bg-surface border border-border-default rounded-xl", children: _jsx(EmptyState, { icon: _jsx(Dumbbell, { size: 20 }), title: search || filterCategory ? "No exercises found" : "No exercises yet", description: search || filterCategory
                        ? "Try a different search or clear the filter."
                        : "Add your first exercise to start building your library.", action: search || filterCategory ? (_jsx(Button, { size: "sm", variant: "secondary", onClick: () => { setSearch(""); setFilterCategory(""); }, children: "Clear filters" })) : (_jsx(Button, { size: "sm", onClick: () => setShowForm(true), children: "Add exercise" })) }) })) : (_jsx("div", { className: "flex flex-col gap-2", children: filtered.map((e) => (_jsx(ExerciseRow, { exercise: e }, e.id))) }))] }));
}
