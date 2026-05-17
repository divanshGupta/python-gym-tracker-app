// apps/web/src/pages/Exercises.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useExercises, useCreateExercise } from "@gymtracker/hooks";

const schema = z.object({
  name:         z.string().min(2, "Min 2 characters"),
  category:     z.string().min(1, "Select a category"),
  muscle_group: z.string().optional(),
  equipment:    z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const CATEGORIES    = ["strength", "cardio", "flexibility", "core"];
const MUSCLE_GROUPS = ["chest", "back", "shoulders", "arms", "legs", "core", "full_body"];
const EQUIPMENT     = ["barbell", "dumbbell", "bodyweight", "machine", "cable", "kettlebell", "none"];

const CATEGORY_COLORS: Record<string, string> = {
  strength:    "bg-green-500/20 text-green-400",
  cardio:      "bg-blue-500/20 text-blue-400",
  flexibility: "bg-yellow-500/20 text-yellow-400",
  core:        "bg-purple-500/20 text-purple-400",
};

export default function Exercises() {
  const [search,         setSearch]         = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showForm,       setShowForm]       = useState(false);

  const { data: exercises = [], isLoading } = useExercises();
  const { mutate, isPending, error, reset: resetMutation } = useCreateExercise();

  const {
    register, handleSubmit, reset, watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Show muscle group only for strength exercises
  const selectedCategory = watch("category");
  const showMuscleGroup  = selectedCategory === "strength";

  const onSubmit = (data: FormData) => {
    mutate(
      {
        name:         data.name.trim().toLowerCase(),
        category:     data.category,
        muscle_group: showMuscleGroup ? (data.muscle_group || null) : null,
        equipment:    data.equipment || null,
      },
      {
        onSuccess: () => {
          reset();
          resetMutation();
          setShowForm(false);
        },
      }
    );
  };

  const filtered = exercises.filter((e) => {
    const matchSearch   = e.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory
      ? e.category.toLowerCase() === filterCategory.toLowerCase()
      : true;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-void px-6 py-8 text-text-primary">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Exercises</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        >
          {showForm ? "Cancel" : "+ Add Exercise"}
        </button>
      </div>

      {/* Add Exercise Form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-border-default bg-surface p-6">
          <h2 className="mb-5 text-lg font-semibold tracking-tight text-text-primary">New Exercise</h2>
          {error && (
            <p className="mb-4 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
              {(error as any)?.response?.data?.detail ?? "Failed to create exercise"}
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

            {/* Name */}
            <div>
              <input
                {...register("name")}
                placeholder="Exercise name (e.g. Running, Squat)"
                className="w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <select
                {...register("category")}
                className="w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-danger">{errors.category.message}</p>
              )}
            </div>

            {/* Muscle group — only for strength */}
            {showMuscleGroup && (
              <div>
                <select
                  {...register("muscle_group")}
                  className="w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  <option value="">Muscle group (optional)</option>
                  {MUSCLE_GROUPS.map((m) => (
                    <option key={m} value={m}>
                      {m.replace("_", " ").charAt(0).toUpperCase() + m.replace("_", " ").slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Equipment */}
            <div>
              <select
                {...register("equipment")}
                className="w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                <option value="">Equipment (optional)</option>
                {EQUIPMENT.map((eq) => (
                  <option key={eq} value={eq}>
                    {eq.charAt(0).toUpperCase() + eq.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-accent py-2.5 text-sm font-semibold text-text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add Exercise"}
            </button>
          </form>
        </div>
      )}

      {/* Search + Filter */}
      <div className="mb-8 flex flex-col gap-3 rounded-xl border border-border-default bg-surface p-4 sm:flex-row">
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Exercise Grid */}
      {isLoading ? (
        <p className="text-text-secondary">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-border-default bg-surface py-16 text-center text-text-secondary">No exercises found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-6">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="group rounded-xl border border-border-default bg-surface p-5 transition-all duration-200 hover:border-accent/30 hover:bg-elevated/40"
            >
              <div className="space-y-1">
                <p className="text-base font-semibold capitalize text-text-primary">{e.name}</p>
                {e.muscle_group && e.muscle_group !== "none" && (
                  <p className="text-xs capitalize text-text-tertiary">
                    {e.muscle_group.replace("_", " ")}
                  </p>
                )}
              </div>
              <span
                className={`mt-4 inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                  CATEGORY_COLORS[e.category] ?? "bg-gray-700 text-gray-300"
                }`}
              >
                {e.category}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 text-xs text-text-tertiary">{filtered.length} exercises</p>
    </div>
  );
}