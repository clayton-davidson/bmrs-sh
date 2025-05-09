"use server";

import config from "@/lib/data/config/mssql";
import { Product } from "@/types/configuration/product";
import sql from "mssql";

export async function getProducts(): Promise<Product[]> {
  const pool = await sql.connect(config);
  const result = await pool.request().query<Product>(`
    SELECT 
        p.id
        , p.[name]
        , pg.[name] productGroup
        , pg.[id] AS productGroupId
        , p.straightenerSpread
    FROM 
        Product p
    INNER JOIN ProductGroup pg ON p.ProductGroupId = pg.Id
    ORDER BY
        p.[Name]`);

  return result.recordset;
}
