import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { LayoutDashboard, Dumbbell, ListChecks, LineChart, Target, Scale, UserCircle, LogOut, Menu, X, } from "lucide-react";
import { useAuthStore } from "@gymtracker/stores";
const NAV_ITEMS = [
    { label: "Dashboard", to: "/", icon: LayoutDashboard },
    { label: "Workouts", to: "/workouts", icon: Dumbbell },
    { label: "Exercises", to: "/exercises", icon: ListChecks },
    { label: "Progress", to: "/progress", icon: LineChart },
    { label: "Goals", to: "/goals", icon: Target },
    { label: "Measurements", to: "/measurements", icon: Scale },
    { label: "Profile", to: "/profile", icon: UserCircle },
];
export function Sidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    const initials = user?.username
        ? user.username.charAt(0).toUpperCase()
        : "G";
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "\r\n          md:hidden\r\n          fixed top-0 inset-x-0 z-40\r\n          h-15\r\n          border-b border-border-default\r\n          bg-surface/95 backdrop-blur-xl\r\n        ", children: _jsxs("div", { className: "h-full px-4 flex items-center justify-between", children: [_jsxs(Link, { to: '/', className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-7 h-7 rounded-md bg-accent flex items-center justify-center", children: _jsx(Dumbbell, { size: 15, className: "text-white", strokeWidth: 2.5 }) }), _jsx("span", { className: "text-[15px] font-semibold tracking-tight text-text-primary", children: "GymTracker" })] }), _jsx("button", { onClick: () => setMobileOpen(true), className: "\r\n              p-2 rounded-md\r\n              text-text-secondary\r\n              hover:bg-elevated\r\n              transition-colors\r\n            ", children: _jsx(Menu, { size: 20 }) })] }) }), mobileOpen && (_jsx("div", { onClick: () => setMobileOpen(false), className: "\r\n            md:hidden\r\n            fixed inset-0 z-40\r\n            bg-black/50 backdrop-blur-sm\r\n          " })), _jsxs("aside", { className: `
          fixed inset-y-0 left-0 z-50
          flex flex-col
          w-60
          bg-surface
          border-r border-border-default
          transition-transform duration-300

          md:translate-x-0

          ${mobileOpen
                    ? "translate-x-0"
                    : "-translate-x-full md:translate-x-0"}
        `, children: [_jsxs("div", { className: "flex items-center justify-between px-5 h-15 border-b border-border-default shrink-0", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-7 h-7 rounded-md bg-accent flex items-center justify-center", children: _jsx(Dumbbell, { size: 15, className: "text-white", strokeWidth: 2.5 }) }), _jsx("span", { className: "text-[15px] font-semibold tracking-tight text-text-primary", children: "GymTracker" })] }), _jsx("button", { onClick: () => setMobileOpen(false), className: "\r\n              md:hidden\r\n              p-1.5 rounded-md\r\n              text-text-secondary\r\n              hover:bg-elevated\r\n            ", children: _jsx(X, { size: 18 }) })] }), _jsx("nav", { className: "flex-1 overflow-y-auto py-3 px-2", children: _jsx("ul", { className: "space-y-0.5", children: NAV_ITEMS.map(({ label, to, icon: Icon }) => (_jsx("li", { children: _jsx(NavLink, { to: to, end: to === "/", onClick: () => setMobileOpen(false), className: ({ isActive }) => [
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors duration-150",
                                        isActive
                                            ? "bg-accent/10 text-accent"
                                            : "text-text-secondary hover:text-text-primary hover:bg-elevated",
                                    ].join(" "), children: ({ isActive }) => (_jsxs(_Fragment, { children: [_jsx(Icon, { size: 16, strokeWidth: isActive ? 2.5 : 2, className: "shrink-0" }), _jsx("span", { children: label }), isActive && (_jsx("span", { className: "ml-auto w-1.5 h-1.5 rounded-full bg-accent" }))] })) }) }, to))) }) }), _jsx("div", { className: "shrink-0 border-t border-border-default p-3", children: _jsxs("div", { className: "flex items-center gap-3 px-2 py-2 rounded-md", children: [_jsxs(Link, { to: "/profile", className: "w-full flex items-center gap-3", children: [_jsx("div", { className: "w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0", children: _jsx("span", { className: "text-[11px] font-semibold text-accent", children: initials }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-[13px] font-medium text-text-primary truncate leading-none", children: user?.username ?? "Athlete" }), _jsx("p", { className: "text-[11px] text-text-tertiary truncate mt-0.5", children: user?.email ?? "" })] })] }), _jsx("button", { onClick: handleLogout, className: "\r\n                shrink-0 p-1.5 rounded-md\r\n                text-text-tertiary\r\n                hover:text-danger\r\n                hover:bg-danger/10\r\n                transition-colors\r\n              ", "aria-label": "Log out", children: _jsx(LogOut, { size: 15 }) })] }) })] })] }));
}
