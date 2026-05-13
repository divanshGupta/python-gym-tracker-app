// apps/web/src/pages/Measurements.tsx
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { getMeasurements, logMeasurement, deleteMeasurement } from "../api/measurements"

function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400" }
  if (bmi < 25)   return { label: "Normal", color: "text-green-400" }
  if (bmi < 30)   return { label: "Overweight", color: "text-yellow-400" }
  return { label: "Obese", color: "text-red-400" }
}

export default function Measurements() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weight_kg: "",
    height_cm: "",
    notes: "",
  })

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["measurements"],
    queryFn: getMeasurements,
  })

  const { mutate: log, isPending } = useMutation({
    mutationFn: logMeasurement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] })
      setShowForm(false)
      setForm({ date: new Date().toISOString().split("T")[0], weight_kg: "", height_cm: "", notes: "" })
    },
  })

  const { mutate: remove } = useMutation({
    mutationFn: deleteMeasurement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["measurements"] }),
  })

  const handleSubmit = () => {
    if (!form.weight_kg) return
    log({
      date: form.date,
      weight_kg: parseFloat(form.weight_kg),
      height_cm: form.height_cm ? parseFloat(form.height_cm) : undefined,
      notes: form.notes || undefined,
    })
  }

  // Chart data — oldest first
  const chartData = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({ date: e.date, Weight: e.weight_kg, BMI: e.bmi ?? undefined }))

  const latest = [...entries].sort(
    (a, b) => b.date.localeCompare(a.date)
  )[0]

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Body Measurements</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm font-semibold"
        >
          + Log Entry
        </button>
      </div>

      {/* Summary cards */}
      {latest && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-900 rounded-xl px-4 py-3">
            <p className="text-gray-400 text-xs mb-1">Current Weight</p>
            <p className="text-xl font-bold">{latest.weight_kg} <span className="text-sm font-normal text-gray-400">kg</span></p>
          </div>
          {latest.bmi && (
            <div className="bg-gray-900 rounded-xl px-4 py-3">
              <p className="text-gray-400 text-xs mb-1">BMI</p>
              <p className="text-xl font-bold">
                {latest.bmi}{" "}
                <span className={`text-sm font-normal ${bmiCategory(latest.bmi).color}`}>
                  {bmiCategory(latest.bmi).label}
                </span>
              </p>
            </div>
          )}
          {entries.length > 1 && (
            <div className="bg-gray-900 rounded-xl px-4 py-3">
              <p className="text-gray-400 text-xs mb-1">Change</p>
              {(() => {
                const sorted = [...entries].sort((a,b)=>
                  a.date.localeCompare(b.date)
                )

                const first = sorted[0]
                const latest = sorted[sorted.length - 1]

                const diff = latest.weight_kg - first.weight_kg
                const sign = diff > 0 ? "+" : ""
                const color = diff > 0 ? "text-red-400" : "text-green-400"
                return <p className={`text-xl font-bold ${color}`}>{sign}{diff.toFixed(1)} kg</p>
              })()}
            </div>
          )}
        </div>
      )}

      {/* Log form */}
      {showForm && (
        <div className="bg-gray-900 rounded-xl p-5 mb-6">
          <h2 className="font-semibold mb-4">New Entry</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="bg-gray-800 px-3 py-2 rounded text-sm outline-none"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Weight (kg)"
              value={form.weight_kg}
              onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
              className="bg-gray-800 px-3 py-2 rounded text-sm outline-none"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Height cm (optional — used for BMI)"
              value={form.height_cm}
              onChange={(e) => setForm({ ...form, height_cm: e.target.value })}
              className="bg-gray-800 px-3 py-2 rounded text-sm outline-none"
            />
            <input
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="bg-gray-800 px-3 py-2 rounded text-sm outline-none"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm font-semibold disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-gray-400 text-sm hover:text-white px-4 py-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Charts */}
      {chartData.length > 1 && (
        <div className="bg-gray-900 rounded-xl p-5 mb-6">
          <h2 className="font-semibold mb-4 text-sm text-gray-400">Weight over time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#111827", border: "none", borderRadius: 8 }} />
              <Line type="monotone" dataKey="Weight" stroke="#22c55e" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartData.some((d) => d.BMI !== undefined) && chartData.length > 1 && (
        <div className="bg-gray-900 rounded-xl p-5 mb-6">
          <h2 className="font-semibold mb-4 text-sm text-gray-400">BMI over time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: "#111827", border: "none", borderRadius: 8 }} />
              <Line type="monotone" dataKey="BMI" stroke="#60a5fa" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History table */}
      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : entries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No measurements logged yet</p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-800">
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Weight</th>
                <th className="text-left px-5 py-3">BMI</th>
                <th className="text-left px-5 py-3">Notes</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-gray-800/50 hover:bg-gray-800/40">
                  <td className="px-5 py-3">{e.date}</td>
                  <td className="px-5 py-3">{e.weight_kg} kg</td>
                  <td className="px-5 py-3">
                    {e.bmi ? (
                      <span className={bmiCategory(e.bmi).color}>{e.bmi}</span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-400 max-w-xs truncate">{e.notes || "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => confirm("Delete entry?") && remove(e.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}