import { z } from "zod";
import { AuditableBase } from "../core/auditable-base";

export const ItemSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
});

export type ItemFormValues = z.infer<typeof ItemSchema>;
export type Item = ItemFormValues & AuditableBase;
