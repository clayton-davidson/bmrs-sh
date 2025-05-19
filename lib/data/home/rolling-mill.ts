import { getCcConnection, getRmConnection } from "@/lib/data/config/db";
import { RollingMillModel } from "@/types/home/rolling-mill-model";

export async function getRollings() {
  const [millJobData, tph, weight, pace] = await Promise.all([
    getMillJobData(),
    getTph(),
    getNextFurnaceBarOutWeight(),
    getPace(),
  ]);

  const theoreticalTph = weight > 0 && pace > 0 ? (3600.0 / pace) * weight : 0;
  const rollings = Array.isArray(millJobData) ? millJobData : [millJobData];

  for (const row of rollings) {
    const required = row.REQUIREDWEIGHT * 1.06;
    const rolled = row.ROLLEDWEIGHT;

    row.TPHWC =
      Math.round(
        (tph > 0 && rolled < required ? (required - rolled) / tph : 0) * 100
      ) / 100;
    row.TPHPACE =
      Math.round(
        (theoreticalTph > 0 && rolled < required
          ? (required - rolled) / theoreticalTph
          : 0) * 100
      ) / 100;
  }

  return rollings;
}

export async function getMillJobData(): Promise<RollingMillModel[]> {
  const sql = `
    WITH LatestTask AS (
      SELECT
        T.TASK_ID
      FROM
        RML_SEMIPRODUCT S
      JOIN
        RML_JOB J ON S.JOB_ID = J.JOB_ID
      JOIN
        RML_TASK T ON J.TASK_ID = T.TASK_ID
      WHERE
        S.REHEATING_DATE = (SELECT MAX(REHEATING_DATE) FROM RML_SEMIPRODUCT)
    )
    SELECT
      RJ.JOB_ID JobId
      , RJ.TASK_ID TaskId
      , REPLACE(SUBSTR(RJ.PROD_SIZE, INSTR(RJ.PROD_SIZE, ' ')), ' lbs') ProductSize
      , RJ.REQUIRED_WEIGHT RequiredWeight
      , T.OUT_PROFILE_ID OutProfileId
      , COALESCE(ROUND(SUM(O.WEIGHT)/2000,2),0) RolledWeight
      , COALESCE(ROUND(SUM(RS.TOT_BAR_LEN)/12,2),0) RolledLength
    FROM
      RML_JOB RJ
      JOIN RML_TASK T ON RJ.TASK_ID = T.TASK_ID
      JOIN LatestTask LT ON RJ.TASK_ID = LT.TASK_ID
      LEFT JOIN RML_SEMIPRODUCT RS ON RS.JOB_ID = RJ.JOB_ID
      LEFT JOIN S_T_BLOOMS_HIST B ON SUBSTR(RS.SEMIPRODUCT_CODE, 1, 8) || '0' || SUBSTR(RS.SEMIPRODUCT_CODE, 9, 2) = B.BLOOM_ID
      LEFT JOIN S_T_ORDER O ON B.ORDER_ID = O.ORDER_ID AND B.LINE_L3 = O.LINE_L3
    GROUP BY
      RJ.JOB_ID, RJ.TASK_ID, REPLACE(SUBSTR(RJ.PROD_SIZE, INSTR(RJ.PROD_SIZE, ' ')), ' lbs'), RJ.REQUIRED_WEIGHT, T.OUT_PROFILE_ID
    ORDER BY 
      RJ.JOB_ID
  `;

  try {
    const connection = await getRmConnection();

    const result = await connection.execute(sql);

    if (result.rows && result.rows.length > 0) {
      return result.rows as RollingMillModel[];
    }

    await connection.close();

    return [];
  } catch (error) {
    console.error("Error getting mill job data:", error);
    return [];
  }
}

export async function getTph(): Promise<number> {
  const sql = `
    SELECT
      ROUND(COALESCE(TPH,0),2) as tph
    FROM
      V_RHF_DISCHG_TPH
  `;

  try {
    const connection = await getCcConnection();

    const result = await connection.execute(sql);

    if (result.rows && result.rows.length > 0) {
      return (result.rows[0] as { TPH: number }).TPH;
    }

    return 0;
  } catch (error) {
    console.error("Error getting tph:", error);
    return 0;
  }
}

export async function getNextFurnaceBarOutWeight(): Promise<number> {
  const sql = `
        SELECT
            ROUND(weight,2) AS weight
        FROM
            V_RHF_MAP_FROM_TRK
        WHERE
            POS_ID =(SELECT
                        MIN(pos_id)
                     FROM
                        V_RHF_MAP_FROM_TRK)
    `;

  try {
    const connection = await getCcConnection();

    const result = await connection.execute(sql);

    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0] as { WEIGHT: number };
      return row.WEIGHT;
    }

    return 0;
  } catch (error) {
    console.error("Error getting next furnace bar out weight:", error);
    return 0;
  }
}

export async function getPace(): Promise<number> {
  try {
    const connection = await getRmConnection();

    const sql = `
      SELECT 
        PACE
      FROM 
        NUCRMRT.RML_PACE 
      ORDER BY 
        PACE_START DESC 
      FETCH FIRST 1 ROWS ONLY
    `;

    const result = await connection.execute(sql);
    await connection.close();

    if (result.rows && result.rows.length > 0) {
      return (result.rows[0] as { PACE: number }).PACE;
    }

    return 0;
  } catch (error) {
    console.error("Error getting pace:", error);
    return 0;
  }
}
