import { createValidator } from "@/lib/utils";
import { z } from "zod";

const commonFields = {
  COUNT: z.number().nullable(),
  WEIGHT: z.number().nullable(),
};

export const bloomYardInventorySchema = z.object({
  STRAND: z.string().nullable(),
  SEQ: z.string().nullable(),
  BLOOM_ID: z.string().nullable(),
  CREATE_DTM: z.date(),
  LOCATION: z.string().nullable(),
  MOLD_SIZE: z.string().nullable(),
  GRADE_CODE: z.string().nullable(),
  LENGTH: z.string().nullable(),
  CHARGE_MODE: z.string().nullable(),
  ORDER_ID: z.number().nullable(),
  ORDER_DESCR: z.string().nullable(),
  WEIGHT: z.number(),
});

export const bloomYardBalanceSchema = z.object({
  ITEM: z.string().nullable(),
  ...commonFields,
});

export const bloomYardSchema = z.object({
  ITEM: z.string().nullable(),
  ...commonFields,
  LENGTH: z.number().nullable(),
});

export const bloomYardCurrentSchema = z.object({
  SEMIPROD: z.string().nullable(),
  LOCATION: z.string().nullable(),
  GRADE: z.string().nullable(),
  ORD_LENGTH: z.string().nullable(),
  ...commonFields,
  LENGTH: z.number().nullable(),
});

export const bloomYardEndSchema = z.object({
  SEMIPROD: z.string().nullable(),
  ...commonFields,
  RECORDDATE: z.date().nullable(),
});

export type BloomYardInventory = z.infer<typeof bloomYardInventorySchema>;
export type BloomYardBalance = z.infer<typeof bloomYardBalanceSchema>;
export type BloomYard = z.infer<typeof bloomYardSchema>;
export type BloomYardCurrent = z.infer<typeof bloomYardCurrentSchema>;
export type BloomYardEnd = z.infer<typeof bloomYardEndSchema>;

export const validateBloomYardInventoryRows = createValidator(
  bloomYardInventorySchema
);
export const validateBloomYardBalanceRows = createValidator(
  bloomYardBalanceSchema
);
export const validateBloomYardRows = createValidator(bloomYardSchema);
export const validateBloomYardCurrentRows = createValidator(
  bloomYardCurrentSchema
);
export const validateBloomYardEndRows = createValidator(bloomYardEndSchema);
