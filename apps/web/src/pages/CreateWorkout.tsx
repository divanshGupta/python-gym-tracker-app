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
  type WorkoutType,
} from "@gymtracker/types"

/* =========================
   Validation Schema
========================= */

const exerciseSchema = z.object({
  exercise_id: z
    .number({
      required_error: "Exercise is required",
    })
    .min(1, "Exercise is required"),

  sets: z.number().positive().optional().nullable(),

  reps: z.number().positive().optional().nullable(),

  weight: z.number().positive().optional().nullable(),
})

const schema = z.object({
  date: z.string().min(1, "Date is required"),

  type: z.enum(WORKOUT_TYPES, {
    errorMap: () => ({
      message: "Workout type is required",
    }),
  }),

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
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto p-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Create Workout
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Track your training session and exercises.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Failed to create workout. Please try again.
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* Workout Details */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-5">

            <h2 className="text-lg font-semibold">
              Workout Details
            </h2>

            {/* Date + Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Date */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Date
                </label>

                <input
                  type="date"
                  {...register("date")}
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
                />

                {errors.date && (
                  <p className="mt-1 text-xs text-red-400">
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
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
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
                  <p className="mt-1 text-xs text-red-400">
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
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
                />

                {errors.duration && (
                  <p className="mt-1 text-xs text-red-400">
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
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
                />

                {errors.calories && (
                  <p className="mt-1 text-xs text-red-400">
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
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-green-500"
              />

              {errors.notes && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.notes.message}
                </p>
              )}
            </div>
          </div>

          {/* Exercises */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold">
                  Exercises
                </h2>

                <p className="text-sm text-gray-400 mt-1">
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
                className="rounded-lg bg-green-500 hover:bg-green-600 px-4 py-2 text-sm font-medium transition-colors"
              >
                Add Exercise
              </button>
            </div>

            {errors.exercises?.message && (
              <p className="mb-4 text-sm text-red-400">
                {errors.exercises.message}
              </p>
            )}

            <div className="space-y-4">

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-gray-800 bg-gray-950 p-4"
                >

                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">

                    <h3 className="text-sm font-medium text-gray-300">
                      Exercise #{index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-sm text-red-400 hover:text-red-300"
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
                      className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
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
                      <p className="mt-1 text-xs text-red-400">
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
                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
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
              className="flex-1 rounded-xl border border-gray-700 bg-gray-900 py-3 font-medium hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-green-500 py-3 font-semibold text-black hover:bg-green-400 disabled:opacity-50 transition-colors"
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