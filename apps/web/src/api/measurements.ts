import api from "./axios"
import type { Measurement } from "../types"

export const getMeasurements = () =>
  api.get<Measurement[]>("/measurements/").then((r) => r.data)

export const logMeasurement = (data: {
  date: string
  weight_kg: number
  height_cm?: number
  notes?: string
}) => api.post<Measurement>("/measurements/", data).then((r) => r.data)

export const deleteMeasurement = (id: number) =>
  api.delete(`/measurements/${id}`)