// apps/web/src/pages/Goals.tsx
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getGoals, createGoal, updateGoal, deleteGoal, logGoalProgress } from "../api/goals"
import type { Goal, GoalType } from "../types"

const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  workout_frequency:   "Workout Frequency",
  lift_target:         "Lift Target",
  body_weight:         "Body Weight",
  progressive_overload: "Progressive Overload",
}

const GOAL_TYPE_UNITS: Record<GoalType, string> = {
  workout_frequency:   "sessions/week",
  lift_target:         "kg",
  body_weight:         "kg",
  progressive_overload: "%",
}

function progressPercent(goal: Goal): number {
  if (!goal.current_value) return 0
  return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
}

export default function Goals() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>("active")
  const [showForm, setShowForm] = useState(false)
  const [logModal, setLogModal] = useState<Goal | null>(null)
  const [logValue, setLogValue] = useState("")
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0])
  const [form, setForm] = useState({
    title: "", goal_type: "workout_frequency" as GoalType,
    target_value: "", unit: "", deadline: "",
  })

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["goals", statusFilter],
    queryFn: () => getGoals(statusFilter || undefined),
  })

  const { mutate: create } = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      setShowForm(false)
      setForm({ title: "", goal_type: "workout_frequency", target_value: "", unit: "", deadline: "" })
    },
  })

  const { mutate: remove } = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  })

  const { mutate: abandon } = useMutation({
    mutationFn: (id: number) => updateGoal(id, { status: "abandoned" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  })

  const { mutate: logProgress, isPending: logging } = useMutation({
    mutationFn: ({ goalId, value, date }: { goalId: number; value: number; date: string }) =>
      logGoalProgress(goalId, { value, date }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      setLogModal(null)
      setLogValue("")
    },
  })

  const handleCreate = () => {
    if (!form.title || !form.target_value) return
    create({
      title: form.title,
      goal_type: form.goal_type,
      target_value: parseFloat(form.target_value),
      unit: form.unit || GOAL_TYPE_UNITS[form.goal_type],
      deadline: form.deadline || undefined,
    })
  }

  const handleLog = () => {
    if (!logModal || !logValue) return
    logProgress({ goalId: logModal.id, value: parseFloat(logValue), date: logDate })
  }

  const statusColors: Record<string, string> = {
    active: "bg-green-500/20 text-green-400",
    completed: "bg-blue-500/20 text-blue-400",
    abandoned: "bg-gray-600/40 text-gray-400",
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Goals</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm font-semibold"
        >
          + New Goal
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6">
        {["active", "completed", "abandoned", ""].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded text-sm ${
              statusFilter === s ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-gray-900 rounded-xl p-5 mb-6">
          <h2 className="font-semibold mb-4">New Goal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-gray-800 px-3 py-2 rounded text-sm outline-none col-span-2"
            />
            <select
              value={form.goal_type}
              onChange={(e) => setForm({ ...form, goal_type: e.target.value as GoalType })}
              className="bg-gray-800 px-3 py-2 rounded text-sm outline-none"
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
              className="bg-gray-800 px-3 py-2 rounded text-sm outline-none"
            />
            <input
              type="date"
              placeholder="Deadline (optional)"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="bg-gray-800 px-3 py-2 rounded text-sm outline-none"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreate}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm font-semibold"
            >
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 text-sm hover:text-white px-4 py-2"
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
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No goals found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {goals.map((g) => {
            const pct = progressPercent(g)
            return (
              <div key={g.id} className="bg-gray-900 rounded-xl px-5 py-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{g.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[g.status]}`}>
                        {g.status}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {GOAL_TYPE_LABELS[g.goal_type]} · Target: {g.target_value} {g.unit}
                      {g.current_value !== undefined && g.current_value !== null && (
                        <span> · Current: {g.current_value} {g.unit}</span>
                      )}
                      {g.deadline && <span> · Due: {g.deadline}</span>}
                    </div>
                  </div>
                  <div className="flex gap-3 text-sm ml-4">
                    {g.status === "active" && (
                      <button
                        onClick={() => setLogModal(g)}
                        className="text-green-400 hover:underline"
                      >
                        Log
                      </button>
                    )}
                    {g.status === "active" && (
                      <button
                        onClick={() => abandon(g.id)}
                        className="text-yellow-500 hover:underline"
                      >
                        Abandon
                      </button>
                    )}
                    <button
                      onClick={() => confirm("Delete goal?") && remove(g.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        g.status === "completed" ? "bg-blue-500" : "bg-green-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Log progress modal */}
      {logModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-sm mx-4">
            <h2 className="font-semibold mb-1">Log Progress</h2>
            <p className="text-gray-400 text-sm mb-4">{logModal.title}</p>
            <input
              type="number"
              placeholder={`Value (${logModal.unit})`}
              value={logValue}
              onChange={(e) => setLogValue(e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded text-sm outline-none mb-3"
            />
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full bg-gray-800 px-3 py-2 rounded text-sm outline-none mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleLog}
                disabled={logging}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm font-semibold disabled:opacity-50"
              >
                {logging ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setLogModal(null)}
                className="text-gray-400 text-sm hover:text-white px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}