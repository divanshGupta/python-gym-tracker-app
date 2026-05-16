// apps/web/src/pages/Dashboard.tsx
import { Link } from "react-router-dom"
import { useWorkouts, useWorkoutStats, usePersonalBests, useContributions } from "@gymtracker/hooks";
import { useAuthStore } from "@gymtracker/stores";
import { Bell, Flame, Trophy } from "lucide-react";
import { ContributionHeatmap } from "../components/contributions/ContributionHeatmap";

function StatCard({ label, value, unit }: { label: string; value: any; unit?: string }) {
  return (
    <div className="bg-surface rounded-xl p-5 flex flex-col gap-1">
      <p className="text-text-tertiary text-base">{label}</p>
      <p className="text-text-primary text-3xl font-bold">
        {value ?? "--"}
        {unit && <span className="text-text-secondary text-lg ml-1">{unit}</span>}
      </p>
    </div>
  );
}

function WorkoutTypeBar({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const colors: Record<string, string> = {
    Strength:    "bg-green-500",
    Cardio:      "bg-blue-500",
    Flexibility: "bg-yellow-500",
    Core:        "bg-purple-500",
  };
  return (
    <div className="bg-surface rounded-xl p-5">
      <p className="text-text-secondary text-base mb-3">Workouts by Type</p>
      <div className="flex flex-col gap-2">
        {Object.entries(data).map(([type, count]) => (
          <div key={type}>
            <div className="flex justify-between text-base text-text-primary mb-1">
              <span>{type}</span>
              <span>{count}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`${colors[type] || "bg-gray-400"} h-2 rounded-full`}
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  
  const { data: stats, isLoading: statsLoading } = useWorkoutStats();
  const { data: recentWorkouts = [], isLoading: workoutsLoading } = useWorkouts({ page: 1, limit: 5 });
  const { data: pbData } = usePersonalBests();
  const { summary } = useContributions('yearly');
  const { user } = useAuthStore();

  const personalBests = pbData?.personal_bests ?? [];

  // Streak
  const currentStreak = summary?.currentStreak 
  const longestStreak = summary?.longestStreak  
  // const totalWorkoutsCount = summary?.totalCount  
  // const totalActiveDays = summary?.totalActiveDays  

  // Username
  const username = user?.username;
  const capitalizeName = username ? username.charAt(0).toUpperCase() + username.slice(1) : "Athlete";
  const initial = username?.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-void text-text-primary p-6">

      {/* -------------------- HEADER ----------------------- */}
      <div className="flex items-center justify-between mb-4">
        {/* LEFT SIDE */}
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold text-text-primary tracking-tight">
            Welcome back,
            <span className="text-accent">{capitalizeName}</span> 👋
          </h1>

          <p className="text-sm text-text-secondary">
            Ready to crush your goals today?
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* Notification */}
          <button
            className="
              relative
              h-10 w-10
              rounded-full
              bg-surface
              border border-border-default
              flex items-center justify-center
              text-text-secondary
              transition-all duration-200
              hover:bg-elevated
              hover:text-text-primary
            "
          >
            <Bell className="h-5 w-5" />

            {/* Notification Dot */}
            <span
              className="
                absolute
                top-2 right-2
                h-2 w-2
                rounded-full
                bg-accent
              "
            />
          </button>

          {/* Profile */}
          <Link
            to="/profile"
            className="
              flex items-center gap-2
              rounded-full
              p-2
              bg-surface
              border border-border-default
              hover:bg-elevated
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-200
            "
          >
            {/* Avatar */}
            <div
              className="
                h-9 w-9
                rounded-full
                bg-accent-subtle
                flex items-center justify-center
                text-accent
                font-semibold
                text-sm
              "
            >
              {initial}
            </div>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {statsLoading ? (
        <p className="text-text-tertiary">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Workouts" value={stats?.total_workouts} />
          <StatCard label="Total Duration" value={stats?.total_duration_minutes} unit="min" />
          <StatCard label="Calories Burned" value={stats?.total_calories_burned} unit="kcal" />
          <StatCard label="Top Exercise" value={stats?.most_logged_exercise} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Workout Type Breakdown */}
        {stats?.workouts_by_type && Object.keys(stats.workouts_by_type).length > 0 && (
          <WorkoutTypeBar data={stats.workouts_by_type} />
        )}

        {/* Personal Bests */}
        {personalBests.length > 0 && (
          <div className="bg-surface rounded-xl p-5">
            <p className="text-text-tertiary text-base mb-3">Personal Bests</p>
            <div className="flex flex-col gap-2">
              {personalBests.slice(0, 5).map((pb) => (
                <div key={pb.exercise} className="flex justify-between text-sm">
                  <span className="text-text-primary text-lg">{pb.exercise}</span>
                  <span className="text-accent font-semibold text-base">{pb.max_weight_kg} kg</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Streak Cards */}
      {currentStreak && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-surface rounded-xl p-5 flex items-center gap-4">
            <Flame className="h-10 w-10 text-text-secondary" />
            <div>
              <p className="text-text-tertiary text-sm">Current Streak</p>
              <p className="text-text-primary text-3xl font-bold">
                {currentStreak}
                <span className="text-text-tertiary text-lg ml-1">days</span>
              </p>
            </div>
          </div>
          <div className="bg-surface rounded-xl p-5 flex items-center gap-4">
            <Trophy className="h-10 w-10 text-text-secondary" />
            <div>
              <p className="text-text-tertiary text-sm">Longest Streak</p>
              <p className="text-text-primary text-3xl font-bold">
                {longestStreak}
                <span className="text-text-tertiary text-lg ml-1">days</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Workouts */}
      <div className="bg-void rounded-xl ">
        <div className="flex justify-between items-center mb-4">
          <p className="text-text-tertiary text-sm">Recent Workouts</p>
          <Link to="/workouts" className="text-accent text-sm hover:underline">
            View all
          </Link>
        </div>

        {workoutsLoading ? (
          <p className="text-text-tertiary text-sm">Loading...</p>
        ) : recentWorkouts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-tertiary mb-3">No workouts yet</p>
            <Link
              to="/workouts"
              className="bg-accent hover:bg-accent-light text-text-primary px-4 py-2 rounded text-sm"
            >
              Log your first workout
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentWorkouts.map((w) => (
              <Link
                key={w.id}
                to={`/workouts/${w.id}`}
                className="flex justify-between items-center bg-surface px-4 py-3 rounded-lg hover:bg-elevated"
              >
                <div>
                  <p className="text-text-primary font-medium">{w.type}</p>
                  <p className="text-text-tertiary text-xs">{w.date}</p>
                </div>
                <div className="text-right text-sm text-text-tertiary">
                  {w.duration && <p>{w.duration} min</p>}
                  {w.calories && <p>{w.calories} kcal</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* heatmap testing */}
      <ContributionHeatmap />
    </div>
  )
}