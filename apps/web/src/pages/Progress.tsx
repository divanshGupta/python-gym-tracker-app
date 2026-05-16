// apps/web/src/pages/Progress.tsx
import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  useWorkoutStats,
  usePersonalBests,
  useStreak,
  useExerciseProgress,
  useExercises,
} from "@gymtracker/hooks";

// ── Sub-components ─────────────────────────────────────────────────────────

function StatCard({ label, value, unit, icon }: {
  label: string; value: any; unit?: string; icon: string;
}) {
  return (
    <div className="bg-void rounded-xl p-5 flex items-start gap-4 border-border-default">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-white text-2xl font-bold">
          {value ?? "--"}
          {unit && <span className="text-gray-400 text-sm ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">
      {children}
    </h2>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function Progress() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | "">("");

  // ── Data ──────────────────────────────────────────────────────────────
  const { data: stats,    isLoading: statsLoading   } = useWorkoutStats();
  const { data: pbData,   isLoading: pbLoading      } = usePersonalBests();
  const { data: streak                               } = useStreak();
  const { data: exercises = []                       } = useExercises();
  const { data: progress, isLoading: progressLoading } = useExerciseProgress(
    selectedExerciseId ? Number(selectedExerciseId) : 0
  );

  const personalBests = pbData?.personal_bests ?? [];

  // Workout type breakdown for bar chart
  const typeChartData = stats?.workouts_by_type
    ? Object.entries(stats.workouts_by_type).map(([type, count]) => ({
        type, count,
      }))
    : [];

  return (
    <div className="min-h-screen bg-void px-4 py-6 sm:px-6 sm:py-8 text-text-primary">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-text-primary">Progress</h1>

      {/* ── Overview stats ─────────────────────────────────────────────── */}
      {statsLoading ? (
        <p className="mb-6 text-sm text-text-secondary">Loading stats...</p>
      ) : (
        <>
          <SectionTitle>Overview</SectionTitle>
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon="🏋️"
              label="Total Workouts"
              value={stats?.total_workouts}
            />
            <StatCard
              icon="⏱️"
              label="Total Duration"
              value={stats?.total_duration_minutes}
              unit="min"
            />
            <StatCard
              icon="🔥"
              label="Calories Burned"
              value={stats?.total_calories_burned}
              unit="kcal"
            />
            <StatCard
              icon="⭐"
              label="Top Exercise"
              value={stats?.most_logged_exercise ?? "—"}
            />
          </div>
        </>
      )}

      {/* ── Streak ─────────────────────────────────────────────────────── */}
      {streak && (
        <>
          <SectionTitle>Streak</SectionTitle>
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl border border-border-default bg-surface p-5 transition-all duration-200 hover:bg-elevated/30">
              <span className="text-3xl sm:text-4xl">🔥</span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Current Streak</p>
                <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
                  {streak.current_streak}
                  <span className="ml-1 text-sm font-normal text-text-secondary">days</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-border-default bg-surface p-5 transition-all duration-200 hover:bg-elevated/30">
              <span className="text-4xl">🏆</span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Longest Streak</p>
                <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
                  {streak.longest_streak}
                  <span className="ml-1 text-sm font-normal text-text-secondary">days</span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Workout type breakdown ──────────────────────────────────────── */}
      {typeChartData.length > 0 && (
        <div className="mb-8">
          <SectionTitle>Workouts by Type</SectionTitle>
          <div className="rounded-2xl border border-border-default bg-surface p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2E" />
                <XAxis
                  dataKey="type"
                  tick={{ fill: "#8E8E93", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#8E8E93", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#1C1C1E", border: "none", borderRadius: 12
                  }}
                />
                <Bar dataKey="count" fill="#7C5CFC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Personal bests ──────────────────────────────────────────────── */}
      {!pbLoading && personalBests.length > 0 && (
        <div className="mb-8">
          <SectionTitle>Personal Bests</SectionTitle>
          <div className="overflow-hidden rounded-2xl border border-border-default bg-surface">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border-default text-xs uppercase tracking-wide text-text-tertiary">
                  <th className="text-left px-5 py-3">Exercise</th>
                  <th className="text-right px-5 py-3">Max Weight</th>
                </tr>
              </thead>
              <tbody>
                {personalBests.map((pb) => (
                  <tr
                    key={pb.exercise}
                    className="border-b border-border-default/50 transition-colors hover:bg-elevated/30"
                  >
                    <td className="px-5 py-3 capitalize">{pb.exercise}</td>
                    <td className="px-5 py-3 text-right font-semibold text-accent">
                      {pb.max_weight_kg} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Exercise progress chart ─────────────────────────────────────── */}
      <div className="mb-8">
        <SectionTitle>Exercise Progress</SectionTitle>
        <div className="bg-gray-900 rounded-xl p-5">
          {/* Exercise picker */}
          <select
            value={selectedExerciseId}
            onChange={(e) =>
              setSelectedExerciseId(e.target.value ? Number(e.target.value) : "")
            }
            className="mb-6 w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 sm:max-w-xs"
          >
            <option value="">Select an exercise...</option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name.charAt(0).toUpperCase() + ex.name.slice(1)}
              </option>
            ))}
          </select>

          {!selectedExerciseId ? (
            <p className="text-sm text-text-secondary">
              Select an exercise to see your progress over time.
            </p>
          ) : progressLoading ? (
            <p className="text-sm text-text-secondary">Loading...</p>
          ) : !progress || progress.max_weight_over_time.length === 0 ? (
            <p className="text-sm text-text-tertiary">
              No data yet for this exercise.
            </p>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Max weight over time */}
              <div>
                <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-tertiary">Max Weight (kg)</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={progress.max_weight_over_time}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                    />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#111827", border: "none", borderRadius: 8,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="max_weight"
                      stroke="#7C5CFC"
                      dot={{ fill: "#7C5CFC", r: 3 }}
                      strokeWidth={2}
                      name="Max Weight"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Volume over time */}
              <div>
                <p className="text-gray-400 text-xs mb-3">
                  Volume (sets × reps × weight)
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={progress.volume_over_time}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#9B7EFD", fontSize: 11 }}
                    />
                    <YAxis tick={{ fill: "#9B7EFD", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#111827", border: "none", borderRadius: 8,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke="#9B7EFD"
                      dot={{ fill: "#9B7EFD", r: 3 }}
                      strokeWidth={2}
                      name="Volume"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}