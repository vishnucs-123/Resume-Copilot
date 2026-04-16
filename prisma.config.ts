import path from "node:path";
import { defineConfig } from "prisma/config";

const DATABASE_URL = (() => {
  const fs = require("fs");
  const env = fs.readFileSync(".env", "utf8");
  const match = env.match(/DATABASE_URL="([^"]+)"/);
  return match?.[1] ?? "";
})();

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: DATABASE_URL,
  },
});