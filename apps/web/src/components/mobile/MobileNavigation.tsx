import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  ListChecks,
  LineChart,
  Menu,
} from "lucide-react";

const MOBILE_NAV_ITEMS = [
  { label: "Home", to: "/", icon: LayoutDashboard },
  { label: "Workouts", to: "/workouts", icon: Dumbbell },
  { label: "Exercises", to: "/exercises", icon: ListChecks },
  { label: "Progress", to: "/progress", icon: LineChart },
  { label: "More", to: "/more", icon: Menu },
];

export function MobileBottomBar() {
  return (
    <div className="md:hidden">
      <nav className="
        fixed bottom-4 left-1/2 -translate-x-1/2
        z-50
        w-[calc(100%-1.25rem)]
        max-w-sm
        px-2 py-2
        rounded-2xl
        border border-border-default
        bg-surface/90
        backdrop-blur-xl
        shadow-lg
      ">
        <ul className="flex items-center justify-between gap-1">
          {MOBILE_NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  [
                    "relative flex flex-col items-center justify-center",
                    "gap-1 py-2 rounded-xl",
                    "transition-all duration-200",
                    "min-h-14",
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-text-secondary",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 2}
                    />

                    <span className={`
                      text-[10px] font-medium
                      transition-colors
                    `}>
                      {label}
                    </span>

                    {isActive && (
                      <span className="
                        absolute top-1 right-4
                        w-1.5 h-1.5
                        rounded-full
                        bg-accent
                      " />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}