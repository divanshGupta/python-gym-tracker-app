// apps/web/src/pages/CreateWorkout.tsx

import { useNavigate } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  useExercises,
  useCreateWorkout,
} from "@gymtracker/hooks"

import {
  WORKOUT_TYPES,
  type WorkoutInput,
} from "@gymtracker/types"

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
})

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
})

type FormData = z.infer<typeof schema>

/* =========================
   Helpers
========================= */

const parseOptionalNumber = (
  value: string
): number | null | undefined => {
  if (value.trim() === "") return undefined

  const parsed = Number(value)

  return Number.isNaN(parsed) ? undefined : parsed
}

/* =========================
   Component
========================= */

export default function CreateWorkout() {
  const navigate = useNavigate()

  const {
    data: exercises = [],
    isLoading: exercisesLoading,
  } = useExercises()

  const {
    mutate: createWorkout,
    isPending,
    error,
  } = useCreateWorkout()

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),

    defaultValues: {
      date: new Date().toISOString().split("T")[0],

      type: "strength",

      duration: undefined,

      calories: undefined,

      notes: "",

      exercises: [],
    },
  })

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "exercises",
  })

  const watchedExercises = watch("exercises")

  /* =========================
     Submit
  ========================= */

  const onSubmit = (data: FormData) => {
    const payload: WorkoutInput = {
      ...data,

      exercises: data.exercises.filter(
        (exercise) => exercise.exercise_id !== 0
      ),
    }

    createWorkout(payload, {
      onSuccess: () => {
        navigate("/workouts")
      },
    })
  }

  /* =========================
     Render
  ========================= */

  return (
    <div className="min-h-screen bg-void text-text-primary">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">
            Create Workout
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Track your training session and exercises.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
            Failed to create workout. Please try again.
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* Workout Details */}
          <div className="bg-surface border border-border-default rounded-xl p-6 space-y-6">

            <h2 className="text-lg font-semibold tracking-tight text-text-primary">
              Workout Details
            </h2>

            {/* Date + Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Date
                </label>

                <input
                  type="date"
                  {...register("date")}
                  className="w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />

                {errors.date && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Workout Type
                </label>

                <select
                  {...register("type")}
                  className="w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  {WORKOUT_TYPES.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type.charAt(0).toUpperCase() +
                        type.slice(1)}
                    </option>
                  ))}
                </select>

                {errors.type && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.type.message}
                  </p>
                )}
              </div>
            </div>

            {/* Duration + Calories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Duration */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Duration (minutes)
                </label>

                <input
                  type="number"
                  placeholder="60"
                  onChange={(e) =>
                    setValue(
                      "duration",
                      parseOptionalNumber(e.target.value)
                    )
                  }
                  className="w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />

                {errors.duration && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.duration.message}
                  </p>
                )}
              </div>

              {/* Calories */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Calories Burned
                </label>

                <input
                  type="number"
                  placeholder="400"
                  onChange={(e) =>
                    setValue(
                      "calories",
                      parseOptionalNumber(e.target.value)
                    )
                  }
                  className="w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />

                {errors.calories && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.calories.message}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Notes
              </label>

              <textarea
                rows={4}
                {...register("notes")}
                placeholder="How was today's workout?"
                className="w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />

              {errors.notes && (
                <p className="mt-1 text-xs text-danger">
                  {errors.notes.message}
                </p>
              )}
            </div>
          </div>

          {/* Exercises */}
          <div className="bg-surface border border-border-default rounded-xl p-5">

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold">
                  Exercises
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  Add exercises performed during this workout.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  append({
                    exercise_id: 0,
                    sets: undefined,
                    reps: undefined,
                    weight: undefined,
                  })
                }
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              >
                Add Exercise
              </button>
            </div>

            {errors.exercises?.message && (
              <p className="mb-4 text-sm text-danger">
                {errors.exercises.message}
              </p>
            )}

            <div className="space-y-4">

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-border-default bg-elevated/40 p-5"
                >

                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">

                    <h3 className="text-sm font-medium text-text-secondary">
                      Exercise #{index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-sm text-danger transition-colors hover:opacity-80"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Exercise Select */}
                  <div className="mb-4">

                    <label className="block text-sm text-gray-400 mb-1">
                      Exercise
                    </label>

                    <select
                      value={
                        watchedExercises?.[index]
                          ?.exercise_id ?? 0
                      }
                      onChange={(e) =>
                        setValue(
                          `exercises.${index}.exercise_id`,
                          Number(e.target.value)
                        )
                      }
                      disabled={exercisesLoading}
                      className="w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    >
                      <option value={0}>
                        Select exercise
                      </option>

                      {exercises.map((exercise) => (
                        <option
                          key={exercise.id}
                          value={exercise.id}
                        >
                          {exercise.name} (
                          {exercise.category})
                        </option>
                      ))}
                    </select>

                    {errors.exercises?.[index]
                      ?.exercise_id && (
                      <p className="mt-1 text-xs text-danger">
                        {
                          errors.exercises[index]
                            ?.exercise_id?.message
                        }
                      </p>
                    )}
                  </div>

                  {/* Sets/Reps/Weight */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                    {/* Sets */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Sets
                      </label>

                      <input
                        type="number"
                        placeholder="4"
                        onChange={(e) =>
                          setValue(
                            `exercises.${index}.sets`,
                            parseOptionalNumber(
                              e.target.value
                            )
                          )
                        }
                        className="w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                      />
                    </div>

                    {/* Reps */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Reps
                      </label>

                      <input
                        type="number"
                        placeholder="12"
                        onChange={(e) =>
                          setValue(
                            `exercises.${index}.reps`,
                            parseOptionalNumber(
                              e.target.value
                            )
                          )
                        }
                        className="w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Weight (kg)
                      </label>

                      <input
                        type="number"
                        placeholder="80"
                        onChange={(e) =>
                          setValue(
                            `exercises.${index}.weight`,
                            parseOptionalNumber(
                              e.target.value
                            )
                          )
                        }
                        className="w-full rounded-lg bg-elevated border border-border-default px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">

            <button
              type="button"
              onClick={() => navigate("/workouts")}
              className="flex-1 rounded-xl border border-border-default bg-surface py-3 font-medium text-text-primary transition-all duration-200 hover:bg-elevated">
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-accent py-3 font-semibold text-text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
            >
              {isPending
                ? "Saving Workout..."
                : "Save Workout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}