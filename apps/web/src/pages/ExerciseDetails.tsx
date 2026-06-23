import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDeleteExercise, useExercise } from "@gymtracker/hooks";

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: exercise, isLoading } = useExercise(Number(id));
  const { mutate: deleteExercise, isPending, error } = useDeleteExercise();

  if (isLoading)
    return <div className="min-h-screen bg-void px-6 py-8 text-text-secondary">Loading...</div>;
  if (!exercise)
    return <div className="min-h-screen bg-void px-6 py-8 text-text-secondary">Exercise not found.</div>;

  const handleDelete = () => {
      if (!exercise?.id) return;

      deleteExercise(exercise.id, {
        onSuccess: () => navigate("/exercises"),
      });
  };

  return (
    <div className="min-h-screen max-w-3xl mx-auto bg-void px-6 py-8 text-text-primary">

      {/* ── Error banner ── */}
      {error && (
        <p className="mb-6 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          Failed to delete Exercise. Please try again.
        </p>
      )}

      {/* ── Header ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight capitalize text-text-primary">
            {exercise.name}
          </h1>
          {/* <p className="mt-1 text-sm text-text-secondary">{exercise.is_custom? "System": "System"}</p> */}
        </div>

        {/* rendering edit and delete button only when the exercise is custom */}
        {exercise.is_custom && (

          <div className="flex items-center gap-3">
              <Link
                to={`/exercises/${exercise.id}/edit`}
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
        )}
      </div>

      {/* ── Stats ── */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Category",  value: exercise.category  ? `${exercise.category}`   : "—" },
          { label: "Muscle Group",  value: exercise.muscle_group  ? `${exercise.muscle_group}`  : "—" },
          { label: "Equipment", value: exercise.equipment ? `${exercise.equipment}` : "—" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border-default bg-surface p-5"
          >
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-tertiary">
              {s.label}
            </p>
            <p className="text-lg font-semibold text-text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Notes ── */}
      {exercise.description && (
        <div className="mb-8 rounded-xl border border-border-default bg-surface p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
            Notes
          </p>
          <p className="text-sm leading-relaxed text-text-primary">{exercise.description}</p>
        </div>
      )}

      <button
        onClick={() => navigate("/exercises")}
        className="mt-8 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        ← Back to exercises
      </button>
    </div>
  );
}