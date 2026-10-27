import { and, asc, desc, eq, gte, isNotNull, max } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import {
  bodyWeights,
  workoutExercises,
  workouts,
  workoutSets,
} from "@/db/schema";
import { useExerciseList } from "@/features/exercises/queries";
import { dailyMetric } from "@/features/progress/metrics";
import { rangeStart } from "@/features/progress/ranges";

import type { TrackingType } from "@/constants/enums";
import { newId } from "@/db/id";
import type { ExerciseSummary } from "@/features/exercises/queries";
import type { SetValues } from "@/features/workouts/queries";
import type { ChartPoint } from "@/utils/chart";

import { parseDateKey, toDateKey } from "@/utils/date";

type TrainedExerciseRow = {
  exerciseId: string;
  lastTrained: Date | null;
};

// A set done, with the day its workout started.
type ExerciseSetRow = SetValues & { startedAt: Date };

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
  rows: readonly TrainedExerciseRow[],
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

// One point per day: the best set of that day, whatever the hour of the
// workout. Days are the user's own (local time), which is why they are grouped
// here and not in SQL. Days with no usable set leave no point.
export function toDailyPoints(
  trackingType: TrackingType,
  rows: readonly ExerciseSetRow[],
): ChartPoint[] {
  const days = new Map<string, { date: Date; sets: ExerciseSetRow[] }>();
  for (const row of rows) {
    const key = row.startedAt.toDateString();
    const day = days.get(key) ?? {
      // Midnight, so the day compares like the ranges and "Today" do.
      date: new Date(
        row.startedAt.getFullYear(),
        row.startedAt.getMonth(),
        row.startedAt.getDate(),
      ),
      sets: [],
    };
    day.sets.push(row);
    days.set(key, day);
  }

  return [...days.values()]
    .flatMap(({ date, sets }): ChartPoint[] => {
      const value = dailyMetric(trackingType, sets);
      return value === null ? [] : [{ date, value }];
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

// The chart of one exercise. Without one (nothing trained yet) it reads no
// sets: an empty id matches none, and the hook still runs on every render.
export function useExerciseProgress(
  exerciseId: string | undefined,
  trackingType: TrackingType | undefined,
) {
  const { data, updatedAt } = useLiveQuery(
    exerciseSetsQuery(exerciseId ?? ""),
    [exerciseId],
  );

  return {
    points: trackingType === undefined ? [] : toDailyPoints(trackingType, data),
    loaded: updatedAt !== undefined,
  };
}

// ? BODY WEIGHT
export function bodyWeightsQuery() {
  return db
    .select({
      id: bodyWeights.id,
      measuredOn: bodyWeights.measuredOn,
      weightKg: bodyWeights.weightKg,
    })
    .from(bodyWeights)
    .orderBy(asc(bodyWeights.measuredOn));
}

export type BodyWeightEntry = { id: string; date: Date; weightKg: number };

// Each day key becomes midnight of that day, local time, oldest first.
export function toBodyWeightEntries(
  rows: readonly { id: string; measuredOn: string; weightKg: number }[],
): BodyWeightEntry[] {
  return rows.map((row) => ({
    id: row.id,
    date: parseDateKey(row.measuredOn),
    weightKg: row.weightKg,
  }));
}

// The chart only needs the day and the weight.
export function toBodyWeightPoints(
  entries: readonly BodyWeightEntry[],
): ChartPoint[] {
  return entries.map((entry) => ({ date: entry.date, value: entry.weightKg }));
}

export type RecentBodyWeight = BodyWeightEntry & { changeKg: number | null };

// The last weigh-ins, the latest first, each with what it changed from the
// one before it. The first ever weigh-in has nothing to compare with.
export function recentBodyWeights(
  entries: readonly BodyWeightEntry[],
  count: number,
): RecentBodyWeight[] {
  return entries
    .map((entry, index) => ({
      ...entry,
      changeKg:
        index === 0 ? null : entry.weightKg - entries[index - 1].weightKg,
    }))
    .slice(-count)
    .reverse();
}

// One live query for the chart and the list: both read the same entries.
export function useBodyWeights() {
  const { data, updatedAt } = useLiveQuery(bodyWeightsQuery(), []);

  return {
    entries: toBodyWeightEntries(data),
    loaded: updatedAt !== undefined,
  };
}

// One weigh-in per day: saving again the same day replaces its weight.
export function saveBodyWeight(measuredAt: Date, weightKg: number) {
  db.insert(bodyWeights)
    .values({ id: newId(), measuredOn: toDateKey(measuredAt), weightKg })
    .onConflictDoUpdate({
      target: bodyWeights.measuredOn,
      set: { weightKg, updatedAt: new Date() },
    })
    .run();
}
