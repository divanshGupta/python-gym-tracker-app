import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Ionicons } from "@expo/vector-icons";

import {
  useWorkoutStats,
  usePersonalBests,
  useStreak,
  useExerciseProgress,
  useExercises,
} from "@gymtracker/hooks";
import { tokens } from "../../theme/tokens";

// ── Design tokens (match tokens.ts) ────────────────────────────────────────
const ACCENT   = tokens.colors.accent;
const ACCENT_L = "#9B7EFD";
const BORDER   = tokens.colors.borderDefault;
const HINT     = tokens.colors.textSecondary;
const BG       = tokens.colors.void;
const SURFACE  = tokens.colors.surface;

const TYPE_COLOUR: Record<string, string> = {
  strength:    ACCENT,
  cardio:      "#22C55E",
  flexibility: "#F59E0B",
  core:        "#EF4444",
};

const AXIS_TICK  = { fill: HINT, fontSize: 10 };
const GRID_PROPS = { strokeDasharray: "3 3" as const, stroke: BORDER };

const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth - 32; // 16px padding each side

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-3">
      {children}
    </Text>
  );
}

function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <View className="flex-1 bg-surface border border-border-default rounded-xl p-4">
      <Text className="text-xs text-text-tertiary mb-2">{label}</Text>
      <View className="flex-row items-baseline gap-1">
        <Text className="text-2xl font-bold text-text-primary">
          {value === "--" ? "—" : value}
        </Text>
        {unit && value !== "--" && (
          <Text className="text-xs text-text-tertiary">{unit}</Text>
        )}
      </View>
    </View>
  );
}

function StreakCard({
  value,
  label,
  iconName,
  iconColor,
  iconBg,
}: {
  value: number;
  label: string;
  iconName: string;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <View className="flex-1 flex-row items-center gap-3 bg-surface border border-border-default rounded-xl px-4 py-3.5">
      <View className={`w-10 h-10 rounded-lg items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Ionicons name={iconName as any} size={18} color={iconColor} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-baseline gap-1">
          <Text className="text-2xl font-bold text-text-primary">{value}</Text>
          <Text className="text-xs font-normal text-text-tertiary">days</Text>
        </View>
        <Text className="text-xs text-text-tertiary mt-0.5">{label}</Text>
      </View>
    </View>
  );
}

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <View className="bg-surface border border-border-default rounded-lg px-3 py-2">
      <Text className="text-xs text-text-secondary capitalize mb-1">
        {label}
      </Text>
      <Text className="text-xs font-semibold text-text-primary">
        {payload[0].value} sessions
      </Text>
    </View>
  );
}

function LineTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <View className="bg-surface border border-border-default rounded-lg px-3 py-2">
      <Text className="text-xs text-text-tertiary mb-1">{label}</Text>
      <Text className="text-xs font-semibold text-text-primary">
        {payload[0].value} {unit}
      </Text>
    </View>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <View className="items-center py-8">
      <View className="w-10 h-10 rounded-lg bg-elevated border border-border-default items-center justify-center mb-3">
        <Text className="text-text-tertiary text-sm">📊</Text>
      </View>
      <Text className="text-xs text-text-secondary text-center max-w-xs px-4">
        {message}
      </Text>
    </View>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────

export function ProgressScreen() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
    null
  );

  const { data: stats, isLoading: statsLoading } = useWorkoutStats();
  const { data: pbData, isLoading: pbLoading } = usePersonalBests();
  const { data: exercises = [] } = useExercises();
  const { data: exerciseProgress, isLoading: progressLoading } =
    useExerciseProgress(selectedExerciseId ?? 0);
  const {
    currentStreak,
    longestStreak,
    isLoading: streakLoading,
    error: streakError,
  } = useStreak();

  const personalBests = pbData?.personal_bests ?? [];
  const typeChartData = stats?.workouts_by_type
    ? Object.entries(stats.workouts_by_type).map(([type, count]) => ({
        type,
        count,
      }))
    : [];

  if (statsLoading || streakLoading) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text className="text-2xl font-bold text-text-primary mb-6 tracking-tight">
        Progress
      </Text>

      {/* ── Overview stats ── */}
      {!statsLoading && stats && (
        <View className="mb-6">
          <SectionLabel>Overview</SectionLabel>
          <View className="gap-2">
            <View className="flex-row gap-2">
              <StatCard
                label="Workouts"
                value={stats.total_workouts ?? "--"}
              />
              <StatCard
                label="Duration"
                value={stats.total_duration_minutes ?? "--"}
                unit="min"
              />
            </View>
            <View className="flex-row gap-2">
              <StatCard
                label="Calories"
                value={stats.total_calories_burned ?? "--"}
                unit="kcal"
              />
              <StatCard label="Top exercise" value={stats.most_logged_exercise ?? "—"} />
            </View>
          </View>
        </View>
      )}

      {/* ── Streak ── */}
      {!streakLoading && !streakError && (
        <View className="mb-6">
          <SectionLabel>Streak</SectionLabel>
          <View className="gap-2">
            <StreakCard
              value={currentStreak ?? 0}
              label="Current streak"
              iconName="flame-outline"
              iconColor={tokens.colors.warning}
              iconBg="bg-warning/10"
            />
            <StreakCard
              value={longestStreak ?? 0}
              label="Longest streak"
              iconName="trophy-outline"
              iconColor={tokens.colors.accent}
              iconBg="bg-accent/10"
            />
          </View>
        </View>
      )}

      {/* ── Workouts by type ── */}
      {typeChartData.length > 0 && (
        <View className="mb-6 bg-surface border border-border-default rounded-xl p-4">
          <Text className="text-sm font-semibold text-text-primary mb-1">
            Workouts by type
          </Text>
          <Text className="text-xs text-text-tertiary mb-4">
            Session count per category
          </Text>
          <View style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeChartData} barCategoryGap="35%">
                <CartesianGrid {...GRID_PROPS} vertical={false} />
                <XAxis
                  dataKey="type"
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={30}
                />
                <Tooltip content={<BarTooltip />} />
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
          </View>
        </View>
      )}

      {/* ── Personal bests ── */}
      {!pbLoading && personalBests.length > 0 && (
        <View className="mb-6 bg-surface border border-border-default rounded-xl overflow-hidden">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-border-default">
            <Text className="text-sm font-semibold text-text-primary">
              Personal bests
            </Text>
            <Text className="text-xs text-text-tertiary">Max weight</Text>
          </View>
          {personalBests.map((pb, i) => (
            <View
              key={pb.exercise}
              className={`flex-row items-center justify-between px-4 py-3 ${
                i < personalBests.length - 1 ? "border-b border-border-default/50" : ""
              }`}
            >
              <View className="flex-row items-center gap-3 flex-1">
                <Text className="text-xs font-semibold text-text-tertiary w-5">
                  {i + 1}
                </Text>
                <Text className="text-sm font-medium text-text-primary capitalize flex-1">
                  {pb.exercise}
                </Text>
              </View>
              <Text className="text-sm font-bold text-accent">
                {pb.max_weight_kg} kg
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* ── Exercise progress ── */}
      <View className="mb-6 bg-surface border border-border-default rounded-xl p-4">
        <View className="mb-4">
          <Text className="text-sm font-semibold text-text-primary mb-1">
            Exercise progress
          </Text>
          <Text className="text-xs text-text-tertiary mb-3">
            Weight and volume over time
          </Text>

          {/* Dropdown */}
          <View className="relative">
            <TouchableOpacity
              onPress={() => {
                // Toggle dropdown or open picker — for now, placeholder
                // In production, use react-native-picker or modal
              }}
              className="bg-elevated border border-border-default rounded-lg px-3 py-2.5"
            >
              <Text className="text-sm text-text-primary">
                {selectedExerciseId
                  ? exercises.find((e) => e.id === selectedExerciseId)?.name ||
                    "Select an exercise…"
                  : "Select an exercise…"}
              </Text>
            </TouchableOpacity>

            {/* Simple dropdown list — rendered below for demo */}
            {exercises.length > 0 && (
              <View className="mt-2 bg-elevated border border-border-default rounded-lg overflow-hidden max-h-40">
                <ScrollView className="flex-1" nestedScrollEnabled>
                  {exercises.map((ex) => (
                    <TouchableOpacity
                      key={ex.id}
                      onPress={() => setSelectedExerciseId(ex.id)}
                      className="px-3 py-2 border-b border-border-default/30"
                    >
                      <Text
                        className={`text-sm ${
                          selectedExerciseId === ex.id
                            ? "font-semibold text-accent"
                            : "text-text-primary"
                        }`}
                      >
                        {ex.name.charAt(0).toUpperCase() + ex.name.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Charts */}
        {!selectedExerciseId ? (
          <EmptyChart message="Select an exercise above to see your progress over time." />
        ) : progressLoading ? (
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="small" color={ACCENT} />
          </View>
        ) : !exerciseProgress || exerciseProgress.max_weight_over_time.length === 0 ? (
          <EmptyChart message="No data yet. Log this exercise to start tracking." />
        ) : (
          <View className="gap-4">
            {/* Max weight chart */}
            <View>
              <Text className="text-xs text-text-tertiary mb-2">Max weight (kg)</Text>
              <View style={{ height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={exerciseProgress.max_weight_over_time}>
                    <CartesianGrid {...GRID_PROPS} />
                    <XAxis
                      dataKey="date"
                      tick={AXIS_TICK}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={AXIS_TICK}
                      axisLine={false}
                      tickLine={false}
                      width={30}
                    />
                    <Tooltip content={<LineTooltip unit="kg" />} />
                    <Line
                      type="monotone"
                      dataKey="max_weight"
                      stroke={ACCENT}
                      strokeWidth={2}
                      dot={{ fill: ACCENT, r: 3 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </View>
            </View>

            {/* Volume chart */}
            <View>
              <Text className="text-xs text-text-tertiary mb-2">
                Volume (sets × reps × weight)
              </Text>
              <View style={{ height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={exerciseProgress.volume_over_time}>
                    <CartesianGrid {...GRID_PROPS} />
                    <XAxis
                      dataKey="date"
                      tick={AXIS_TICK}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={AXIS_TICK}
                      axisLine={false}
                      tickLine={false}
                      width={30}
                    />
                    <Tooltip content={<LineTooltip unit="" />} />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke={ACCENT_L}
                      strokeWidth={2}
                      dot={{ fill: ACCENT_L, r: 3 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Bottom padding for scroll */}
      <View className="h-6" />
    </ScrollView>
  );
}
