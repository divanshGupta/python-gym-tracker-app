// apps/web/src/pages/EditExercise.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

import { useExercise, useUpdateExercise } from "@gymtracker/hooks";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  muscle_group: z.string().optional(),
  equipment: z.string().optional(),
  description: z.string().optional(),
});

type ExerciseFormData = z.infer<typeof schema>;

export default function EditExercise() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: exercise, isLoading } = useExercise(Number(id));
  const { mutate, isPending, error } = useUpdateExercise();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (exercise) {
      reset({
        name: exercise.name,
        category: exercise.category,
        muscle_group: exercise.muscle_group ?? undefined,
        equipment: exercise.equipment ?? undefined,
        description: exercise.description ?? undefined,
      });
    }
  }, [exercise, reset]);

  const onSubmit = (data: ExerciseFormData) => {
    mutate(
      { id: Number(id), data },
      { onSuccess: () => navigate(`/exercises/${id}`) }
    );
  };

  if (isLoading)
    return <div className="min-h-screen bg-void px-6 py-8 text-text-secondary">Loading...</div>;
  if (!exercise)
    return <div className="min-h-screen bg-void px-6 py-8 text-text-secondary">Exercise not found.</div>;

  return (
    <div className="min-h-screen max-w-3xl mx-auto bg-void px-6 py-8 text-text-primary">
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* ── Error banner ── */}
        {error && (
          <p className="mb-6 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
            Failed to update exercise. Please try again.
          </p>
        )}

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            {/* Same visual size/weight as the <h1> on the Detail page, but it's an input now */}
            <input
              {...register("name")}
              type="text"
              className="w-full bg-transparent text-2xl font-semibold tracking-tight capitalize text-gray-400 border-b border-border-default focus:outline-none focus:border-primary pb-1"
            />
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-light disabled:opacity-50"
            >
              {isPending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/exercises/${id}`)}
              className="rounded-lg border border-border-default bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-elevated"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Category */}
          <div className="rounded-xl border border-border-default bg-surface p-5">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-tertiary">
              Category
            </p>
            <input
              {...register("category")}
              type="text"
              className="w-full bg-transparent text-lg font-semibold text-gray-400
             border-b border-dashed border-border-default
             focus:outline-none focus:border-solid focus:border-primary
             transition-colors duration-200"
            />
            {errors.category && <p className="text-danger text-xs mt-1">{errors.category.message}</p>}
          </div>

          {/* Muscle Group */}
          <div className="rounded-xl border border-border-default bg-surface p-5">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-tertiary">
              Muscle Group
            </p>
            <input
              {...register("muscle_group")}
              type="text"
              placeholder="—"
              className="w-full bg-transparent text-lg font-semibold text-gray-400
             border-b border-dashed border-border-default
             focus:outline-none focus:border-solid focus:border-primary
             transition-colors duration-200"
            />
          </div>

          {/* Equipment */}
          <div className="rounded-xl border border-border-default bg-surface p-5">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-tertiary">
              Equipment
            </p>
            <input
              {...register("equipment")}
              type="text"
              placeholder="—"
              className="w-full bg-transparent text-lg font-semibold text-gray-400
             border-b border-dashed border-border-default
             focus:outline-none focus:border-solid focus:border-primary
             transition-colors duration-200"
            />
          </div>
        </div>

        {/* ── Notes ── */}
        <div className="mb-8 rounded-xl border border-border-default bg-surface p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
            Notes
          </p>
          <textarea
            {...register("description")}
            rows={1}
            className="w-full bg-transparent text-sm font-sm text-gray-400
             border-b border-dashed border-border-default
             focus:outline-none focus:border-solid focus:border-primary
             transition-colors duration-200"
          />
        </div>

        <button
          type="button"
          onClick={() => navigate(`/exercises/${id}`)}
          className="mt-8 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          ← Back to exercise
        </button>

      </form>
    </div>
  );
}