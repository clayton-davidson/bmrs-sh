import { Base } from "./base";

export interface AuditableBase extends Base {
  createdAt?: Date | null;
  createdBy?: string | null;
  lastModifiedAt?: Date | null;
  lastModifiedBy?: string | null;
}
