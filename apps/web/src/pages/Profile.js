import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { LogOut, Building2, AlignLeft, MapPin } from "lucide-react";
import { useWorkoutStats } from "@gymtracker/hooks";
import { useAuthStore } from "@gymtracker/stores";
import { Button, PageSkeleton } from "../components/ui";
// ── Helpers ────────────────────────────────────────────────────────────────
function formatMemberSince(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long", year: "numeric",
    });
}
function formatLargeNum(n) {
    if (n == null)
        return "—";
    if (n >= 1000)
        return `${(n / 1000).toFixed(1)}k`;
    return String(n);
}
// ── Sub-components ─────────────────────────────────────────────────────────
function SectionLabel({ children }) {
    return (_jsx("p", { className: "text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.09em] mb-3", children: children }));
}
function ComingSoonBadge() {
    return (_jsx("span", { className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-elevated text-text-tertiary border border-border-default", children: "Coming soon" }));
}
// ── Page ───────────────────────────────────────────────────────────────────
export default function Profile() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { data: stats, isLoading } = useWorkoutStats();
    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };
    if (isLoading)
        return _jsx(PageSkeleton, { stats: 3, rows: 0 });
    if (!user)
        return (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("p", { className: "text-text-secondary text-[13px]", children: "User not found." }) }));
    const initials = user.username
        ? user.username.charAt(0).toUpperCase()
        : "?";
    return (_jsxs("div", { className: "flex flex-col gap-6 max-w-2xl", children: [_jsxs("div", { className: "bg-surface border border-border-default rounded-xl p-5 flex flex-col gap-5", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-full bg-accent/15 border-2 border-accent/25 flex items-center justify-center shrink-0", children: _jsx("span", { className: "text-[22px] font-bold text-accent", children: initials }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-[17px] font-bold text-text-primary tracking-tight truncate", children: user.username }), _jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5 truncate", children: user.email }), user.created_at && (_jsxs("p", { className: "text-[11px] text-text-tertiary/60 mt-1.5", children: ["Member since ", formatMemberSince(user.created_at)] }))] }), _jsxs("div", { className: "flex flex-col gap-1.5 shrink-0", children: [_jsx(Button, { variant: "secondary", size: "sm", children: "Edit profile" }), _jsx(Button, { variant: "danger", size: "sm", icon: _jsx(LogOut, { size: 13 }), onClick: handleLogout, children: "Sign out" })] })] }), _jsxs("div", { className: "flex items-center gap-4 pt-4 border-t border-border-default", children: [_jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [_jsx("span", { className: "text-[16px] font-bold text-text-primary tabular-nums", children: stats?.total_workouts ?? "—" }), _jsx("span", { className: "text-[10px] text-text-tertiary", children: "Workouts" })] }), _jsx("div", { className: "w-px h-6 bg-border-default" }), _jsxs("div", { className: "flex flex-col items-center gap-0.5 opacity-40", children: [_jsx("span", { className: "text-[16px] font-bold text-text-tertiary", children: "\u2014" }), _jsx("span", { className: "text-[10px] text-text-tertiary", children: "Followers" })] }), _jsx("div", { className: "w-px h-6 bg-border-default opacity-40" }), _jsxs("div", { className: "flex flex-col items-center gap-0.5 opacity-40", children: [_jsx("span", { className: "text-[16px] font-bold text-text-tertiary", children: "\u2014" }), _jsx("span", { className: "text-[10px] text-text-tertiary", children: "Following" })] }), _jsx("div", { className: "ml-auto", children: _jsx(ComingSoonBadge, {}) })] })] }), stats && (_jsxs("section", { children: [_jsx(SectionLabel, { children: "Lifetime stats" }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: [
                            { label: "Workouts", value: stats.total_workouts, unit: "" },
                            { label: "Duration", value: stats.total_duration_minutes, unit: "min" },
                            { label: "Calories", value: stats.total_calories_burned, unit: "kcal" },
                        ].map(({ label, value, unit }) => (_jsxs("div", { className: "bg-surface border border-border-default rounded-xl px-4 py-3", children: [_jsxs("p", { className: "text-[20px] font-bold text-text-primary leading-none tabular-nums", children: [formatLargeNum(value), unit && (_jsx("span", { className: "text-[11px] font-normal text-text-tertiary ml-1", children: unit }))] }), _jsx("p", { className: "text-[10px] font-medium text-text-tertiary uppercase tracking-wider mt-1.5", children: label })] }, label))) })] })), _jsxs("section", { children: [_jsx(SectionLabel, { children: "Details" }), _jsx("div", { className: "bg-surface border border-border-default rounded-xl overflow-hidden", children: [
                            { icon: _jsx(Building2, { size: 13 }), label: "Gym", value: null },
                            { icon: _jsx(AlignLeft, { size: 13 }), label: "Bio", value: null },
                            { icon: _jsx(MapPin, { size: 13 }), label: "Location", value: null },
                        ].map(({ icon, label, value }, i, arr) => (_jsxs("div", { className: [
                                "flex items-center gap-3 px-4 py-3",
                                i < arr.length - 1 ? "border-b border-border-default/60" : "",
                            ].join(" "), children: [_jsx("div", { className: "w-7 h-7 rounded-lg bg-elevated flex items-center justify-center text-text-tertiary shrink-0", children: icon }), _jsx("span", { className: "text-[12px] text-text-tertiary w-16 shrink-0", children: label }), _jsx("span", { className: "text-[13px] text-text-tertiary/50 italic flex-1", children: value ?? "Not set" }), _jsx(ComingSoonBadge, {})] }, label))) })] })] }));
}
