import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Dumbbell, ListChecks, LineChart, Menu, } from "lucide-react";
const MOBILE_NAV_ITEMS = [
    { label: "Home", to: "/", icon: LayoutDashboard },
    { label: "Workouts", to: "/workouts", icon: Dumbbell },
    { label: "Exercises", to: "/exercises", icon: ListChecks },
    { label: "Progress", to: "/progress", icon: LineChart },
    { label: "More", to: "/more", icon: Menu },
];
export function MobileBottomBar() {
    return (_jsx("div", { className: "md:hidden", children: _jsx("nav", { className: "\r\n        fixed bottom-4 left-1/2 -translate-x-1/2\r\n        z-50\r\n        w-[calc(100%-1.25rem)]\r\n        max-w-sm\r\n        px-2 py-2\r\n        rounded-2xl\r\n        border border-border-default\r\n        bg-surface/90\r\n        backdrop-blur-xl\r\n        shadow-lg\r\n      ", children: _jsx("ul", { className: "flex items-center justify-between gap-1", children: MOBILE_NAV_ITEMS.map(({ label, to, icon: Icon }) => (_jsx("li", { className: "flex-1", children: _jsx(NavLink, { to: to, end: to === "/", className: ({ isActive }) => [
                            "relative flex flex-col items-center justify-center",
                            "gap-1 py-2 rounded-xl",
                            "transition-all duration-200",
                            "min-h-14",
                            isActive
                                ? "bg-accent/10 text-accent"
                                : "text-text-secondary",
                        ].join(" "), children: ({ isActive }) => (_jsxs(_Fragment, { children: [_jsx(Icon, { size: 20, strokeWidth: isActive ? 2.5 : 2 }), _jsx("span", { className: `
                      text-[10px] font-medium
                      transition-colors
                    `, children: label }), isActive && (_jsx("span", { className: "\r\n                        absolute top-1 right-4\r\n                        w-1.5 h-1.5\r\n                        rounded-full\r\n                        bg-accent\r\n                      " }))] })) }) }, to))) }) }) }));
}
