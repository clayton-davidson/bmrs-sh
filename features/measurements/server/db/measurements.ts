"use server";

import dbConfig from "@/lib/data/config/mssql";
import sql from "mssql";
import { Measurement, MeasurementType } from "../../schemas/measurements";

export async function getMeasurementTypes(): Promise<MeasurementType[]> {
  const pool = await sql.connect(dbConfig);
  const request = pool.request();

  const result = await request.query<MeasurementType[]>(`
    SELECT
        id
        , [name]
        , unit
        , capacity
    FROM
        [Measurement].[dbo].[Types]
    ORDER BY
        SortOrder`);

  return result.recordset;
}

export async function getLatestMeasurements(): Promise<Measurement[]> {
  const pool = await sql.connect(dbConfig);
  const request = pool.request();

  const result = await request.query<Measurement[]>(`
    WITH LatestReadings AS (
        SELECT 
            r.[typeId]
            , r.[reading]
            , r.[takenAt]
            , ROW_NUMBER() OVER (PARTITION BY r.[typeId] ORDER BY r.[takenAt] DESC) AS RowNum
        FROM 
            [Measurement].[dbo].[Readings] r
    )
    SELECT 
        t.[Id] typeId
        , lr.[reading]
        , lr.[takenAt]
    FROM 
        [Measurement].[dbo].[Types] t
    INNER JOIN 
        LatestReadings lr ON t.[Id] = lr.[TypeId] AND lr.RowNum = 1 AND lr.reading < t.capacity + 5 AND lr.reading >= 0
    ORDER BY 
        t.[Name]`);

  return result.recordset;
}

export async function getMeasurementHistory(typeId: number, fromTime: Date) {
  const pool = await sql.connect(dbConfig);
  const request = pool.request();

  const result = await request
    .input("typeId", sql.Int, typeId)
    .input("fromTime", sql.DateTime, fromTime).query<Measurement[]>(`
    SELECT 
        r.[typeId]
        , r.[reading]
        , r.[takenAt]
    FROM 
        [Measurement].[dbo].[Readings] r
    INNER JOIN
        [Measurement].[dbo].[Types] t ON r.[TypeId] = t.[Id]
    WHERE 
        r.[TypeId] = @typeId
        AND r.[TakenAt] >= @fromTime
        AND r.[Reading] < t.capacity
        AND r.[Reading] >= 0
    ORDER BY 
        r.[TakenAt]`);

  return result.recordset;
}
