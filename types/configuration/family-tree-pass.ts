import { Base } from "../core/base";

export interface FamilyTreePass extends Base {
  pass: string;
  familyTreeId: number;
  passId: number;
  stand: number;
  isRemovable: boolean;
}
