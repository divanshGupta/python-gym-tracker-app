export interface Measurement {
  id:         number;
  user_id:    number;
  date:       string;           // "YYYY-MM-DD"
  weight_kg:  number;
  height_cm:  number | null;
  bmi:        number | null;    // computed by backend
  notes:      string | null;
  created_at: string;
}

export interface CreateMeasurementPayload {
  date:       string;
  weight_kg:  number;
  height_cm?: number;           // optional — backend falls back to last known
  notes?:     string;
}