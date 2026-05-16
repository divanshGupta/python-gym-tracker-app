// apps/web/src/pages/Profile.tsx
import { useNavigate } from "react-router-dom"

// shared packages
import { useWorkoutStats } from "@gymtracker/hooks"
import { useAuthStore } from "@gymtracker/stores";

export default function Profile() {
  const { data: stats, isLoading } = useWorkoutStats();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate()

  // const logout = () => {
  //   authStore.removeToken()
  //   navigate("/login")
  // }

  const handleLogout = async () => {
    await logout();
    navigate("/login")
  }

  if (isLoading) return <div className="min-h-screen bg-void px-6 py-8 text-text-secondary">Loading...</div>
  if (!user) return <div className="min-h-screen bg-void px-6 py-8 text-text-secondary">User not found.</div>

  return (

    <div className="bg-void">
      <div className="min-h-screen max-w-4xl mx-auto bg-void px-4 py-6 sm:px-6 sm:py-8 text-text-primary">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-text-primary">Profile</h1>

        {/* Avatar + Info */}
        <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-border-default bg-surface p-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-subtle text-2xl font-semibold text-accent">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xl font-semibold text-text-primary">{user.username}</p>
            <p className="truncate text-sm text-text-secondary">{user.email}</p>
            <p className="mt-2 text-xs text-text-tertiary">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Workouts", value: stats.total_workouts },
              { label: "Minutes", value: stats.total_duration_minutes },
              { label: "Calories", value: stats.total_calories_burned },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border-default bg-surface p-5 text-center transition-all duration-200 hover:bg-elevated/30">
                <p className="text-2xl font-semibold tracking-tight text-text-primary">{s.value}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Workout Type Breakdown */}
        {stats && Object.keys(stats.workouts_by_type).length > 0 && (
          <div className="mb-8 rounded-2xl border border-border-default bg-surface p-6">
            <p className="mb-5 text-sm font-medium text-text-secondary">Workout Breakdown</p>
            {Object.entries(stats.workouts_by_type).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between border-b border-border-default py-3 text-sm last:border-0">
                <span className="capitalize text-text-primary">{type}</span>
                <span className="font-medium text-accent">{count} sessions</span>
              </div>
            ))}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full rounded-xl bg-danger py-3 text-sm font-semibold text-text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
        >
          Logout
        </button>
      </div>
    </div>
  )
}