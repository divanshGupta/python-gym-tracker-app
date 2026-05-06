import { useQuery } from "@tanstack/react-query"
import { getProfile } from "../api/auth"
import { getStats } from "../api/workouts"
import type { User } from "../types"
import type { Stats } from "../types"
import authStore from "../store/authStore"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const navigate = useNavigate()

  const { data: profileRes, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  })

  const { data: statsRes } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  })

  const user: User | undefined = profileRes?.data
  const stats: Stats | undefined = statsRes?.data

  const logout = () => {
    authStore.removeToken()
    navigate("/login")
  }

  if (isLoading) return <div className="min-h-screen bg-gray-950 text-gray-400 p-6">Loading...</div>
  if (!user) return <div className="min-h-screen bg-gray-950 text-gray-400 p-6">User not found.</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* Avatar + Info */}
      <div className="bg-gray-900 rounded-xl p-6 flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-2xl font-bold text-white">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white text-xl font-semibold">{user.username}</p>
          <p className="text-gray-400 text-sm">{user.email}</p>
          <p className="text-gray-500 text-xs mt-1">
            Member since {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Workouts", value: stats.total_workouts },
            { label: "Minutes", value: stats.total_duration_minutes },
            { label: "Calories", value: stats.total_calories_burned },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 rounded-xl p-4 text-center">
              <p className="text-white text-xl font-bold">{s.value}</p>
              <p className="text-gray-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Workout Type Breakdown */}
      {stats && Object.keys(stats.workouts_by_type).length > 0 && (
        <div className="bg-gray-900 rounded-xl p-5 mb-6">
          <p className="text-gray-400 text-sm mb-3">Workout Breakdown</p>
          {Object.entries(stats.workouts_by_type).map(([type, count]) => (
            <div key={type} className="flex justify-between text-sm py-1 border-b border-gray-800 last:border-0">
              <span className="text-white">{type}</span>
              <span className="text-green-400 font-semibold">{count} sessions</span>
            </div>
          ))}
        </div>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-semibold text-sm"
      >
        Logout
      </button>
    </div>
  )
}