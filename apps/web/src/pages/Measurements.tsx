import { useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import { useMeasurements, useLogMeasurement, useDeleteMeasurement } from "@gymtracker/hooks";
import type { Measurement } from "@gymtracker/types";

import { Button, Input, StatCard, EmptyState, PageSkeleton } from "../components/ui";

// ── Constants ──────────────────────────────────────────────────────────────

const ACCENT  = "#7C5CFC";
const BORDER  = "#2C2C2E";
const HINT    = "#636366";
const AXIS    = { fill: HINT, fontSize: 11 };
const GRID    = { strokeDasharray: "3 3" as const, stroke: BORDER };

const EMPTY_FORM = {
  date:      new Date().toISOString().split("T")[0],
  weight_kg: "",
  height_cm: "",
  notes:     "",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-accent"   };
  if (bmi < 25)   return { label: "Normal",      color: "text-success"  };
  if (bmi < 30)   return { label: "Overweight",  color: "text-warning"  };
  return               { label: "Obese",         color: "text-danger"   };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function LineTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border-default rounded-lg px-3 py-2 text-[12px]">
      <p className="text-text-tertiary mb-0.5">{label}</p>
      <p className="text-text-primary font-semibold">{payload[0].value} {payload[0].name === "Weight" ? "kg" : ""}</p>
    </div>
  );
}

// ── Log form ───────────────────────────────────────────────────────────────

function LogForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const { mutate: log, isPending } = useLogMeasurement();

  const handleSubmit = () => {
    if (!form.weight_kg) return;
    log(
      {
        date:      form.date,
        weight_kg: parseFloat(form.weight_kg),
        height_cm: form.height_cm ? parseFloat(form.height_cm) : undefined,
        notes:     form.notes || undefined,
      },
      { onSuccess: onClose }
    );
  };

  return (
    <div className="bg-surface border border-border-default rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[14px] font-semibold text-text-primary">New entry</p>
          <p className="text-[11px] text-text-tertiary mt-0.5">Log today's weight</p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-elevated transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <Input
          label="Weight (kg)"
          type="number"
          step="0.1"
          placeholder="e.g. 72.5"
          value={form.weight_kg}
          onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
        />
        <Input
          label="Height cm (optional — for BMI)"
          type="number"
          step="0.1"
          placeholder="e.g. 175"
          value={form.height_cm}
          onChange={(e) => setForm({ ...form, height_cm: e.target.value })}
        />
        <Input
          label="Notes (optional)"
          placeholder="e.g. Morning, fasted"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" loading={isPending} onClick={handleSubmit}>Save entry</Button>
      </div>
    </div>
  );
}

// ── History entry row ──────────────────────────────────────────────────────

function EntryRow({ entry: e, onDelete }: { entry: Measurement; onDelete: (id: number) => void }) {
  const bmi = e.bmi ? bmiCategory(e.bmi) : null;

  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-elevated/30 transition-colors">
      {/* Date */}
      <span className="text-[13px] font-medium text-text-primary w-27.5 shrink-0">
        {formatDate(e.date)}
      </span>

      {/* Weight */}
      <span className="text-[13px] font-semibold text-text-primary w-17.5 shrink-0 tabular-nums">
        {e.weight_kg} kg
      </span>

      {/* BMI */}
      <span className="w-32.5 shrink-0 text-[12px]">
        {bmi ? (
          <span className={bmi.color}>{e.bmi} · {bmi.label}</span>
        ) : (
          <span className="text-text-tertiary">—</span>
        )}
      </span>

      {/* Notes */}
      <span className="flex-1 text-[11px] text-text-tertiary truncate min-w-0">
        {e.notes || "—"}
      </span>

      {/* Delete */}
      <button
        onClick={() => confirm("Delete this entry?") && onDelete(e.id)}
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-text-tertiary hover:bg-danger/10 hover:text-danger transition-colors"
        aria-label="Delete entry"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Measurements() {
  const [showForm, setShowForm] = useState(false);

  
  const { data: entries = [], isLoading } = useMeasurements();
  const { mutate: remove } = useDeleteMeasurement();

  // Derived
  const latest = entries[0] as Measurement | undefined;

  const weightChange = (() => {
    if (entries.length < 2) return null;
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const diff   = sorted[sorted.length - 1].weight_kg - sorted[0].weight_kg;
    return { diff, positive: diff > 0 };
  })();

  const chartData = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({ date: e.date, Weight: e.weight_kg, BMI: e.bmi ?? undefined }));

  const hasBMIChart = chartData.some((d) => d.BMI !== undefined) && chartData.length > 1;

  if (isLoading) return <PageSkeleton stats={3} rows={4} />;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Measurements</h1>
          <p className="text-[13px] text-text-secondary mt-1 sm:mt-2">Body weight history</p>
        </div>
        <Button
          icon={showForm ? <X size={14} /> : <Plus size={14} />}
          variant={showForm ? "secondary" : "primary"}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "Log entry"}
        </Button>
      </div>

      {/* Log form */}
      {showForm && <LogForm onClose={() => setShowForm(false)} />}

      {/* Summary stat cards */}
      {latest && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Current weight" value={latest.weight_kg} unit="kg" />
          {latest.bmi && (
            <StatCard
              label="BMI"
              value={latest.bmi}
              trend={bmiCategory(latest.bmi).label}
              trendDir={
                latest.bmi < 18.5 ? "down"
                : latest.bmi < 25  ? "up"
                : "neutral"
              }
            />
          )}
          {weightChange && (
            <StatCard
              label="Change"
              value={`${weightChange.positive ? "+" : ""}${weightChange.diff.toFixed(1)}`}
              unit="kg"
              trendDir={weightChange.positive ? "down" : "up"}
              trend={weightChange.positive ? "gained" : "lost"}
            />
          )}
        </div>
      )}

      {/* Weight chart */}
      {chartData.length > 1 && (
        <div className={`grid gap-4 ${hasBMIChart ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
          <div className="bg-surface border border-border-default rounded-xl p-5">
            <p className="text-[13px] font-semibold text-text-primary mb-4">Weight over time</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="date" tick={AXIS} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip content={<LineTooltip />} />
                <Line type="monotone" dataKey="Weight" stroke={ACCENT} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: ACCENT }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {hasBMIChart && (
            <div className="bg-surface border border-border-default rounded-xl p-5">
              <p className="text-[13px] font-semibold text-text-primary mb-4">BMI over time</p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData}>
                  <CartesianGrid {...GRID} />
                  <XAxis dataKey="date" tick={AXIS} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                  <Tooltip content={<LineTooltip />} />
                  <Line type="monotone" dataKey="BMI" stroke="#9B7EFD" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#9B7EFD" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {entries.length === 0 ? (
        <div className="bg-surface border border-border-default rounded-xl">
          <EmptyState
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            }
            title="No measurements yet"
            description="Log your first entry to start tracking body weight over time."
            action={<Button size="sm" onClick={() => setShowForm(true)}>Log first entry</Button>}
          />
        </div>
      ) : (
        <div className="bg-surface border border-border-default rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
            <p className="text-[13px] font-semibold text-text-primary">History</p>
            <p className="text-[11px] text-text-tertiary tabular-nums">
              {entries.length} entr{entries.length !== 1 ? "ies" : "y"}
            </p>
          </div>

          {/* Column headers */}
          <div className="flex items-center gap-4 px-4 py-2 border-b border-border-default/60">
            <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider w-27.5 shrink-0">Date</span>
            <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider w-17.5 shrink-0">Weight</span>
            <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider w-32.5 shrink-0">BMI</span>
            <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider flex-1">Notes</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border-default/50">
            {entries.map((e: Measurement) => (
              <EntryRow key={e.id} entry={e} onDelete={remove} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}