"use server";

import { Location } from "@/types/configuration/location";
import config from "@/lib/data/config/mssql";
import sql from "mssql";

const getLocations = async (): Promise<Location[]> => {
  const pool = await sql.connect(config);
  const result = await pool.request().query<Location>(`
    SELECT
        id
        , "name"
        , layers
        , isDirty
    FROM
        Location
    ORDER BY
        "name"
   `);

  return result.recordset;
};

const mergeLocation = async (
  location: Location,
  userId: string
): Promise<Location> => {
  const pool = await sql.connect(config);
  const request = pool
    .request()
    .input("Id", sql.Int, location.id)
    .input("Name", sql.NVarChar(255), location.name)
    .input("Layers", sql.Int, location.layers)
    .input("IsDirty", sql.Bit, location.isDirty)
    .input("CreatedBy", sql.NVarChar(255), userId)
    .input("LastModifiedBy", sql.NVarChar(255), userId);

  const result = await request.query<Location>(`
    DECLARE @InsertedId TABLE (Id INT);

    MERGE INTO Location AS target
    USING (SELECT @Id AS Id, @Name AS Name, @Layers AS Layers, @IsDirty AS IsDirty, @LastModifiedBy AS LastModifiedBy, @CreatedBy AS CreatedBy) AS source
    ON (target.Id = source.Id)
    WHEN MATCHED THEN
        UPDATE SET
            Name = source.Name
            , Layers = source.Layers
            , IsDirty = source.IsDirty
            , LastModifiedBy = source.LastModifiedBy
    WHEN NOT MATCHED THEN
        INSERT (Name, Layers, IsDirty, CreatedBy)
        VALUES (source.Name, source.Layers, source.IsDirty, source.CreatedBy)
    OUTPUT INSERTED.Id INTO @InsertedId;

    SELECT
        l.id
        , l.[name]
        , l.layers
        , l.isDirty
    FROM
        Location l
    WHERE
        l.Id = CASE WHEN @Id = 0 THEN (SELECT Id FROM @InsertedId) ELSE @Id END;
  `);

  return result.recordset[0];
};

export { getLocations, mergeLocation };
