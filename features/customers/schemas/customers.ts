import { createValidator } from "@/lib/utils";
import { z } from "zod";

export const customerSchema = z.object({
  CUSTOMER: z.number(),
  CUSTOMERNAME: z.string().nullable(),
  COUNTRYCODE: z.string().nullable(),
  STATECODE: z.string().nullable(),
  CITY: z.string().nullable(),
  CREATEDATE: z.string().nullable(),
});

export const customerOrderSchema = z.object({
  CUSTOMER: z.string(),
  TONS: z.number(),
  TONSSHIPPED: z.number(),
  BUNDLESORDERED: z.number().nullable(),
  PRODUCT: z.string().nullable(),
  ORDERDATE: z.string().nullable(),
});

export const productBreakdownSchema = z.object({
  product: z.string().nullable(),
  customer: z.number(),
  tons: z.number(),
  bundlesOrdered: z.number(),
});

export const orderEntrySchema = z.object({
  orderDate: z.date(),
  tons: z.number(),
});

export const processedCustomerDataSchema = z.object({
  tonsOrderedPastYear: z.number(),
  tonsShippedPastYear: z.number(),
  fulfillmentRate: z.string(),
  breakdownBySection: z.array(productBreakdownSchema),
  orderEntries: z.array(orderEntrySchema),
});

export type CustomerOrder = z.infer<typeof customerOrderSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type ProductBreakdown = z.infer<typeof productBreakdownSchema>;
export type OrderEntry = z.infer<typeof orderEntrySchema>;
export type ProcessedCustomerData = z.infer<typeof processedCustomerDataSchema>;

export const validateCustomerRows = createValidator(customerSchema);
export const validateCustomerOrderRows = createValidator(customerOrderSchema);
export const validateProductBreakdownRows = createValidator(
  productBreakdownSchema
);
export const validateOrderEntryRows = createValidator(orderEntrySchema);
export const validateProcessedCustomerData = createValidator(
  processedCustomerDataSchema
);
