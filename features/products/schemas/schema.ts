import { createValidator } from "@/lib/utils";
import { string, z } from "zod";

export const productSchema = z.object({
  PROFILE_ID: z.string(),
  ASTM: string(),
});

export type Product = z.infer<typeof productSchema>;

export const validateProducts = createValidator(productSchema);
