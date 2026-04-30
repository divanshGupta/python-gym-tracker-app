import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createWorkout } from "../api/workouts"
import { getExercises } from "../api/exercises"
import type { Exercise } from "../types"
import type { WorkoutExerciseInput } from "../api/workouts"

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  type: z.string().min(1, "Type is required"),
  duration: z.coerce.number().min(1).optional(),
  calories: z.coerce.number().min(1).optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const WORKOUT_TYPES = ["Strength", "Cardio", "Flexibility", "Core"]

export default function CreateWorkout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExerciseInput[]>([])

  const { data: exercisesRes } = useQuery({
    queryKey: ["exercises"],
    queryFn: getExercises,
  })

  const exercises: Exercise[] = exercisesRes?.data || []

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { date: new Date().toISOString().split("T")[0] }
  })

  const { mutate, isPending, error } = useMutation({
    mutationFn: createWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
      queryClient.invalidateQueries({ queryKey: ["stats"] })
      navigate("/workouts")
    }
  })

  const addExercise = () => {
    setSelectedExercises([...selectedExercises, { exercise_id: 0, sets: undefined, reps: undefined, weight: undefined }])
  }

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: keyof WorkoutExerciseInput, value: number) => {
    const updated = [...selectedExercises]
    updated[index] = { ...updated[index], [field]: value }
    setSelectedExercises(updated)
  }

  const onSubmit = (data: FormData) => {
    mutate({
      ...data,
      exercises: selectedExercises.filter((e) => e.exercise_id !== 0),
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Log Workout</h1>

      {error && (
        <p className="text-red-400 text-sm mb-4">Failed to create workout. Try again.</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

        {/* Date + Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Date</label>
            <input
              type="date"
              {...register("date")}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>}
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Type</label>
            <select
              {...register("type")}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select type</option>
              {WORKOUT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.type && <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>}
          </div>
        </div>

        {/* Duration + Calories */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Duration (min)</label>
            <input
              type="number"
              {...register("duration")}
              placeholder="e.g. 60"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Calories</label>
            <input
              type="number"
              {...register("calories")}
              placeholder="e.g. 400"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Notes</label>
          <textarea
            {...register("notes")}
            placeholder="How did it go?"
            rows={2}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400 resize-none"
          />
        </div>

        {/* Exercises */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-gray-400 text-sm">Exercises</label>
            <button
              type="button"
              onClick={addExercise}
              className="text-green-400 text-sm hover:underline"
            >
              + Add Exercise
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {selectedExercises.map((ex, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <select
                    className="bg-gray-700 text-white px-3 py-1.5 rounded text-sm outline-none flex-1 mr-3"
                    value={ex.exercise_id}
                    onChange={(e) => updateExercise(index, "exercise_id", Number(e.target.value))}
                  >
                    <option value={0}>Select exercise</option>
                    {exercises.map((e) => (
                      <option key={e.id} value={e.id}>{e.name} ({e.category})</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="text-red-400 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(["sets", "reps", "weight"] as const).map((field) => (
                    <div key={field}>
                      <label className="text-gray-400 text-xs mb-1 block capitalize">
                        {field}{field === "weight" ? " (kg)" : ""}
                      </label>
                      <input
                        type="number"
                        placeholder={field === "weight" ? "0.0" : "0"}
                        className="w-full bg-gray-700 text-white px-3 py-1.5 rounded text-sm outline-none"
                        onChange={(e) => updateExercise(index, field, Number(e.target.value))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => navigate("/workouts")}
            className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded font-semibold text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded font-semibold text-sm disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Workout"}
          </button>
        </div>
      </form>
    </div>
  )
}