import { getRmConnection } from "@/lib/data/config/db";
import { CreditReportModel } from "@/types/reports/credit/credit-report-model";

export async function getCreditReport(startDate: Date, stopDate: Date) {
  const sql = `
    SELECT
        C.CREDIT_ID CreditId
        , C.REASON_ID ReasonId
        , C.ENTRY_DATE EntryDate
        , C.CREW
        , TO_CHAR(C.NOTE) NOTE  -- Convert CLOB to VARCHAR2/STRING
        , ROUND(D.Credit * 60, 1) Credit
        , D.Description 
    FROM
        RML_CREDIT C
    INNER JOIN 
        DLY_REASON D ON C.REASON_ID = D.REASON_ID
    WHERE
        ENTRY_DATE BETWEEN :startDate AND :stopDate
        AND C.STATUS = 1
    ORDER BY
        C.ENTRY_DATE
  `;

  const connection = await getRmConnection();
  const result = await connection.execute(sql, { startDate, stopDate });

  // somebody made the note column CLOB (unlucky)
  const processedRows = await Promise.all(
    ((result.rows || []) as Record<string, any>[]).map(async (row: Record<string, any>) => {
      const processedRow = { ...(row as Record<string, any>) };

      if (
        processedRow.NOTE &&
        typeof processedRow.NOTE === "object" &&
        "read" in processedRow.NOTE
      ) {
        try {
          const chunks = [];
          let chunk;
          do {
            chunk = await processedRow.NOTE.read();
            if (chunk) chunks.push(chunk);
          } while (chunk);

          processedRow.NOTE = Buffer.concat(chunks).toString();
        } catch (error) {
          console.error("Error reading LOB:", error);
          processedRow.NOTE = null;
        }
      }

      return processedRow;
    })
  );

  await connection.close();

  return processedRows as CreditReportModel[];
}
