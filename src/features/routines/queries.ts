import { asc, desc, eq, inArray } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import { newId } from "@/db/id";
import { routineExercises, routines } from "@/db/schema";
import type { MuscleId } from "@/features/exercises/catalog";
import { useExerciseList } from "@/features/exercises/queries";

export type RoutineSummary = {
  id: string;
  name: string;
  exerciseCount: number;
  muscles: MuscleId[];
};

export function createRoutine(input: {
  name: string;
  exerciseIds: readonly string[];
}) {
  const routineId = newId();
  db.transaction((tx) => {
    tx.insert(routines)
      .values({ id: routineId, name: input.name.trim() })
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
      .set({ name: input.name.trim() })
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
  const { exercises } = useExerciseList();

  const mainMuscles = new Map(
    exercises.map(
      (exercise) => [exercise.id, exercise.primaryMuscles.at(0)] as const,
    ),
  );
  const summaries = new Map<string, RoutineSummary>();
  for (const { exerciseId, ...routine } of data) {
    const summary = summaries.get(routine.id) ?? {
      ...routine,
      exerciseCount: 0,
      muscles: [],
    };
    if (exerciseId !== null) {
      summary.exerciseCount += 1;
      const muscle = mainMuscles.get(exerciseId);
      if (muscle !== undefined && !summary.muscles.includes(muscle)) {
        summary.muscles.push(muscle);
      }
    }
    summaries.set(routine.id, summary);
  }

  return {
    routines: [...summaries.values()],
    loaded: updatedAt !== undefined,
  };
}
