import { useNavigate } from "react-router-dom";
import { LogOut, Building2, AlignLeft, MapPin } from "lucide-react";

import { useWorkoutStats } from "@gymtracker/hooks";
import { useAuthStore }    from "@gymtracker/stores";

import { Button, PageSkeleton } from "../components/ui";

// ── Helpers ────────────────────────────────────────────────────────────────

function formatMemberSince(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", year: "numeric",
  });
}

function formatLargeNum(n: number | undefined | null): string {
  if (n == null) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.09em] mb-3">
      {children}
    </p>
  );
}

function ComingSoonBadge() {
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-elevated text-text-tertiary border border-border-default">
      Coming soon
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout }              = useAuthStore();
  const { data: stats, isLoading }    = useWorkoutStats();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isLoading) return <PageSkeleton stats={3} rows={0} />;
  if (!user)     return (
    <div className="flex items-center justify-center py-20">
      <p className="text-text-secondary text-[13px]">User not found.</p>
    </div>
  );

  const initials = user.username
    ? user.username.charAt(0).toUpperCase()
    : "?";

  return (

      <div className="flex flex-col gap-6 max-w-2xl mx-auto">

        {/* ── Hero card ── */}
        <div className="bg-surface border border-border-default rounded-xl p-5 flex flex-col gap-5">
          {/* Top row — avatar + info + actions */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-accent/15 border-2 border-accent/25 flex items-center justify-center shrink-0">
              <span className="text-[22px] font-bold text-accent">{initials}</span>
            </div>

            {/* Name + email + since */}
            <div className="flex-1 min-w-0">
              <p className="text-[17px] font-bold text-text-primary tracking-tight truncate">
                {user.username}
              </p>
              <p className="text-[12px] text-text-tertiary mt-0.5 truncate">{user.email}</p>
              {user.created_at && (
                <p className="text-[11px] text-text-tertiary/60 mt-1.5">
                  Member since {formatMemberSince(user.created_at)}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <Button variant="secondary" size="sm">
                Edit profile
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<LogOut size={13} />}
                onClick={handleLogout}
              >
                Sign out
              </Button>
            </div>
          </div>

          {/* Social stats row — scaffold for follower/following */}
          <div className="flex items-center gap-4 pt-4 border-t border-border-default">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[16px] font-bold text-text-primary tabular-nums">
                {stats?.total_workouts ?? "—"}
              </span>
              <span className="text-[10px] text-text-tertiary">Workouts</span>
            </div>

            <div className="w-px h-6 bg-border-default" />

            <div className="flex flex-col items-center gap-0.5 opacity-40">
              <span className="text-[16px] font-bold text-text-tertiary">—</span>
              <span className="text-[10px] text-text-tertiary">Followers</span>
            </div>

            <div className="w-px h-6 bg-border-default opacity-40" />

            <div className="flex flex-col items-center gap-0.5 opacity-40">
              <span className="text-[16px] font-bold text-text-tertiary">—</span>
              <span className="text-[10px] text-text-tertiary">Following</span>
            </div>

            <div className="ml-auto">
              <ComingSoonBadge />
            </div>
          </div>
        </div>

        {/* ── Lifetime stats ── */}
        {stats && (
          <section>
            <SectionLabel>Lifetime stats</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Workouts", value: stats.total_workouts,         unit: ""     },
                { label: "Duration", value: stats.total_duration_minutes,  unit: "min"  },
                { label: "Calories", value: stats.total_calories_burned,   unit: "kcal" },
              ].map(({ label, value, unit }) => (
                <div
                  key={label}
                  className="bg-surface border border-border-default rounded-xl px-4 py-3"
                >
                  <p className="text-[20px] font-bold text-text-primary leading-none tabular-nums">
                    {formatLargeNum(value)}
                    {unit && (
                      <span className="text-[11px] font-normal text-text-tertiary ml-1">{unit}</span>
                    )}
                  </p>
                  <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider mt-1.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Profile details (gym, bio, location — future fields) ── */}
        <section>
          <SectionLabel>Details</SectionLabel>
          <div className="bg-surface border border-border-default rounded-xl overflow-hidden">
            {[
              { icon: <Building2 size={13} />, label: "Gym",      value: null },
              { icon: <AlignLeft  size={13} />, label: "Bio",      value: null },
              { icon: <MapPin     size={13} />, label: "Location", value: null },
            ].map(({ icon, label, value }, i, arr) => (
              <div
                key={label}
                className={[
                  "flex items-center gap-3 px-4 py-3",
                  i < arr.length - 1 ? "border-b border-border-default/60" : "",
                ].join(" ")}
              >
                <div className="w-7 h-7 rounded-lg bg-elevated flex items-center justify-center text-text-tertiary shrink-0">
                  {icon}
                </div>
                <span className="text-[12px] text-text-tertiary w-16 shrink-0">{label}</span>
                <span className="text-[13px] text-text-tertiary/50 italic flex-1">
                  {value ?? "Not set"}
                </span>
                <ComingSoonBadge />
              </div>
            ))}
          </div>
        </section>

      </div>
  );
}