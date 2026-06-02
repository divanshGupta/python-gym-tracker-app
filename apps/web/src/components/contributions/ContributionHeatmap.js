import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// apps/web/src/components/contributions/ContributionHeatmap.tsx
import { useState } from 'react';
import { DEFAULT_CONTRIBUTION_RANGE } from '@gymtracker/constants';
import { useContributions } from '@gymtracker/hooks';
import { RangeSelector } from './RangeSelector';
import { HeatmapGrid } from './HeatmapGrid';
import { ContributionStats } from './ContributionStats';
import { HeatmapSkeleton } from './HeatmapSkeleton';
export function ContributionHeatmap() {
    const [range, setRange] = useState(DEFAULT_CONTRIBUTION_RANGE);
    const { summary, isLoading, error } = useContributions(range);
    return (_jsxs("div", { className: "flex flex-col gap-4 p-4 bg-surface rounded-xl border border-border-default", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "font-semibold text-text-primary", children: "Activity" }), _jsx(RangeSelector, { selected: range, onChange: setRange })] }), isLoading && !summary && _jsx(HeatmapSkeleton, {}), error && (_jsx("p", { className: "text-error text-sm", children: "Failed to load activity data." })), summary && summary.totalActiveDays === 0 && (_jsxs("div", { className: "py-8 text-center text-text-secondary text-muted text-sm", children: ["No workouts logged in this period.", _jsx("br", {}), _jsx("span", { className: "text-xs", children: "Start logging to see your streak!" })] })), summary && summary.totalActiveDays > 0 && (_jsxs(_Fragment, { children: [_jsx(HeatmapGrid, { weeks: summary.weeks }), _jsx(ContributionStats, { summary: summary })] }))] }));
}
