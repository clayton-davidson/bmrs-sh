import oracledb from "oracledb";
import odbc from "odbc";

try {
  oracledb.initOracleClient({
    libDir: "C:\\Program Files\\instantclient_23_7",
  });
} catch (err) {
  console.error("Failed to initialize Oracle client libraries");
  console.error(err);
}

export const as400Config = {
  connectionString:
    "DRIVER={iSeries Access ODBC Driver};SYSTEM=S103266d;DATABASE=COLDMLDTA;UID=nucorpc;PWD=support;PORT=8471;",
};

async function connectToAS400() {
  try {
    //console.log("connecting");
    const connectionString =
      "DRIVER={iSeries Access ODBC Driver};SYSTEM=S103266d;DATABASE=COLDMLDTA;UID=nucorpc;PWD=support;PORT=8471;";

    const connection = await odbc.connect(connectionString);
    //console.log("Connected successfully!");

    const result = (await connection.query(
      "SELECT 1 as test FROM SYSIBM.SYSDUMMY1"
    )) as { [key: string]: any }[];

    //console.log("Value:", result[0]["TEST"]);

    await connection.close();
  } catch (err) {
    console.error("Connection error:", err);
  }
}

connectToAS400();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const rmConfig = {
  user: "nucrmrt",
  password: "nucrmrt",
  connectString:
    "spnsbcoracleprod.sps.nucorsteel.local/rmprd.sps.nucorsteel.local",
};

export async function getRmConnection() {
  let connection;
  try {
    connection = await oracledb.getConnection(rmConfig);
    return connection;
  } catch (err) {
    console.error("Error getting connection:", err);
    throw err;
  }
}

const ccConfig = {
  user: "ccl2s",
  password: "ccl2s",
  connectString:
    "spnsbcoracleprod.sps.nucorsteel.local/ccprd.sps.nucorsteel.local",
};

export async function getCcConnection() {
  let connection;
  try {
    connection = await oracledb.getConnection(ccConfig);
    return connection;
  } catch (err) {
    console.error("Error getting connection:", err);
    throw err;
  }
}
