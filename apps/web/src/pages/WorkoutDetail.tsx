// apps/web/src/pages/WorkoutDetail.tsx
import { useParams, useNavigate, Link } from "react-router-dom"
import { useWorkout, useDeleteWorkout } from "@gymtracker/hooks"

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: workout, isLoading } = useWorkout(Number(id));
  const { mutate: deleteWorkout, isPending, error } = useDeleteWorkout();

  if (isLoading) return <div className="min-h-screen bg-gray-950 text-gray-400 p-6">Loading...</div>
  if (!workout) return <div className="min-h-screen bg-gray-950 text-gray-400 p-6">Workout not found.</div>

  const handleDelete = () => {
    const confirmed = confirm("Delete this workout?");

    if (!confirmed) return

    deleteWorkout(workout.id, {
      onSuccess: () => {
        navigate("/workouts")
      },
    })
  }
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-2xl mx-auto">

      {error && (
        <p className="text-red-400 text-sm mb-4">
          Failed to update workout. Try again.
        </p>
      )}
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
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete"}
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
      <Link
        to="/progress" 
        className="bg-gray-900 rounded-xl p-5"
      >
        <p className="text-gray-400 text-sm mb-4">Exercises</p>
        {workout.workout_exercises.length === 0 ? (
          <p className="text-gray-500 text-sm">No exercises logged.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {workout.workout_exercises.map((we) => (
              <Link
                key={we.id}
                to={`/progress?exercise=${we.exercise.id}`}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-3 block transition-colors group"
              >
                <p className="text-white font-medium mb-2 flex items-center justify-between">
                  <span>
                    {we.exercise.name}
                    <span className="text-xs text-gray-400 ml-2">({we.exercise.category})</span>
                  </span>
                  <span className="text-xs text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    View progress →
                  </span>
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
              </Link>
            ))}
          </div>
        )}
      </Link>

      <button
        onClick={() => navigate("/workouts")}
        className="mt-6 text-gray-400 text-sm hover:text-white"
      >
        ← Back to Workouts
      </button>
    </div>
  )
}