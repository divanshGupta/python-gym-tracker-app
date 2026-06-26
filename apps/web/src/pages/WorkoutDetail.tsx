import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useWorkout, useDeleteWorkout } from "@gymtracker/hooks";

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: workout, isLoading } = useWorkout(Number(id));
  const { mutate: deleteWorkout, isPending, error } = useDeleteWorkout();

  if (isLoading)
    return <div className="min-h-screen bg-void px-6 py-8 text-text-secondary">Loading...</div>;
  if (!workout)
    return <div className="min-h-screen bg-void px-6 py-8 text-text-secondary">Workout not found.</div>;

  const handleDelete = () => {
    deleteWorkout(workout.id, {
      onSuccess: () => navigate("/workouts"),
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-void text-text-primary">

      {/* ── Error banner ── */}
      {error && (
        <p className="mb-6 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          Failed to delete workout. Please try again.
        </p>
      )}

      {/* ── Header ── */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight capitalize text-text-primary">
            {workout.type} Workout
          </h1>
          <p className="mt-1 text-sm text-text-secondary">{workout.date}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={`/workouts/${workout.id}/edit`}
            className="rounded-lg border border-border-default bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-elevated"
          >
            Edit
          </Link>

          {/* ── Delete with inline confirm ── */}
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Sure?</span>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-border-default bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-elevated"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="mb-4 sm:mb-6 grid grid-cols-3 gap-2 sm:gap-4 sm:grid-cols-3">
        {[
          { label: "Duration",  value: workout.duration  ? `${workout.duration} min`   : "—" },
          { label: "Calories",  value: workout.calories  ? `${workout.calories} kcal`  : "—" },
          { label: "Exercises", value: workout.workout_exercises.length},
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border-default bg-surface p-3 sm:p-5 text-center"
          >
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-tertiary">
              {s.label}
            </p>
            <p className="text-lg font-semibold text-text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Notes ── */}
      {workout.notes && (
        <div className="mb-4 sm:mb-6 rounded-xl border border-border-default bg-surface p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
            Notes
          </p>
          <p className="text-sm leading-relaxed text-text-primary">{workout.notes}</p>
        </div>
      )}

      {/* ── Exercises ── */}
      {/* FIX: removed the outer <Link> that was wrapping this entire section */}
      <div className="rounded-xl border border-border-default bg-surface p-5">
        <p className="mb-4 sm:mb-6 text-sm font-medium text-text-secondary">Exercises</p>
        {workout.workout_exercises.length === 0 ? (
          <p className="text-sm text-text-tertiary">No exercises logged.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {workout.workout_exercises.map((we) => (
              <Link
                key={we.id}
                to={`/progress?exercise=${we.exercise.id}`}
                className="group block rounded-xl border border-border-default bg-elevated/40 px-5 py-4 transition-all duration-200 hover:border-accent/30 hover:bg-elevated"
              >
                <p className="mb-3 flex items-center justify-between font-medium text-text-primary">
                  <span>
                    {we.exercise.name}
                    <span className="ml-2 text-xs text-text-tertiary capitalize">
                      ({we.exercise.category})
                    </span>
                  </span>
                  <span className="text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                    View progress →
                  </span>
                </p>

                <div className="flex flex-wrap gap-6 text-sm">
                  {we.sets && (
                    <div>
                      <p className="text-xs text-text-tertiary">Sets</p>
                      <p className="font-semibold text-text-primary">{we.sets}</p>
                    </div>
                  )}
                  {we.reps && (
                    <div>
                      <p className="text-xs text-text-tertiary">Reps</p>
                      <p className="font-semibold text-text-primary">{we.reps}</p>
                    </div>
                  )}
                  {we.weight && (
                    <div>
                      <p className="text-xs text-text-tertiary">Weight</p>
                      <p className="font-semibold text-text-primary">{we.weight} kg</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/workouts")}
        className="mt-4 sm:mt-6 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        ← Back to Workouts
      </button>
    </div>
  );
}