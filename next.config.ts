import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "nsb-bml2-websvr", "*"],
    },
  },
};

export default nextConfig;
