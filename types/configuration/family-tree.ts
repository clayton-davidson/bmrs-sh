import { AuditableBase } from "../core/auditable-base";

export interface FamilyTree extends AuditableBase {
  productId: number;
  product: string;
  stand: number;
  pass: string;
  minWebWidth: number | null;
  newWebWidth: number;
  spread: number | null;
}
