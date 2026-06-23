import type { WorkoutRowProps, WorkoutType, Workout } from "@gymtracker/types";
import { Link } from "react-router-dom";
import {
  ChevronRight, Trash2,
  Dumbbell, Wind, Zap, Activity,
  Calendar, Clock, Flame
} from "lucide-react";

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

export function WorkoutRow({ workout: w, onDelete }: WorkoutRowProps) {
  const type        = w.type?.toLowerCase() ?? "strength";
  const accentClass = ACCENT_CLASS[type]     ?? "bg-elevated";
  const iconClass   = TYPE_ICON_CLASS[type]  ?? "bg-elevated text-text-tertiary";
  const badgeClass  = TYPE_BADGE_CLASS[type] ?? "bg-elevated text-text-secondary";
  const name        = workoutDisplayName(w);

  return (
    <div className="flex items-center bg-surface border border-border-default rounded-xl overflow-hidden hover:border-border-strong hover:bg-elevated/20 transition-all duration-150 group">

      {/* Type accent bar */}
      <div className={`w-0.75 self-stretch shrink-0 ${accentClass}`} />

      {/* Icon */}
      <div className="flex items-center justify-center w-13 shrink-0">
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
          <p className="mt-1.5 text-[11px] text-text-tertiary truncate max-w-90">
            {w.notes}
          </p>
        )}
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 shrink-0">
        <Link
          to={`/workouts/${w.id}`}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
          aria-label="View workout"
        >
          <ChevronRight size={15} />
        </Link>
        {onDelete && (
            <button
            onClick={(e) => { e.stopPropagation(); onDelete(w.id); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:bg-danger/10 hover:text-danger transition-colors"
            aria-label="Delete workout"
            >
                <Trash2 size={14} />
            </button>
        )}
      </div>
    </div>
  );
}