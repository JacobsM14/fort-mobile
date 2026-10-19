import { eq, isNotNull, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { newId } from "@/db/id";
import { exerciseMuscles, exercises, muscles } from "@/db/schema";

import { EXERCISE_CATALOG, MUSCLES } from "./catalog";
import { deleteExercise } from "./queries";

type CatalogEntry = (typeof EXERCISE_CATALOG)[number];
type StoredMuscleRow = { muscleId: string; role: string };

function catalogMuscleRows(exerciseId: string, entry: CatalogEntry) {
  return [
    ...entry.primaryMuscles.map((muscleId) => ({
      exerciseId,
      muscleId,
      role: "primary" as const,
    })),
    ...entry.secondaryMuscles.map((muscleId) => ({
      exerciseId,
      muscleId,
      role: "secondary" as const,
    })),
  ];
}

function muscleSignature(rows: readonly StoredMuscleRow[]) {
  return rows.map((row) => `${row.role}:${row.muscleId}`).join(",");
}

// Writes the catalog to SQLite. It runs on every startup but only writes what
// changed, matched by key, so a normal launch writes nothing and updated_at
// only moves when the catalog really changes. It never touches name,
// description or archivedAt (those may be user edits). The transaction is
// synchronous because the Expo driver doesn't support async callbacks in
// transactions.
export function syncCatalog() {
  const droppedIds = db.transaction((tx) => {
    const storedMuscles = new Map(
      tx
        .select()
        .from(muscles)
        .all()
        .map((row) => [row.id, row] as const),
    );
    MUSCLES.forEach((muscle, sortOrder) => {
      const stored = storedMuscles.get(muscle.id);
      if (
        stored?.groupKey === muscle.groupKey &&
        stored.sortOrder === sortOrder
      ) {
        return;
      }
      tx.insert(muscles)
        .values({ id: muscle.id, groupKey: muscle.groupKey, sortOrder })
        .onConflictDoUpdate({
          target: muscles.id,
          set: { groupKey: muscle.groupKey, sortOrder },
        })
        .run();
    });

    const storedExercises = tx
      .select({
        id: exercises.id,
        key: exercises.key,
        equipment: exercises.equipment,
        trackingType: exercises.trackingType,
        archivedAt: exercises.archivedAt,
      })
      .from(exercises)
      .where(isNotNull(exercises.key))
      .all();
    const storedByKey = new Map(
      storedExercises.map((row) => [row.key, row] as const),
    );

    // Rowid order is insertion order, which keeps each exercise's main muscle
    // first, so a reordered list also counts as a change.
    const storedExerciseMuscles = new Map<string, StoredMuscleRow[]>();
    const muscleRows = tx
      .select({
        exerciseId: exerciseMuscles.exerciseId,
        muscleId: exerciseMuscles.muscleId,
        role: exerciseMuscles.role,
      })
      .from(exerciseMuscles)
      .orderBy(sql`${exerciseMuscles}.rowid`)
      .all();
    for (const row of muscleRows) {
      const rows = storedExerciseMuscles.get(row.exerciseId) ?? [];
      rows.push(row);
      storedExerciseMuscles.set(row.exerciseId, rows);
    }

    for (const entry of EXERCISE_CATALOG) {
      const stored = storedByKey.get(entry.key);
      const exerciseId = stored?.id ?? newId();
      if (stored === undefined) {
        tx.insert(exercises)
          .values({
            id: exerciseId,
            key: entry.key,
            equipment: entry.equipment,
            trackingType: entry.trackingType,
          })
          .run();
      } else if (
        stored.equipment !== entry.equipment ||
        stored.trackingType !== entry.trackingType
      ) {
        tx.update(exercises)
          .set({ equipment: entry.equipment, trackingType: entry.trackingType })
          .where(eq(exercises.id, exerciseId))
          .run();
      }

      const rows = catalogMuscleRows(exerciseId, entry);
      const storedRows = storedExerciseMuscles.get(exerciseId) ?? [];
      if (muscleSignature(rows) !== muscleSignature(storedRows)) {
        tx.delete(exerciseMuscles)
          .where(eq(exerciseMuscles.exerciseId, exerciseId))
          .run();
        if (rows.length > 0) {
          tx.insert(exerciseMuscles).values(rows).run();
        }
      }
    }

    const catalogKeys = new Set<string | null>(
      EXERCISE_CATALOG.map((entry) => entry.key),
    );
    return storedExercises
      .filter((row) => !catalogKeys.has(row.key) && row.archivedAt === null)
      .map((row) => row.id);
  });

  // Exercises dropped from the catalog are handled like a user deleting them:
  // they leave the routines, and stay archived if workouts used them.
  for (const id of droppedIds) {
    deleteExercise(id);
  }
}
