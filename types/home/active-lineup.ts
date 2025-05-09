export interface ActiveLineup {
  stand: number;
  setId: number;
  setName: string;
  topWebWidth: number;
  bottomWebWidth: number;
  topFoundryNumber: string;
  topDiameter: number;
  bottomFoundryNumber: string;
  bottomDiameter: number;
  topRollId: number;
  bottomRollId: number;
  passLocation: number;
  driveTopChock: string;
  driveBottomChock: string;
  operatorTopChock: string;
  operatorBottomChock: string;
  driveTopChockId: number;
  driveBottomChockId: number;
  operatorTopChockId: number;
  operatorBottomChockId: number;
}
