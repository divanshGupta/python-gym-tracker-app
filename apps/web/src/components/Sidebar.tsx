import { NavLink, useNavigate } from "react-router-dom";
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
import { useState } from "react";
import { useAuthStore } from "@gymtracker/stores";

const NAV_ITEMS = [
  { label: "Dashboard",    to: "/",              icon: LayoutDashboard },
  { label: "Workouts",     to: "/workouts",      icon: Dumbbell        },
  { label: "Exercises",    to: "/exercises",     icon: ListChecks      },
  { label: "Progress",     to: "/progress",      icon: LineChart       },
  { label: "Goals",        to: "/goals",         icon: Target          },
  { label: "Measurements", to: "/measurements",  icon: Scale           },
  { label: "Profile",      to: "/profile",       icon: UserCircle      },
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
    ? user.username.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "GT";

  return (
    <>
      {/* ── Mobile toggle button ── */}
      <button
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-9 h-9 rounded-md bg-elevated border border-border-default text-text-secondary hover:text-text-primary transition-colors md:hidden"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-void/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside
        className={[
          // base
          "fixed inset-y-0 left-0 z-40 flex flex-col",
          "w-60 bg-surface border-r border-border-default",
          "transition-transform duration-200 ease-in-out",
          // desktop: always visible; mobile: slide in
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-15 border-b border-border-default shrink-0">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <Dumbbell size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-text-primary">
            GymTracker
          </span>
        </div>

        {/* Nav items */}
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
                      "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] sm:text-[16px] md:text-[18px] font-medium transition-colors duration-150",
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

        {/* User + logout */}
        <div className="shrink-0 border-t border-border-default p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-md">
            {/* Avatar */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
              <span className="text-[11px] sm:text-[14px] md:text-[18px] font-semibold text-accent">{initials}</span>
            </div>
            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] sm:text-[14px] md:text-[18px] font-medium text-text-primary truncate leading-none">
                {user?.username ?? "Athlete"}
              </p>
              <p className="text-[11px] sm:text-[12px] md:text-[14px] text-text-tertiary truncate mt-0.5">
                {user?.email ?? ""}
              </p>
            </div>
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="shrink-0 p-1.5 rounded-md text-text-tertiary hover:text-danger hover:bg-danger/10 transition-colors"
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
