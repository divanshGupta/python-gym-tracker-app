import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Flame, Trophy } from "lucide-react";

import {
  useWorkoutStats,
  usePersonalBests,
  useStreak,
  useExerciseProgress,
  useExercises,
} from "@gymtracker/hooks";

import { StatCard, PageSkeleton } from "../components/ui";

// ── Design tokens (match CSS vars) ────────────────────────────────────────
const ACCENT   = "#7C5CFC";
const ACCENT_L = "#9B7EFD";
const BORDER   = "#2C2C2E";
const HINT     = "#636366";

// Bar colour per type — consistent with Workouts page accent bars
const TYPE_COLOUR: Record<string, string> = {
  strength:    ACCENT,
  cardio:      "#22C55E",
  flexibility: "#F59E0B",
  core:        "#EF4444",
};

// ── Shared chart style props ───────────────────────────────────────────────
const AXIS_TICK  = { fill: HINT, fontSize: 11 };
const GRID_PROPS = { strokeDasharray: "3 3" as const, stroke: BORDER };

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.09em] mb-3">
      {children}
    </p>
  );
}

function StreakCard({
  value, label, icon, iconBg,
}: {
  value: number; label: string; icon: React.ReactNode; iconBg: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-surface border border-border-default rounded-xl p-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-[26px] font-bold text-text-primary leading-none tracking-tight">
          {value}
          <span className="text-[13px] font-normal text-text-tertiary ml-1.5">days</span>
        </p>
        <p className="text-[11px] text-text-tertiary mt-1">{label}</p>
      </div>
    </div>
  );
}

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border-default rounded-lg px-3 py-2 text-[12px]">
      <p className="text-text-secondary capitalize mb-0.5">{label}</p>
      <p className="text-text-primary font-semibold">{payload[0].value} sessions</p>
    </div>
  );
}

function LineTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border-default rounded-lg px-3 py-2 text-[12px]">
      <p className="text-text-tertiary mb-0.5">{label}</p>
      <p className="text-text-primary font-semibold">
        {payload[0].value} {unit}
      </p>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="w-10 h-10 rounded-xl bg-elevated border border-border-default flex items-center justify-center text-text-tertiary mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
        </svg>
      </div>
      <p className="text-[13px] text-text-secondary max-w-[220px]">{message}</p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Progress() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | "">("");

  const { data: stats,            isLoading: statsLoading   } = useWorkoutStats();
  const { data: pbData,           isLoading: pbLoading      } = usePersonalBests();
  const { data: exercises = []                               } = useExercises();
  const { data: exerciseProgress, isLoading: progressLoading } = useExerciseProgress(
    selectedExerciseId ? Number(selectedExerciseId) : 0
  );
  const {
    currentStreak, longestStreak,
    isLoading: streakLoading,
    error: streakError,
  } = useStreak();

  const personalBests = pbData?.personal_bests ?? [];
  const typeChartData = stats?.workouts_by_type
    ? Object.entries(stats.workouts_by_type).map(([type, count]) => ({ type, count }))
    : [];

  if (statsLoading && streakLoading) return <PageSkeleton stats={4} rows={0} />;

  return (
    <div className="flex flex-col gap-8">

      {/* ── Header ── */}
      <div>
        <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Progress</h1>
        <p className="text-[13px] text-text-secondary mt-1">Your training stats at a glance</p>
      </div>

      {/* ── Overview stats ── */}
      {!statsLoading && stats && (
        <section>
          <SectionLabel>Overview</SectionLabel>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <StatCard label="Total workouts"  value={stats.total_workouts          ?? "--"} />
            <StatCard label="Total duration"  value={stats.total_duration_minutes  ?? "--"} unit="min"  />
            <StatCard label="Calories burned" value={stats.total_calories_burned   ?? "--"} unit="kcal" />
            <StatCard label="Top exercise"    value={stats.most_logged_exercise    ?? "—"}  />
          </div>
        </section>
      )}

      {/* ── Streak ── */}
      {!streakLoading && !streakError && (
        <section>
          <SectionLabel>Streak</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StreakCard
              value={currentStreak ?? 0}
              label="Current streak"
              iconBg="bg-warning/10"
              icon={<Flame size={18} className="text-warning" />}
            />
            <StreakCard
              value={longestStreak ?? 0}
              label="Longest streak"
              iconBg="bg-accent/10"
              icon={<Trophy size={18} className="text-accent" />}
            />
          </div>
        </section>
      )}

      {/* ── Type breakdown + Personal bests ── */}
      {(typeChartData.length > 0 || (!pbLoading && personalBests.length > 0)) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Bar chart */}
          {typeChartData.length > 0 && (
            <section className="bg-surface border border-border-default rounded-xl p-5">
              <p className="text-[13px] font-semibold text-text-primary">Workouts by type</p>
              <p className="text-[11px] text-text-tertiary mt-0.5 mb-4">Session count per category</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={typeChartData} barCategoryGap="35%">
                  <CartesianGrid {...GRID_PROPS} vertical={false} />
                  <XAxis dataKey="type" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {typeChartData.map((entry) => (
                      <Cell
                        key={entry.type}
                        fill={TYPE_COLOUR[entry.type.toLowerCase()] ?? ACCENT}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </section>
          )}

          {/* Personal bests */}
          {!pbLoading && personalBests.length > 0 && (
            <section className="bg-surface border border-border-default rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default">
                <p className="text-[13px] font-semibold text-text-primary">Personal bests</p>
                <p className="text-[11px] text-text-tertiary">Max weight</p>
              </div>
              <div>
                {personalBests.map((pb, i) => (
                  <div
                    key={pb.exercise}
                    className={[
                      "flex items-center justify-between px-5 py-3 hover:bg-elevated/40 transition-colors",
                      i < personalBests.length - 1 ? "border-b border-border-default/50" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-semibold text-text-tertiary w-4 tabular-nums">
                        {i + 1}
                      </span>
                      <span className="text-[13px] font-medium text-text-primary capitalize">
                        {pb.exercise}
                      </span>
                    </div>
                    <span className="text-[13px] font-bold text-accent tabular-nums">
                      {pb.max_weight_kg} kg
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      )}

      {/* ── Exercise progress ── */}
      <section className="bg-surface border border-border-default rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div>
            <p className="text-[13px] font-semibold text-text-primary">Exercise progress</p>
            <p className="text-[11px] text-text-tertiary mt-0.5">Weight and volume over time</p>
          </div>

          <div className="sm:ml-auto relative">
            <select
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value ? Number(e.target.value) : "")}
              className="h-9 bg-elevated border border-border-default rounded-lg pl-3 pr-8 text-[13px] text-text-primary appearance-none outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors min-w-[200px]"
            >
              <option value="">Select an exercise…</option>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name.charAt(0).toUpperCase() + ex.name.slice(1)}
                </option>
              ))}
            </select>
            {/* Chevron overlay */}
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>

        {!selectedExerciseId ? (
          <EmptyChart message="Select an exercise above to see your progress over time." />
        ) : progressLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-[180px] bg-elevated rounded-xl animate-pulse" />
            <div className="h-[180px] bg-elevated rounded-xl animate-pulse" />
          </div>
        ) : !exerciseProgress || exerciseProgress.max_weight_over_time.length === 0 ? (
          <EmptyChart message="No data yet. Log this exercise in a workout to start tracking." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Max weight */}
            <div>
              <p className="text-[11px] text-text-tertiary mb-3">Max weight (kg)</p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={exerciseProgress.max_weight_over_time}>
                  <CartesianGrid {...GRID_PROPS} />
                  <XAxis dataKey="date" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <Tooltip content={<LineTooltip unit="kg" />} />
                  <Line
                    type="monotone"
                    dataKey="max_weight"
                    stroke={ACCENT}
                    strokeWidth={2}
                    dot={{ fill: ACCENT, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: ACCENT }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Volume */}
            <div>
              <p className="text-[11px] text-text-tertiary mb-3">Volume (sets × reps × weight)</p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={exerciseProgress.volume_over_time}>
                  <CartesianGrid {...GRID_PROPS} />
                  <XAxis dataKey="date" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <Tooltip content={<LineTooltip unit="" />} />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke={ACCENT_L}
                    strokeWidth={2}
                    dot={{ fill: ACCENT_L, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: ACCENT_L }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}
      </section>

    </div>
  );
}