import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { notesTable } from "./schema";
import { profilesTable } from "./schema/profiles-schema";

config({ path: ".env.local" });

const schema = {
  profiles: profilesTable,
  notes: notesTable
};

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

let client;
try {
  client = postgres(process.env.DATABASE_URL);
  console.log("Database connection initialized");
} catch (error) {
  console.error("Failed to initialize database connection:", error);
  throw error;
}

export const db = drizzle(client, { schema });
