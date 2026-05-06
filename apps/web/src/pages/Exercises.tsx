// react/src/pages/Exercises.tsx
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { getExercises, createExercise } from "../api/exercises"
import type { Exercise } from "../types"

const schema = z.object({
  name: z.string().min(2, "Min 2 characters"),
  category: z.string().min(1, "Select a category"),
})

type FormData = z.infer<typeof schema>

const CATEGORIES = ["Strength", "Cardio", "Flexibility", "Core"]

const CATEGORY_COLORS: Record<string, string> = {
  Strength: "bg-green-500/20 text-green-400",
  Cardio: "bg-blue-500/20 text-blue-400",
  Flexibility: "bg-yellow-500/20 text-yellow-400",
  Core: "bg-purple-500/20 text-purple-400",
}

export default function Exercises() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["exercises"],
    queryFn: getExercises,
  })

  const { mutate, isPending, error } = useMutation({
    mutationFn: createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] })
      reset()
      setShowForm(false)
    },
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const exercises: Exercise[] = data?.data || []

  const filtered = exercises.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = filterCategory ? e.category === filterCategory : true
    return matchSearch && matchCategory
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exercises</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm font-semibold"
        >
          {showForm ? "Cancel" : "+ Add Exercise"}
        </button>
      </div>

      {/* Add Exercise Form */}
      {showForm && (
        <div className="bg-gray-900 rounded-xl p-5 mb-6">
          <h2 className="text-white font-semibold mb-4">New Exercise</h2>
          {error && <p className="text-red-400 text-sm mb-3">Exercise already exists or invalid.</p>}
          <form onSubmit={handleSubmit((d) => mutate(d))} className="flex flex-col gap-3">
            <div>
              <input
                {...register("name")}
                placeholder="Exercise name"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <select
                {...register("category")}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="bg-green-500 hover:bg-green-600 py-2 rounded font-semibold text-sm disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add Exercise"}
            </button>
          </form>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400 text-sm"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded text-sm outline-none"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Exercise Grid */}
      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400">No exercises found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((e) => (
            <div key={e.id} className="bg-gray-900 rounded-xl px-4 py-3 flex justify-between items-center">
              <p className="text-white font-medium">{e.name}</p>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[e.category] || "bg-gray-700 text-gray-300"}`}>
                {e.category}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="text-gray-600 text-xs mt-6">{filtered.length} exercises</p>
    </div>
  )
}