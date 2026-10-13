import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { useEffect, useState } from "react";

import { syncCatalog } from "@/features/exercises/sync-catalog";

import { db, expoDb } from "./client";
import migrations from "./migrations/migrations";

export function useDatabase() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    // Las foreign keys se apagan antes de migrar y se encienden después: las
    // migraciones van en una transacción (donde el PRAGMA no tiene efecto) y,
    // si recrean una tabla, su DROP TABLE dispararía el CASCADE (borrando las
    // filas hijas) o el RESTRICT. Se apagan explícitamente porque con Fast
    // Refresh la conexión sigue abierta con ellas ya encendidas.
    expoDb.execSync("PRAGMA foreign_keys = OFF;");
    migrate(db, migrations)
      .then(() => {
        expoDb.execSync("PRAGMA foreign_keys = ON;");
        // Con las foreign keys ya activas, para que validen los músculos.
        syncCatalog();
        setReady(true);
      })
      .catch(setError);
  }, []);

  return { ready, error };
}
