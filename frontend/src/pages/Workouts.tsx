// pages/Workout.tsx
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { getWorkouts, deleteWorkout } from "../api/workouts"
import type { WorkoutFilters } from "../api/workouts"
import type { Workout } from "../types"

const WORKOUT_TYPES = ["Strength", "Cardio", "Flexibility", "Core"]

export default function Workouts() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<WorkoutFilters>({ page: 1, limit: 10 })

  const { data, isLoading } = useQuery({
    queryKey: ["workouts", filters],
    queryFn: () => getWorkouts(filters),
  })

  const { mutate: remove } = useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workouts"] }),
  })

  const workouts: Workout[] = data?.data || []

  const handleDelete = (id: number) => {
    if (confirm("Delete this workout?")) remove(id)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <Link
          to="/workouts/create"
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm font-semibold"
        >
          + New Workout
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          className="bg-gray-800 text-white px-3 py-2 rounded text-sm outline-none"
          value={filters.type || ""}
          onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined, page: 1 })}
        >
          <option value="">All Types</option>
          {WORKOUT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <input
          type="date"
          className="bg-gray-800 text-white px-3 py-2 rounded text-sm outline-none"
          value={filters.date_from || ""}
          onChange={(e) => setFilters({ ...filters, date_from: e.target.value || undefined, page: 1 })}
        />

        <input
          type="date"
          className="bg-gray-800 text-white px-3 py-2 rounded text-sm outline-none"
          value={filters.date_to || ""}
          onChange={(e) => setFilters({ ...filters, date_to: e.target.value || undefined, page: 1 })}
        />

        <button
          onClick={() => setFilters({ page: 1, limit: 10 })}
          className="text-gray-400 text-sm hover:text-white"
        >
          Clear
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : workouts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No workouts found</p>
          <Link
            to="/workouts/create"
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm"
          >
            Log your first workout
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {workouts.map((w) => (
            <div
              key={w.id}
              className="bg-gray-900 rounded-xl px-5 py-4 flex justify-between items-center"
            >
              <Link to={`/workouts/${w.id}`} className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-white font-semibold">{w.type}</span>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                    {w.workout_exercises.length} exercises
                  </span>
                </div>
                <div className="flex gap-4 text-gray-400 text-sm">
                  <span>{w.date}</span>
                  {w.duration && <span>{w.duration} min</span>}
                  {w.calories && <span>{w.calories} kcal</span>}
                </div>
                {w.notes && <p className="text-gray-500 text-xs mt-1 truncate">{w.notes}</p>}
              </Link>

              <div className="flex gap-2 ml-4">
                <Link
                  to={`/workouts/${w.id}`}
                  className="text-sm text-green-400 hover:underline"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="text-sm text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {workouts.length > 0 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
            className="px-4 py-2 bg-gray-800 rounded disabled:opacity-40 hover:bg-gray-700 text-sm"
          >
            Previous
          </button>
          <span className="text-gray-400 text-sm py-2">Page {filters.page}</span>
          <button
            disabled={workouts.length < (filters.limit || 10)}
            onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
            className="px-4 py-2 bg-gray-800 rounded disabled:opacity-40 hover:bg-gray-700 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}