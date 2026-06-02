import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";
import { useMeasurements, useLogMeasurement, useDeleteMeasurement } from "@gymtracker/hooks";
import { Button, Input, StatCard, EmptyState, PageSkeleton } from "../components/ui";
// ── Constants ──────────────────────────────────────────────────────────────
const ACCENT = "#7C5CFC";
const BORDER = "#2C2C2E";
const HINT = "#636366";
const AXIS = { fill: HINT, fontSize: 11 };
const GRID = { strokeDasharray: "3 3", stroke: BORDER };
const EMPTY_FORM = {
    date: new Date().toISOString().split("T")[0],
    weight_kg: "",
    height_cm: "",
    notes: "",
};
// ── Helpers ────────────────────────────────────────────────────────────────
function bmiCategory(bmi) {
    if (bmi < 18.5)
        return { label: "Underweight", color: "text-accent" };
    if (bmi < 25)
        return { label: "Normal", color: "text-success" };
    if (bmi < 30)
        return { label: "Overweight", color: "text-warning" };
    return { label: "Obese", color: "text-danger" };
}
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}
function LineTooltip({ active, payload, label }) {
    if (!active || !payload?.length)
        return null;
    return (_jsxs("div", { className: "bg-surface border border-border-default rounded-lg px-3 py-2 text-[12px]", children: [_jsx("p", { className: "text-text-tertiary mb-0.5", children: label }), _jsxs("p", { className: "text-text-primary font-semibold", children: [payload[0].value, " ", payload[0].name === "Weight" ? "kg" : ""] })] }));
}
// ── Log form ───────────────────────────────────────────────────────────────
function LogForm({ onClose }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const { mutate: log, isPending } = useLogMeasurement();
    const handleSubmit = () => {
        if (!form.weight_kg)
            return;
        log({
            date: form.date,
            weight_kg: parseFloat(form.weight_kg),
            height_cm: form.height_cm ? parseFloat(form.height_cm) : undefined,
            notes: form.notes || undefined,
        }, { onSuccess: onClose });
    };
    return (_jsxs("div", { className: "bg-surface border border-border-default rounded-xl p-5 flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[14px] font-semibold text-text-primary", children: "New entry" }), _jsx("p", { className: "text-[11px] text-text-tertiary mt-0.5", children: "Log today's weight" })] }), _jsx("button", { onClick: onClose, className: "w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-elevated transition-colors", children: _jsx(X, { size: 15 }) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsx(Input, { label: "Date", type: "date", value: form.date, onChange: (e) => setForm({ ...form, date: e.target.value }) }), _jsx(Input, { label: "Weight (kg)", type: "number", step: "0.1", placeholder: "e.g. 72.5", value: form.weight_kg, onChange: (e) => setForm({ ...form, weight_kg: e.target.value }) }), _jsx(Input, { label: "Height cm (optional \u2014 for BMI)", type: "number", step: "0.1", placeholder: "e.g. 175", value: form.height_cm, onChange: (e) => setForm({ ...form, height_cm: e.target.value }) }), _jsx(Input, { label: "Notes (optional)", placeholder: "e.g. Morning, fasted", value: form.notes, onChange: (e) => setForm({ ...form, notes: e.target.value }) })] }), _jsxs("div", { className: "flex items-center gap-2 pt-1", children: [_jsx(Button, { variant: "secondary", size: "sm", onClick: onClose, children: "Cancel" }), _jsx(Button, { size: "sm", loading: isPending, onClick: handleSubmit, children: "Save entry" })] })] }));
}
// ── History entry row ──────────────────────────────────────────────────────
function EntryRow({ entry: e, onDelete }) {
    const bmi = e.bmi ? bmiCategory(e.bmi) : null;
    return (_jsxs("div", { className: "flex items-center gap-4 px-4 py-3 hover:bg-elevated/30 transition-colors", children: [_jsx("span", { className: "text-[13px] font-medium text-text-primary w-27.5 shrink-0", children: formatDate(e.date) }), _jsxs("span", { className: "text-[13px] font-semibold text-text-primary w-17.5 shrink-0 tabular-nums", children: [e.weight_kg, " kg"] }), _jsx("span", { className: "w-32.5 shrink-0 text-[12px]", children: bmi ? (_jsxs("span", { className: bmi.color, children: [e.bmi, " \u00B7 ", bmi.label] })) : (_jsx("span", { className: "text-text-tertiary", children: "\u2014" })) }), _jsx("span", { className: "flex-1 text-[11px] text-text-tertiary truncate min-w-0", children: e.notes || "—" }), _jsx("button", { onClick: () => confirm("Delete this entry?") && onDelete(e.id), className: "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-text-tertiary hover:bg-danger/10 hover:text-danger transition-colors", "aria-label": "Delete entry", children: _jsx(Trash2, { size: 13 }) })] }));
}
// ── Page ───────────────────────────────────────────────────────────────────
export default function Measurements() {
    const [showForm, setShowForm] = useState(false);
    const { data: entries = [], isLoading } = useMeasurements();
    const { mutate: remove } = useDeleteMeasurement();
    // Derived
    const latest = entries[0];
    const weightChange = (() => {
        if (entries.length < 2)
            return null;
        const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
        const diff = sorted[sorted.length - 1].weight_kg - sorted[0].weight_kg;
        return { diff, positive: diff > 0 };
    })();
    const chartData = [...entries]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((e) => ({ date: e.date, Weight: e.weight_kg, BMI: e.bmi ?? undefined }));
    const hasBMIChart = chartData.some((d) => d.BMI !== undefined) && chartData.length > 1;
    if (isLoading)
        return _jsx(PageSkeleton, { stats: 3, rows: 4 });
    return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-[24px] font-bold text-text-primary tracking-tight", children: "Measurements" }), _jsx("p", { className: "text-[13px] text-text-secondary mt-1", children: "Body weight history" })] }), _jsx(Button, { icon: showForm ? _jsx(X, { size: 14 }) : _jsx(Plus, { size: 14 }), variant: showForm ? "secondary" : "primary", onClick: () => setShowForm((v) => !v), children: showForm ? "Cancel" : "Log entry" })] }), showForm && _jsx(LogForm, { onClose: () => setShowForm(false) }), latest && (_jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsx(StatCard, { label: "Current weight", value: latest.weight_kg, unit: "kg" }), latest.bmi && (_jsx(StatCard, { label: "BMI", value: latest.bmi, trend: bmiCategory(latest.bmi).label, trendDir: latest.bmi < 18.5 ? "down"
                            : latest.bmi < 25 ? "up"
                                : "neutral" })), weightChange && (_jsx(StatCard, { label: "Change", value: `${weightChange.positive ? "+" : ""}${weightChange.diff.toFixed(1)}`, unit: "kg", trendDir: weightChange.positive ? "down" : "up", trend: weightChange.positive ? "gained" : "lost" }))] })), chartData.length > 1 && (_jsxs("div", { className: `grid gap-4 ${hasBMIChart ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`, children: [_jsxs("div", { className: "bg-surface border border-border-default rounded-xl p-5", children: [_jsx("p", { className: "text-[13px] font-semibold text-text-primary mb-4", children: "Weight over time" }), _jsx(ResponsiveContainer, { width: "100%", height: 160, children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { ...GRID }), _jsx(XAxis, { dataKey: "date", tick: AXIS, axisLine: false, tickLine: false }), _jsx(YAxis, { tick: AXIS, axisLine: false, tickLine: false, domain: ["auto", "auto"] }), _jsx(Tooltip, { content: _jsx(LineTooltip, {}) }), _jsx(Line, { type: "monotone", dataKey: "Weight", stroke: ACCENT, strokeWidth: 2, dot: false, activeDot: { r: 4, fill: ACCENT } })] }) })] }), hasBMIChart && (_jsxs("div", { className: "bg-surface border border-border-default rounded-xl p-5", children: [_jsx("p", { className: "text-[13px] font-semibold text-text-primary mb-4", children: "BMI over time" }), _jsx(ResponsiveContainer, { width: "100%", height: 160, children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { ...GRID }), _jsx(XAxis, { dataKey: "date", tick: AXIS, axisLine: false, tickLine: false }), _jsx(YAxis, { tick: AXIS, axisLine: false, tickLine: false, domain: ["auto", "auto"] }), _jsx(Tooltip, { content: _jsx(LineTooltip, {}) }), _jsx(Line, { type: "monotone", dataKey: "BMI", stroke: "#9B7EFD", strokeWidth: 2, dot: false, activeDot: { r: 4, fill: "#9B7EFD" } })] }) })] }))] })), entries.length === 0 ? (_jsx("div", { className: "bg-surface border border-border-default rounded-xl", children: _jsx(EmptyState, { icon: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M3 3v18h18" }), _jsx("path", { d: "m19 9-5 5-4-4-3 3" })] }), title: "No measurements yet", description: "Log your first entry to start tracking body weight over time.", action: _jsx(Button, { size: "sm", onClick: () => setShowForm(true), children: "Log first entry" }) }) })) : (_jsxs("div", { className: "bg-surface border border-border-default rounded-xl overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border-default", children: [_jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "History" }), _jsxs("p", { className: "text-[11px] text-text-tertiary tabular-nums", children: [entries.length, " entr", entries.length !== 1 ? "ies" : "y"] })] }), _jsxs("div", { className: "flex items-center gap-4 px-4 py-2 border-b border-border-default/60", children: [_jsx("span", { className: "text-[10px] font-semibold text-text-tertiary uppercase tracking-wider w-27.5 shrink-0", children: "Date" }), _jsx("span", { className: "text-[10px] font-semibold text-text-tertiary uppercase tracking-wider w-17.5 shrink-0", children: "Weight" }), _jsx("span", { className: "text-[10px] font-semibold text-text-tertiary uppercase tracking-wider w-32.5 shrink-0", children: "BMI" }), _jsx("span", { className: "text-[10px] font-semibold text-text-tertiary uppercase tracking-wider flex-1", children: "Notes" })] }), _jsx("div", { className: "divide-y divide-border-default/50", children: entries.map((e) => (_jsx(EntryRow, { entry: e, onDelete: remove }, e.id))) })] }))] }));
}
