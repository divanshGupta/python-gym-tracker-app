// Matches /stats/summary response
export interface WorkoutStats {
  total_workouts:          number;
  total_duration_minutes:  number;
  total_calories_burned:   number;
  workouts_by_type:        Record<string, number>;
  most_logged_exercise:    string | null;
}

// Matches /stats/personal_bests response
export interface PersonalBest {
  exercise:       string;
  max_weight_kg:  number;
}

export interface PersonalBests {
  personal_bests: PersonalBest[];
}

// Matches /stats/streak response
export interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_workout:   string | null;
}

// Matches /stats/progress/{exercise_id} response
export interface ProgressPoint {
  date:       string;
  max_weight: number;
}

export interface VolumePoint {
  date:   string;
  volume: number;
}

export interface ExerciseProgress {
  exercise_id:          number;
  max_weight_over_time: ProgressPoint[];
  volume_over_time:     VolumePoint[];
}