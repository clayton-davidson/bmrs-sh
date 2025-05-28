import { createValidator, formatDate } from "@/lib/utils";
import { z } from "zod";

function calculateDuration(startTime: Date, stopTime: Date | null) {
  if (!stopTime) return { formatted: "Ongoing", minutes: 0 };

  const durationMs = stopTime.getTime() - startTime.getTime();
  const totalMinutes = Math.floor(durationMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

  const formatted = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return { formatted, minutes: totalMinutes };
}

const rawMorningMeetingDelaySchema = z.object({
  DELAY_ID: z.number(),
  START_TIME: z.date(),
  STOP_TIME: z.date().nullable(),
  AREA: z.string().nullable(),
  CREW: z.string().nullable(),
  REASON: z.string().nullable(),
  NOTES: z.string().nullable(),
  PROD_SIZE: z.string().nullable(),
});

const rawQualitySchema = z.object({
  PRODUCTID: z.string().nullable(),
  CREW: z.string().nullable(),
  WEIGHT: z.number(),
  PIECES: z.number(),
  LENGTH: z.string().nullable(),
  DEFECT: z.string().nullable(),
  DISPOSITION: z.string().nullable(),
  ENTRYDATE: z.date(),
  HEAT: z.number(),
  SCRAPCOMMENT: z.string().nullable(),
});

const rawStockAnalysisSchema = z.object({
  PRODUCT: z.string().nullable(),
  GRADE: z.string().nullable(),
  TESTCODE: z.string().nullable(),
  FEET: z.number(),
  INCHES: z.number(),
  SHIPPEDTONS: z.number(),
  STOCKTONS: z.number(),
});

export const morningMeetingDelaySchema = rawMorningMeetingDelaySchema.transform(
  (data) => {
    const duration = calculateDuration(data.START_TIME, data.STOP_TIME);
    return {
      ...data,
      START_TIME_FORMATTED: formatDate(data.START_TIME),
      DURATION: duration.formatted,
      DURATION_MINUTES: duration.minutes,
    };
  }
);

export const qualitySchema = rawQualitySchema.transform((data) => ({
  ...data,
  ENTRYDATE_FORMATTED: formatDate(data.ENTRYDATE),
}));

export const rawFailingHeatSchema = z.object({
  HEAT: z.number(),
  PRODUCT: z.string().nullable(),
  GRADE: z.string().nullable(),
});

export const failingHeatSchema = z.object({
  HEAT: z.number(),
  PRODUCT: z.string().nullable(),
  GRADE: z.string().nullable(),
  COMMENT: z.string().nullable(),
});

export const failingHeatCommentSchema = z.object({
  HEAT: z.number(),
  COMMENT: z.string().nullable(),
});

export const stockAnalysisSchema = z.object({
  PRODUCT: z.string().nullable(),
  FEET: z.number(),
  INCHES: z.number(),
  GRADE: z.string().nullable(),
  TESTCODE: z.string().nullable(),
  STOCKTONS: z.number(),
  SHIPPEDTONS: z.number(),
  CUMSHIP: z.number(),
  CUMPERCENT: z.number(),
  CUMSKU: z.number(),
  CUMSKUPERCENT: z.number(),
  ABC: z.string().nullable(),
  EWU: z.number(),
  WOH: z.number(),
});

export const bundleReconciliationSchema = z.object({
  BUNDLECOUNT: z.number(),
  PROFILEASTM: z.string().nullable(),
  GRADECAST: z.string().nullable(),
  TESTCODE: z.string().nullable(),
  FEET: z.number(),
  INCHES: z.number(),
  ROLLYEAR: z.number(),
  ROLLWEEK: z.number(),
  STATUS: z.number(),
});

export const additionSchema = z.object({
  PRODUCT: z.string().nullable(),
  GRADECAST: z.string().nullable(),
  TESTCODE: z.string().nullable(),
  BUNDLELENGTH: z.number(),
  ADDITION: z.number(),
  ROLLWEEK: z.number(),
  ROLLYEAR: z.number(),
});

export type RawMorningMeetingDelay = z.infer<
  typeof rawMorningMeetingDelaySchema
>;
export type MorningMeetingDelay = z.infer<typeof morningMeetingDelaySchema>;
export type RawQuality = z.infer<typeof rawQualitySchema>;
export type Quality = z.infer<typeof qualitySchema>;
export type RawFailingHeat = z.infer<typeof rawFailingHeatSchema>;
export type FailingHeat = z.infer<typeof failingHeatSchema>;
export type FailingHeatComment = z.infer<typeof failingHeatCommentSchema>;
export type RawStockAnalysis = z.infer<typeof rawStockAnalysisSchema>;
export type StockAnalysis = z.infer<typeof stockAnalysisSchema>;
export type BundleReconciliation = z.infer<typeof bundleReconciliationSchema>;
export type Addition = z.infer<typeof additionSchema>;

export const validateMorningMeetingDelayRows = createValidator(
  morningMeetingDelaySchema
);
export const validateQualityRows = createValidator(qualitySchema);
export const validateFailingHeatRows = createValidator(rawFailingHeatSchema);
export const validateFailingHeatCommentRows = createValidator(
  failingHeatCommentSchema
);
export const validateRawStockAnalysisRows = createValidator(
  rawStockAnalysisSchema
);
export const validateStockAnalysisRows = createValidator(stockAnalysisSchema);
export const validateBundleReconciliationRows = createValidator(
  bundleReconciliationSchema
);
export const validateAdditionRows = createValidator(additionSchema);
