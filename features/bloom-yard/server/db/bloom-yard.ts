import { getCcConnection, getRmConnection } from "@/lib/data/config/db";
import {
  BloomYardInventory,
  validateBloomYardInventoryRows,
  BloomYardBalance,
  validateBloomYardBalanceRows,
  BloomYard,
  validateBloomYardRows,
  BloomYardCurrent,
  validateBloomYardCurrentRows,
  BloomYardEnd,
  validateBloomYardEndRows,
} from "../../schemas/bloom-yard";
import dayjs from "dayjs";

export async function getBloomYardInventory(): Promise<BloomYardInventory[]> {
  const sql = `
    SELECT
        i.BLOOM_ID
        , i.STRAND
        , i.SEQ
        , i.CREATE_DTM
        , i.LOCATION
        , i.MOLD_SIZE
        , i.GRADE_CODE
        , i.CHARGE_MODE
        , CONCAT(CONCAT(TO_CHAR(o.LENGTH_IN_FEET), chr(39)), CONCAT(TO_CHAR(o.LENGTH_IN_INCHES), chr(34))) "LENGTH"
        , i.ORDER_ID
        , o.ORDER_DESCR
        , ROUND(o.WEIGHT/2000,2) WEIGHT
    FROM 
        T_BLOOMS_INV i
    INNER JOIN 
        T_ORDER o ON i.ORDER_ID = o.ORDER_ID AND i.LINE_L3 = o.LINE_L3
    ORDER BY
        STEEL_ID DESC
  `;

  const connection = await getCcConnection();

  try {
    const result = await connection.execute(sql);

    return validateBloomYardInventoryRows(result.rows || []);
  } finally {
    await connection.close();
  }
}

export async function getBloomYardBalance(
  startDate: Date,
  stopDate: Date
): Promise<BloomYardBalance[]> {
  const sql = `
    WITH StartSnapshot AS (
        SELECT SUM(COUNT) as CNT, NVL(ROUND(SUM(WEIGHT), 2), 0) as WEIGHT
        FROM V_BY_SNAPSHOT
        WHERE POS = 'START'
          AND to_char(datetime, 'mm/dd/yyyy hh24:mi') = to_char(:formattedStartDate)
          AND to_char(datetime, 'mm/dd/yyyy hh24:mi') <> to_char(:formattedStopDate)
    ),
    EndSnapshot AS (
        SELECT SUM(COUNT) as CNT, ROUND(SUM(WEIGHT), 2) as WEIGHT
        FROM v_by_snapshot
        WHERE datetime BETWEEN to_date(:endDate, 'MM/dd/yyyy hh24:mi') - 1/1440 
                        AND to_date(:endDate, 'MM/dd/yyyy hh24:mi') + 1/1440
    ),
    ProducedBlooms AS (
        SELECT count(*) as CNT, NVL(Round(SUM(o.WEIGHT)/2000, 2), 0) as WEIGHT
        FROM t_blooms_hist h
        JOIN t_order o ON h.order_id = o.order_id AND h.line_l3 = o.line_l3
        JOIN t_steel s ON H.STEEL_ID = S.STEEL_ID
        WHERE H.CREATE_DTM BETWEEN S.OPEN_TIME-(120/1440) AND NVL(S.CLOSE_TIME+(120/1440), SYSDATE)
          AND h.create_dtm BETWEEN to_date(:formattedStartDate, 'mm/dd/yyyy hh24:mi') 
                          AND to_date(:formattedStopDate, 'mm/dd/yyyy hh24:mi')
    ),
    CreatedBlooms AS (
        SELECT count(*) as CNT, NVL(Round(SUM(o.WEIGHT)/2000, 2), 0) as WEIGHT
        FROM t_blooms_hist h
        JOIN t_order o ON h.order_id = o.order_id AND h.line_l3 = o.line_l3
        JOIN t_steel s ON H.STEEL_ID = S.STEEL_ID
        WHERE (H.CREATE_DTM NOT BETWEEN S.OPEN_TIME-(120/1440) AND NVL(S.CLOSE_TIME+(120/1440), SYSDATE) 
              OR S.OPEN_TIME IS NULL)
          AND h.create_dtm BETWEEN to_date(:formattedStartDate, 'mm/dd/yyyy hh24:mi') 
                          AND to_date(:formattedStopDate, 'mm/dd/yyyy hh24:mi')
    ),
    RolledBlooms AS (
        SELECT count(*) as CNT, NVL(Round(SUM(o.WEIGHT)/2000, 2), 0) as WEIGHT
        FROM t_blooms_hist h
        JOIN t_order o ON h.order_id = o.order_id AND h.line_l3 = o.line_l3
        JOIN (
            SELECT SEMIPRODUCT_CODE as bid 
            FROM S_RML_SEMIPRODUCT 
            WHERE REHEATING_DATE >= to_date(:formattedStartDate, 'mm/dd/yyyy hh24:mi') 
              AND REHEATING_DATE < to_date(:formattedStopDate, 'mm/dd/yyyy hh24:mi')
        ) r ON SUBSTR(r.bid, 1, 8) || '0' || SUBSTR(r.bid, 9, 2) = h.BLOOM_ID
    ),
    ScrappedBlooms AS (
        SELECT count(*) as CNT, NVL(Round(SUM(o.WEIGHT)/2000, 2), 0) as WEIGHT
        FROM t_blooms_hist h
        JOIN t_order o ON h.order_id = o.order_id AND h.line_l3 = o.line_l3
        WHERE h.bloom_status = 3 
          AND h.status_dtm BETWEEN to_date(:formattedStartDate, 'mm/dd/yyyy hh24:mi') 
                          AND to_date(:formattedStopDate, 'mm/dd/yyyy hh24:mi')
    )
    SELECT ITEM, CNT as COUNT, WEIGHT
    FROM (
        SELECT 0 AS NO, 'START' as ITEM, ss.CNT, ss.WEIGHT
        FROM StartSnapshot ss

        UNION ALL

        SELECT 1 AS NO, '+ PRODUCED' as ITEM, pb.CNT, pb.WEIGHT
        FROM ProducedBlooms pb

        UNION ALL

        SELECT 2 AS NO, '+ CREATED' as ITEM, cb.CNT, cb.WEIGHT
        FROM CreatedBlooms cb

        UNION ALL

        SELECT 3 AS NO, '- ROLLED' as ITEM, -1 * rb.CNT, -1 * rb.WEIGHT
        FROM RolledBlooms rb

        UNION ALL

        SELECT 4 AS NO, '- SCRAPPED' as ITEM, -1 * sb.CNT, -1 * sb.WEIGHT
        FROM ScrappedBlooms sb

        UNION ALL

        SELECT 5 AS NO, '= END' as ITEM, es.CNT, es.WEIGHT
        FROM EndSnapshot es
    ) 
    ORDER BY NO
  `;

  const connection = await getCcConnection();

  const now = new Date();
  const endDate = dayjs(stopDate > now ? now : stopDate).format(
    "MM/DD/YYYY HH:mm"
  );
  const formattedStartDate = dayjs(startDate).format("MM/DD/YYYY HH:mm");
  const formattedStopDate = dayjs(stopDate).format("MM/DD/YYYY HH:mm");

  try {
    const result = await connection.execute(sql, {
      endDate,
      formattedStartDate,
      formattedStopDate,
    });

    const rows: BloomYardBalance[] = validateBloomYardBalanceRows(
      result.rows || []
    );

    const firstFiveSum = rows
      .slice(0, 5)
      .reduce((sum, row) => sum + (row.COUNT || 0), 0);
    const remainingSum = rows
      .slice(5)
      .reduce((sum, row) => sum + (row.COUNT || 0), 0);

    const firstFiveWeightSum = rows
      .slice(0, 5)
      .reduce((sum, row) => sum + (row.WEIGHT || 0), 0);
    const remainingWeightSum = rows
      .slice(5)
      .reduce((sum, row) => sum + (row.WEIGHT || 0), 0);

    const balanceRow: BloomYardBalance = {
      ITEM: "BALANCE",
      COUNT: firstFiveSum - remainingSum,
      WEIGHT: Number((firstFiveWeightSum - remainingWeightSum).toFixed(2)) || 0,
    };

    return [...rows, balanceRow];
  } finally {
    await connection.close();
  }
}

export async function getBloomYardConsumed(
  startDate: Date,
  stopDate: Date
): Promise<BloomYard[]> {
  const sql = `
    SELECT 
        DECODE(profile_id, '160x160', 'BILLET', '160x230', 'BLOOM', '220x330', 'BEAM', 'UNKNOWN') ITEM
        , COUNT(*) COUNT
        , SUM(semiproduct_len) LENGTH 
        , SUM(semiproduct_wgt)/2000 WEIGHT 
    FROM 
        RML_SEMIPRODUCT 
    WHERE 
        reheating_date BETWEEN :startDate AND :stopDate
    GROUP BY 
        profile_id
  `;

  const connection = await getRmConnection();

  try {
    const result = await connection.execute(sql, { startDate, stopDate });

    return validateBloomYardRows(result.rows || []);
  } finally {
    await connection.close();
  }
}

export async function getBloomYardCreated(
  startDate: Date,
  stopDate: Date
): Promise<BloomYard[]> {
  const sql = `
    SELECT 
        DECODE(h.mold_size, '160x160', 'BILLET', '160x230', 'BLOOM', '220x330', 'BEAM', 'UNKNOWN') ITEM
        , COUNT(*) COUNT
        , SUM(h.bloom_length) LENGTH
        , SUM(o.weight)/2000 WEIGHT
    FROM 
        t_blooms_hist h
    INNER JOIN 
        t_order o ON h.order_id = o.order_id AND h.line_l3 = o.line_l3
    INNER JOIN
        t_steel s ON h.steel_id = s.steel_id AND (H.CREATE_DTM NOT BETWEEN S.OPEN_TIME-(120/1440) AND NVL(S.CLOSE_TIME+(120/1440), SYSDATE) OR S.OPEN_TIME IS NULL)
    WHERE 
        h.create_dtm BETWEEN :startDate AND :stopDate
    GROUP BY 
        h.mold_size
  `;

  const connection = await getCcConnection();

  try {
    const result = await connection.execute(sql, { startDate, stopDate });

    return validateBloomYardRows(result.rows || []);
  } finally {
    await connection.close();
  }
}

export async function getBloomYardCurrent(): Promise<BloomYardCurrent[]> {
  const sql = `
    SELECT 
        SEMIPROD
        , LOCATION
        , GRADE
        , ORD_LENGTH
        , COUNT
        , LENGTH
        , WEIGHT 
    FROM 
        V_BLOOMS_INV_SIZE_GRADE_ORD
  `;

  const connection = await getCcConnection();

  try {
    const result = await connection.execute(sql);

    return validateBloomYardCurrentRows(result.rows || []);
  } finally {
    await connection.close();
  }
}

export async function getBloomYardEnd(): Promise<BloomYardEnd[]> {
  const sql = `
    SELECT 
        SEMIPROD
        , COUNT
        , WEIGHT
        , DATETIME RecordDate
    FROM 
        v_by_snapshot
    WHERE 
        POS = 'END'
  `;

  const connection = await getCcConnection();

  try {
    const result = await connection.execute(sql);

    return validateBloomYardEndRows(result.rows || []);
  } finally {
    await connection.close();
  }
}

export async function getBloomYardRunnable(): Promise<BloomYardCurrent[]> {
  const sql = `
    SELECT 
        SEMIPROD
        , LOCATION
        , GRADE
        , ORD_LENGTH
        , COUNT
        , LENGTH
        , WEIGHT 
    FROM 
        V_BL_INV_SIZE_GRADE_ORD_RUN
  `;

  const connection = await getCcConnection();

  try {
    const result = await connection.execute(sql);

    return validateBloomYardCurrentRows(result.rows || []);
  } finally {
    await connection.close();
  }
}

export async function getBloomYardScrapped(
  startDate: Date,
  stopDate: Date
): Promise<BloomYard[]> {
  const sql = `
    SELECT 
        DECODE(h.mold_size, '160x160', 'BILLET', '160x230', 'BLOOM', '220x330', 'BEAM', 'UNKNOWN') ITEM
        , COUNT(*) COUNT 
        , SUM(h.bloom_length) LENGTH
        , SUM(o.weight) / 2000 WEIGHT
    FROM
        t_blooms_hist h
    INNER JOIN
        t_order o ON h.order_id = o.order_id AND h.line_l3 = o.line_l3
    WHERE 
        h.bloom_status = 3 
        AND h.update_dtm BETWEEN :startDate AND :stopDate
    GROUP BY
        h.mold_size
  `;

  const connection = await getCcConnection();

  try {
    const result = await connection.execute(sql, { startDate, stopDate });

    return validateBloomYardRows(result.rows || []);
  } finally {
    await connection.close();
  }
}

export async function getBloomYardProduced(
  startDate: Date,
  stopDate: Date
): Promise<BloomYard[]> {
  const sql = `
    SELECT  
        DECODE(h.mold_size, '160x160', 'BILLET', '160x230', 'BLOOM', '220x330', 'BEAM', 'UNKNOWN') ITEM   
        , COUNT(*) COUNT 
        , SUM(h.bloom_length) LENGTH
        , SUM(o.weight) / 2000 WEIGHT
    FROM
        t_blooms_hist h
    INNER JOIN
        t_order o ON h.order_id = o.order_id AND h.line_l3 = o.line_l3
    INNER JOIN
        t_steel s ON h.steel_id = s.steel_id AND H.CREATE_DTM BETWEEN S.OPEN_TIME-(120/1440) AND COALESCE(S.CLOSE_TIME+(120/1440), SYSDATE)
    WHERE
        h.create_dtm BETWEEN :startDate AND :stopDate
    GROUP BY
        h.mold_size
  `;

  const connection = await getCcConnection();

  try {
    const result = await connection.execute(sql, { startDate, stopDate });

    return validateBloomYardRows(result.rows || []);
  } finally {
    await connection.close();
  }
}

export async function getBloomYardStart(
  startDate: Date
): Promise<BloomYardEnd[]> {
  const sql = `
    SELECT 
        SEMIPROD 
        , COUNT
        , WEIGHT
        , DATETIME RecordDate
    FROM 
        V_BY_SNAPSHOT
    WHERE 
        POS = 'START'
        AND to_char(datetime, 'mm/dd/yyyy hh24:mi') = to_char(:formattedStartDate)
        AND datetime <> to_date(to_char(SYSDATE, 'mm/dd/yyyy hh24:mi:ss'), 'mm/dd/yyyy hh24:mi:ss')
  `;

  const connection = await getCcConnection();
  const formattedStartDate = dayjs(startDate).format("MM/DD/YYYY HH:mm");

  try {
    const result = await connection.execute(sql, { formattedStartDate });

    return validateBloomYardEndRows(result.rows || []);
  } finally {
    await connection.close();
  }
}
