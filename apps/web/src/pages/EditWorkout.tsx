// apps/web/src/pages/EditWorkout.tsx
import { useNavigate, useParams } from "react-router-dom";
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

type WorkoutFormData = z.infer<typeof schema>;

// Shared "editable" affordance: dashed underline at rest, solid on focus.
// Reused across every input in this form so the whole page reads consistently.
const editableField =
  "w-full bg-transparent text-text-primary border-b border-dashed border-border-default " +
  "focus:outline-none focus:border-solid focus:border-primary transition-colors duration-200";

export default function EditWorkout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: workout, isLoading } = useWorkout(Number(id));
  const { mutate, isPending, error } = useUpdateWorkout();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof schema>, any, z.output<typeof schema>>({
    resolver: zodResolver(schema),
  });

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

  const onSubmit = (data: WorkoutFormData) => {
    mutate(
      { id: Number(id), data },
      { onSuccess: () => navigate(`/workouts/${id}`) }
    );
  };

  if (isLoading)
    return <div className="min-h-screen bg-void px-6 py-8 text-text-secondary">Loading...</div>;
  if (!workout)
    return <div className="min-h-screen bg-void px-6 py-8 text-text-secondary">Workout not found.</div>;

  return (
    <div className="min-h-screen max-w-3xl mx-auto bg-void text-text-primary">
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* ── Error banner ── */}
        {error && (
          <p className="mb-6 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
            Failed to update workout. Please try again.
          </p>
        )}

        {/* ── Header — matches WorkoutDetail's title + date layout ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col w-full">
            <select
              {...register("type")}
              className={`${editableField} text-xl font-medium tracking-tight pb-1 max-w-60`}
            >
              <option value="" className="text-black">Select Category</option>
              {WORKOUT_TYPES.map((t) => (
                <option key={t} value={t} className="text-black text-lg font-normal capitalize">{t}</option>
              ))}
            </select>
            {errors.type && <p className="text-danger text-xs mt-1">{errors.type.message}</p>}

            <input
              type="date"
              {...register("date")}
              className={`${editableField} mt-2 text-sm text-text-secondary pb-1 max-w-40`}
            />
            {errors.date && <p className="text-danger text-xs mt-1">{errors.date.message}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-accent hover:bg-accent-light disabled:bg-opacity-50"
            >
              {isPending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/workouts/${id}`)}
              className="rounded-lg border border-border-default bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-elevated"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* ── Stats — same 3-card grid as WorkoutDetail ── */}
        <div className="mb-8 grid grid-cols-3 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border-default bg-surface p-5 text-center">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-tertiary">
              Duration (min)
            </p>
            <input
              type="number"
              {...register("duration")}
              className={`${editableField} text-center text-lg font-semibold`}
            />
          </div>

          <div className="rounded-xl border border-border-default bg-surface p-5 text-center">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-tertiary">
              Calories
            </p>
            <input
              type="number"
              {...register("calories")}
              className={`${editableField} text-center text-lg font-semibold`}
            />
          </div>

          {/* Exercise count isn't editable here, so it stays read-only — matches the note below */}
          <div className="rounded-xl border border-border-default bg-surface p-5 text-center">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-tertiary">
              Exercises
            </p>
            <p className="text-lg font-semibold text-text-primary">
              {workout.workout_exercises.length}
            </p>
          </div>
        </div>

        {/* ── Notes — same card as WorkoutDetail, textarea instead of <p> ── */}
        <div className="mb-8 rounded-xl border border-border-default bg-surface p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
            Notes
          </p>
          <textarea
            {...register("notes")}
            rows={1}
            className={`${editableField} resize-none text-sm leading-relaxed`}
          />
        </div>

        <p className="text-text-secondary text-xs">
          * To change exercises, delete this workout and create a new one.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(`/workouts/${id}`)}
            className="flex-1 bg-elevated hover:bg-surface py-2 rounded font-semibold text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-accent hover:bg-accent-light py-2 rounded font-semibold text-sm disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/workouts/${id}`)}
          className="mt-8 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          ← Back to workout
        </button>

      </form>
    </div>
  );
}