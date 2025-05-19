import { as400Config } from "@/lib/data/config/db";
import odbc from "odbc";
import {
  Customer,
  CustomerOrder,
  validateCustomerOrderRows,
  validateCustomerRows,
} from "../../schemas/customers";
import { As400Handler } from "@/lib/misc/as400-handler";

export async function getCustomers(): Promise<Customer[]> {
  const sql = `
    WITH LastOrders AS (
        SELECT
            H8AANB Customer
            , MAX(H8AQNB) LastOrder
        FROM
            COLDMLDTA.CNH8REP
        GROUP BY
            H8AANB
    )
    SELECT
        A.H9AANB Customer
        , A.H9ABNA CustomerName
        , A.H9ILTS CountryCode
        , A.H9FQCE StateCode
        , A.H9BMTX City
        , COLDMLDTA.C2DATE2(A.H9ALDT, A.H9ACTM) CreateDate
        , B.LastOrder LastOrder
    FROM
        COLDMLDTA.CNH9REL1 A
    LEFT JOIN
        LastOrders B ON A.H9AANB = B.Customer
    WHERE
        A.H9FRSP = 'A'
    `;

  let connection;
  try {
    connection = await odbc.connect(as400Config.connectionString);
    const result = await connection.query(sql);

    return validateCustomerRows(result);
  } finally {
    await connection?.close();
  }
}

export async function getCustomerOrders(
  customer: number
): Promise<CustomerOrder[]> {
  const sql = `
  SELECT
      H9ABNA Customer
      , H8CANB Tons
      , H8D7NB TonsShipped
      , ROUND(H8CANB/ROUND(H8S6NR/2000,2),2) BundlesOrdered
      , H8E6TS Product
      , COLDMLDTA.C2DATE2(H7ALDT, 0) OrderDate
  FROM
      COLDMLDTA.CNH8REP
  JOIN
      COLDMLDTA.CNH9REL1 ON H8AANB = H9AANB
  JOIN
      COLDMLDTA.CNH7REP ON H8AQNB = H7AQNB
  WHERE
      H9AANB = ?
      AND H7ALDT >= ?
  ORDER BY
      OrderDate
  `;

  let connection;

  const startDate = As400Handler.as400Date(
    new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
  );

  try {
    connection = await odbc.connect(as400Config.connectionString);
    const result = await connection.query<CustomerOrder[]>(sql, [
      customer,
      startDate,
    ]);

    return validateCustomerOrderRows(result);
  } finally {
    await connection?.close();
  }
}
