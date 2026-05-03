import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { useSearchParams } from "react-router-dom"
import { getExercises } from "../api/exercises"
import { getExerciseProgress } from "../api/workouts"
import type { Exercise } from "../types"

export default function Progress() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [localId, setLocalId] = useState<number | null>(null)

  // URL param always wins; local state only used after user picks from dropdown
  const urlId = Number(searchParams.get("exercise")) || null
  const selectedId = localId ?? urlId

  console.log("urlId:", urlId, "localId:", localId, "selectedId:", selectedId)

  const { data: exercisesRes } = useQuery({
    queryKey: ["exercises"],
    queryFn: getExercises,
  })

  const { data: progressRes, isLoading } = useQuery({
    queryKey: ["progress", selectedId],
    queryFn: () => getExerciseProgress(selectedId!),
    enabled: !!selectedId,
  })

  const exercises: Exercise[] = exercisesRes?.data || []
  const progress = progressRes?.data

  const hasData = progress && progress.max_weight_over_time.length > 0

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Progress Charts</h1>

      {/* Exercise Selector */}
      <div className="mb-6">
        <label className="text-gray-400 text-sm mb-2 block">Select Exercise</label>
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400 w-full max-w-sm"
          value={selectedId || ""}
          // dropdown onChange:
          onChange={(e) => {
            const id = Number(e.target.value) || null
            setLocalId(id)
            if (id) setSearchParams({ exercise: String(id) })
            else setSearchParams({})
          }}
        >
          <option value="">Choose an exercise...</option>
          {exercises.map((e) => (
            <option key={e.id} value={e.id}>{e.name} ({e.category})</option>
          ))}
        </select>
      </div>

      {!selectedId && (
        <div className="text-center py-20 text-gray-500">
          Select an exercise to see your progress
        </div>
      )}

      {isLoading && <p className="text-gray-400">Loading...</p>}

      {selectedId && !isLoading && !hasData && (
        <div className="text-center py-20 text-gray-500">
          No weight data found for this exercise yet.
        </div>
      )}

      {hasData && (
        <div className="flex flex-col gap-8">

          {/* Max Weight Chart */}
          <div className="bg-gray-900 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-6">Max Weight Over Time (kg)</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={progress.max_weight_over_time}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  tickFormatter={(d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} unit=" kg" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px" }}
                  labelStyle={{ color: "#9CA3AF" }}
                  itemStyle={{ color: "#34D399" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="max_weight"
                  name="Max Weight (kg)"
                  stroke="#34D399"
                  strokeWidth={2}
                  dot={{ fill: "#34D399", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Volume Chart */}
          {progress.volume_over_time.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-6">Training Volume Over Time (sets × reps × kg)</p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={progress.volume_over_time}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickFormatter={(d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  />
                  <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px" }}
                    labelStyle={{ color: "#9CA3AF" }}
                    itemStyle={{ color: "#60A5FA" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    name="Volume"
                    stroke="#60A5FA"
                    strokeWidth={2}
                    dot={{ fill: "#60A5FA", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  )
}