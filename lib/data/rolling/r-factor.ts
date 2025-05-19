"use server";

import { getRmConnection } from "@/lib/data/config/db";
import { BloomModel } from "@/types/rolling/r-factor/bloom-model";
import { StandRFactorModel } from "@/types/rolling/r-factor/stand-r-factor-model";
import sql from "mssql";

export async function getMostRecentBlooms(
  bloomId: string | null
): Promise<BloomModel[]> {
  const sql = `
        WITH Blooms AS (
            SELECT
                rs.SEMIPRODUCT_CODE
                , rs.SEMIPRODUCT_ID
                , rs.JOB_ID
                , rs.REHEATING_DATE
            FROM
                RML_SEMIPRODUCT rs
            WHERE rs.REHEATING_DATE <= (
                SELECT 
                    REHEATING_DATE
                FROM
                    RML_SEMIPRODUCT
                WHERE
                    SEMIPRODUCT_CODE = COALESCE(:bloomId, (
                        SELECT
                            SEMIPRODUCT_CODE
                        FROM
                            RML_SEMIPRODUCT
                        WHERE
                            REHEATING_DATE = (SELECT MAX(REHEATING_DATE) FROM RML_SEMIPRODUCT)
                        FETCH FIRST 1 ROW ONLY)
                )
                ORDER BY
                    REHEATING_DATE DESC
                FETCH FIRST 1 ROW ONLY
            )
            ORDER BY rs.REHEATING_DATE DESC
            FETCH FIRST 5 ROWS ONLY
        )
        SELECT 
            b.SEMIPRODUCT_CODE
            , b.SEMIPRODUCT_ID
            , b.JOB_ID
            , b.REHEATING_DATE
            , rj.PROD_SIZE
            , rlp.PROFILE_TYPE
            , 'JobId ' || TRIM(rj.JOB_ID) || ' Year ' || rj.ROLL_YEAR || ' Week ' || rj.ROLL_WEEK JobText
            , rsl.Stand
            , ROUND(rsl.RFactor, 2) RFactor
            , ROUND(rsl.InchesPerSecond, 2) InchesPerSecond
            , rsl.RFactorSetpoint
            , rsl.MessageDate
            , ROUND(rsl.Torque / 10, 2) Torque
            , CASE 
                WHEN rlp.PROFILE_TYPE IN ('02', '03') THEN rbcv.CROSS_SECTION_AREA
                WHEN rlp.PROFILE_TYPE = '01' THEN racv.CROSS_SECTION_AREA
                WHEN rlp.PROFILE_TYPE = '04' THEN rccv.CROSS_SECTION_AREA
            END AS CrossSectionArea
        FROM
            Blooms b
        JOIN
            RML_JOB rj ON b.JOB_ID = rj.JOB_ID
        LEFT JOIN
            RML_LASER_PROFILE rlp ON rj.PROD_SIZE = rlp.PROFILE_NAME
        LEFT JOIN 
            RML_STAND_LOAD rsl ON b.SEMIPRODUCT_CODE = rsl.BLOOMID
        LEFT JOIN
            RML_BEAM_COLD_VALUES rbcv ON RTRIM(b.SEMIPRODUCT_CODE) = rbcv.BLOOM_ID AND rlp.PROFILE_TYPE IN ('02', '03') AND rbcv.METRIC = 0
        LEFT JOIN
            RML_ANGLE_COLD_VALUES racv ON RTRIM(b.SEMIPRODUCT_CODE) = racv.BLOOM_ID AND rlp.PROFILE_TYPE = '01' AND racv.METRIC = 0
        LEFT JOIN
            RML_CHANNEL_COLD_VALUES rccv ON RTRIM(b.SEMIPRODUCT_CODE) = rccv.BLOOM_ID AND rlp.PROFILE_TYPE = '04' AND rccv.METRIC = 0
        WHERE
            rsl.MessageDate IS NOT NULL
            AND rsl.STAND <> 6
            AND (rj.ROLL_YEAR > 2023 OR (rj.ROLL_YEAR = 2023 AND rj.ROLL_WEEK >= 28)) -- the time we started doing all this r-factor stuff
        ORDER BY 
            b.REHEATING_DATE DESC
            , rsl.MessageDate DESC
            , rsl.Stand
  `;

  const connection = await getRmConnection();

  const result = await connection.execute(sql, {
    bloomId: bloomId?.padEnd(32),
  });

  await connection.close();

  return (result.rows as BloomModel[]) || [];
}

export async function getRFactorSetpoints(
  productName: string
): Promise<StandRFactorModel[]> {
  const sqlConfig = {
    user: process.env.MSSQL_USER || "username",
    password: process.env.MSSQL_PASSWORD || "password",
    database: process.env.MSSQL_DATABASE || "database",
    server: process.env.MSSQL_SERVER || "localhost",
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  };

  const pool = await sql.connect(sqlConfig);
  const request = pool.request().input("productName", sql.VarChar, productName);

  const result = await request.query<StandRFactorModel>(`
    SELECT 
        InchesPerSecond
        , Stand
        , ProductName
    FROM
        StandSpeedProducts ssp
    LEFT JOIN
        StandSpeedsByProduct ssbp ON ssp.Id = ssbp.Product
    WHERE
        ssp.ProductName = @productName
        AND ssbp.IsDummy = 0
        `);

  return result.recordset;
}
