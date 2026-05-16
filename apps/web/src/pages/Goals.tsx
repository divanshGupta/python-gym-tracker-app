import { useState } from "react";
import {
  useGoals,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
  useLogGoalProgress,
} from "@gymtracker/hooks";
import type { Goal, GoalType } from "@gymtracker/types";

// Constants

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

const STATUS_COLORS: Record<string, string> = {
  active:    "bg-green-500/20 text-green-400",
  completed: "bg-blue-500/20 text-blue-400",
  abandoned: "bg-gray-600/40 text-gray-400",
};

// ── Helpers ────────────────────────────────────────────────────────────────

const progressPercent = (goal: Goal): number => {
  if (!goal.current_value) return 0;
  return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
};

// ── Page ───────────────────────────────────────────────────────────────────

export default function Goals() {
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [showForm,     setShowForm]     = useState(false);
  const [logModal,     setLogModal]     = useState<Goal | null>(null);
  const [logValue,     setLogValue]     = useState("");
  const [logDate,      setLogDate]      = useState(
    new Date().toISOString().split("T")[0]
  );
  const [form, setForm] = useState({
    title:        "",
    goal_type:    "workout_frequency" as GoalType,
    target_value: "",
    unit:         "",
    deadline:     "",
  });

  // ── Data ──────────────────────────────────────────────────────────────
  const { data: goals = [], isLoading } = useGoals(statusFilter || undefined);

  // ── Mutations ─────────────────────────────────────────────────────────
  const { mutate: create }  = useCreateGoal();
  const { mutate: update }  = useUpdateGoal();
  const { mutate: remove }  = useDeleteGoal();
  const { mutate: logProgress, isPending: logging } = useLogGoalProgress();

  // ── Handlers ──────────────────────────────────────────────────────────

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
          setShowForm(false);
          setForm({
            title: "", goal_type: "workout_frequency",
            target_value: "", unit: "", deadline: "",
          });
        },
      }
    );
  };

  const handleAbandon = (id: number) => {
    update({ id, data: { status: "abandoned" } });
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this goal?")) remove(id);
  };

  const handleLog = () => {
    if (!logModal || !logValue) return;
    logProgress(
      {
        goalId: logModal.id,
        data: {
          value: parseFloat(logValue),
          date:  logDate,
        },
      },
      {
        onSuccess: () => {
          setLogModal(null);
          setLogValue("");
        },
      }
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-void px-4 py-6 sm:px-6 sm:py-8 text-text-primary">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Goals</h1>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        >
          + New Goal
        </button>
      </div>

      {/* Status filter */}
      <div className="mb-8 flex flex-wrap gap-2 rounded-xl border border-border-default bg-surface p-3">
        {["active", "completed", "abandoned", ""].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              statusFilter === s
                ? "bg-accent text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-border-default bg-surface p-6">
          <h2 className="mb-5 text-lg font-semibold tracking-tight text-text-primary">New Goal</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <select
              value={form.goal_type}
              onChange={(e) =>
                setForm({ ...form, goal_type: e.target.value as GoalType })
              }
              className="rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
              {Object.entries(GOAL_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder={`Target (${GOAL_TYPE_UNITS[form.goal_type]})`}
              value={form.target_value}
              onChange={(e) => setForm({ ...form, target_value: e.target.value })}
              className="rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleCreate}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
            >
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-border-default bg-surface px-4 py-2.5 text-sm text-text-secondary transition-all duration-200 hover:bg-elevated hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals list */}
      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : goals.length === 0 ? (
        <div className="rounded-2xl border border-border-default bg-surface py-20 text-center">
          <p className="text-sm text-text-secondary">No goals found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {goals.map((g: Goal) => {
            const pct = progressPercent(g);
            return (
              <div key={g.id} className="rounded-2xl border border-border-default bg-surface p-5 transition-all duration-200 hover:border-accent/20 hover:bg-elevated/30">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold text-text-primary">{g.title}</span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          STATUS_COLORS[g.status]
                        }`}
                      >
                        {g.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-text-secondary">
                      {GOAL_TYPE_LABELS[g.goal_type]} · Target: {g.target_value}{" "}
                      {g.unit}
                      {g.current_value != null && (
                        <span> · Current: {g.current_value} {g.unit}</span>
                      )}
                      {g.deadline && <span> · Due: {g.deadline}</span>}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {g.status === "active" && (
                      <button
                        onClick={() => setLogModal(g)}
                        className="font-medium text-accent transition-colors hover:opacity-80"
                      >
                        Log
                      </button>
                    )}
                    {g.status === "active" && (
                      <button
                        onClick={() => handleAbandon(g.id)}
                        className="font-medium text-warning transition-colors hover:opacity-80"
                      >
                        Abandon
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="font-medium text-danger transition-colors hover:opacity-80"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-text-tertiary">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-elevated">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        g.status === "completed" ? "bg-accent-light" : "bg-accent"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Log progress modal */}
      {logModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border-default bg-surface p-6">
            <h2 className="mb-1 text-lg font-semibold text-text-primary">Log Progress</h2>
            <p className="mb-5 text-sm text-text-secondary">{logModal.title}</p>
            <input
              type="number"
              placeholder={`Value (${logModal.unit ?? ""})`}
              value={logValue}
              onChange={(e) => setLogValue(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleLog}
                disabled={logging}
                className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-text-primary transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              >
                {logging ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setLogModal(null)}
                className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-text-primary transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}