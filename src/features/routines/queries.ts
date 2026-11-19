import { asc, desc, eq, inArray } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import { newId } from "@/db/id";
import { routineExercises, routines } from "@/db/schema";
import {
  useExerciseList,
  type ExerciseSummary,
} from "@/features/exercises/queries";

import type { TrackingType } from "@/constants/enums";
import type { MuscleId } from "@/features/exercises/catalog";

import { limitChars } from "@/utils/text";

// Long enough for "Pierna y glúteos · semana 3", short enough to fit the
// routine cards on Today and in Progress.
export const ROUTINE_NAME_MAX_LENGTH = 40;

function cleanRoutineName(name: string) {
  return limitChars(name, ROUTINE_NAME_MAX_LENGTH);
}

export type RoutineSummary = {
  id: string;
  name: string;
  exerciseCount: number;
  muscles: MuscleId[];
  trackingTypes: TrackingType[];
};

export function createRoutine(input: {
  name: string;
  exerciseIds: readonly string[];
}) {
  const routineId = newId();
  db.transaction((tx) => {
    tx.insert(routines)
      .values({ id: routineId, name: cleanRoutineName(input.name) })
      .run();
    if (input.exerciseIds.length > 0) {
      tx.insert(routineExercises)
        .values(
          input.exerciseIds.map((exerciseId, position) => ({
            id: newId(),
            routineId,
            exerciseId,
            position,
          })),
        )
        .run();
    }
  });
  return routineId;
}

export function updateRoutine(
  id: string,
  input: { name: string; exerciseIds: readonly string[] },
) {
  db.transaction((tx) => {
    tx.update(routines)
      .set({ name: cleanRoutineName(input.name) })
      .where(eq(routines.id, id))
      .run();

    const current = tx
      .select({
        id: routineExercises.id,
        exerciseId: routineExercises.exerciseId,
      })
      .from(routineExercises)
      .where(eq(routineExercises.routineId, id))
      .all();
    const removedIds = current
      .filter((row) => !input.exerciseIds.includes(row.exerciseId))
      .map((row) => row.id);
    if (removedIds.length > 0) {
      tx.delete(routineExercises)
        .where(inArray(routineExercises.id, removedIds))
        .run();
    }

    const rowIds = new Map(
      current.map((row) => [row.exerciseId, row.id] as const),
    );
    input.exerciseIds.forEach((exerciseId, position) => {
      const rowId = rowIds.get(exerciseId);
      if (rowId === undefined) {
        tx.insert(routineExercises)
          .values({ id: newId(), routineId: id, exerciseId, position })
          .run();
      } else {
        tx.update(routineExercises)
          .set({ position })
          .where(eq(routineExercises.id, rowId))
          .run();
      }
    });
  });
}

export function deleteRoutine(id: string) {
  db.delete(routines).where(eq(routines.id, id)).run();
}

export function useRoutine(id: string | null) {
  const { data, updatedAt } = useLiveQuery(
    db
      .select({
        name: routines.name,
        exerciseId: routineExercises.exerciseId,
      })
      .from(routines)
      .leftJoin(routineExercises, eq(routineExercises.routineId, routines.id))
      .where(eq(routines.id, id ?? ""))
      .orderBy(asc(routineExercises.position)),
    [id],
  );

  const first = data.at(0);
  const routine =
    first === undefined
      ? undefined
      : {
          name: first.name,
          exerciseIds: data
            .map((row) => row.exerciseId)
            .filter((exerciseId) => exerciseId !== null),
        };

  return { routine, loaded: updatedAt !== undefined };
}

export type RoutineExerciseRow = {
  id: string;
  name: string;
  exerciseId: string | null;
};

// The list query returns one row per routine and exercise (a left join); this
// folds them into one summary per routine, with each exercise's main muscle
// and tracking type listed once.
export function toRoutineSummaries(
  rows: readonly RoutineExerciseRow[],
  exercises: readonly ExerciseSummary[],
): RoutineSummary[] {
  const exercisesById = new Map(
    exercises.map((exercise) => [exercise.id, exercise] as const),
  );
  const summaries = new Map<string, RoutineSummary>();
  for (const { exerciseId, ...routine } of rows) {
    const summary = summaries.get(routine.id) ?? {
      ...routine,
      exerciseCount: 0,
      muscles: [],
      trackingTypes: [],
    };
    if (exerciseId !== null) {
      summary.exerciseCount += 1;
      const exercise = exercisesById.get(exerciseId);
      const muscle = exercise?.primaryMuscles.at(0);
      if (muscle !== undefined && !summary.muscles.includes(muscle)) {
        summary.muscles.push(muscle);
      }
      if (
        exercise !== undefined &&
        !summary.trackingTypes.includes(exercise.trackingType)
      ) {
        summary.trackingTypes.push(exercise.trackingType);
      }
    }
    summaries.set(routine.id, summary);
  }
  return [...summaries.values()];
}

export function useRoutineList() {
  const { data, updatedAt } = useLiveQuery(
    db
      .select({
        id: routines.id,
        name: routines.name,
        exerciseId: routineExercises.exerciseId,
      })
      .from(routines)
      .leftJoin(routineExercises, eq(routineExercises.routineId, routines.id))
      .orderBy(desc(routines.createdAt), asc(routineExercises.position)),
  );
  const { exercises, loaded: exercisesLoaded } = useExerciseList();

  return {
    routines: toRoutineSummaries(data, exercises),
    // The summaries take muscles and tracking types from the exercises, so
    // they aren't complete until both queries have loaded.
    loaded: updatedAt !== undefined && exercisesLoaded,
  };
}
