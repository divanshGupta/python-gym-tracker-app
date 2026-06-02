import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// apps/web/src/pages/EditWorkout.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useWorkout, useUpdateWorkout } from "@gymtracker/hooks";
import { WORKOUT_TYPES } from "@gymtracker/types";
const schema = z.object({
    date: z.string().min(1, "Date is required"),
    type: z.enum(WORKOUT_TYPES),
    duration: z.coerce.number().min(1).optional(),
    calories: z.coerce.number().min(1).optional(),
    notes: z.string().optional(),
});
export default function EditWorkout() {
    const { id } = useParams();
    const navigate = useNavigate();
    // ── Data ──────────────────────────────────────────────────────────────
    // Before: useQuery + getWorkout(Number(id)) + data?.data unwrap
    // After:  useWorkout returns data directly, no unwrap needed
    const { data: workout, isLoading } = useWorkout(Number(id));
    // ── Mutation ──────────────────────────────────────────────────────────
    // Before: useMutation + updateWorkout + manual invalidateQueries x3
    // After:  useUpdateWorkout invalidates workouts cache internally
    //         stats invalidation added via onSuccess callback at call site
    const { mutate, isPending, error } = useUpdateWorkout();
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
    });
    // Populate form once workout loads — unchanged
    useEffect(() => {
        if (workout) {
            reset({
                date: workout.date,
                type: workout.type,
                duration: workout.duration ?? undefined,
                calories: workout.calories ?? undefined,
                notes: workout.notes ?? undefined,
            });
        }
    }, [workout, reset]);
    const onSubmit = (data) => {
        mutate({ id: Number(id), data }, {
            onSuccess: () => navigate(`/workouts/${id}`),
        });
    };
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-void text-text-secondary p-6", children: "Loading..." }));
    }
    if (!workout) {
        return (_jsx("div", { className: "min-h-screen bg-void text-text-secondary p-6", children: "Workout not found." }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-void text-text-primary p-6 max-w-2xl mx-auto", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Edit Workout" }), error && (_jsx("p", { className: "text-danger text-sm mb-4", children: "Failed to update workout. Try again." })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-5", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-text-secondary text-sm mb-1 block", children: "Date" }), _jsx("input", { type: "date", ...register("date"), className: "w-full bg-elevated text-text-primary px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400" }), errors.date && (_jsx("p", { className: "text-danger text-xs mt-1", children: errors.date.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "text-text-secondary text-sm mb-1 block", children: "Type" }), _jsxs("select", { ...register("type"), className: "w-full bg-elevated text-text-primary px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400", children: [_jsx("option", { value: "", children: "Select type" }), WORKOUT_TYPES.map((t) => (_jsx("option", { value: t, children: t }, t)))] }), errors.type && (_jsx("p", { className: "text-danger text-xs mt-1", children: errors.type.message }))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-text-secondary text-sm mb-1 block", children: "Duration (min)" }), _jsx("input", { type: "number", ...register("duration"), className: "w-full bg-elevated text-text-primary px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-text-secondary text-sm mb-1 block", children: "Calories" }), _jsx("input", { type: "number", ...register("calories"), className: "w-full bg-elevated text-text-primary px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-text-secondary text-sm mb-1 block", children: "Notes" }), _jsx("textarea", { ...register("notes"), rows: 3, className: "w-full bg-elevated text-text-primary px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400 resize-none" })] }), _jsx("p", { className: "text-text-secondary text-xs", children: "* To change exercises, delete this workout and create a new one." }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", onClick: () => navigate(`/workouts/${id}`), className: "flex-1 bg-elevated hover:bg-surface py-2 rounded font-semibold text-sm", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isPending, className: "flex-1 bg-green-500 hover:bg-green-600 py-2 rounded font-semibold text-sm disabled:opacity-50", children: isPending ? "Saving..." : "Save Changes" })] })] })] }));
}
