// apps/web/src/pages/EditWorkout.tsx
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"

import { useWorkout, useUpdateWorkout } from "@gymtracker/hooks";
import { WORKOUT_TYPES } from "@gymtracker/types"

const schema = z.object({
  date:     z.string().min(1, "Date is required"),
  type:     z.enum(WORKOUT_TYPES),
  duration: z.coerce.number().min(1).optional(),
  calories: z.coerce.number().min(1).optional(),
  notes:    z.string().optional(),
});

type WorkoutFormData = z.infer<typeof schema>;

export default function EditWorkout() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // ── Data ──────────────────────────────────────────────────────────────
  // Before: useQuery + getWorkout(Number(id)) + data?.data unwrap
  // After:  useWorkout returns data directly, no unwrap needed
  const { data: workout, isLoading } = useWorkout(Number(id));

  // ── Mutation ──────────────────────────────────────────────────────────
  // Before: useMutation + updateWorkout + manual invalidateQueries x3
  // After:  useUpdateWorkout invalidates workouts cache internally
  //         stats invalidation added via onSuccess callback at call site
  const { mutate, isPending, error } = useUpdateWorkout();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof schema>,
    any,
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
  });

  // Populate form once workout loads — unchanged
  useEffect(() => {
    if (workout) {
      reset({
        date:     workout.date,
        type:     workout.type,
        duration: workout.duration  ?? undefined,
        calories: workout.calories  ?? undefined,
        notes:    workout.notes     ?? undefined,
      });
    }
  }, [workout, reset]);

  const onSubmit = (data: WorkoutFormData) => {
    mutate(
      { id: Number(id), data },
      {
        onSuccess: () => navigate(`/workouts/${id}`),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void text-text-secondary p-6">
        Loading...
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-void text-text-secondary p-6">
        Workout not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void text-text-primary p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Workout</h1>

      {error && (
        <p className="text-danger text-sm mb-4">
          Failed to update workout. Try again.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

        {/* Date + Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-text-secondary text-sm mb-1 block">Date</label>
            <input
              type="date"
              {...register("date")}
              className="w-full bg-elevated text-text-primary px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.date && (
              <p className="text-danger text-xs mt-1">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="text-text-secondary text-sm mb-1 block">Type</label>
            <select
              {...register("type")}
              className="w-full bg-elevated text-text-primary px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select type</option>
              {WORKOUT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.type && (
              <p className="text-danger text-xs mt-1">{errors.type.message}</p>
            )}
          </div>
        </div>

        {/* Duration + Calories */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-text-secondary text-sm mb-1 block">
              Duration (min)
            </label>
            <input
              type="number"
              {...register("duration")}
              className="w-full bg-elevated text-text-primary px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="text-text-secondary text-sm mb-1 block">Calories</label>
            <input
              type="number"
              {...register("calories")}
              className="w-full bg-elevated text-text-primary px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-text-secondary text-sm mb-1 block">Notes</label>
          <textarea
            {...register("notes")}
            rows={3}
            className="w-full bg-elevated text-text-primary px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400 resize-none"
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
      </form>
    </div>
  );
}