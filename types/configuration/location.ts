import { AuditableBase } from "../core/auditable-base";

export interface Location extends AuditableBase {
  name: string;
  layers: number;
  isDirty: boolean;
}
