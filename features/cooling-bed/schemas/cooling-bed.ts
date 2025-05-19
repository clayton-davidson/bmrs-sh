import { createValidator } from "@/lib/utils";
import { z } from "zod";

const commonFields = {
  MULT_ID: z.string().nullable(),
  SP_ID: z.string().nullable(),
  PROD_SIZE: z.string().nullable(),
  SEQ: z.number(),
  HEAT_ID: z.string().nullable(),
  MULT_LEN: z.string().nullable(),
};

const dateFields = {
  ROLL_DATE: z.date().nullable(),
  STR_DATE: z.date().nullable(),
  LOSS_DATE: z.date().nullable(),
};

const baseCoolingBedSchema = z.object({
  ...commonFields,
  ...dateFields,
});

export const currentCoolingBedSchema = baseCoolingBedSchema.extend({
  RHF_TEMP: z.number(),
  TMP_W: z.number(),
  TMP_F: z.number(),
  TMP_Q: z.number(),
});

export const chargedCoolingBedSchema = baseCoolingBedSchema.extend({
  RHF_TEMP: z.number(),
  TMP_W: z.number(),
  TMP_F: z.number(),
  TMP_Q: z.number(),
});

export const dischargedCoolingBedSchema = baseCoolingBedSchema.extend({
  TEMP1: z.number(),
  TEMP2: z.number(),
});

export const historyCoolingBedSchema = z.object({
  MULTIPLE_ID: z.string().nullable(),
  SEMIPRODUCT_NO: z.coerce.string(),
  JOB_ID: z.string(),
  PROD_SIZE: z.string().nullable(),
  MULT_LEN: z.number(),
  REHEATING_DATE: z.date().nullable(),
  ROLLING_DATE: z.date().nullable(),
  SEMIPRODUCT_CODE: z.coerce.string(),
  STR_TEMP_1: z.number(),
  TGT_WEIGHT: z.number(),
  SCALE_WGT: z.number().nullable(),
  DELTA: z.number().nullable(),
});

export const minimalCoolingBedSchema = z.object({
  SEQ: z.number(),
  PROD_SIZE: z.string().nullable(),
  HEAT_ID: z.string().nullable(),
  MULT_LEN: z.string().nullable(),
  RHF_TEMP: z.number(),
  TMP_F: z.number(),
  CREW: z.string().nullable(),
  MULT_ID: z.string().nullable(),
  WEIGHT_DELTA: z.number(),
});

export const coolingBedCountSchema = z.object({
  BAR_COUNT: z.number(),
});

export const coolingBedResponseSchema = z.object({
  barCount: z.number(),
  bars: z.array(minimalCoolingBedSchema),
});

export type CurrentCoolingBed = z.infer<typeof currentCoolingBedSchema>;
export type ChargedCoolingBed = z.infer<typeof chargedCoolingBedSchema>;
export type DischargedCoolingBed = z.infer<typeof dischargedCoolingBedSchema>;
export type HistoryCoolingBed = z.infer<typeof historyCoolingBedSchema>;
export type MinimalCoolingBed = z.infer<typeof minimalCoolingBedSchema>;
export type CoolingBedCount = z.infer<typeof coolingBedCountSchema>;
export type CoolingBedResponse = z.infer<typeof coolingBedResponseSchema>;

export const validateCurrentCoolingBedRows = createValidator(
  currentCoolingBedSchema
);
export const validateChargedCoolingBedRows = createValidator(
  chargedCoolingBedSchema
);
export const validateDischargedCoolingBedRows = createValidator(
  dischargedCoolingBedSchema
);
export const validateHistoryCoolingBedRows = createValidator(
  historyCoolingBedSchema
);
export const validateMinimalCoolingBedRows = createValidator(
  minimalCoolingBedSchema
);
