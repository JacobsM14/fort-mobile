/// <reference types="node" />
import { drizzle } from "drizzle-orm/node-sqlite";
import { DatabaseSync } from "node:sqlite";

import migrations from "@/db/migrations/migrations";

export function createTestDatabase() {
  const client = new DatabaseSync(":memory:", {
    enableForeignKeyConstraints: false,
  });
  for (const migration of Object.values(migrations.migrations)) {
    for (const statement of migration.split("--> statement-breakpoint")) {
      if (statement.trim() !== "") {
        client.exec(statement);
      }
    }
  }
  client.exec("PRAGMA foreign_keys = ON;");
  return { db: drizzle({ client }) };
}
