import { getRmConnection } from "@/lib/data/config/db";
import {
  ChargedCoolingBed,
  CoolingBedResponse,
  CurrentCoolingBed,
  DischargedCoolingBed,
  HistoryCoolingBed,
  coolingBedCountSchema,
  validateChargedCoolingBedRows,
  validateCurrentCoolingBedRows,
  validateDischargedCoolingBedRows,
  validateHistoryCoolingBedRows,
  validateMinimalCoolingBedRows,
  type MinimalCoolingBed,
} from "@/features/cooling-bed/schemas/cooling-bed";
import { CrewCalculator } from "@/lib/misc/crew-calculator";

export async function getLastSixCoolingBedBars(): Promise<MinimalCoolingBed[]> {
  const sql = `
    SELECT
      C.SEQ
      , C.PROD_SIZE
      , C.HEAT_ID
      , TRIM(C.MULT_LEN) MULT_LEN
      , C.RHF_TEMP
      , C.TMP_F
      , RTRIM(C.CREW) CREW
      , C.MULT_ID
      , (SELECT W.WEIGHT_DELTA
         FROM S_V_WSCALE_TRK W
         WHERE W.BLOOM_ID = SUBSTR(S.SEMIPRODUCT_CODE, 1, 8) || '0' || SUBSTR(S.SEMIPRODUCT_CODE, 9, 2)
         FETCH FIRST 1 ROW ONLY) WEIGHT_DELTA
    FROM 
      NUCRMRT.V_CB_CUR_LIST_DESC C
    JOIN
       NUCRMRT.RML_SEMIPRODUCT S ON C.SEQ = S.LOADING_SEQ
    WHERE
      TO_DATE(C.ROLL_DATE, 'mm/dd/yy hh24:mi') > SYSDATE - 0.2
      AND SUBSTR(C.MULT_ID, 1, INSTR(C.MULT_ID, '-') - 1) = TRIM(S.JOB_ID)
      AND ROWNUM <= 6
  `;

  const connection = await getRmConnection();

  try {
    const result = await connection.execute(sql);

    return validateMinimalCoolingBedRows(result.rows || []);
  } finally {
    await connection.close();
  }
}

export async function getCoolingBedCount(): Promise<number> {
  const sql = `
    SELECT
       COUNT(SEQ) BAR_COUNT
    FROM
       NUCRMRT.V_CB_CUR_LIST_DESC
    WHERE
       TO_DATE(ROLL_DATE, 'mm/dd/yy hh24:mi') > SYSDATE - 0.1
  `;

  const connection = await getRmConnection();

  try {
    const result = await connection.execute(sql);

    const row = coolingBedCountSchema.parse(result.rows?.[0]);
    return row.BAR_COUNT;
  } finally {
    await connection.close();
  }
}

export async function getCoolingBedData(): Promise<CoolingBedResponse> {
  const [barCount, bars] = await Promise.all([
    getCoolingBedCount(),
    getLastSixCoolingBedBars(),
  ]);

  return { barCount, bars };
}

export async function getCurrentCoolingBed(): Promise<CurrentCoolingBed[]> {
  const sql = `
    SELECT
        RTRIM(M.MULTIPLE_ID) MULT_ID
        , RTRIM(S.SEMIPRODUCT_ID) SP_ID
        , RTRIM(J.PROD_SIZE) PROD_SIZE
        , S.LOADING_SEQ SEQ
        , RTRIM(S.HEAT_ID) HEAT_ID
        , RTRIM(IN2FTIN(M.MULTIPLE_LEN)) MULT_LEN
        , S.TEMPERATURE RHF_TEMP
        , S.WEB_TEMP_HIPRO TMP_W
        , S.FLAN_TEMP_HIPRO TMP_F
        , S.QUENCH_TEMP TMP_Q
        , S.ROLLING_DATE ROLL_DATE
        , M.ROLLING_DATE STR_DATE
        , M.LOSS_DATE
    FROM
        RML_MULTIPLE M
    INNER JOIN
        RML_SEMIPRODUCT S ON 
            M.JOB_ID = S.JOB_ID AND 
            M.SEMIPRODUCT_NO = S.SEMIPRODUCT_NO
    INNER JOIN
        RML_JOB J ON M.JOB_ID = J.JOB_ID
    WHERE
        M.MULTIPLE_STATUS = 70
        AND M.ROLLING_DATE IS NULL
        AND S.ROLLING_DATE IS NOT NULL
        AND S.ROLLING_DATE > (SYSDATE - 1)
    ORDER BY
        S.ROLLING_DATE DESC
        , M.MULTIPLE_ID DESC
  `;

  const connection = await getRmConnection();

  try {
    const result = await connection.execute(sql);

    return validateCurrentCoolingBedRows(result.rows || []);
  } finally {
    await connection.close();
  }
}

export async function getChargedCoolingBed(): Promise<ChargedCoolingBed[]> {
  const sql = `
    SELECT 
        RTRIM(M.MULTIPLE_ID, ' ') MULT_ID
        , RTRIM(S.SEMIPRODUCT_ID) SP_ID
        , RTRIM(J.PROD_SIZE) PROD_SIZE
        , S.LOADING_SEQ SEQ 
        , RTRIM(S.HEAT_ID, ' ') HEAT_ID 
        , RTRIM(IN2FTIN(M.MULTIPLE_LEN), ' ') MULT_LEN 
        , S.TEMPERATURE RHF_TEMP
        , S.WEB_TEMP_HIPRO TMP_W 
        , S.FLAN_TEMP_HIPRO TMP_F 
        , S.QUENCH_TEMP TMP_Q
        , S.ROLLING_DATE ROLL_DATE 
        , M.ROLLING_DATE STR_DATE 
        , M.LOSS_DATE LOSS_DATE                              
    FROM
        RML_MULTIPLE M
    INNER JOIN
        RML_SEMIPRODUCT S ON M.JOB_ID = S.JOB_ID AND M.SEMIPRODUCT_NO = S.SEMIPRODUCT_NO                                
    INNER JOIN
        RML_JOB J ON S.JOB_ID = J.JOB_ID
    WHERE
        S.ROLLING_DATE BETWEEN :startDate AND :stopDate
    ORDER BY 
        S.REHEATING_DATE DESC
        , M.MULTIPLE_NO DESC
  `;

  const connection = await getRmConnection();

  const startDate = CrewCalculator.startOfCurrentShift();
  const stopDate = CrewCalculator.endOfCurrentShift();

  try {
    const result = await connection.execute(sql, { startDate, stopDate });

    return validateChargedCoolingBedRows(result.rows || []);
  } finally {
    await connection.close();
  }
}

export async function getDischargedCoolingBed(): Promise<
  DischargedCoolingBed[]
> {
  const sql = `
    SELECT 
        TRIM(M.MULTIPLE_ID) MULT_ID 
      , RTRIM(S.SEMIPRODUCT_ID) SP_ID
      , RTRIM(J.PROD_SIZE) PROD_SIZE
      , S.LOADING_SEQ SEQ 
      , TRIM(S.HEAT_ID) HEAT_ID 
      , RTRIM(IN2FTIN(M.MULTIPLE_LEN)) MULT_LEN
      , M.STR_TEMP_1 TEMP1 
      , M.STR_TEMP_2 TEMP2 
      , S.ROLLING_DATE ROLL_DATE 
      , M.ROLLING_DATE STR_DATE 
      , M.LOSS_DATE LOSS_DATE
    FROM
        RML_MULTIPLE M
    INNER JOIN 
        RML_SEMIPRODUCT S ON M.JOB_ID = S.JOB_ID  AND M.SEMIPRODUCT_NO = S.SEMIPRODUCT_NO                                
    INNER JOIN 
        RML_JOB J ON S.JOB_ID = J.JOB_ID
    WHERE
        M.ROLLING_DATE BETWEEN :startDate AND :stopDate
    ORDER BY 
        M.ROLLING_DATE DESC
        , M.MULTIPLE_NO DESC
  `;

  const connection = await getRmConnection();

  const startDate = CrewCalculator.startOfCurrentShift();
  const stopDate = CrewCalculator.endOfCurrentShift();

  try {
    const result = await connection.execute(sql, { startDate, stopDate });

    return validateDischargedCoolingBedRows(result.rows || []);
  } finally {
    await connection.close();
  }
}

export async function getCoolingBedHistory(
  startDate: Date,
  stopDate: Date
): Promise<HistoryCoolingBed[]> {
  const sql = `
    SELECT 
        M.MULTIPLE_ID
        , m.SEMIPRODUCT_NO
        , m.JOB_ID
        , J.PROD_SIZE
        , ROUND(M.MULTIPLE_LEN/12, 2) MULT_LEN
        , S.REHEATING_DATE
        , M.ROLLING_DATE
        , S.SEMIPRODUCT_CODE
        , M.STR_TEMP_1
        , W.TGT_WEIGHT
        , W.SCALE_WGT
        , ROUND(W.SCALE_WGT - W.TGT_WEIGHT, 2) DELTA
    FROM
        RML_MULTIPLE M
    INNER JOIN
        RML_SEMIPRODUCT S ON M.SEMIPRODUCT_NO = S.SEMIPRODUCT_NO AND M.JOB_ID = S.JOB_ID
    INNER JOIN
        RML_JOB J ON S.JOB_ID = J.JOB_ID
    INNER JOIN
        S_T_WSCALE_DATA W ON  W.BLOOM_ID = SUBSTR(S.SEMIPRODUCT_CODE, 1, 8) || '0' || SUBSTR(S.SEMIPRODUCT_CODE, 9, 2)
    WHERE
        REHEATING_DATE BETWEEN :startDate AND :stopDate
    ORDER BY
        S.REHEATING_DATE DESC
  `;

  const connection = await getRmConnection();

  try {
    const result = await connection.execute(sql, { startDate, stopDate });

    return validateHistoryCoolingBedRows(result.rows || []);
  } finally {
    await connection.close();
  }
}
