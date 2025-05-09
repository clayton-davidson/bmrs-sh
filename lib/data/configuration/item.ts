"use server";

import { Item, ItemFormValues } from "@/types/configuration/item";
import config from "@/lib/data/config/mssql";
import sql from "mssql";

export async function getItems(): Promise<Item[]> {
  const pool = await sql.connect(config);
  const result = await pool.request().query<Item>(`
    SELECT
       id
       , [name]
    FROM
       Item
    ORDER BY
       [name]`);

  return result.recordset;
}

export async function mergeItem(
  item: ItemFormValues,
  userId: string
): Promise<Item> {
  const pool = await sql.connect(config);
  const request = pool
    .request()
    .input("Id", sql.Int, item.id || 0)
    .input("Name", sql.NVarChar, item.name)
    .input("CreatedBy", sql.NVarChar, userId)
    .input("LastModifiedBy", sql.NVarChar, userId);

  const result = await request.query<Item>(`
    DECLARE @InsertedId TABLE (Id INT);
    MERGE INTO Item AS target
    USING (SELECT @Id AS Id, @Name AS Name, @CreatedBy as CreatedBy, @LastModifiedBy AS LastModifiedBy) AS source
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
        , s.name
    FROM
        Item s
    WHERE
        s.Id = CASE WHEN @Id = 0 THEN (SELECT Id FROM @InsertedId) ELSE @Id END;`);

  return result.recordset[0];
}
