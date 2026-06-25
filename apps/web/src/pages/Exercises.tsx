import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Search, Dumbbell, Wind, Zap, Activity, ChevronRight, Trash2 } from "lucide-react";

import { useExercises, useCreateExercise } from "@gymtracker/hooks";
import type { ExerciseCategory, ExerciseRowProps } from "@gymtracker/types";

import { Button, Input, Select, EmptyState } from "../components/ui";
import { Link } from "react-router-dom";

// ── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES    = ["strength", "cardio", "flexibility", "core"] as const;
const MUSCLE_GROUPS = ["chest", "back", "shoulders", "arms", "legs", "core", "full_body"];
const EQUIPMENT     = ["barbell", "dumbbell", "bodyweight", "machine", "cable", "kettlebell", "none"];

// ── Design maps ────────────────────────────────────────────────────────────

const ACCENT_BAR: Record<string, string> = {
  strength:    "bg-accent",
  cardio:      "bg-success",
  flexibility: "bg-warning",
  core:        "bg-danger",
};

const ICON_BOX: Record<string, string> = {
  strength:    "bg-accent/10 text-accent",
  cardio:      "bg-success/10 text-success",
  flexibility: "bg-warning/10 text-warning",
  core:        "bg-danger/10 text-danger",
};

const BADGE: Record<string, string> = {
  strength:    "bg-accent/10 text-accent-light",
  cardio:      "bg-success/10 text-success",
  flexibility: "bg-warning/10 text-warning",
  core:        "bg-danger/10 text-danger",
};

function ExerciseIcon({ category }: { category: string }) {
  const cls = "w-[15px] h-[15px]";
  switch (category) {
    case "cardio":      return <Wind     className={cls} />;
    case "flexibility": return <Zap      className={cls} />;
    case "core":        return <Activity className={cls} />;
    default:            return <Dumbbell className={cls} />;
  }
}

function cap(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ") : "";
}

// ── Form schema ────────────────────────────────────────────────────────────

const schema = z.object({
  name:         z.string().min(2, "Minimum 2 characters"),
  category:     z.string().min(1, "Select a category"),
  muscle_group: z.string().optional(),
  equipment:    z.string().optional(),
});
type FormData = z.infer<typeof schema>;

// ── Sub-components ─────────────────────────────────────────────────────────

interface AddExerciseFormProps {
  onClose: () => void;
}

function AddExerciseForm({ onClose }: AddExerciseFormProps) {
  const { mutate, isPending, error, reset: resetMutation } = useCreateExercise();

  const {
    register, handleSubmit, reset, watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const selectedCategory = watch("category");
  const showMuscleGroup  = selectedCategory === "strength";

  const onSubmit = (data: FormData) => {
    mutate(
      {
        name:         data.name.trim().toLowerCase(),
        category:     data.category as ExerciseCategory,
        muscle_group: showMuscleGroup ? (data.muscle_group || null) : null,
        equipment:    data.equipment  || null,
      },
      {
        onSuccess: () => {
          reset();
          resetMutation();
          onClose();
        },
      }
    );
  };

  return (
    <div className="bg-surface border border-border-default rounded-xl p-5">
      {/* Form header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[14px] font-semibold text-text-primary">New exercise</p>
          <p className="text-[11px] text-text-tertiary mt-0.5">It will be available in all future workouts</p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-elevated transition-colors"
          aria-label="Close form"
        >
          <X size={15} />
        </button>
      </div>

      {/* API error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg border border-danger/20 bg-danger/10 text-[13px] text-danger">
          {(error as any)?.response?.data?.detail ?? "Failed to create exercise"}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Row 1 — name + category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Exercise name"
            placeholder="e.g. Bench Press, Running"
            error={errors.name?.message}
            {...register("name")}
          />
          <Select
            label="Category"
            error={errors.category?.message}
            {...register("category")}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{cap(c)}</option>
            ))}
          </Select>
        </div>

        {/* Row 2 — muscle group (strength only) + equipment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {showMuscleGroup && (
            <Select label="Muscle group" {...register("muscle_group")}>
              <option value="">Optional</option>
              {MUSCLE_GROUPS.map((m) => (
                <option key={m} value={m}>{cap(m)}</option>
              ))}
            </Select>
          )}
          <Select label="Equipment" {...register("equipment")}>
            <option value="">Optional</option>
            {EQUIPMENT.map((eq) => (
              <option key={eq} value={eq}>{cap(eq)}</option>
            ))}
          </Select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" loading={isPending}>
            Add exercise
          </Button>
        </div>
      </form>
    </div>
  );
}

// ── Exercise row ───────────────────────────────────────────────────────────

function ExerciseRow({ exercise, onDelete }: ExerciseRowProps) {
  const cat        = exercise.category?.toLowerCase() ?? "strength";
  const accentBar  = ACCENT_BAR[cat] ?? "bg-elevated";
  const iconBox    = ICON_BOX[cat]   ?? "bg-elevated text-text-tertiary";
  const badgeClass = BADGE[cat]      ?? "bg-elevated text-text-secondary";

  return (
    <Link 
    to={`/exercises/${exercise.id}`}
    className="flex items-center bg-surface border border-border-default rounded-xl overflow-hidden hover:border-border-strong hover:bg-elevated/20 transition-all duration-150">
      {/* Accent bar */}
      <div className={`w-0.75 self-stretch shrink-0 ${accentBar}`} />

      {/* Icon */}
      <div className="flex items-center justify-center w-12 shrink-0">
        <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center ${iconBox}`}>
          <ExerciseIcon category={cat} />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 py-3 pr-3 min-w-0">
        <p className="text-[13px] font-semibold text-text-primary capitalize leading-snug">
          {exercise.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {exercise.muscle_group && exercise.muscle_group !== "none" && (
            <span className="text-[11px] text-text-tertiary capitalize">
              {exercise.muscle_group.replace(/_/g, " ")}
            </span>
          )}
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${badgeClass}`}>
            {exercise.category}
          </span>
        </div>
      </div>

      {/* Equipment (right) */}
      {exercise.equipment && exercise.equipment !== "none" && (
        <div className="px-4 shrink-0">
          <span className="text-[11px] text-text-tertiary capitalize">
            {exercise.equipment}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
          aria-label="View workout"
        >
          <ChevronRight size={15} />
        </div>
        {onDelete && (
            <button
            onClick={(e) => { e.stopPropagation(); onDelete(exercise.id); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:bg-danger/10 hover:text-danger transition-colors"
            aria-label="Delete workout"
            >
                <Trash2 size={14} />
            </button>
        )}
      </div>
    </Link>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Exercises() {
  const [search,         setSearch]         = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showForm,       setShowForm]       = useState(false);

  const { data: exercises = [], isLoading } = useExercises();

  const filtered = exercises.filter((e) => {
    const matchSearch   = e.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory
      ? e.category.toLowerCase() === filterCategory.toLowerCase()
      : true;
    return matchSearch && matchCategory;
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Exercises</h1>
          <p className="text-[13px] text-text-secondary mt-1 sm:mt-2">Your exercise library</p>
        </div>
        <Button
          icon={showForm ? <X size={14} /> : <Plus size={14} />}
          variant={showForm ? "secondary" : "primary"}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "Add exercise"}
        </Button>
      </div>

      {/* ── Add exercise form (inline panel) ── */}
      {showForm && <AddExerciseForm onClose={() => setShowForm(false)} />}

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search input */}
        <div className="relative flex items-center flex-1 min-w-45">
          <Search size={14} className="absolute left-3 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="Search exercises…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 bg-surface border border-border-default rounded-xl pl-9 pr-3 text-[13px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
          />
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface border border-border-default rounded-xl">
          <button
            onClick={() => setFilterCategory("")}
            className={[
              "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors",
              filterCategory === "" ? "bg-elevated text-text-primary" : "text-text-tertiary hover:text-text-secondary",
            ].join(" ")}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(filterCategory === c ? "" : c)}
              className={[
                "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors capitalize",
                filterCategory === c ? "bg-elevated text-text-primary" : "text-text-tertiary hover:text-text-secondary",
              ].join(" ")}
            >
              {cap(c)}
            </button>
          ))}
        </div>

        {/* Count */}
        <span className="text-[12px] text-text-tertiary tabular-nums ml-auto">
          {filtered.length} exercise{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Exercise list ── */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14.5 bg-surface border border-border-default rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-border-default rounded-xl">
          <EmptyState
            icon={<Dumbbell size={20} />}
            title={search || filterCategory ? "No exercises found" : "No exercises yet"}
            description={
              search || filterCategory
                ? "Try a different search or clear the filter."
                : "Add your first exercise to start building your library."
            }
            action={
              search || filterCategory ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => { setSearch(""); setFilterCategory(""); }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button size="sm" onClick={() => setShowForm(true)}>
                  Add exercise
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((e) => (
            <ExerciseRow key={e.id} exercise={e} />
          ))}
        </div>
      )}

    </div>
  );
}