import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["oracledb", "odbc", "mssql"],
  turbopack: {
    resolveAlias: {
      "@azure/app-configuration": "data:text/javascript,export default {};",
      "@azure/identity": "data:text/javascript,export default {};",
      "@azure/keyvault-secrets": "data:text/javascript,export default {};",
      "oci-common": "data:text/javascript,export default {};",
      "oci-objectstorage": "data:text/javascript,export default {};",
      "oci-secrets": "data:text/javascript,export default {};",
    },
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "nsb-bml2-websvr", "*"],
    },
  },
};

export default nextConfig;
