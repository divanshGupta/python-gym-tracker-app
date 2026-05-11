// apps/web/src/pages/EditWorkout.tsx
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import { getWorkout, updateWorkout } from "../api/workouts"
import type { Workout } from "../types"

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  type: z.string().min(1, "Type is required"),
  duration: z.coerce.number().min(1).optional(),
  calories: z.coerce.number().min(1).optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const WORKOUT_TYPES = ["Strength", "Cardio", "Flexibility", "Core"]

export default function EditWorkout() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["workout", id],
    queryFn: () => getWorkout(Number(id)),
    enabled: !!id,
  })

  const workout: Workout | undefined = data?.data

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // Populate form once workout loads
  useEffect(() => {
    if (workout) {
      reset({
        date: workout.date,
        type: workout.type,
        duration: workout.duration ?? undefined,
        calories: workout.calories ?? undefined,
        notes: workout.notes ?? undefined,
      })
    }
  }, [workout, reset])

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: FormData) => updateWorkout(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout", id] })
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
      queryClient.invalidateQueries({ queryKey: ["stats"] })
      navigate(`/workouts/${id}`)
    },
  })

  if (isLoading) return <div className="min-h-screen bg-gray-950 text-gray-400 p-6">Loading...</div>
  if (!workout) return <div className="min-h-screen bg-gray-950 text-gray-400 p-6">Workout not found.</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Workout</h1>

      {error && (
        <p className="text-red-400 text-sm mb-4">Failed to update workout. Try again.</p>
      )}

      <form onSubmit={handleSubmit((d) => mutate(d))} className="flex flex-col gap-5">

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
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Calories</label>
            <input
              type="number"
              {...register("calories")}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Notes</label>
          <textarea
            {...register("notes")}
            rows={3}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400 resize-none"
          />
        </div>

        {/* Note about exercises */}
        <p className="text-gray-500 text-xs">
          * To change exercises, delete this workout and create a new one.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(`/workouts/${id}`)}
            className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded font-semibold text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded font-semibold text-sm disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}