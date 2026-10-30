import { and, eq, gte, isNotNull } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import {
  exercises,
  workoutExercises,
  workouts,
  workoutSets,
} from "@/db/schema";
import { firstWorkoutStartQuery } from "@/features/workouts/queries";
import {
  ACTIVITY_CALENDAR_WEEKS,
  toCalendarLevels,
  toDailySets,
} from "./activity-calendar";
import {
  ATHLETE_TYPE_WEEKS,
  consistencyWeeks,
  toFrequentExercises,
  toWeeklySessions,
  trainingStyle,
} from "./athlete-type";

import { lastWeekStarts } from "@/utils/date";

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
  // The complete weeks and this one: what is trained today already counts for
  // the style and the exercises, though not for the consistency.
  const weekStarts = lastWeekStarts(
    new Date(),
    firstWeekday,
    ATHLETE_TYPE_WEEKS + 1,
  );
  const from = weekStarts[0];
  const sets = useLiveQuery(athleteTypeSetsQuery(from), [from.getTime()]);
  const first = useLiveQuery(firstWorkoutStartQuery());
  const firstWorkoutStart = first.data.at(0)?.startedAt ?? undefined;
  const rows = sets.data;

  return {
    athleteType:
      rows.length === 0
        ? null
        : {
            style: trainingStyle(rows),
            frequentExercises: toFrequentExercises(rows, FREQUENT_EXERCISES),
            weeklySessions: toWeeklySessions(
              rows,
              consistencyWeeks(weekStarts, firstWorkoutStart),
            ),
          },
    // Both: with only the sets, the consistency would show first over every
    // week and change once the first workout is known.
    loaded: sets.updatedAt !== undefined && first.updatedAt !== undefined,
  };
}

// A row per set done, in a finished workout or not: today lights up while
// training. Unlike the athlete type, which waits for the workout to end.
export function dailySetsQuery(from: Date) {
  return db
    .select({
      startedAt: workouts.startedAt,
    })
    .from(workoutSets)
    .innerJoin(
      workoutExercises,
      eq(workoutExercises.id, workoutSets.workoutExerciseId),
    )
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(
      and(isNotNull(workoutSets.completedAt), gte(workouts.startedAt, from)),
    );
}

export function useActivityCalendar(firstWeekday: number) {
  const today = new Date();
  const weekStarts = lastWeekStarts(
    today,
    firstWeekday,
    ACTIVITY_CALENDAR_WEEKS,
  );
  const from = weekStarts[0];
  const { data, updatedAt } = useLiveQuery(dailySetsQuery(from), [
    from.getTime(),
  ]);

  return {
    weekStarts,
    levels: toCalendarLevels(weekStarts, toDailySets(data), today),
    loaded: updatedAt !== undefined,
  };
}
