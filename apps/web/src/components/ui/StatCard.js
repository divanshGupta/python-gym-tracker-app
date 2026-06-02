import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
const trendColors = {
    up: "text-success",
    down: "text-danger",
    neutral: "text-text-tertiary",
};
const TrendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
};
export function StatCard({ label, value, unit, icon, trend, trendDir = "neutral", className = "", }) {
    const TrendIcon = TrendIcons[trendDir];
    return (_jsxs("div", { className: [
            "bg-surface border border-border-default rounded-xl p-4 flex flex-col gap-3",
            className,
        ].join(" "), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[12px] font-medium text-text-tertiary uppercase tracking-wide", children: label }), icon && (_jsx("span", { className: "text-text-tertiary", children: icon }))] }), _jsxs("div", { className: "flex items-baseline gap-1.5", children: [_jsx("span", { className: "text-[28px] font-bold text-text-primary leading-none tracking-tight", children: value }), unit && (_jsx("span", { className: "text-[13px] text-text-tertiary font-medium", children: unit }))] }), trend && (_jsxs("div", { className: ["flex items-center gap-1", trendColors[trendDir]].join(" "), children: [_jsx(TrendIcon, { size: 12, strokeWidth: 2.5 }), _jsx("span", { className: "text-[11px] font-medium", children: trend })] }))] }));
}
