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
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exercises</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm font-semibold"
        >
          {showForm ? "Cancel" : "+ Add Exercise"}
        </button>
      </div>

      {/* Add Exercise Form */}
      {showForm && (
        <div className="bg-gray-900 rounded-xl p-5 mb-6">
          <h2 className="text-white font-semibold mb-4">New Exercise</h2>
          {error && (
            <p className="text-red-400 text-sm mb-3">
              {(error as any)?.response?.data?.detail ?? "Failed to create exercise"}
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

            {/* Name */}
            <div>
              <input
                {...register("name")}
                placeholder="Exercise name (e.g. Running, Squat)"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <select
                {...register("category")}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Muscle group — only for strength */}
            {showMuscleGroup && (
              <div>
                <select
                  {...register("muscle_group")}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
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
                className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
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
              className="bg-green-500 hover:bg-green-600 py-2 rounded font-semibold text-sm disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add Exercise"}
            </button>
          </form>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400 text-sm"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded text-sm outline-none"
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
        <p className="text-gray-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">No exercises found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="bg-gray-900 rounded-xl px-4 py-3 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-medium capitalize">{e.name}</p>
                {e.muscle_group && e.muscle_group !== "none" && (
                  <p className="text-gray-500 text-xs capitalize mt-0.5">
                    {e.muscle_group.replace("_", " ")}
                  </p>
                )}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                  CATEGORY_COLORS[e.category] ?? "bg-gray-700 text-gray-300"
                }`}
              >
                {e.category}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="text-gray-600 text-xs mt-6">{filtered.length} exercises</p>
    </div>
  );
}