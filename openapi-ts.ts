import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:52624/openapi/v1.json",
  output: "./lib/api",
  plugins: [
    {
      name: "@hey-api/client-next",
    },
    { name: "@tanstack/react-query" },
  ],
});
