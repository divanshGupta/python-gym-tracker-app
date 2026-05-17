import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useWorkouts, useStreak } from "@gymtracker/hooks";
import { useAuthStore } from "@gymtracker/stores";
import { ContributionHeatmap } from "../components/contributions/ContributionHeatmap";
import { Button } from "../components/ui";
import { PageSkeleton } from "../components/ui";

// ── Helpers ────────────────────────────────────────────────────────────────

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  });
}

function relativeDay(dateStr: string): string {
  const today = new Date();
  const d     = new Date(dateStr);
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7)  return `${diff} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Workout type → badge colours (all using design tokens)
const TYPE_STYLES: Record<string, string> = {
  Strength:    "bg-accent/10 text-accent-light",
  Cardio:      "bg-success/10 text-success",
  Flexibility: "bg-warning/10 text-warning",
  Core:        "bg-accent/10 text-accent-light",
};

const TYPE_ICON: Record<string, string> = {
  Strength:    "dumbbell",
  Cardio:      "run",
  Flexibility: "yoga",
  Core:        "circles",
};

// ── Sub-components ─────────────────────────────────────────────────────────

function StreakPill({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-warning/8 border border-warning/18 text-warning text-[13px] font-semibold">
      {/* Flame — inline SVG to avoid lucide size inconsistency */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2c0 6-6 8-6 14a6 6 0 0 0 12 0c0-3-1.5-5-3-7-1 2-2 3-3 7-1-2-1-4 0-7z"/>
      </svg>
      {count}
      <span className="font-normal text-text-secondary text-[12px]">day streak</span>
    </span>
  );
}

function WorkoutRow({ workout }: { workout: any }) {
  const type       = workout.type ?? "Strength";
  const badgeClass = TYPE_STYLES[type] ?? "bg-elevated text-text-secondary";

  return (
    <Link
      to={`/workouts/${workout.id}`}
      className="flex items-center gap-3.5 px-3 py-2.5 rounded-lg hover:bg-elevated transition-colors duration-150 group"
    >
      {/* Icon box */}
      <div className="w-9 h-9 rounded-lg bg-elevated border border-border-default flex items-center justify-center shrink-0 text-text-tertiary group-hover:border-border-strong transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {type === "Cardio" ? (
            <><path d="M13 4v6l3 3-3 3v4"/><path d="M11 4v6l-3 3 3 3v4"/></>
          ) : (
            <><path d="M6 5v14"/><path d="M18 5v14"/><path d="M6 12h12"/><rect x="2" y="9" width="4" height="6" rx="1"/><rect x="18" y="9" width="4" height="6" rx="1"/></>
          )}
        </svg>
      </div>

      {/* Name + date */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-text-primary leading-snug truncate">
          {workout.name ?? workout.type ?? "Workout"}
        </p>
        <p className="text-[11px] text-text-tertiary mt-0.5">
          {relativeDay(workout.date)}
        </p>
      </div>

      {/* Duration + type badge */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        {workout.duration && (
          <span className="text-[12px] text-text-secondary">{workout.duration} min</span>
        )}
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
          {type}
        </span>
      </div>
    </Link>
  );
}

function FriendsPlaceholder() {
  return (
    <div className="flex items-center justify-between px-1 py-1 opacity-40 select-none">
      <div className="flex items-center gap-3">
        {/* Ghost avatars */}
        <div className="flex">
          {["A", "K", "R"].map((l, i) => (
            <div
              key={l}
              className="w-6 h-6 rounded-full bg-elevated border-2 border-void flex items-center justify-center text-[9px] font-semibold text-text-tertiary"
              style={{ marginLeft: i === 0 ? 0 : -6 }}
            >
              {l}
            </div>
          ))}
        </div>
        <span className="text-[13px] text-text-tertiary">Friends activity</span>
      </div>
      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-elevated text-text-tertiary border border-border-default">
        Coming soon
      </span>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const { user }                                               = useAuthStore();
  const { data: recentWorkouts = [], isLoading: wLoading }     = useWorkouts({ page: 1, limit: 3 });
  const { currentStreak, isLoading: sLoading }                 = useStreak();

  const firstName = user?.username
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : "Athlete";

  const isLoading = wLoading || sLoading;

  if (isLoading) return <PageSkeleton stats={0} rows={3} />;

  return (
    <div className="flex flex-col gap-7 px-6 py-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-widest mb-1.5">
            {formatDate()}
          </p>
          <h1 className="text-[24px] md:text-[30px] font-bold text-text-primary tracking-tight leading-tight">
            {greeting()},{" "}
            <span className="text-accent">{firstName}</span>
          </h1>
          <StreakPill count={currentStreak ?? 0} />
        </div>

        <div className="shrink-0 pt-1">
          <Button
            icon={<Plus size={14} />}
            onClick={() => navigate("/workouts/create")}
          >
            Log workout
          </Button>
        </div>
      </div>

      {/* ── Activity heatmap ── */}
      <ContributionHeatmap />

      {/* ── Recent workouts ── */}
      <div className="bg-surface border border-border-default rounded-xl overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="text-[13px] font-semibold text-text-primary">Recent workouts</h2>
          <Link
            to="/workouts"
            className="text-[12px] text-accent font-medium hover:text-accent-light transition-colors"
          >
            View all
          </Link>
        </div>

        {/* Rows */}
        {recentWorkouts.length === 0 ? (
          <div className="flex flex-col items-center text-center px-6 py-10">
            <div className="w-10 h-10 rounded-xl bg-elevated flex items-center justify-center text-text-tertiary mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="9" width="4" height="6" rx="1"/><rect x="18" y="9" width="4" height="6" rx="1"/><path d="M6 12h12"/><path d="M6 5v14"/><path d="M18 5v14"/>
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-text-primary mb-1">No workouts yet</p>
            <p className="text-[12px] text-text-secondary mb-4 max-w-55">
              Log your first session to start building your streak.
            </p>
            <Button size="sm" onClick={() => navigate("/workouts/create")}>
              Start now
            </Button>
          </div>
        ) : (
          <div className="px-2 pb-2">
            {recentWorkouts.map((w, i) => (
              <div key={w.id}>
                <WorkoutRow workout={w} />
                {i < recentWorkouts.length - 1 && (
                  <div className="h-px bg-border-default mx-3" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Social scaffold (future) ── */}
      <div className="bg-surface border border-border-default rounded-xl px-5 py-4">
        <FriendsPlaceholder />
      </div>

    </div>
  );
}