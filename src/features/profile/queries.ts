import { and, eq, gte, isNotNull } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import {
  exercises,
  workoutExercises,
  workouts,
  workoutSets,
} from "@/db/schema";
import {
  ATHLETE_TYPE_WEEKS,
  lastWeekStarts,
  toFrequentExercises,
  toWeeklySessions,
  trainingStyle,
} from "./athlete-type";

// How many of the most frequent exercises the profile shows.
const FREQUENT_EXERCISES = 3;

export function athleteTypeSetsQuery(from: Date) {
  return db
    .select({
      workoutId: workouts.id,
      startedAt: workouts.startedAt,
      exerciseId: exercises.id,
      key: exercises.key,
      name: exercises.name,
      description: exercises.description,
      trackingType: exercises.trackingType,
    })
    .from(workoutSets)
    .innerJoin(
      workoutExercises,
      eq(workoutExercises.id, workoutSets.workoutExerciseId),
    )
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .innerJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .where(
      and(
        isNotNull(workoutSets.completedAt),
        isNotNull(workouts.endedAt),
        gte(workouts.startedAt, from),
      ),
    );
}

// The athlete type over the last weeks, or null while nothing was trained in
// them. The weeks are worked out here, so the first one is always there.
export function useAthleteType(firstWeekday: number) {
  const weekStarts = lastWeekStarts(
    new Date(),
    firstWeekday,
    ATHLETE_TYPE_WEEKS,
  );
  const from = weekStarts[0];
  const { data, updatedAt } = useLiveQuery(athleteTypeSetsQuery(from), [
    from.getTime(),
  ]);

  return {
    athleteType:
      data.length === 0
        ? null
        : {
            style: trainingStyle(data),
            frequentExercises: toFrequentExercises(data, FREQUENT_EXERCISES),
            weeklySessions: toWeeklySessions(data, weekStarts),
          },
    loaded: updatedAt !== undefined,
  };
}
