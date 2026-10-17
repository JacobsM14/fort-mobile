import { desc, eq, isNull, sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import type { Equipment, TrackingType } from "@/constants/enums";
import { db } from "@/db/client";
import { newId } from "@/db/id";
import { exerciseMuscles, exercises } from "@/db/schema";

import { isMuscleId, type MuscleId } from "./catalog";

export type ExerciseSummary = {
  id: string;
  key: string | null;
  name: string | null;
  description: string | null;
  equipment: Equipment | null;
  trackingType: TrackingType;
  primaryMuscles: MuscleId[];
  secondaryMuscles: MuscleId[];
};

// Ejercicio del usuario: sin key, con el nombre tal cual (no se traduce).
// Se devuelve la consulta para que quien llame haga await: Drizzle no la
// ejecuta hasta entonces.
export function createExercise(input: {
  name: string;
  description: string;
  trackingType: TrackingType;
}) {
  return db.insert(exercises).values({
    id: newId(),
    name: input.name.trim(),
    description: input.description.trim() || null,
    trackingType: input.trackingType,
  });
}

// Se vuelve a ejecutar sola cuando cambia la tabla (client.ts abre la base de
// datos con enableChangeListener).
export function useExercises() {
  return useLiveQuery(
    db
      .select()
      .from(exercises)
      .where(isNull(exercises.archivedAt))
      .orderBy(desc(exercises.createdAt)),
  );
}

// syncCatalog inserts each exercise's muscles in catalog order, so rowid order
// keeps the main muscle first. It lives outside the hook because the React
// Compiler skips any hook with a tagged template, and an uncompiled hook hands
// out a new list on every render, so screens re-sort it on every tap.
const MUSCLE_ORDER = sql`${exerciseMuscles}.rowid`;

export function useExerciseList() {
  const { data, updatedAt } = useLiveQuery(
    db
      .select({
        id: exercises.id,
        key: exercises.key,
        name: exercises.name,
        description: exercises.description,
        equipment: exercises.equipment,
        trackingType: exercises.trackingType,
        muscleId: exerciseMuscles.muscleId,
        role: exerciseMuscles.role,
      })
      .from(exercises)
      .leftJoin(exerciseMuscles, eq(exerciseMuscles.exerciseId, exercises.id))
      .where(isNull(exercises.archivedAt))
      .orderBy(MUSCLE_ORDER),
  );

  const summaries = new Map<string, ExerciseSummary>();
  for (const { muscleId, role, ...exercise } of data) {
    const summary = summaries.get(exercise.id) ?? {
      ...exercise,
      primaryMuscles: [],
      secondaryMuscles: [],
    };
    if (muscleId !== null && isMuscleId(muscleId)) {
      if (role === "primary") {
        summary.primaryMuscles.push(muscleId);
      } else {
        summary.secondaryMuscles.push(muscleId);
      }
    }
    summaries.set(exercise.id, summary);
  }

  return {
    exercises: [...summaries.values()],
    // Until the first read finishes, an empty list means "not loaded yet".
    loaded: updatedAt !== undefined,
  };
}
