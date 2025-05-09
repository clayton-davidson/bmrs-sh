const dbConfig = {
  user: process.env.MSSQL_USER || "username",
  password: process.env.MSSQL_PASSWORD || "password",
  database: "rollshop",
  server: process.env.MSSQL_SERVER || "localhost",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export default dbConfig;
