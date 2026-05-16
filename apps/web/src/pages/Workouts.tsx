// apps/web/src/pages/Workouts.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

// ── Shared packages ────────────────────────────────────────────────────────
import { useWorkouts, useDeleteWorkout } from "@gymtracker/hooks";
import type { WorkoutFilters, Workout, WorkoutType } from "@gymtracker/types";

// ── Constants ─────────────────────────────────────────────────────────────
const WORKOUT_TYPES = ["strength", "cardio", "flexibility", "core"];

export default function Workouts() {
  const [filters, setFilters] = useState<WorkoutFilters>({ page: 1, limit: 10 });

  // ── Data fetching ──────────────────────────────────────────────────────
  // useWorkouts handles queryKey, queryFn, and staleTime internally
  // No need for useQueryClient or manual queryKey strings here
  const { data: workouts = [], isLoading } = useWorkouts(filters);

  // ── Mutations ──────────────────────────────────────────────────────────
  // useDeleteWorkout handles cache invalidation on success internally
  // No need for useQueryClient here either
  const { mutate: remove } = useDeleteWorkout();

  const handleDelete = (id: number) => {
    if (confirm("Delete this workout?")) remove(id);
  };

  return (
    <div className="min-h-screen bg-void px-6 py-8 text-text-primary">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Workouts</h1>
        <Link
          to="/workouts/create"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        >
          + New Workout
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-border-default bg-surface p-4">
        <select
          className="rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
          value={filters.type || ""}
          onChange={(e) =>
            setFilters({ ...filters, type: (e.target.value) as WorkoutType || undefined, page: 1 })
          }
        >
          <option value="">All Types</option>
          {WORKOUT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <input
          type="date"
          className="rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
          value={filters.date_from || ""}
          onChange={(e) =>
            setFilters({ ...filters, date_from: e.target.value || undefined, page: 1 })
          }
        />

        <input
          type="date"
          className="rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
          value={filters.date_to || ""}
          onChange={(e) =>
            setFilters({ ...filters, date_to: e.target.value || undefined, page: 1 })
          }
        />

        <button
          onClick={() => setFilters({ page: 1, limit: 10 })}
          className="text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          Clear
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <p className="text-text-secondary">Loading...</p>
      ) : workouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border-default bg-surface py-20">
          <p className="mb-5 text-sm text-text-secondary">No workouts found</p>
          <Link
            to="/workouts/create"
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:opacity-90"
          >
            Log your first workout
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {workouts.map((w: Workout) => (
            <div
              key={w.id}
              className="flex items-center justify-between rounded-xl border border-border-default bg-surface px-5 py-4 transition-all duration-200 hover:border-accent/30 hover:bg-elevated/40"
            >
              <Link to={`/workouts/${w.id}`} className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold capitalize text-text-primary">{w.type}</span>
                  <span className="rounded-full bg-accent-subtle px-2.5 py-1 text-xs font-medium text-accent">
                    {w.workout_exercises.length} exercises
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                  <span>{w.date}</span>
                  {w.duration  && <span>{w.duration} min</span>}
                  {w.calories  && <span>{w.calories} kcal</span>}
                </div>
                {w.notes && (
                  <p className="mt-2 truncate text-xs text-text-tertiary">{w.notes}</p>
                )}
              </Link>

              <div className="ml-6 flex items-center gap-3">
                <Link
                  to={`/workouts/${w.id}`}
                  className="text-sm font-medium text-accent transition-colors hover:opacity-80"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="text-sm font-medium text-danger transition-colors hover:opacity-80"
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
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
            className="rounded-lg border border-border-default bg-surface px-4 py-2 text-sm text-text-primary transition-all duration-200 hover:bg-elevated disabled:opacity-40"
          >
            Previous
          </button>
          <span className="py-2 text-sm text-text-secondary">Page {filters.page}</span>
          <button
            disabled={workouts.length < (filters.limit || 10)}
            onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
            className="rounded-lg border border-border-default bg-surface px-4 py-2 text-sm text-text-primary transition-all duration-200 hover:bg-elevated disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}