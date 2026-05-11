// apps/web/src/pages/Dashboard.tsx
import { Link } from "react-router-dom"
import { useWorkouts, useWorkoutStats, usePersonalBests, useStreak } from "@gymtracker/hooks";

function StatCard({ label, value, unit }: { label: string; value: any; unit?: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-5 flex flex-col gap-1">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white text-3xl font-bold">
        {value ?? "--"}
        {unit && <span className="text-gray-400 text-lg ml-1">{unit}</span>}
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
    <div className="bg-gray-900 rounded-xl p-5">
      <p className="text-gray-400 text-sm mb-3">Workouts by Type</p>
      <div className="flex flex-col gap-2">
        {Object.entries(data).map(([type, count]) => (
          <div key={type}>
            <div className="flex justify-between text-sm text-white mb-1">
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
  const { data: streak } = useStreak();

  const personalBests = pbData?.personal_bests ?? [];

  return (
    <div className="min-h-screen bg-void text-text-primary p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      {statsLoading ? (
        <p className="text-gray-400">Loading stats...</p>
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
          <div className="bg-gray-900 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-3">Personal Bests</p>
            <div className="flex flex-col gap-2">
              {personalBests.slice(0, 5).map((pb) => (
                <div key={pb.exercise} className="flex justify-between text-sm">
                  <span className="text-white">{pb.exercise}</span>
                  <span className="text-green-400 font-semibold">{pb.max_weight_kg} kg</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Streak Cards */}
      {streak && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-5 flex items-center gap-4">
            <span className="text-4xl">🔥</span>
            <div>
              <p className="text-gray-400 text-sm">Current Streak</p>
              <p className="text-white text-3xl font-bold">
                {streak.current_streak}
                <span className="text-gray-400 text-lg ml-1">days</span>
              </p>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 flex items-center gap-4">
            <span className="text-4xl">🏆</span>
            <div>
              <p className="text-gray-400 text-sm">Longest Streak</p>
              <p className="text-white text-3xl font-bold">
                {streak.longest_streak}
                <span className="text-gray-400 text-lg ml-1">days</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Workouts */}
      <div className="bg-gray-900 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-400 text-sm">Recent Workouts</p>
          <Link to="/workouts" className="text-green-400 text-sm hover:underline">
            View all
          </Link>
        </div>

        {workoutsLoading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : recentWorkouts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-3">No workouts yet</p>
            <Link
              to="/workouts"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
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
                className="flex justify-between items-center bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-700"
              >
                <div>
                  <p className="text-white font-medium">{w.type}</p>
                  <p className="text-gray-400 text-xs">{w.date}</p>
                </div>
                <div className="text-right text-sm text-gray-400">
                  {w.duration && <p>{w.duration} min</p>}
                  {w.calories && <p>{w.calories} kcal</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}