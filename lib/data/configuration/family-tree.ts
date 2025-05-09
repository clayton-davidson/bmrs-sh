"use server";

import config from "@/lib/data/config/mssql";
import { FamilyTree } from "@/types/configuration/family-tree";
import { FamilyTreePass } from "@/types/configuration/family-tree-pass";
import sql from "mssql";

export async function getFamilyTree(productId: number): Promise<FamilyTree[]> {
  const pool = await sql.connect(config);
  const request = pool.request().input("productId", sql.Int, productId);

  const result = await request.query<FamilyTree>(`
            SELECT
               ft.id
               , ft.stand
               , STRING_AGG(CONCAT(p.Name, ''), ', ') WITHIN GROUP (ORDER BY p.Id) pass
               , ft.minWebWidth
               , ft.spread
            FROM
                FamilyTree ft
            LEFT JOIN FamilyTreePass ftp ON ft.Id = ftp.FamilyTreeId 
            LEFT JOIN Pass p ON ftp.PassId = p.Id
            WHERE 
                ft.ProductId = @productId
            GROUP BY
                ft.Id
                , ft.Stand
                , ft.MinWebWidth
                , ft.Spread`);

  return result.recordset;
}

export async function getFamilyTreePasses(
  familyTreeId: number
): Promise<FamilyTreePass[]> {
  const pool = await sql.connect(config);
  const request = pool.request().input("familyTreeId", sql.Int, familyTreeId);

  const result = await request.query<FamilyTreePass>(`
            SELECT
                ftp.id
                , p.Id AS passId
                , p.name
                , MAX(CASE WHEN mp.FamilyTreeId IS NOT NULL THEN 1 ELSE 0 END) isRemovable
                , ftp.familyTreeId
            FROM
                FamilyTreePass ftp
            LEFT JOIN
                Pass p ON ftp.PassId = p.Id
            LEFT JOIN
                v_ActiveMillPlan mp ON mp.FamilyTreeId = ftp.FamilyTreeId
            WHERE
                ftp.FamilyTreeId = @familyTreeId
            GROUP BY
                ftp.Id
                , p.Id
                , p.Name
                , ftp.FamilyTreeId
  `);

  return result.recordset;
}

export async function updateFamilyTree(
  familyTree: FamilyTree,
  passes: FamilyTreePass[],
  userId: string
) {
  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const updateFamilyTreeRequest = new sql.Request(transaction);
    updateFamilyTreeRequest
      .input("Id", sql.Int, familyTree.id)
      .input("MinWebWidth", sql.Decimal(15, 3), familyTree.minWebWidth)
      .input("Spread", sql.Decimal(15, 3), familyTree.spread)
      .input("UserId", sql.NVarChar(256), userId);

    await updateFamilyTreeRequest.query(`
        UPDATE
            FamilyTree
        SET
            MinWebWidth = @MinWebWidth
            , Spread = @Spread
            , LastModifiedBy = @UserId
        WHERE
            Id = @Id
    `);

    if (passes.length === 0) {
      const deleteAllPassesRequest = new sql.Request(transaction);
      deleteAllPassesRequest.input("familyTreeId", sql.Int, familyTree.id);

      await deleteAllPassesRequest.query(`
        DELETE FROM FamilyTreePass 
        WHERE FamilyTreeId = @familyTreeId
      `);
    } else {
      const passValues = passes
        .map((p) => `(${familyTree.id}, ${p.passId})`)
        .join(", ");

      const mergePassRequest = new sql.Request(transaction);

      await mergePassRequest.query(`
        MERGE INTO FamilyTreePass AS target
        USING (
          SELECT FamilyTreeId, PassId 
          FROM (VALUES ${passValues}) AS source(FamilyTreeId, PassId)
        ) AS source
        ON target.FamilyTreeId = source.FamilyTreeId AND target.PassId = source.PassId
        WHEN NOT MATCHED THEN
          INSERT (FamilyTreeId, PassId)
          VALUES (source.FamilyTreeId, source.PassId);
      `);

      const passIds = passes.map((p) => p.passId).join(",");

      const deleteUnusedPassesRequest = new sql.Request(transaction);
      deleteUnusedPassesRequest.input("familyTreeId", sql.Int, familyTree.id);

      await deleteUnusedPassesRequest.query(`
        DELETE FROM FamilyTreePass 
        WHERE FamilyTreeId = @familyTreeId 
        AND PassId NOT IN (${passIds})
      `);
    }

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating family tree:", error);
    return false;
  }
}
