import { AuditableBase } from "../core/auditable-base";

export interface Product extends AuditableBase {
  name: string;
  productGroup: string;
  productGroupId: number;
  productPlanId: number;
  straightenerSpread: number;
  startedAt: Date;
}
