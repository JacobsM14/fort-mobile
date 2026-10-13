import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { newId } from "@/db/id";
import { exerciseMuscles, exercises, muscles } from "@/db/schema";

import { EXERCISE_CATALOG, MUSCLES } from "./catalog";

// Vuelca el catálogo en SQLite. Se ejecuta en cada arranque y se puede repetir:
// crea lo que falta y actualiza lo que ha cambiado por key, sin tocar name,
// description ni archivedAt (pueden ser cambios del usuario). La transacción es
// síncrona porque el driver de Expo no admite callbacks async en transacciones.
export function syncCatalog() {
  db.transaction((tx) => {
    MUSCLES.forEach((muscle, sortOrder) => {
      tx.insert(muscles)
        .values({ id: muscle.id, groupKey: muscle.groupKey, sortOrder })
        .onConflictDoUpdate({
          target: muscles.id,
          set: { groupKey: muscle.groupKey, sortOrder },
        })
        .run();
    });

    for (const entry of EXERCISE_CATALOG) {
      // .all() y no .get(): con el driver de Expo, .get() lee solo la primera
      // fila y deja la sentencia RETURNING abierta, y SQLite rechaza el commit
      // ("cannot commit transaction - SQL statements in progress").
      const [row] = tx
        .insert(exercises)
        .values({
          id: newId(),
          key: entry.key,
          equipment: entry.equipment,
          trackingType: entry.trackingType,
        })
        .onConflictDoUpdate({
          target: exercises.key,
          set: { equipment: entry.equipment, trackingType: entry.trackingType },
        })
        .returning({ id: exercises.id })
        .all();

      tx.delete(exerciseMuscles)
        .where(eq(exerciseMuscles.exerciseId, row.id))
        .run();

      const exerciseMuscleRows = [
        ...entry.primaryMuscles.map((muscleId) => ({
          exerciseId: row.id,
          muscleId,
          role: "primary" as const,
        })),
        ...entry.secondaryMuscles.map((muscleId) => ({
          exerciseId: row.id,
          muscleId,
          role: "secondary" as const,
        })),
      ];
      if (exerciseMuscleRows.length > 0) {
        tx.insert(exerciseMuscles).values(exerciseMuscleRows).run();
      }
    }
  });
}
