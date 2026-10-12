import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

export const expoDb = openDatabaseSync("fortapp.db", {
  enableChangeListener: true,
});
expoDb.execSync("PRAGMA journal_mode = WAL;");

export const db = drizzle(expoDb);
