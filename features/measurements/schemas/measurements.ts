import { createValidator } from "@/lib/utils";
import { z } from "zod";

export const measurementSchema = z.object({
  typeId: z.number(),
  reading: z.number(),
  takenAt: z.date(),
});

export const measurementTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  unit: z.string().nullable(),
  capacity: z.number(),
});

export type Measurement = z.infer<typeof measurementSchema>;
export type MeasurementType = z.infer<typeof measurementTypeSchema>;

export const validateMeasurementRows = createValidator(measurementSchema);
export const validateMeasurementTypeRows = createValidator(
  measurementTypeSchema
);
