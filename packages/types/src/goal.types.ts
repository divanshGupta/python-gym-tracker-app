export type GoalType =
  | "workout_frequency"
  | "lift_target"
  | "body_weight"
  | "progressive_overload";

export type GoalStatus = "active" | "completed" | "abandoned";

export interface GoalProgress {
  id:        number;
  goal_id:   number;
  value:     number;
  date:      string;       // "YYYY-MM-DD"
  notes:     string | null;
  logged_at: string;       // ISO datetime
}

export interface Goal {
  id:            number;
  user_id:       number;
  title:         string;
  goal_type:     GoalType;
  target_value:  number;
  current_value: number | null;
  unit:          string | null;
  exercise_id:   number | null;
  deadline:      string | null;  // "YYYY-MM-DD"
  status:        GoalStatus;
  created_at:    string;
  progress:      GoalProgress[];
}

// ── Payloads ───────────────────────────────────────────────────────────────

export interface CreateGoalPayload {
  title:        string;
  goal_type:    GoalType;
  target_value: number;
  unit?:        string;
  exercise_id?: number;
  deadline?:    string;
}

export interface UpdateGoalPayload {
  title?:        string;
  target_value?: number;
  deadline?:     string;
  status?:       GoalStatus;
}

export interface LogGoalProgressPayload {
  value: number;
  date:  string;
  notes?: string;
}