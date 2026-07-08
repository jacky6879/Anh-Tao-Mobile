import path from "node:path";
import { defineConfig } from "prisma/config";

// Load .env for local CLI usage (Prisma 7 config file does not auto-load it).
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config();
} catch {
  /* dotenv optional */
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL,
    // shadowDatabaseUrl: process.env.DIRECT_URL,
  },
});
