import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HeatmapCell } from './HeatmapCell';
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export function HeatmapGrid({ weeks }) {
    return (_jsxs("div", { className: "text-text-primary flex gap-1", children: [_jsx("div", { className: "flex flex-col gap-1 mr-1", children: DAY_LABELS.map((label, i) => (_jsx("div", { className: "h-3 text-xs text-muted leading-none flex items-center", children: i % 2 !== 0 ? label : '' }, label))) }), weeks.map((week, weekIndex) => (_jsx("div", { className: "flex flex-col gap-1", children: week.days.map((entry, dayIndex) => (entry
                    ? _jsx(HeatmapCell, { entry: entry }, entry.date)
                    : _jsx("div", { className: "w-3 h-3" }, dayIndex) // empty padding
                )) }, weekIndex)))] }));
}
