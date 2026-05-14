// apps/web/src/pages/Progress.tsx
import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
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
    <div className="bg-gray-900 rounded-xl p-5 flex items-start gap-4">
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
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Progress</h1>

      {/* ── Overview stats ─────────────────────────────────────────────── */}
      {statsLoading ? (
        <p className="text-gray-400 mb-6">Loading stats...</p>
      ) : (
        <>
          <SectionTitle>Overview</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
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
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-gray-900 rounded-xl p-5 flex items-center gap-4">
              <span className="text-4xl">🔥</span>
              <div>
                <p className="text-gray-400 text-xs">Current Streak</p>
                <p className="text-3xl font-bold">
                  {streak.current_streak}
                  <span className="text-gray-400 text-base ml-1">days</span>
                </p>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-5 flex items-center gap-4">
              <span className="text-4xl">🏆</span>
              <div>
                <p className="text-gray-400 text-xs">Longest Streak</p>
                <p className="text-3xl font-bold">
                  {streak.longest_streak}
                  <span className="text-gray-400 text-base ml-1">days</span>
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
          <div className="bg-gray-900 rounded-xl p-5">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="type"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#111827", border: "none", borderRadius: 8,
                  }}
                />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Personal bests ──────────────────────────────────────────────── */}
      {!pbLoading && personalBests.length > 0 && (
        <div className="mb-8">
          <SectionTitle>Personal Bests</SectionTitle>
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs border-b border-gray-800">
                  <th className="text-left px-5 py-3">Exercise</th>
                  <th className="text-right px-5 py-3">Max Weight</th>
                </tr>
              </thead>
              <tbody>
                {personalBests.map((pb) => (
                  <tr
                    key={pb.exercise}
                    className="border-b border-gray-800/50 hover:bg-gray-800/40"
                  >
                    <td className="px-5 py-3 capitalize">{pb.exercise}</td>
                    <td className="px-5 py-3 text-right text-green-400 font-semibold">
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
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm outline-none mb-5 w-full sm:w-64"
          >
            <option value="">Select an exercise...</option>
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name.charAt(0).toUpperCase() + ex.name.slice(1)}
              </option>
            ))}
          </select>

          {!selectedExerciseId ? (
            <p className="text-gray-600 text-sm">
              Select an exercise to see your progress over time.
            </p>
          ) : progressLoading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : !progress || progress.max_weight_over_time.length === 0 ? (
            <p className="text-gray-600 text-sm">
              No data yet for this exercise.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Max weight over time */}
              <div>
                <p className="text-gray-400 text-xs mb-3">Max Weight (kg)</p>
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
                      stroke="#22c55e"
                      dot={{ fill: "#22c55e", r: 3 }}
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
                      dataKey="volume"
                      stroke="#60a5fa"
                      dot={{ fill: "#60a5fa", r: 3 }}
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