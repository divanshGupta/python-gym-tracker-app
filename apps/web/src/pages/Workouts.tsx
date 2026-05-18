import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus, ChevronRight, Trash2,
  Dumbbell, Wind, Zap, Activity,
  Calendar, Clock, Flame, ChevronLeft,
} from "lucide-react";

import { useWorkouts, useDeleteWorkout } from "@gymtracker/hooks";
import type { WorkoutFilters, Workout, WorkoutType } from "@gymtracker/types";

import { Button, EmptyState, PageSkeleton } from "../components/ui";

// ── Constants ──────────────────────────────────────────────────────────────

const TYPES: { value: WorkoutType | ""; label: string }[] = [
  { value: "",            label: "All"         },
  { value: "strength",   label: "Strength"    },
  { value: "cardio",     label: "Cardio"      },
  { value: "flexibility",label: "Flexibility" },
  { value: "core",       label: "Core"        },
];

// left accent bar colour per type
const ACCENT_CLASS: Record<string, string> = {
  strength:    "bg-accent",
  cardio:      "bg-success",
  flexibility: "bg-warning",
  core:        "bg-danger",
};

// icon background tint + icon per type
const TYPE_ICON_CLASS: Record<string, string> = {
  strength:    "bg-accent/10 text-accent",
  cardio:      "bg-success/10 text-success",
  flexibility: "bg-warning/10 text-warning",
  core:        "bg-danger/10 text-danger",
};

const TYPE_BADGE_CLASS: Record<string, string> = {
  strength:    "bg-accent/10 text-accent-light",
  cardio:      "bg-success/10 text-success",
  flexibility: "bg-warning/10 text-warning",
  core:        "bg-danger/10 text-danger",
};

function WorkoutIcon({ type }: { type: string }) {
  const cls = "w-4 h-4";
  switch (type.toLowerCase()) {
    case "cardio":      return <Wind className={cls} />;
    case "flexibility": return <Zap  className={cls} />;
    case "core":        return <Activity className={cls} />;
    default:            return <Dumbbell className={cls} />;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function relativeDay(dateStr: string): string {
  const today = new Date();
  const d     = new Date(dateStr);
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff  <  7) return `${diff}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

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
        <Calendar size={13} className="flex-shrink-0" />
        <input
          type="date"
          value={filters.date_from || ""}
          onChange={(e) => onChange({ ...filters, date_from: e.target.value || undefined, page: 1 })}
          className="bg-transparent outline-none text-[12px] text-text-secondary w-[100px] placeholder:text-text-tertiary"
          placeholder="From"
        />
        <span className="text-text-tertiary">—</span>
        <input
          type="date"
          value={filters.date_to || ""}
          onChange={(e) => onChange({ ...filters, date_to: e.target.value || undefined, page: 1 })}
          className="bg-transparent outline-none text-[12px] text-text-secondary w-[100px]"
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

// Derive a human-readable title from the workout's exercises.
// Falls back to capitalised type if no exercises are logged yet.
function workoutDisplayName(w: Workout): string {
  const exs = w.workout_exercises ?? [];
  if (exs.length === 0) {
    return w.type ? w.type.charAt(0).toUpperCase() + w.type.slice(1) : "Workout";
  }
  const first = exs[0].exercise.name;
  if (exs.length === 1) return first;
  if (exs.length === 2) return `${first} & ${exs[1].exercise.name}`;
  return `${first}, ${exs[1].exercise.name} +${exs.length - 2} more`;
}

interface WorkoutRowProps {
  workout:  Workout;
  onDelete: (id: number) => void;
}

function WorkoutRow({ workout: w, onDelete }: WorkoutRowProps) {
  const type        = w.type?.toLowerCase() ?? "strength";
  const accentClass = ACCENT_CLASS[type]     ?? "bg-elevated";
  const iconClass   = TYPE_ICON_CLASS[type]  ?? "bg-elevated text-text-tertiary";
  const badgeClass  = TYPE_BADGE_CLASS[type] ?? "bg-elevated text-text-secondary";
  const name        = workoutDisplayName(w);

  return (
    <div className="flex items-center bg-surface border border-border-default rounded-xl overflow-hidden hover:border-border-strong hover:bg-elevated/30 transition-all duration-150 group">

      {/* Type accent bar */}
      <div className={`w-[3px] self-stretch flex-shrink-0 ${accentClass}`} />

      {/* Icon */}
      <div className="flex items-center justify-center w-[52px] flex-shrink-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
          <WorkoutIcon type={type} />
        </div>
      </div>

      {/* Body — takes remaining space */}
      <Link to={`/workouts/${w.id}`} className="flex-1 py-3 pr-3 min-w-0">
        {/* Name + badge */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[13px] font-semibold text-text-primary leading-none">
            {name}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
            {w.type}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
          <span className="flex items-center gap-1 text-[11px] text-text-tertiary">
            <Calendar size={11} />
            {relativeDay(w.date)}
          </span>
          {w.duration && (
            <span className="flex items-center gap-1 text-[11px] text-text-tertiary">
              <Clock size={11} />
              {w.duration} min
            </span>
          )}
          {w.calories && (
            <span className="flex items-center gap-1 text-[11px] text-text-tertiary">
              <Flame size={11} />
              {w.calories} kcal
            </span>
          )}
          {w.workout_exercises?.length > 0 && (
            <span className="text-[11px] text-text-tertiary">
              · {w.workout_exercises.length} exercise{w.workout_exercises.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Notes */}
        {w.notes && (
          <p className="mt-1.5 text-[11px] text-text-tertiary truncate max-w-[360px]">
            {w.notes}
          </p>
        )}
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 flex-shrink-0">
        <Link
          to={`/workouts/${w.id}`}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
          aria-label="View workout"
        >
          <ChevronRight size={15} />
        </Link>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(w.id); }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:bg-danger/10 hover:text-danger transition-colors"
          aria-label="Delete workout"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

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
    <div className="flex flex-col gap-6 ">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Workouts</h1>
          {workouts.length > 0 && (
            <p className="text-[13px] text-text-secondary mt-1">
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