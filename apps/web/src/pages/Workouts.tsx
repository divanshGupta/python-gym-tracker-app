import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, ChevronRight,
  Dumbbell,
  Calendar, ChevronLeft,
} from "lucide-react";

import { useWorkouts, useDeleteWorkout } from "@gymtracker/hooks";
import type { WorkoutFilters, Workout, WorkoutType } from "@gymtracker/types";

import { Button, EmptyState, PageSkeleton } from "../components/ui";
import { WorkoutRow } from "../components/dashboard/WorkoutRow";

// ── Constants ──────────────────────────────────────────────────────────────

const TYPES: { value: WorkoutType | ""; label: string }[] = [
  { value: "",            label: "All"         },
  { value: "strength",   label: "Strength"    },
  { value: "cardio",     label: "Cardio"      },
  { value: "flexibility",label: "Flexibility" },
  { value: "core",       label: "Core"        },
];

// ── Sub-components ─────────────────────────────────────────────────────────

interface FilterBarProps {
  filters:    WorkoutFilters;
  onChange:   (f: WorkoutFilters) => void;
  totalCount: number;
}

function FilterBar({ filters, onChange, totalCount }: FilterBarProps) {
  const hasDateFilter = !!(filters.date_from || filters.date_to);
  const hasFilter     = !!(filters.type || hasDateFilter);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Type tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface border border-border-default rounded-xl overflow-x-auto">
        {TYPES.map(({ value, label }) => (
          <button
            key={label}
            onClick={() => onChange({ ...filters, type: value as WorkoutType || undefined, page: 1 })}
            className={[
              "px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-colors duration-150",
              (filters.type ?? "") === value
                ? "bg-elevated text-text-primary"
                : "text-text-tertiary hover:text-text-secondary",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Date range — joined pill */}
      <div className="flex items-center gap-2 px-3 h-9 bg-surface border border-border-default rounded-xl text-[12px] text-text-tertiary">
        <Calendar size={13} className="shrink-0" />
        <input
          type="date"
          value={filters.date_from || ""}
          onChange={(e) => onChange({ ...filters, date_from: e.target.value || undefined, page: 1 })}
          className="bg-transparent outline-none text-[12px] text-text-secondary w-25 placeholder:text-text-tertiary"
          placeholder="From"
        />
        <span className="text-text-tertiary">—</span>
        <input
          type="date"
          value={filters.date_to || ""}
          onChange={(e) => onChange({ ...filters, date_to: e.target.value || undefined, page: 1 })}
          className="bg-transparent outline-none text-[12px] text-text-secondary w-25"
          placeholder="To"
        />
      </div>

      {/* Clear + count */}
      <div className="flex items-center gap-3 ml-auto">
        {hasFilter && (
          <button
            onClick={() => onChange({ page: 1, limit: 10 })}
            className="text-[12px] text-text-tertiary hover:text-text-primary transition-colors"
          >
            Clear
          </button>
        )}
        <span className="text-[12px] text-text-tertiary tabular-nums">
          {totalCount} workout{totalCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default function Workouts() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<WorkoutFilters>({ page: 1, limit: 10 });

  const { data: workouts = [], isLoading } = useWorkouts(filters);
  const { mutate: remove } = useDeleteWorkout();

  const handleDelete = (id: number) => {
    if (confirm("Delete this workout?")) remove(id);
  };

  const page      = filters.page  ?? 1;
  const limit     = filters.limit ?? 10;
  const canGoNext = workouts.length >= limit;
  const canGoPrev = page > 1;

  if (isLoading) return <PageSkeleton stats={0} rows={6} />;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Workouts</h1>
          {workouts.length > 0 && (
            <p className="text-[13px] text-text-secondary mt-1 sm:mt-2">
              {workouts.length} session{workouts.length !== 1 ? "s" : ""} logged
            </p>
          )}
        </div>
        <Button icon={<Plus size={14} />} onClick={() => navigate("/workouts/create")}>
          New workout
        </Button>
      </div>

      {/* Filter bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        totalCount={workouts.length}
      />

      {/* List */}
      {workouts.length === 0 ? (
        <div className="bg-surface border border-border-default rounded-xl">
          <EmptyState
            icon={<Dumbbell size={22} />}
            title="No workouts found"
            description={
              filters.type || filters.date_from || filters.date_to
                ? "Try adjusting your filters."
                : "Log your first session to start tracking progress."
            }
            action={
              !filters.type && !filters.date_from && !filters.date_to ? (
                <Button size="sm" onClick={() => navigate("/workouts/create")}>
                  Log first workout
                </Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => setFilters({ page: 1, limit: 10 })}>
                  Clear filters
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {workouts.map((w: Workout) => (
            <WorkoutRow key={w.id} workout={w} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {workouts.length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-2">
          <button
            disabled={!canGoPrev}
            onClick={() => setFilters({ ...filters, page: page - 1 })}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-surface border border-border-default text-[12px] text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors disabled:opacity-35 disabled:pointer-events-none"
          >
            <ChevronLeft size={13} /> Previous
          </button>

          <span className="text-[12px] text-text-tertiary tabular-nums">
            Page {page}
          </span>

          <button
            disabled={!canGoNext}
            onClick={() => setFilters({ ...filters, page: page + 1 })}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-surface border border-border-default text-[12px] text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors disabled:opacity-35 disabled:pointer-events-none"
          >
            Next <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}