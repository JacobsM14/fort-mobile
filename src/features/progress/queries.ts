import { and, asc, desc, eq, gte, isNotNull, max } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import { workoutExercises, workouts, workoutSets } from "@/db/schema";
import { useExerciseList } from "@/features/exercises/queries";
import { rangeStart } from "@/features/progress/ranges";

import type { ExerciseSummary } from "@/features/exercises/queries";

type ExerciseSetRow = {
  exerciseId: string;
  lastTrained: Date | null;
};

// Collects all sets for a given exercise that have been completed.
export function exerciseSetsQuery(exerciseId: string) {
  return db
    .select({
      startedAt: workouts.startedAt,
      weightKg: workoutSets.weightKg,
      reps: workoutSets.reps,
      durationS: workoutSets.durationS,
      distanceM: workoutSets.distanceM,
    })
    .from(workoutSets)
    .innerJoin(
      workoutExercises,
      eq(workoutExercises.id, workoutSets.workoutExerciseId),
    )
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(
      and(
        eq(workoutExercises.exerciseId, exerciseId),
        isNotNull(workoutSets.completedAt),
      ),
    )
    .orderBy(asc(workouts.startedAt));
}

// Exercises with a set done since the given day, the latest trained first.
export function trainedExercisesQuery(since: Date) {
  return db
    .select({
      exerciseId: workoutExercises.exerciseId,
      lastTrained: max(workouts.startedAt),
    })
    .from(workoutSets)
    .innerJoin(
      workoutExercises,
      eq(workoutExercises.id, workoutSets.workoutExerciseId),
    )
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(
      and(isNotNull(workoutSets.completedAt), gte(workouts.startedAt, since)),
    )
    .groupBy(workoutExercises.exerciseId)
    .orderBy(desc(max(workouts.startedAt)));
}

// The picker needs each exercise's name and type: the rows only have ids. Archived exercises have no summary and are left out.
export function toTrainedExercises(
  rows: readonly ExerciseSetRow[],
  summaries: readonly ExerciseSummary[],
) {
  const byId = new Map(
    summaries.map((summary) => [summary.id, summary] as const),
  );

  return rows.flatMap((row) => {
    const summary = byId.get(row.exerciseId);
    return summary === undefined
      ? []
      : [{ ...summary, lastTrained: row.lastTrained }];
  });
}

// The exercises trained within the longest range of the filter, so none of them shows an empty chart.
export function useTrainedExercises() {
  // Get the date one year ago from today to filter trained exercises.
  const since = rangeStart("1y", new Date());

  const { data, updatedAt } = useLiveQuery(trainedExercisesQuery(since), [
    since.getTime(),
  ]);

  const { exercises, loaded } = useExerciseList();

  return {
    exercises: toTrainedExercises(data, exercises),
    loaded: updatedAt !== undefined && loaded,
  };
}
