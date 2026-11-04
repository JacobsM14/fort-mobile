import { and, countDistinct, eq, inArray, isNull, sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import { newId } from "@/db/id";
import {
  exerciseMuscles,
  exercises,
  routineExercises,
  routines,
  workoutExercises,
} from "@/db/schema";

import { isMuscleId, type MuscleId } from "./catalog";

import type { Equipment, MuscleRole, TrackingType } from "@/constants/enums";

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

export type ExerciseInput = {
  name: string;
  description: string;
  trackingType: TrackingType;
  equipment: Equipment | null;
  primaryMuscles: readonly MuscleId[];
};

function exerciseValues(input: ExerciseInput) {
  return {
    name: input.name.trim(),
    description: input.description.trim() || null,
    equipment: input.equipment,
    trackingType: input.trackingType,
  };
}

function primaryMuscleRows(exerciseId: string, muscles: readonly MuscleId[]) {
  return muscles.map((muscleId) => ({
    exerciseId,
    muscleId,
    role: "primary" as const,
  }));
}

// User exercise: no key, and the name is stored as typed (not translated).
// Synchronous because the Expo driver doesn't accept async transactions.
export function createExercise(input: ExerciseInput) {
  const exerciseId = newId();
  db.transaction((tx) => {
    tx.insert(exercises)
      .values({ id: exerciseId, ...exerciseValues(input) })
      .run();
    if (input.primaryMuscles.length > 0) {
      tx.insert(exerciseMuscles)
        .values(primaryMuscleRows(exerciseId, input.primaryMuscles))
        .run();
    }
  });
  return exerciseId;
}

export function updateExercise(id: string, input: ExerciseInput) {
  db.transaction((tx) => {
    tx.update(exercises)
      .set(exerciseValues(input))
      .where(eq(exercises.id, id))
      .run();
    tx.delete(exerciseMuscles)
      .where(
        and(
          eq(exerciseMuscles.exerciseId, id),
          eq(exerciseMuscles.role, "primary"),
        ),
      )
      .run();
    if (input.primaryMuscles.length > 0) {
      tx.insert(exerciseMuscles)
        .values(primaryMuscleRows(id, input.primaryMuscles))
        .run();
    }
  });
}

export function countRoutinesWithExercise(exerciseId: string) {
  return (
    db
      .select({ count: countDistinct(routineExercises.routineId) })
      .from(routineExercises)
      .where(eq(routineExercises.exerciseId, exerciseId))
      .all()
      .at(0)?.count ?? 0
  );
}

// Also takes it out of the routines that use it. If logged workouts use it,
// it's archived instead of deleted so their history keeps it.
export function deleteExercise(id: string) {
  db.transaction((tx) => {
    const routineIds = tx
      .selectDistinct({ routineId: routineExercises.routineId })
      .from(routineExercises)
      .where(eq(routineExercises.exerciseId, id))
      .all()
      .map((row) => row.routineId);
    if (routineIds.length > 0) {
      tx.delete(routineExercises)
        .where(eq(routineExercises.exerciseId, id))
        .run();
      // useRoutineList only re-runs when the routines table changes.
      tx.update(routines)
        .set({ updatedAt: new Date() })
        .where(inArray(routines.id, routineIds))
        .run();
    }

    const usedInWorkouts =
      tx
        .select({ id: workoutExercises.id })
        .from(workoutExercises)
        .where(eq(workoutExercises.exerciseId, id))
        .limit(1)
        .all().length > 0;
    if (usedInWorkouts) {
      tx.update(exercises)
        .set({ archivedAt: new Date() })
        .where(eq(exercises.id, id))
        .run();
    } else {
      tx.delete(exercises).where(eq(exercises.id, id)).run();
    }
  });
}

export type ExerciseMuscleRow = {
  id: string;
  key: string | null;
  name: string | null;
  description: string | null;
  equipment: Equipment | null;
  trackingType: TrackingType;
  muscleId: string | null;
  role: MuscleRole | null;
};

// The list query returns one row per exercise and muscle (a left join); this
// folds them into one summary per exercise, keeping the muscles' order.
export function toExerciseSummaries(
  rows: readonly ExerciseMuscleRow[],
): ExerciseSummary[] {
  const summaries = new Map<string, ExerciseSummary>();
  for (const { muscleId, role, ...exercise } of rows) {
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
  return [...summaries.values()];
}

// syncCatalog inserts each exercise's muscles in catalog order, so rowid order
// keeps the main muscle first. It lives outside the hook because the React
// Compiler skips any hook with a tagged template, and an uncompiled hook hands
// out a new list on every render, so screens re-sort it on every tap.
const MUSCLE_ORDER = sql`${exerciseMuscles}.rowid`;

// Re-runs by itself when the exercises table changes (client.ts opens the
// database with enableChangeListener).
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

  return {
    exercises: toExerciseSummaries(data),
    // Until the first read finishes, an empty list means "not loaded yet".
    loaded: updatedAt !== undefined,
  };
}
