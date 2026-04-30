import { useParams, useNavigate, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getWorkout, deleteWorkout } from "../api/workouts"
import type { Workout } from "../types"

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["workout", id],
    queryFn: () => getWorkout(Number(id)),
    enabled: !!id,
  })

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] })
      queryClient.invalidateQueries({ queryKey: ["stats"] })
      navigate("/workouts")
    },
  })

  const workout: Workout | undefined = data?.data

  if (isLoading) return <div className="min-h-screen bg-gray-950 text-gray-400 p-6">Loading...</div>
  if (!workout) return <div className="min-h-screen bg-gray-950 text-gray-400 p-6">Workout not found.</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{workout.type} Workout</h1>
          <p className="text-gray-400 text-sm mt-1">{workout.date}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/workouts/${workout.id}/edit`}
            className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded text-sm"
          >
            Edit
          </Link>
          <button
            onClick={() => confirm("Delete this workout?") && remove(workout.id)}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Duration", value: workout.duration ? `${workout.duration} min` : "--" },
          { label: "Calories", value: workout.calories ? `${workout.calories} kcal` : "--" },
          { label: "Exercises", value: workout.workout_exercises.length },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">{s.label}</p>
            <p className="text-white font-bold text-lg">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Notes */}
      {workout.notes && (
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <p className="text-gray-400 text-xs mb-1">Notes</p>
          <p className="text-white text-sm">{workout.notes}</p>
        </div>
      )}

      {/* Exercises */}
      <div className="bg-gray-900 rounded-xl p-5">
        <p className="text-gray-400 text-sm mb-4">Exercises</p>
        {workout.workout_exercises.length === 0 ? (
          <p className="text-gray-500 text-sm">No exercises logged.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {workout.workout_exercises.map((we) => (
              <div key={we.id} className="bg-gray-800 rounded-lg px-4 py-3">
                <p className="text-white font-medium mb-2">{we.exercise.name}
                  <span className="text-xs text-gray-400 ml-2">({we.exercise.category})</span>
                </p>
                <div className="flex gap-6 text-sm">
                  {we.sets && (
                    <div>
                      <p className="text-gray-400 text-xs">Sets</p>
                      <p className="text-white font-semibold">{we.sets}</p>
                    </div>
                  )}
                  {we.reps && (
                    <div>
                      <p className="text-gray-400 text-xs">Reps</p>
                      <p className="text-white font-semibold">{we.reps}</p>
                    </div>
                  )}
                  {we.weight && (
                    <div>
                      <p className="text-gray-400 text-xs">Weight</p>
                      <p className="text-white font-semibold">{we.weight} kg</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/workouts")}
        className="mt-6 text-gray-400 text-sm hover:text-white"
      >
        ← Back to Workouts
      </button>
    </div>
  )
}