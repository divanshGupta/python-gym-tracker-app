import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

import {
  useWorkoutStats,
  usePersonalBests,
  useStreak,
  useExerciseProgress,
  useExercises,
} from "@gymtracker/hooks";
import { tokens } from "../../theme/tokens";
import {
  ScreenContainer, AppHeader, AppCard, StatCard, EmptyState, SectionHeader
} from "../../components/ui";

const ACCENT   = (tokens?.colors?.accent as string)        || "#7C5CFC";
const ACCENT_L = "#9B7EFD";
const HINT     = (tokens?.colors?.textSecondary as string)  || "#636366";
const BG       = (tokens?.colors?.void as string)     || "#141414";

const screenWidth = Dimensions.get("window").width;
const CHART_WIDTH = screenWidth - 32; // 16px padding each side
const CHART_HEIGHT = 160;

// Shared chart config for react-native-chart-kit
const baseChartConfig = {
  backgroundGradientFrom:    BG,
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo:      BG,
  backgroundGradientToOpacity: 0,
  color:        (opacity = 1) => `rgba(124, 92, 252, ${opacity})`,
  labelColor:   (opacity = 1) => `rgba(99, 99, 102, ${opacity})`,
  strokeWidth:  2,
  barPercentage: 0.6,
  decimalPlaces: 0,
  propsForDots: {
    r: "4",
    strokeWidth: "0",
    fill: ACCENT,
  },
  propsForBackgroundLines: {
    stroke: "#2C2C2E",
    strokeDasharray: "4",
  },
};

// ── Sub-components ────────────────────────────────────────────────────────

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
    <AppCard className="flex-1 flex-row items-center p-3.5" style={{ gap: 10 }}>
      <View className={`w-10 h-10 rounded-lg items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Ionicons name={iconName as any} size={18} color={iconColor} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-baseline gap-0.5">
          <Text className="text-2xl font-bold text-text-primary">{value}</Text>
          <Text className="text-2xs font-medium text-text-tertiary uppercase ml-0.5">days</Text>
        </View>
        <Text className="text-2xs font-semibold text-text-tertiary uppercase tracking-wide mt-0.5">{label}</Text>
      </View>
    </AppCard>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────

export default function ProgressScreen() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: stats,           isLoading: statsLoading    } = useWorkoutStats();
  const { data: pbData,          isLoading: pbLoading       } = usePersonalBests();
  const { data: exercises = []                               } = useExercises();
  const { data: exerciseProgress, isLoading: progressLoading } = useExerciseProgress(selectedExerciseId ?? 0);
  const {
    currentStreak,
    longestStreak,
    isLoading: streakLoading,
    error: streakError,
  } = useStreak();

  const personalBests  = pbData?.personal_bests ?? [];
  const typeChartData  = stats?.workouts_by_type
    ? Object.entries(stats.workouts_by_type).map(([type, count]) => ({ type, count: count as number }))
    : [];

  // ── react-native-chart-kit data shapes ───────────────────────────────
  const barChartData = {
    labels: typeChartData.map((d) => d.type.charAt(0).toUpperCase() + d.type.slice(0, 3)),
    datasets: [{ data: typeChartData.map((d) => d.count) }],
  };

  const weightChartData = exerciseProgress?.max_weight_over_time?.length
    ? {
        labels: exerciseProgress.max_weight_over_time.map((d: any) =>
          d.date?.slice(5) ?? ""   // "2026-05-11" → "05-11"
        ),
        datasets: [{ data: exerciseProgress.max_weight_over_time.map((d: any) => d.max_weight), color: () => ACCENT }],
      }
    : null;

  const volumeChartData = exerciseProgress?.volume_over_time?.length
    ? {
        labels: exerciseProgress.volume_over_time.map((d: any) =>
          d.date?.slice(5) ?? ""
        ),
        datasets: [{ data: exerciseProgress.volume_over_time.map((d: any) => d.volume), color: () => ACCENT_L }],
      }
    : null;

  if (statsLoading || streakLoading) {
    return (
      <View className="flex-1 bg-void items-center justify-center">
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-void">
      {/* Header */}
      <AppHeader
        title="Progress"
        safeArea
      />
      <ScreenContainer
        scrollable
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >

        {/* Overview stats */}
        {stats && (
          <View className="mb-6" >
            <SectionHeader title="Overview" />
            <View style={{ gap: 12 }}>
              <View className="flex-row" style={{ gap: 12 }}>
                <StatCard label="Workouts" value={stats.total_workouts ?? "--"} />
                <StatCard label="Duration" value={stats.total_duration_minutes ?? "--"} unit="min" />
              </View>
              <View className="flex-row" style={{ gap: 12 }}>
                <StatCard label="Calories" value={stats.total_calories_burned ?? "--"} unit="kcal" />
                <StatCard label="Top exercise" value={stats.most_logged_exercise ?? "—"} />
              </View>
            </View>
          </View>
        )}

        {/* Streak */}
        {!streakLoading && !streakError && (
          <View className="mb-6">
            <SectionHeader title="Streak" />
            <View className="flex-row" style={{ gap: 12 }}>
              <StreakCard
                value={currentStreak ?? 0}
                label="Current"
                iconName="flame-outline"
                iconColor={(tokens?.colors?.warning as string) || "#F59E0B"}
                iconBg="bg-warning/10"
              />
              <StreakCard
                value={longestStreak ?? 0}
                label="Longest"
                iconName="trophy-outline"
                iconColor={ACCENT}
                iconBg="bg-accent/10"
              />
            </View>
          </View>
        )}

        {/* Workouts by type */}
        {typeChartData.length > 0 && (
          <AppCard className="mb-6">
            <Text className="text-sm font-semibold text-text-primary mb-0.5">
              Workouts by type
            </Text>
            <Text className="text-2xs text-text-tertiary mb-4 uppercase tracking-wider font-semibold">
              Session count per category
            </Text>
            <BarChart
              data={barChartData}
              width={CHART_WIDTH - 32}
              height={CHART_HEIGHT}
              chartConfig={{
                ...baseChartConfig,
                color: (opacity = 1) => `rgba(124, 92, 252, ${opacity})`,
              }}
              style={{ borderRadius: 8, marginLeft: -16 }}
              showValuesOnTopOfBars
              withInnerLines
              fromZero
              yAxisLabel=""
              yAxisSuffix=""
            />
          </AppCard>
        )}

        {/* Personal bests */}
        {!pbLoading && personalBests.length > 0 && (
          <AppCard className="mb-6 p-0 overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-border-default bg-elevated/20">
              <Text className="text-sm font-semibold text-text-primary">
                Personal bests
              </Text>
              <Text className="text-2xs font-semibold text-text-tertiary uppercase tracking-wider">Max weight</Text>
            </View>
            {personalBests.map((pb: any, i: number) => (
              <View
                key={pb.exercise}
                className={`flex-row items-center justify-between px-4 py-3.5 ${
                  i < personalBests.length - 1 ? "border-b border-border-default/50" : ""
                }`}
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <Text className="text-2xs font-bold text-text-tertiary w-5 text-center">
                    {i + 1}
                  </Text>
                  <Text className="text-sm font-semibold text-text-primary capitalize flex-1">
                    {pb.exercise}
                  </Text>
                </View>
                <Text className="text-sm font-bold text-accent">
                  {pb.max_weight_kg} kg
                </Text>
              </View>
            ))}
          </AppCard>
        )}

        {/* Exercise progress */}
        <AppCard className="mb-6">
          <Text className="text-sm font-semibold text-text-primary mb-0.5">
            Exercise progress
          </Text>
          <Text className="text-2xs text-text-tertiary mb-3.5 uppercase tracking-wider font-semibold">
            Weight and volume over time
          </Text>

          {/* Exercise picker */}
          <TouchableOpacity
            onPress={() => setDropdownOpen((prev) => !prev)}
            className="bg-elevated border border-border-default rounded-xl px-4 flex-row items-center justify-between mb-2"
            style={{ height: 48 }}
            activeOpacity={0.8}
          >
            <Text className="text-sm text-text-primary font-medium">
              {selectedExerciseId
                ? exercises.find((e: any) => e.id === selectedExerciseId)?.name ?? "Select an exercise…"
                : "Select an exercise…"}
            </Text>
            <Ionicons
              name={dropdownOpen ? "chevron-up-outline" : "chevron-down-outline"}
              size={16}
              color={HINT}
            />
          </TouchableOpacity>

          {/* Dropdown list */}
          {dropdownOpen && (
            <View className="bg-elevated border border-border-default rounded-xl overflow-hidden mb-4">
              <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                {exercises.map((ex: any) => (
                  <TouchableOpacity
                    key={ex.id}
                    onPress={() => {
                      setSelectedExerciseId(ex.id);
                      setDropdownOpen(false);
                    }}
                    className={`px-4 py-3 border-b border-border-default/30 ${
                      selectedExerciseId === ex.id ? "bg-accent/10" : ""
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        selectedExerciseId === ex.id
                          ? "font-semibold text-accent"
                          : "text-text-primary font-medium"
                      }`}
                    >
                      {ex.name.charAt(0).toUpperCase() + ex.name.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Charts or Empty States */}
          {!selectedExerciseId ? (
            <View className="mt-2">
              <EmptyState
                title="No exercise selected"
                description="Select an exercise above to see your progress over time."
                iconName="stats-chart-outline"
              />
            </View>
          ) : progressLoading ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="small" color={ACCENT} />
            </View>
          ) : !weightChartData ? (
            <View className="mt-2">
              <EmptyState
                title="No data yet"
                description="No data yet. Log this exercise to start tracking."
                iconName="barbell-outline"
              />
            </View>
          ) : (
            <View className="gap-6 mt-2">
              {/* Max weight */}
              <View>
                <Text className="text-2xs font-semibold text-text-tertiary uppercase tracking-wider mb-3 px-0.5">Max weight (kg)</Text>
                <LineChart
                  data={weightChartData}
                  width={CHART_WIDTH - 64}
                  height={CHART_HEIGHT}
                  chartConfig={baseChartConfig}
                  bezier
                  style={{ borderRadius: 8, marginLeft: -16 }}
                  withDots
                  withInnerLines
                  withOuterLines={false}
                  withShadow={false}
                  yAxisLabel=""
                  yAxisSuffix=" kg"
                />
              </View>

              {/* Volume */}
              <View>
                <Text className="text-2xs font-semibold text-text-tertiary uppercase tracking-wider mb-3 px-0.5">
                  Volume (sets × reps × weight)
                </Text>
                <LineChart
                  data={volumeChartData!}
                  width={CHART_WIDTH - 64}
                  height={CHART_HEIGHT}
                  chartConfig={{
                    ...baseChartConfig,
                    color: (opacity = 1) => `rgba(155, 126, 253, ${opacity})`,
                    propsForDots: {
                      r: "4",
                      strokeWidth: "0",
                      fill: ACCENT_L,
                    },
                  }}
                  bezier
                  style={{ borderRadius: 8, marginLeft: -16 }}
                  withDots
                  withInnerLines
                  withOuterLines={false}
                  withShadow={false}
                  yAxisLabel=""
                  yAxisSuffix=""
                />
              </View>
            </View>
          )}
        </AppCard>
      </ScreenContainer>
    </View>
  );
}