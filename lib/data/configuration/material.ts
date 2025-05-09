"use server";

import config from "@/lib/data/config/mssql";
import { Material } from "@/types/configuration";
import sql from "mssql";

export async function getMaterials(): Promise<Material[]> {
  const pool = await sql.connect(config);
  const result = await pool.request().query<Material>(`
    SELECT
       id
       , [name]
    FROM
       Material
    ORDER BY
       [name]`);

  return result.recordset;
}

export async function mergeMaterial(
  material: Material,
  userId: string
): Promise<Material> {
  const pool = await sql.connect(config);
  const request = pool
    .request()
    .input("Id", sql.Int, material.id || 0)
    .input("Name", sql.NVarChar, material.name)
    .input("CreatedBy", sql.NVarChar, userId)
    .input("LastModifiedBy", sql.NVarChar, userId);

  const result = await request.query<Material>(`
    DECLARE @InsertedId TABLE (Id INT);
    MERGE INTO Material AS target
    USING (SELECT @Id AS Id, @Name AS Name, @CreatedBy AS CreatedBy, @LastModifiedBy AS LastModifiedBy) AS source
    ON (target.Id = source.Id)
    WHEN MATCHED THEN
        UPDATE SET
            Name = source.Name
            , LastModifiedBy = source.LastModifiedBy
    WHEN NOT MATCHED THEN
        INSERT (Name, CreatedBy)
        VALUES (source.Name, source.CreatedBy)
    OUTPUT INSERTED.Id INTO @InsertedId;

    SELECT
        s.id
        , s.[name]
    FROM
        Material s
    WHERE
        s.Id = CASE WHEN @Id = 0 THEN (SELECT Id FROM @InsertedId) ELSE @Id END;`);

  return result.recordset[0];
}
