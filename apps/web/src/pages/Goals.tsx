import { useState } from "react";
import { Plus, X, Flag, Trash2 } from "lucide-react";

import {
  useGoals,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
  useLogGoalProgress,
} from "@gymtracker/hooks";
import type { Goal, GoalType } from "@gymtracker/types";

import { Button, Input, Select, EmptyState, PageSkeleton } from "../components/ui";

// ── Constants ──────────────────────────────────────────────────────────────

const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  workout_frequency:    "Workout Frequency",
  lift_target:          "Lift Target",
  body_weight:          "Body Weight",
  progressive_overload: "Progressive Overload",
};

const GOAL_TYPE_UNITS: Record<GoalType, string> = {
  workout_frequency:    "sessions/week",
  lift_target:          "kg",
  body_weight:          "kg",
  progressive_overload: "%",
};

const STATUS_FILTERS = [
  { value: "active",    label: "Active"    },
  { value: "completed", label: "Completed" },
  { value: "abandoned", label: "Abandoned" },
  { value: "",          label: "All"       },
] as const;

// ── Helpers ────────────────────────────────────────────────────────────────

function progressPercent(goal: Goal): number {
  if (!goal.current_value || !goal.target_value) return 0;
  return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
}

function formatDeadline(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ── Status badge ───────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, string> = {
  active:    "bg-success/10 text-success border border-success/15",
  completed: "bg-accent/10 text-accent-light border border-accent/15",
  abandoned: "bg-elevated text-text-tertiary border border-border-default",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[status] ?? STATUS_BADGE.abandoned}`}>
      {status}
    </span>
  );
}

// ── Progress bar ───────────────────────────────────────────────────────────

function ProgressBar({ goal }: { goal: Goal }) {
  const pct       = progressPercent(goal);
  const isComplete = goal.status === "completed" || pct >= 100;
  const barColor  = isComplete ? "bg-success" : "bg-accent";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-text-tertiary">Progress</span>
        <span className={`text-[12px] font-semibold ${isComplete ? "text-success" : "text-text-primary"}`}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-text-tertiary">0 {goal.unit}</span>
        <span className="text-[10px] text-text-tertiary">{goal.target_value} {goal.unit}</span>
      </div>
    </div>
  );
}

// ── Goal card ──────────────────────────────────────────────────────────────

interface GoalCardProps {
  goal:      Goal;
  onLog:     (g: Goal) => void;
  onAbandon: (id: number) => void;
  onDelete:  (id: number) => void;
}

function GoalCard({ goal: g, onLog, onAbandon, onDelete }: GoalCardProps) {
  const isActive = g.status === "active";

  return (
    <div className={[
      "bg-surface border border-border-default rounded-xl p-4 flex flex-col gap-4",
      "hover:border-border-strong transition-colors duration-150",
      !isActive ? "opacity-60" : "",
    ].join(" ")}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        {/* Left — title + meta */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-semibold text-text-primary leading-snug">
              {g.title}
            </span>
            <StatusBadge status={g.status} />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Type tag */}
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-elevated text-text-secondary">
              {GOAL_TYPE_LABELS[g.goal_type]}
            </span>
            <span className="text-[10px] text-border-strong">·</span>
            <span className="text-[11px] text-text-tertiary">
              Target: {g.target_value} {g.unit}
            </span>
            {g.current_value != null && (
              <>
                <span className="text-[10px] text-border-strong">·</span>
                <span className="text-[11px] text-text-tertiary">
                  Current: {g.current_value} {g.unit}
                </span>
              </>
            )}
            {g.deadline && (
              <>
                <span className="text-[10px] text-border-strong">·</span>
                <span className="text-[11px] text-text-tertiary">
                  Due {formatDeadline(g.deadline)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right — action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {isActive && (
            <button
              onClick={() => onLog(g)}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-accent/10 text-accent text-[11px] font-semibold hover:bg-accent/20 transition-colors"
            >
              <Plus size={11} /> Log
            </button>
          )}
          {isActive && (
            <button
              onClick={() => onAbandon(g.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:bg-warning/10 hover:text-warning transition-colors"
              aria-label="Abandon goal"
            >
              <Flag size={13} />
            </button>
          )}
          <button
            onClick={() => onDelete(g.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:bg-danger/10 hover:text-danger transition-colors"
            aria-label="Delete goal"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar goal={g} />
    </div>
  );
}

// ── Log progress modal ─────────────────────────────────────────────────────

interface LogModalProps {
  goal:     Goal;
  onClose:  () => void;
}

function LogModal({ goal, onClose }: LogModalProps) {
  const [value, setValue] = useState("");
  const [date,  setDate]  = useState(new Date().toISOString().split("T")[0]);
  const { mutate: logProgress, isPending } = useLogGoalProgress();

  const handleSave = () => {
    if (!value) return;
    logProgress(
      { goalId: goal.id, data: { value: parseFloat(value), date } },
      { onSuccess: onClose }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-void/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-surface border border-border-default rounded-2xl p-6 flex flex-col gap-5 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-text-primary">Log progress</h2>
            <p className="text-[12px] text-text-secondary mt-0.5">{goal.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-elevated transition-colors"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          <Input
            label={`Current value (${goal.unit ?? ""})`}
            type="number"
            placeholder={`e.g. ${goal.current_value ?? goal.target_value}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" loading={isPending} onClick={handleSave} className="flex-1">
            Save progress
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Create goal form ───────────────────────────────────────────────────────

interface CreateGoalFormProps {
  onClose: () => void;
}

function CreateGoalForm({ onClose }: CreateGoalFormProps) {
  const { mutate: create } = useCreateGoal();
  const [form, setForm] = useState({
    title:        "",
    goal_type:    "workout_frequency" as GoalType,
    target_value: "",
    unit:         "",
    deadline:     "",
  });

  const handleCreate = () => {
    if (!form.title || !form.target_value) return;
    create(
      {
        title:        form.title,
        goal_type:    form.goal_type,
        target_value: parseFloat(form.target_value),
        unit:         form.unit || GOAL_TYPE_UNITS[form.goal_type],
        deadline:     form.deadline || undefined,
      },
      {
        onSuccess: () => {
          onClose();
          setForm({ title: "", goal_type: "workout_frequency", target_value: "", unit: "", deadline: "" });
        },
      }
    );
  };

  return (
    <div className="bg-surface border border-border-default rounded-xl p-5 flex flex-col gap-4">
      {/* Form header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-text-primary">New goal</p>
          <p className="text-[11px] text-text-tertiary mt-0.5">Set a target to work towards</p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-elevated transition-colors"
          aria-label="Close"
        >
          <X size={15} />
        </button>
      </div>

      {/* Row 1 — title + type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Goal title"
          placeholder="e.g. Bench Press 100kg"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Select
          label="Goal type"
          value={form.goal_type}
          onChange={(e) => setForm({ ...form, goal_type: e.target.value as GoalType })}
        >
          {Object.entries(GOAL_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </Select>
      </div>

      {/* Row 2 — target + deadline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label={`Target value (${GOAL_TYPE_UNITS[form.goal_type]})`}
          type="number"
          placeholder="e.g. 100"
          value={form.target_value}
          onChange={(e) => setForm({ ...form, target_value: e.target.value })}
        />
        <Input
          label="Deadline (optional)"
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleCreate}>Create goal</Button>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Goals() {
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [showForm,     setShowForm]     = useState(false);
  const [logModal,     setLogModal]     = useState<Goal | null>(null);

  const { data: goals = [], isLoading } = useGoals(statusFilter || undefined);
  const { mutate: update } = useUpdateGoal();
  const { mutate: remove } = useDeleteGoal();

  const handleAbandon = (id: number) => update({ id, data: { status: "abandoned" } });
  const handleDelete  = (id: number) => { if (confirm("Delete this goal?")) remove(id); };

  if (isLoading) return <PageSkeleton stats={0} rows={3} />;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Goals</h1>
          <p className="text-[13px] text-text-secondary mt-1 sm:mt-2">Track your targets</p>
        </div>
        <Button
          icon={showForm ? <X size={14} /> : <Plus size={14} />}
          variant={showForm ? "secondary" : "primary"}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "New goal"}
        </Button>
      </div>

      {/* ── Create form ── */}
      {showForm && <CreateGoalForm onClose={() => setShowForm(false)} />}

      {/* ── Status filter tabs ── */}
      <div className="flex items-center gap-1 p-1 bg-surface border border-border-default rounded-xl w-fit">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={label}
            onClick={() => setStatusFilter(value)}
            className={[
              "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150",
              statusFilter === value
                ? "bg-elevated text-text-primary"
                : "text-text-tertiary hover:text-text-secondary",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Goals list ── */}
      {goals.length === 0 ? (
        <div className="bg-surface border border-border-default rounded-xl">
          <EmptyState
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
              </svg>
            }
            title={statusFilter === "active" ? "No active goals" : "No goals found"}
            description={
              statusFilter === "active"
                ? "Create a goal to start tracking your progress."
                : "Try a different filter."
            }
            action={
              statusFilter === "active" ? (
                <Button size="sm" onClick={() => setShowForm(true)}>
                  Create first goal
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {goals.map((g: Goal) => (
            <GoalCard
              key={g.id}
              goal={g}
              onLog={setLogModal}
              onAbandon={handleAbandon}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── Log modal ── */}
      {logModal && (
        <LogModal goal={logModal} onClose={() => setLogModal(null)} />
      )}

    </div>
  );
}