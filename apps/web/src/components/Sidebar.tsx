import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  LayoutDashboard,
  Dumbbell,
  ListChecks,
  LineChart,
  Target,
  Scale,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuthStore } from "@gymtracker/stores";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Workouts", to: "/workouts", icon: Dumbbell },
  { label: "Exercises", to: "/exercises", icon: ListChecks },
  { label: "Progress", to: "/progress", icon: LineChart },
  { label: "Goals", to: "/goals", icon: Target },
  { label: "Measurements", to: "/measurements", icon: Scale },
  { label: "Profile", to: "/profile", icon: UserCircle },
] as const;

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

  return (
    <>
      {/* MOBILE TOPBAR */}
      <header
        className="
          md:hidden
          fixed top-0 inset-x-0 z-40
          h-15
          border-b border-border-default
          bg-surface/95 backdrop-blur-xl
        "
      >
        <div className="h-full px-4 flex items-center justify-between">
          {/* Brand */}
          <Link to='/' className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
              <Dumbbell
                size={15}
                className="text-white"
                strokeWidth={2.5}
              />
            </div>

            <span className="text-[15px] font-semibold tracking-tight text-text-primary">
              GymTracker
            </span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="
              p-2 rounded-md
              text-text-secondary
              hover:bg-elevated
              transition-colors
            "
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="
            md:hidden
            fixed inset-0 z-40
            bg-black/50 backdrop-blur-sm
          "
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          w-60
          bg-surface
          border-r border-border-default
          transition-transform duration-300

          md:translate-x-0

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-15 border-b border-border-default shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
              <Dumbbell
                size={15}
                className="text-white"
                strokeWidth={2.5}
              />
            </div>

            <span className="text-[15px] font-semibold tracking-tight text-text-primary">
              GymTracker
            </span>
          </div>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="
              md:hidden
              p-1.5 rounded-md
              text-text-secondary
              hover:bg-elevated
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors duration-150",
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-text-secondary hover:text-text-primary hover:bg-elevated",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={16}
                        strokeWidth={isActive ? 2.5 : 2}
                        className="shrink-0"
                      />

                      <span>{label}</span>

                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div className="shrink-0 border-t border-border-default p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-md">
            <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-semibold text-accent">
                {initials}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-text-primary truncate leading-none">
                {user?.username ?? "Athlete"}
              </p>

              <p className="text-[11px] text-text-tertiary truncate mt-0.5">
                {user?.email ?? ""}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="
                shrink-0 p-1.5 rounded-md
                text-text-tertiary
                hover:text-danger
                hover:bg-danger/10
                transition-colors
              "
              aria-label="Log out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}