"use server";

import config from "@/lib/data/config/mssql";
import { Pass } from "@/types/configuration/pass";
import sql from "mssql";

export async function getPasses(): Promise<Pass[]> {
  const pool = await sql.connect(config);
  const result = await pool.request().query<Pass>(`
        SELECT
            id
            , [name]
            , description
        FROM
            Pass`);

  return result.recordset;
}

export async function mergePass(pass: Pass, userId: string): Promise<Pass> {
  const pool = await sql.connect(config);
  const request = pool
    .request()
    .input("Id", sql.Int, pass.id || 0)
    .input("Name", sql.NVarChar, pass.name)
    .input("Description", sql.NVarChar, pass.description)
    .input("CreatedBy", sql.NVarChar, userId)
    .input("LastModifiedBy", sql.NVarChar, userId);

  const result = await request.query<Pass>(`
    DECLARE @InsertedId TABLE (Id INT);

    MERGE INTO Pass AS target
    USING (SELECT @Id AS Id, @Name AS Name, @Description AS Description, @CreatedBy AS CreatedBy, @LastModifiedBy AS LastModifiedBy) AS source
    ON (target.Id = source.Id)
    WHEN MATCHED THEN
        UPDATE SET
            Name = source.Name
            , Description = source.Description
            , LastModifiedBy = source.LastModifiedBy 
    WHEN NOT MATCHED THEN
        INSERT (Name, Description, CreatedBy)
        VALUES (source.Name, source.Description, source.CreatedBy)
    OUTPUT INSERTED.Id INTO @InsertedId;

    SELECT 
        id
        , [name]
        , description
    FROM Pass
    WHERE Id = CASE 
        WHEN @Id = 0 THEN (SELECT Id FROM @InsertedId) 
        ELSE @Id 
    END;`);

  return result.recordset[0];
}
