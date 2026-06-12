// Matches /stats/summary response
export interface WorkoutStats {
  total_workouts: number;
  total_duration_minutes: number;
  total_calories_burned: number;
  workouts_by_type: Record<string, number>;
  most_logged_exercise: string | null;
}

// Matches /stats/personal_bests response
export interface PersonalBest {
  exercise: string;
  max_weight_kg: number;
}

export interface PersonalBests {
  personal_bests: PersonalBest[];
}

// Matches /stats/streak response
export interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_workout: string | null;
}

// Matches /stats/progress/{exercise_id} response
export interface ProgressPoint {
  date: string;
  max_weight: number;
}

export interface VolumePoint {
  date: string;
  volume: number;
}

export interface ExerciseProgress {
  exercise_id: number;
  max_weight_over_time: ProgressPoint[];
  volume_over_time: VolumePoint[];
}

export interface ContributionDay {
  date: string; // "YYYY-MM-DD"
  count: number;
}

export interface ContributionsResponse {
  source: string;
  from: string;
  to: string;
  contributions: ContributionDay[];
}

export interface ProgressionResult {
  exercise_id: number;
  exercise_name: string;
  sessions_analyzed: number;
  suggestion:
    | "increase_weight"
    | "maintain"
    | "reduce_weight"
    | "insufficient_data";
  suggestion_text: string;
  current_weight: number;
  suggested_weight: number;
}
