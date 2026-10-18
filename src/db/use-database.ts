import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { useEffect, useState } from "react";

import { syncCatalog } from "@/features/exercises/sync-catalog";

import { db, expoDb } from "./client";
import migrations from "./migrations/migrations";

export function useDatabase() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    // Foreign keys are turned off before migrating and back on afterwards:
    // migrations run inside a transaction (where the PRAGMA has no effect)
    // and, when one recreates a table, its DROP TABLE would fire the CASCADE
    // (deleting child rows) or the RESTRICT. They are turned off explicitly
    // because with Fast Refresh the connection stays open with them already on.
    expoDb.execSync("PRAGMA foreign_keys = OFF;");
    migrate(db, migrations)
      .then(() => {
        expoDb.execSync("PRAGMA foreign_keys = ON;");
        // Runs once foreign keys are back on, so they validate the muscles.
        syncCatalog();
        setReady(true);
      })
      .catch(setError);
  }, []);

  return { ready, error };
}
