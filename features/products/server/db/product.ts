import { getRmConnection } from "@/lib/data/config/db";
import { Product, validateProducts } from "../../schemas/schema";

export async function getProducts(): Promise<Product[]> {
  const sql = `
SELECT
   PROFILE_ID
   , ASTM
FROM 
   RML_PROFILE
WHERE
   USAGE_TYPE = 2
   AND ACTIVE_IN_MMI = 1
ORDER BY 
   PROFILE_ID
    `;

  let connection;

  try {
    connection = await getRmConnection();
    const result = await connection.execute(sql);
    return validateProducts(result.rows || []);
  } finally {
    await connection?.close();
  }
}
