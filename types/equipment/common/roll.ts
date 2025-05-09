import { MillSize } from "./mill-size";

export interface Roll {
  id: number;
  name: string;
  material: string;
  materialId: number;
  item: string;
  itemId: number;
  status: string;
  createdAt: string;
  millSize: string;
  millSizeId: MillSize;
  cost: number;
  diameter: number;
  startDiameter: number;
  scrapDiameter: number;
  rollBarrel: string;
  setName: string;
  setId: number;
  location: string;
  locationId: number;
  purchaseOrder: string;
  purchaseOrderId: number;
  hardness: number;
  receivedAt: Date;
  lastTurnedAt: Date;
}
