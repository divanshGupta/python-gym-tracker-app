import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// apps/web/src/pages/CreateWorkout.tsx
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useExercises, useCreateWorkout, } from "@gymtracker/hooks";
import { WORKOUT_TYPES, } from "@gymtracker/types";
/* =========================
   Validation Schema
========================= */
const exerciseSchema = z.object({
    exercise_id: z
        .number({
        error: "Exercise is required",
    })
        .min(1, "Exercise is required"),
    sets: z.number().positive().optional().nullable(),
    reps: z.number().positive().optional().nullable(),
    weight: z.number().positive().optional().nullable(),
});
const schema = z.object({
    date: z.string().min(1, "Date is required"),
    type: z.enum(WORKOUT_TYPES, { error: "Invalid workout type" }),
    duration: z
        .number()
        .positive("Duration must be greater than 0")
        .optional()
        .nullable(),
    calories: z
        .number()
        .positive("Calories must be greater than 0")
        .optional()
        .nullable(),
    notes: z
        .string()
        .max(500, "Notes cannot exceed 500 characters")
        .optional()
        .nullable(),
    exercises: z
        .array(exerciseSchema)
        .min(1, "Add at least one exercise"),
});
/* =========================
   Helpers
========================= */
const parseOptionalNumber = (value) => {
    if (value.trim() === "")
        return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
};
/* =========================
   Component
========================= */
export default function CreateWorkout() {
    const navigate = useNavigate();
    const { data: exercises = [], isLoading: exercisesLoading, } = useExercises();
    const { mutate: createWorkout, isPending, error, } = useCreateWorkout();
    const { register, control, handleSubmit, setValue, watch, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            type: "strength",
            duration: undefined,
            calories: undefined,
            notes: "",
            exercises: [],
        },
    });
    const { fields, append, remove, } = useFieldArray({
        control,
        name: "exercises",
    });
    const watchedExercises = watch("exercises");
    /* =========================
       Submit
    ========================= */
    const onSubmit = (data) => {
        const payload = {
            ...data,
            exercises: data.exercises.filter((exercise) => exercise.exercise_id !== 0),
        };
        createWorkout(payload, {
            onSuccess: () => {
                navigate("/workouts");
            },
        });
    };
    /* =========================
       Render
    ========================= */
    return (_jsx("div", { className: "min-h-screen bg-void text-text-primary", children: _jsxs("div", { className: "max-w-3xl mx-auto px-6 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-semibold tracking-tight text-text-primary", children: "Create Workout" }), _jsx("p", { className: "mt-2 text-sm text-text-secondary", children: "Track your training session and exercises." })] }), error && (_jsx("div", { className: "mb-6 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger", children: "Failed to create workout. Please try again." })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { className: "bg-surface border border-border-default rounded-xl p-6 space-y-6", children: [_jsx("h2", { className: "text-lg font-semibold tracking-tight text-text-primary", children: "Workout Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1.5 block text-sm font-medium text-text-secondary", children: "Date" }), _jsx("input", { type: "date", ...register("date"), className: "w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20" }), errors.date && (_jsx("p", { className: "mt-1 text-xs text-danger", children: errors.date.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-1", children: "Workout Type" }), _jsx("select", { ...register("type"), className: "w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20", children: WORKOUT_TYPES.map((type) => (_jsx("option", { value: type, children: type.charAt(0).toUpperCase() +
                                                            type.slice(1) }, type))) }), errors.type && (_jsx("p", { className: "mt-1 text-xs text-danger", children: errors.type.message }))] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-1", children: "Duration (minutes)" }), _jsx("input", { type: "number", placeholder: "60", onChange: (e) => setValue("duration", parseOptionalNumber(e.target.value)), className: "w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20" }), errors.duration && (_jsx("p", { className: "mt-1 text-xs text-danger", children: errors.duration.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-1", children: "Calories Burned" }), _jsx("input", { type: "number", placeholder: "400", onChange: (e) => setValue("calories", parseOptionalNumber(e.target.value)), className: "w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20" }), errors.calories && (_jsx("p", { className: "mt-1 text-xs text-danger", children: errors.calories.message }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-1", children: "Notes" }), _jsx("textarea", { rows: 4, ...register("notes"), placeholder: "How was today's workout?", className: "w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20" }), errors.notes && (_jsx("p", { className: "mt-1 text-xs text-danger", children: errors.notes.message }))] })] }), _jsxs("div", { className: "bg-surface border border-border-default rounded-xl p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold", children: "Exercises" }), _jsx("p", { className: "mt-1 text-sm text-text-secondary", children: "Add exercises performed during this workout." })] }), _jsx("button", { type: "button", onClick: () => append({
                                                exercise_id: 0,
                                                sets: undefined,
                                                reps: undefined,
                                                weight: undefined,
                                            }), className: "rounded-lg bg-accent px-4 py-2 text-sm font-medium text-text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.98]", children: "Add Exercise" })] }), errors.exercises?.message && (_jsx("p", { className: "mb-4 text-sm text-danger", children: errors.exercises.message })), _jsx("div", { className: "space-y-4", children: fields.map((field, index) => (_jsxs("div", { className: "rounded-xl border border-border-default bg-elevated/40 p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "text-sm font-medium text-text-secondary", children: ["Exercise #", index + 1] }), _jsx("button", { type: "button", onClick: () => remove(index), className: "text-sm text-danger transition-colors hover:opacity-80", children: "Remove" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm text-gray-400 mb-1", children: "Exercise" }), _jsxs("select", { value: watchedExercises?.[index]
                                                            ?.exercise_id ?? 0, onChange: (e) => setValue(`exercises.${index}.exercise_id`, Number(e.target.value)), disabled: exercisesLoading, className: "w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20", children: [_jsx("option", { value: 0, children: "Select exercise" }), exercises.map((exercise) => (_jsxs("option", { value: exercise.id, children: [exercise.name, " (", exercise.category, ")"] }, exercise.id)))] }), errors.exercises?.[index]
                                                        ?.exercise_id && (_jsx("p", { className: "mt-1 text-xs text-danger", children: errors.exercises[index]
                                                            ?.exercise_id?.message }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-1", children: "Sets" }), _jsx("input", { type: "number", placeholder: "4", onChange: (e) => setValue(`exercises.${index}.sets`, parseOptionalNumber(e.target.value)), className: "w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-1", children: "Reps" }), _jsx("input", { type: "number", placeholder: "12", onChange: (e) => setValue(`exercises.${index}.reps`, parseOptionalNumber(e.target.value)), className: "w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-1", children: "Weight (kg)" }), _jsx("input", { type: "number", placeholder: "80", onChange: (e) => setValue(`exercises.${index}.weight`, parseOptionalNumber(e.target.value)), className: "w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20" })] })] })] }, field.id))) })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsx("button", { type: "button", onClick: () => navigate("/workouts"), className: "flex-1 rounded-xl border border-border-default bg-surface py-3 font-medium text-text-primary transition-all duration-200 hover:bg-elevated", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isPending, className: "flex-1 rounded-xl bg-accent py-3 font-semibold text-text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50", children: isPending
                                        ? "Saving Workout..."
                                        : "Save Workout" })] })] })] }) }));
}
