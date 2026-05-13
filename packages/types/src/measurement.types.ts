// packages/types/src/measurement.types.ts
export interface Measurement {
  id: number
  user_id: number
  date: string
  weight_kg: number
  height_cm?: number
  bmi?: number
  notes?: string
  created_at: string
}

// payloads

export interface CreateMeasurementPayload {
  date: string
  weight_kg: number
  height_cm?: number
  notes?: string
}