import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { newId } from "@/db/id";
import { exerciseMuscles, exercises, muscles } from "@/db/schema";

import { EXERCISE_CATALOG, MUSCLES } from "./catalog";

// Writes the catalog to SQLite. It runs on every startup and is safe to repeat:
// it creates what is missing and updates what changed, matched by key, without
// touching name, description or archivedAt (those may be user edits). The
// transaction is synchronous because the Expo driver doesn't support async
// callbacks in transactions.
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
      // .all() rather than .get(): with the Expo driver, .get() reads only the
      // first row and leaves the RETURNING statement open, so SQLite rejects
      // the commit ("cannot commit transaction - SQL statements in progress").
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
