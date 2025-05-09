"use server";

import config from "@/lib/data/config/mssql";
import sql from "mssql";
import { ActiveLineup } from "@/types/home/active-lineup";

export async function getActiveProductPlan(): Promise<ActiveLineup[]> {
  const pool = await sql.connect(config);

  const result = await pool.request().query<ActiveLineup>(`
    SELECT
        ft.stand
        , rs.Id setId
        , rs.setName
        , t1.WebWidth topWebWidth
        , t2.WebWidth bottomWebWidth
        , tr.Name topFoundryNumber
        , ROUND(t1.Diameter, 3) topDiameter
        , br.Name bottomFoundryNumber
        , ROUND(t2.Diameter, 3) bottomDiameter
        , tr.Id topRollId
        , br.Id bottomRollId
        , mp.passLocation
        , dt.Name driveTopChock
        , db.Name driveBottomChock
        , ot.Name operatorTopChock
        , ob.Name operatorBottomChock
        , dt.Id driveTopChockId
        , db.Id driveBottomChockId
        , ot.Id operatorTopChockId
        , ob.Id operatorBottomChockId
    FROM
        ProductPlan pp
    INNER JOIN FamilyTree ft ON pp.ProductId = ft.ProductId
    INNER JOIN v_ActiveMillPlan mp ON mp.ProductPlanId = pp.Id AND ft.Id = mp.FamilyTreeId
    INNER JOIN MillPlanExecution mpe ON mp.Id = mpe.MillPlanId
    LEFT JOIN v_ActiveRollSets rs ON mp.RollSetId = rs.Id
    LEFT JOIN v_AllRollsSimple tr ON rs.TopRollId = tr.ID
    LEFT JOIN v_AllRollsSimple br ON rs.BottomRollId = br.ID
    LEFT JOIN v_LatestTurnCorrelated t1 ON t1.RollId = rs.TopRollId
    LEFT JOIN v_LatestTurnCorrelated t2 ON t2.RollId = rs.BottomRollId
    LEFT JOIN Chock dt ON mp.DriveTopChockId = dt.Id
    LEFT JOIN Chock db ON mp.DriveBottomChockId = db.Id
    LEFT JOIN Chock ot ON mp.OperatorTopChockId = ot.Id
    LEFT JOIN Chock ob ON mp.OperatorBottomChockId = ob.Id
    WHERE
        pp.StartedAt IS NOT NULL 
        AND pp.StoppedAt IS NULL
        AND mpe.StartedAt IS NOT NULL
        AND mpe.StoppedAt IS NULL
    ORDER BY
        ft.Stand`);

  return result.recordset;
}
