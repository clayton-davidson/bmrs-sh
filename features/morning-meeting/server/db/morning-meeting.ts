import { as400Config, getRmConnection } from "@/lib/data/config/db";
import {
  Addition,
  BundleReconciliation,
  FailingHeat,
  FailingHeatComment,
  RawFailingHeat,
  RawMorningMeetingDelay,
  RawQuality,
  RawStockAnalysis,
  StockAnalysis,
  validateAdditionRows,
  validateBundleReconciliationRows,
  validateFailingHeatCommentRows,
  validateFailingHeatRows,
  validateMorningMeetingDelayRows,
  validateQualityRows,
  validateRawStockAnalysisRows,
} from "../../schemas/morning-meeting";
import dbConfig from "@/lib/data/config/mssql";
import sql from "mssql";
import odbc from "odbc";

export async function getDelays(
  startDate: Date,
  stopDate: Date
): Promise<RawMorningMeetingDelay[]> {
  const sql = `
    WITH Delays AS (
      SELECT
          d.delay_id
          , d.start_time
          , d.stop_time
          , TRIM(a.description) AREA
          , d.CREW
          , TRIM(r.description) REASON
          , TRIM(d.NOTE) NOTES
          , LEAD(d.start_time) OVER (ORDER BY d.start_time) NEXT_START
      FROM
          rml_delay d
      INNER JOIN
          dly_reason r ON r.reason_id = d.reason_id
      INNER JOIN
          dly_subarea a ON a.subarea_id = r.area
      WHERE
          d.start_time >= :startDate
          AND d.start_time < :stopDate
  )
  SELECT
      d.DELAY_ID
      , d.START_TIME
      , d.STOP_TIME
      , d.AREA
      , d.CREW
      , d.REASON
      , CAST(d.NOTES AS VARCHAR2(500)) NOTES
      , J.PROD_SIZE
  FROM
      Delays d
  LEFT JOIN LATERAL (
      SELECT
          S.JOB_ID
      FROM
          RML_SEMIPRODUCT S
      WHERE
          S.REHEATING_DATE BETWEEN d.START_TIME - INTERVAL '12' MINUTE
              AND COALESCE(d.STOP_TIME, d.NEXT_START, d.START_TIME + INTERVAL '1' DAY) + INTERVAL '20' MINUTE
      ORDER BY
          S.REHEATING_DATE DESC
      FETCH FIRST 1 ROW ONLY
  ) S ON 1=1
  LEFT JOIN
      RML_JOB J ON J.JOB_ID = S.JOB_ID
  ORDER BY
      d.START_TIME DESC
      `;

  let connection;

  try {
    connection = await getRmConnection();
    const result = await connection.execute(sql, { startDate, stopDate });

    return validateMorningMeetingDelayRows(result.rows || []);
  } finally {
    await connection?.close();
  }
}

export async function getQuality(
  startDate: Date,
  stopDate: Date
): Promise<RawQuality[]> {
  const pool = await sql.connect(dbConfig);
  const request = pool.request();

  const result = await request
    .input("startDate", sql.DateTime, startDate)
    .input("stopDate", sql.DateTime, stopDate).query<RawQuality[]>(`
    SELECT
        [PRODUCTID]
        , [CREW]
        , ROUND(CONVERT(DECIMAL(10,2),[WEIGHT]/2000),2) WEIGHT
        , [PIECES]
        , [LENGTH]
        , [DEFECT]
        , [DISPOSITION]
        , [ENTRYDATE]
        , [HEAT]
        , [SCRAPCOMMENT]
    FROM
        [BMPROD].[DBO].[SCRAPREPORT]
    WHERE
        [ENTRYDATE] >= @startDate
        AND [ENTRYDATE] < @stopDate
    ORDER BY
        [ENTRYDATE] DESC
  `);

  return validateQualityRows(result.recordset || []);
}

export async function getFailingHeats(
  as400StartDate: number,
  as400StartDateTime: number,
  as400StopDateTime: number
): Promise<RawFailingHeat[]> {
  const sql = `
  SELECT DISTINCT
      IUAXNB Heat
      , IUE6TS Product
      , IUEHSP Grade
  FROM
      COLDMLDTA.CNIUREP
  WHERE
      IUALDT >= ?
      AND IUALDT * 1000000 + IUCITM > ?
      AND IUALDT * 1000000 + IUCITM < ?
      AND IUHOSP = 'F'
  `;

  let connection;

  try {
    connection = await odbc.connect(as400Config.connectionString);
    const result = await connection.query<RawFailingHeat[]>(sql, [
      as400StartDate,
      as400StartDateTime,
      as400StopDateTime,
    ]);

    const rows = validateFailingHeatRows(result);

    return rows;
  } finally {
    await connection?.close();
  }
}

async function getFailingHeatComments(
  heats: string[]
): Promise<FailingHeatComment[]> {
  const pool = await sql.connect(dbConfig);
  const request = pool.request();

  const heatList = heats.join(",");

  const result = await request.input("heatNames", sql.VarChar, heatList).query<
    FailingHeatComment[]
  >(`
      SELECT Heat, Comment 
      FROM ShiftHeatsComments
      WHERE Heat IN (
        SELECT TRIM(value) 
        FROM STRING_SPLIT(@heatNames, ',')
      )
    `);

  return validateFailingHeatCommentRows(result.recordset || []);
}

export async function getFailingHeatsWithComments(
  as400StartDate: number,
  as400StartDateTime: number,
  as400StopDateTime: number
): Promise<FailingHeat[]> {
  const failingHeats = await getFailingHeats(
    as400StartDate,
    as400StartDateTime,
    as400StopDateTime
  );

  if (failingHeats.length === 0) {
    return failingHeats as FailingHeat[];
  }

  const heatNumbers = failingHeats.map((heat) => heat.HEAT.toString());
  const comments = await getFailingHeatComments(heatNumbers);

  const commentMap = new Map<number, string | null>();
  comments.forEach((comment) => {
    commentMap.set(comment.HEAT, comment.COMMENT);
  });

  return failingHeats.map((heat) => ({
    ...heat,
    COMMENT: commentMap.get(heat.HEAT) || null,
  }));
}

export async function getRollShopNotes(
  startDate: Date,
  stopDate: Date
): Promise<string> {
  const pool = await sql.connect(dbConfig);
  const request = pool.request();

  const result = await request
    .input("startDate", sql.DateTime, startDate)
    .input("stopDate", sql.DateTime, stopDate).query<{
    ROLLSHOP: string;
  }>(`
      SELECT TOP 1
        ROLLSHOP
      FROM
        BMPROD.DBO.SHIFTSUPERVISORREPORT
      WHERE
        SHIFTDATE >= @startDate
        AND SHIFTDATE < @stopDate
  `);

  return result.recordset[0]?.ROLLSHOP || "";
}

export async function getStockAnalysis(
  as400StartDate: number,
  as400StartDateTime: number,
  as400StopDateTime: number,
  startDate: Date,
  stopDate: Date
): Promise<StockAnalysis[]> {
  const sql = `
    SELECT
        RTRIM(IKE6TS) PRODUCT
        , RTRIM(IKEHSP) GRADE
        , RTRIM(IKFFCE) TESTCODE
        , IKUUNR FEET
        , IKXSNR INCHES
        , SUM(CASE WHEN IKAIDT <> 0 THEN IKS6NR ELSE 0 END) / 2000 SHIPPEDTONS
        , SUM(CASE WHEN IKAIDT = 0 THEN IKS6NR ELSE 0 END) / 2000 STOCKTONS
    FROM
        COLDMLDTA.CNIKREP
    WHERE
        IKAEDT >= ?
        AND IKAEDT * 1000000 + IKAKTM > ?
        AND IKAEDT * 1000000 + IKAKTM < ?
        AND IKHQSP = 'A'
    GROUP BY
        IKE6TS, IKUUNR, IKXSNR, IKEHSP, IKFFCE
    ORDER BY
        SUM(CASE WHEN IKAIDT <> 0 THEN IKS6NR ELSE 0 END) / 2000 DESC
  `;

  let connection;

  try {
    connection = await odbc.connect(as400Config.connectionString);
    const rawData = await connection.query<RawStockAnalysis[]>(sql, [
      as400StartDate,
      as400StartDateTime,
      as400StopDateTime,
    ]);

    const rows = validateRawStockAnalysisRows(rawData);

    const shippedTotalTons = rows.reduce(
      (sum, row) => sum + row.SHIPPEDTONS,
      0
    );
    const timeInWeeks =
      (stopDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7);
    const totalCount = rows.length;

    const getAbcRating = (cumSkuPercent: number): string => {
      if (cumSkuPercent <= 20) return "A";
      if (cumSkuPercent < 95) return "B";
      return "C";
    };

    let shippedCumulativeTons = 0;
    let cumulativeSku = 0;

    const result: StockAnalysis[] = rows.map((item) => {
      shippedCumulativeTons += item.SHIPPEDTONS;
      cumulativeSku++;

      const cumSkuPercent = (cumulativeSku / totalCount) * 100;
      const abcRating = getAbcRating(cumSkuPercent);
      const ewu = item.SHIPPEDTONS / timeInWeeks;
      const woh = ewu === 0 ? 0 : (item.STOCKTONS || 0) / ewu;

      return {
        PRODUCT: item.PRODUCT,
        GRADE: item.GRADE,
        TESTCODE: item.TESTCODE,
        FEET: item.FEET,
        INCHES: item.INCHES,
        SHIPPEDTONS: item.SHIPPEDTONS,
        STOCKTONS: item.STOCKTONS,
        CUMSHIP: Math.round(shippedCumulativeTons * 10000) / 10000,
        CUMPERCENT:
          Math.round((shippedCumulativeTons / shippedTotalTons) * 100 * 100) /
          100,
        CUMSKU: cumulativeSku,
        CUMSKUPERCENT: Math.round(cumSkuPercent * 100) / 100,
        ABC: abcRating,
        EWU: Math.round(ewu * 100) / 100,
        WOH: Math.round(woh * 100) / 100,
      };
    });

    return result;
  } finally {
    await connection?.close();
  }
}

export async function getBundlesReconciled(
  as400StartDate: number,
  as400StartDateTime: number,
  as400StopDateTime: number
): Promise<BundleReconciliation[]> {
  const sql = `
    WITH DistinctCombinations AS (
      SELECT DISTINCT
          RTRIM(IKE6TS) PROFILEASTM
          , RTRIM(IKEHSP) GRADECAST
          , RTRIM(IKFFCE) TESTCODE
          , IKUUNR Feet
          , IKXSNR Inches
          , IKS0NR ROLLYEAR
          , IKS1NR ROLLWEEK
          , IKHPSP STATUS
      FROM
          COLDMLDTA.CNIKREP
      WHERE
          ikAEDT >= ?
          AND IKAEDT * 1000000 + IKAKTM > ?
          AND IKAEDT * 1000000 + IKAKTM < ?
          AND IKHPSP NOT IN (3, 4, 5, 6, 7, 8, 9)
  )
  SELECT
      COUNT(IKHATS) BundleCount
      , dc.PROFILEASTM
      , dc.GRADECAST
      , dc.TESTCODE
      , dc.Feet
      , dc.Inches
      , dc.ROLLYEAR
      , dc.ROLLWEEK
      , dc.STATUS
  FROM
      COLDMLDTA.CNIKREP cr
  INNER JOIN
      DistinctCombinations dc
  ON
      RTRIM(cr.IKE6TS) = dc.PROFILEASTM
      AND RTRIM(cr.IKEHSP) = dc.GRADECAST
      AND RTRIM(cr.IKFFCE) = dc.TESTCODE
      AND cr.IKUUNR = dc.Feet
      AND cr.IKXSNR = dc.Inches
      AND cr.IKS0NR = dc.ROLLYEAR
      AND cr.IKS1NR = dc.ROLLWEEK
      AND cr.IKHPSP = dc.STATUS
  GROUP BY
      dc.PROFILEASTM, dc.GRADECAST, dc.TESTCODE, dc.Feet, dc.Inches, dc.ROLLYEAR, dc.ROLLWEEK, dc.STATUS
  `;

  let connection;

  try {
    connection = await odbc.connect(as400Config.connectionString);
    const result = await connection.query<BundleReconciliation[]>(sql, [
      as400StartDate,
      as400StartDateTime,
      as400StopDateTime,
    ]);

    const rows = validateBundleReconciliationRows(result);

    return rows;
  } finally {
    await connection?.close();
  }
}

export async function getAdditions(
  bundles: BundleReconciliation[]
): Promise<Addition[]> {
  const sql = `
    SELECT
        PRODUCT
        , GRADECAST
        , TESTCODE
        , BUNDLELENGTH
        , ADDITION
        , ROLLWEEK
        , ROLLYEAR
    FROM
        RML_BUNDLE_ADDITIONS
    WHERE
        ROLLYEAR IN :rollYears
        AND ROLLWEEK IN :rollWeeks
        AND PRODUCT IN :products
  `;

  let connection;

  try {
    connection = await getRmConnection();

    const rollYears = [...new Set(bundles.map((b) => b.ROLLYEAR))];
    const rollWeeks = [...new Set(bundles.map((b) => b.ROLLWEEK))];
    const products = [...new Set(bundles.map((b) => b.PROFILEASTM))];

    const result = await connection.execute(sql, {
      rollYears: rollYears.join(","),
      rollWeeks: rollWeeks.join(","),
      products: products.join(","),
    });

    return validateAdditionRows(result.rows || []);
  } finally {
    await connection?.close();
  }
}