// packages/api-client/src/measurements.api.ts
import { apiClient } from "./client";

import type {
  Measurement,
  CreateMeasurementPayload,
} from "@gymtracker/types";

export const measurementsApi = {
  getAll: () =>
    apiClient.get<Measurement[]>("/measurements"),

  create: (data: CreateMeasurementPayload) =>
    apiClient.post<Measurement>("/measurements", data),

  delete: (id: number) =>
    apiClient.delete(`/measurements/${id}`),

};