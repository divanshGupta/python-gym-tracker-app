// apps/web/src/pages/Measurements.tsx
import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ── Shared packages ────────────────────────────────────────────────────────
import { useMeasurements, useLogMeasurement, useDeleteMeasurement } from "@gymtracker/hooks";
import type { Measurement } from "@gymtracker/types";

// ── Helpers ────────────────────────────────────────────────────────────────
function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400"   };
  if (bmi < 25)   return { label: "Normal",       color: "text-green-400"  };
  if (bmi < 30)   return { label: "Overweight",   color: "text-yellow-400" };
  return               { label: "Obese",          color: "text-red-400"   };
}

const EMPTY_FORM = {
  date:      new Date().toISOString().split("T")[0],
  weight_kg: "",
  height_cm: "",
  notes:     "",
};

export default function Measurements() {
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);

  // ── Data ──────────────────────────────────────────────────────────────
  const { data: entries = [], isLoading } = useMeasurements();

  // ── Mutations ─────────────────────────────────────────────────────────
  const { mutate: log,    isPending } = useLogMeasurement();
  const { mutate: remove }            = useDeleteMeasurement();

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!form.weight_kg) return;
    log(
      {
        date:      form.date,
        weight_kg: parseFloat(form.weight_kg),
        height_cm: form.height_cm ? parseFloat(form.height_cm) : undefined,
        notes:     form.notes     || undefined,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setForm(EMPTY_FORM);
        },
      }
    );
  };

  // ── Derived data ───────────────────────────────────────────────────────
  // Chart needs oldest → newest
  const chartData = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({
      date:   e.date,
      Weight: e.weight_kg,
      BMI:    e.bmi ?? undefined,
    }));

  // Latest entry = first in list (backend orders by date desc)
  const latest: Measurement | undefined = entries[0];

  // Weight change: last entry minus first entry (chronological)
  const weightChange = (() => {
    if (entries.length < 2) return null;
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const diff   = sorted[sorted.length - 1].weight_kg - sorted[0].weight_kg;
    return { diff, sign: diff > 0 ? "+" : "", color: diff > 0 ? "text-red-400" : "text-green-400" };
  })();

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-void px-4 py-6 sm:px-6 sm:py-8 text-text-primary">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Body Measurements</h1>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        >
          + Log Entry
        </button>
      </div>

      {/* Summary cards */}
      {latest && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-border-default bg-surface p-5 transition-all duration-200 hover:bg-elevated/30">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">Current Weight</p>
            <p className="text-2xl font-semibold tracking-tight text-text-primary">
              {latest.weight_kg}{" "}
              <span className="text-sm font-normal text-text-secondary">kg</span>
            </p>
          </div>

          {latest.bmi && (
            <div className="rounded-2xl border border-border-default bg-surface p-5 transition-all duration-200 hover:bg-elevated/30">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">BMI</p>
              <p className="text-2xl font-semibold tracking-tight text-text-primary">
                {latest.bmi}{" "}
                <span className={`text-sm font-normal ${bmiCategory(latest.bmi).color}`}>
                  {bmiCategory(latest.bmi).label}
                </span>
              </p>
            </div>
          )}

          {weightChange && (
            <div className="rounded-2xl border border-border-default bg-surface p-5 transition-all duration-200 hover:bg-elevated/30">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">Change</p>
              <p className={`text-2xl font-semibold tracking-tight text-text-primary ${weightChange.color}`}>
                {weightChange.sign}{weightChange.diff.toFixed(1)} kg
              </p>
            </div>
          )}
        </div>
      )}

      {/* Log form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-border-default bg-surface p-6">
          <h2 className="mb-5 text-lg font-semibold tracking-tight text-text-primary">New Entry</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Weight (kg)"
              value={form.weight_kg}
              onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
              className="rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Height cm (optional — used for BMI)"
              value={form.height_cm}
              onChange={(e) => setForm({ ...form, height_cm: e.target.value })}
              className="rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <input
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-text-primary transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-border-default bg-surface px-4 py-2.5 text-sm text-text-secondary transition-all duration-200 hover:bg-elevated hover:text-text-primary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Weight chart */}
      {chartData.length > 1 && (
        <div className="mb-8 rounded-2xl border border-border-default bg-surface p-6">
          <h2 className="mb-5 text-sm font-medium text-text-secondary">
            Weight over time
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2E" />
              <XAxis dataKey="date" tick={{ fill: "#8E8E93", fontSize: 11 }} />
              <YAxis tick={{ fill: "#8E8E93", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#1C1C1E", border: "none", borderRadius: 12 }}
              />
              <Line
                type="monotone" dataKey="Weight"
                stroke="#7C5CFC" dot={false} strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* BMI chart — only if we have BMI data */}
      {chartData.some((d) => d.BMI !== undefined) && chartData.length > 1 && (
        <div className="mb-8 rounded-2xl border border-border-default bg-surface p-6">
          <h2 className="mb-5 text-sm font-medium text-text-secondary">BMI over time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{ background: "#111827", border: "none", borderRadius: 8 }}
              />
              <Line
                type="monotone" dataKey="BMI"
                stroke="#9B7EFD" dot={false} strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History table */}
      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-border-default bg-surface py-20 text-center">
          <p className="text-sm text-text-secondary">No measurements logged yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border-default bg-surface">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border-default text-xs uppercase tracking-wide text-text-tertiary">
                <th className="px-4 py-4 sm:px-5">Date</th>
                <th className="px-4 py-4 sm:px-5">Weight</th>
                <th className="px-4 py-4 sm:px-5">BMI</th>
                <th className="px-4 py-4 sm:px-5">Notes</th>
                <th className="px-4 py-4 sm:px-5" />
              </tr>
            </thead>
            <tbody>
              {entries.map((e: Measurement) => (
                <tr
                  key={e.id}
                  className="border-b border-border-default/50 transition-colors hover:bg-elevated/30"
                >
                  <td className="px-4 py-4 sm:px-5">{e.date}</td>
                  <td className="px-4 py-4 sm:px-5">{e.weight_kg} kg</td>
                  <td className="px-4 py-4 sm:px-5">
                    {e.bmi ? (
                      <span className={bmiCategory(e.bmi).color}>{e.bmi}</span>
                    ) : (
                      <span className="text-text-tertiary">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 max-w-45 truncate text-text-secondary sm:max-w-xs">
                    {e.notes || "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => confirm("Delete entry?") && remove(e.id)}
                      className="text-sm font-medium text-danger transition-colors hover:opacity-80"
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
  );
}