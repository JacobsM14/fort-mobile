import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { useEffect, useState } from "react";

import { db, expoDb } from "./client";
import migrations from "./migrations/migrations";

export function useDatabase() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    migrate(db, migrations)
      .then(() => {
        // Las foreign keys se activan después de migrar: las migraciones van en
        // una transacción (donde no se pueden apagar) y, si recrean una tabla,
        // su DROP TABLE dispararía el CASCADE y borraría las filas hijas.
        expoDb.execSync("PRAGMA foreign_keys = ON;");
        setReady(true);
      })
      .catch(setError);
  }, []);

  return { ready, error };
}
