import { getRmConnection, getCcConnection } from "@/lib/data/config/db";
import { CrewCalculator } from "@/lib/misc/crew-calculator";
import { HeaderModel } from "@/types/home/header-model";
import {
  getMillJobData,
  getPace,
  getTph,
} from "@/lib/data/home/rolling-mill";

export async function getHeaderData(): Promise<HeaderModel> {
  const [rolledTons, tph, limitingArea, millPace, millJobs, previousBar] =
    await Promise.all([
      getRolledTons(),
      getTph(),
      getPaceLimitingArea(),
      getPace(),
      assembleCurrentRolling(),
      getPreviousBarOutOfFurnace(),
    ]);

  let lastBarTimer = "N/A";
  if (previousBar?.discharge && previousBar.discharge !== new Date(0)) {
    const time =
      new Date().getTime() - new Date(previousBar.discharge).getTime();
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    lastBarTimer = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  const currentRolling =
    millJobs?.length > 0 ? millJobs[0].outProfileId || "N/A" : "N/A";

  let estimatedRollChangeByTph = 0;
  let estimatedRollChangeByPace = 0;

  if (millJobs?.length > 0) {
    const job = millJobs[0];
    const remainingWeight = job.requiredWeight * 1.06 - job.rolledWeight;

    if (tph > 0 && remainingWeight > 0) {
      estimatedRollChangeByTph =
        Math.round((remainingWeight / tph) * 100) / 100;
    }

    const nextBarWeight = await getNextFurnaceBarOutWeight();
    const theoreticalTph =
      nextBarWeight > 0 && millPace > 0
        ? (3600.0 / millPace) * nextBarWeight
        : 0;

    if (theoreticalTph > 0 && remainingWeight > 0) {
      estimatedRollChangeByPace =
        Math.round((remainingWeight / theoreticalTph) * 100) / 100;
    }
  }

  return {
    crew: CrewCalculator.calculateCurrentCrew(),
    currentRolling,
    tph,
    millPace,
    lastBarTimer,
    estimatedRollChangeByTph,
    estimatedRollChangeByPace,
    limitingArea,
    projectedBonus: 0,
    rolledTons,
  };
}

async function getRolledTons(): Promise<number> {
  const sql = `
    SELECT
      COALESCE(ROUND(SUM(WEIGHT),2),0) as rolledTons
    FROM
      V_DSCHG_SMRY_RPRT
  `;

  try {
    const connection = await getCcConnection();

    const result = await connection.execute(sql);

    if (result.rows && result.rows.length > 0) {
      return (result.rows[0] as { ROLLEDTONS: number }).ROLLEDTONS;
    }

    return 0;
  } catch (error) {
    console.error("Error getting rolled tons:", error);
    return 0;
  }
}

async function getPaceLimitingArea(): Promise<string> {
  const sql = `
    SELECT
      AREA_ID
    FROM
      RML_PACE
    ORDER BY
      PACE_START DESC 
    FETCH FIRST 1 ROWS ONLY
  `;

  try {
    const connection = await getRmConnection();

    const result = await connection.execute(sql);

    if (result.rows && result.rows.length > 0) {
      const areaId = (result.rows[0] as { AREA_ID: number }).AREA_ID;
      const areaDesc = await matchAreaIdToDescription(connection, areaId);
      return areaDesc ? areaDesc.substring(4) : "";
    }

    return "";
  } catch (error) {
    console.error("Error getting pace limiting area:", error);
    return "";
  }
}

async function matchAreaIdToDescription(
  connection: any,
  areaId: number
): Promise<string> {
  const sql = `
    SELECT
        DESCRIPTION
    FROM
        RML_PACE_AREA 
    WHERE
        AREA_ID = :areaId
  `;

  try {
    const result = await connection.execute(sql, [areaId]);

    if (result.rows && result.rows.length > 0) {
      return result.rows[0].AREA_DESC;
    }

    return "";
  } catch (error) {
    console.error("Error matching area ID to description:", error);
    return "";
  }
}

async function assembleCurrentRolling(): Promise<any[]> {
  try {
    const millJobData = await getMillJobData();
    const tph = await getTph();
    const weight = await getNextFurnaceBarOutWeight();
    const pace = await getPace();

    const theoreticalTph =
      weight > 0 && pace > 0 ? (3600.0 / pace) * weight : 0;

    return millJobData.map((row) => {
      const required = row.REQUIREDWEIGHT * 1.06;
      const rolled = row.ROLLEDWEIGHT;

      return {
        ...row,
        jobId: row.JOBID,
        taskId: row.TASKID,
        productSize: row.PRODUCTSIZE,
        requiredWeight: row.REQUIREDWEIGHT,
        outProfileId: row.OUTPROFILEID,
        rolledWeight: row.ROLLEDWEIGHT,
        rolledLength: row.ROLLEDLENGTH,
        tphWc:
          Math.round(
            tph > 0 && rolled < required ? (required - rolled) / tph : 0 * 100
          ) / 100,
        tphPace:
          Math.round(
            theoreticalTph > 0 && rolled < required
              ? (required - rolled) / theoreticalTph
              : 0 * 100
          ) / 100,
      };
    });
  } catch (error) {
    console.error("Error assembling current rolling:", error);
    return [];
  }
}

async function getNextFurnaceBarOutWeight(): Promise<number> {
  try {
    const connection = await getCcConnection();

    const sql = `
      SELECT
        ROUND(weight,2) AS weight
      FROM
        V_RHF_MAP_FROM_TRK
      WHERE
        POS_ID = (SELECT MIN(pos_id) FROM V_RHF_MAP_FROM_TRK)
    `;

    const result = await connection.execute(sql);
    await connection.close();

    if (result.rows && result.rows.length > 0) {
      return (result.rows[0] as { WEIGHT: number }).WEIGHT;
    }

    return 0;
  } catch (error) {
    console.error("Error getting next furnace bar out weight:", error);
    return 0;
  }
}

async function getPreviousBarOutOfFurnace() {
  try {
    const connection = await getCcConnection();

    const sql = `
      SELECT
        SEQ,
        HEAT_ID HeatId,
        GRADE Chemistry,
        ORD_LENGTH OrderLength,
        GET_RHF_CHG_MODE_RC(CONCAT(TRIM(HEAT_ID), TRIM(BLOOM_ID))) AS ChargeMode,
        dischg Discharge
      FROM
        CCL2S.V_DSCHG_LST_RPRT
      WHERE
        DISCHG = (SELECT MAX(dischg) FROM CCL2S.V_DSCHG_LST_RPRT)
    `;

    const result = await connection.execute(sql);
    await connection.close();

    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0] as {
        SEQ: string;
        HEATID: string;
        CHEMISTRY: string;
        ORDERLENGTH: string;
        CHARGEMODE: string;
        DISCHARGE: string;
      };

      return {
        seq: row.SEQ,
        heatId: row.HEATID,
        chemistry: row.CHEMISTRY,
        orderLength: row.ORDERLENGTH,
        chargeMode: row.CHARGEMODE,
        discharge: new Date(row.DISCHARGE),
      };
    }

    return {
      seq: "N/A",
      heatId: "N/A",
      chemistry: "N/A",
      orderLength: "N/A",
      chargeMode: "N/A",
      discharge: null,
    };
  } catch (error) {
    console.error("Error getting previous bar out of furnace:", error);
    return {
      seq: "N/A",
      heatId: "N/A",
      chemistry: "N/A",
      orderLength: "N/A",
      chargeMode: "N/A",
      discharge: new Date(0),
    };
  }
}
