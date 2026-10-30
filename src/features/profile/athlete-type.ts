import type { TrackingType } from "@/constants/enums";

import { getWeekDays } from "@/utils/date";

// What most of the training goes into, read from the exercises done most.
export type TrainingStyle =
  "strength" | "calisthenics" | "endurance" | "allRound";

// Lowest first: each level is reached from the one before.
export const CONSISTENCY_LEVELS = [
  "sporadic",
  "regular",
  "steady",
  "unstoppable",
] as const;
export type ConsistencyLevel = (typeof CONSISTENCY_LEVELS)[number];

// Sessions a week to reach each level: on average over the weeks looked at,
// except unstoppable, which asks for them in each of the latest weeks.
export const LEVEL_SESSIONS: Record<
  Exclude<ConsistencyLevel, "sporadic">,
  number
> = {
  regular: 2,
  steady: 3,
  unstoppable: 4,
};
export const UNSTOPPABLE_WEEKS = 2;

export type FrequentExercise = {
  id: string;
  // As stored: a catalog exercise has no name of its own, and the screen
  // gets it translated from its key.
  key: string | null;
  name: string | null;
  description: string | null;
  trackingType: TrackingType;
  // The workouts it was done in.
  workoutCount: number;
};

// The share of the sets that decides the style.
const STYLE_SHARE = 0.6;

export type AthleteType = {
  style: TrainingStyle;
  frequentExercises: FrequentExercise[];
  weeklySessions: number[];
};

export function averageSessions(weeklySessions: readonly number[]): number {
  if (weeklySessions.length === 0) {
    return 0;
  }
  const total = weeklySessions.reduce((sum, sessions) => sum + sessions, 0);
  return total / weeklySessions.length;
}

export function consistencyLevel(
  weeklySessions: readonly number[],
): ConsistencyLevel {
  const latest = weeklySessions.slice(-UNSTOPPABLE_WEEKS);
  if (
    latest.length === UNSTOPPABLE_WEEKS &&
    latest.every((sessions) => sessions >= LEVEL_SESSIONS.unstoppable)
  ) {
    return "unstoppable";
  }
  const average = averageSessions(weeklySessions);
  if (average >= LEVEL_SESSIONS.steady) {
    return "steady";
  }
  if (average >= LEVEL_SESSIONS.regular) {
    return "regular";
  }
  return "sporadic";
}

export function nextConsistencyLevel(
  level: ConsistencyLevel,
): Exclude<ConsistencyLevel, "sporadic"> | null {
  switch (level) {
    case "sporadic":
      return "regular";
    case "regular":
      return "steady";
    case "steady":
      return "unstoppable";
    case "unstoppable":
      return null;
  }
}

// The weeks the athlete type looks back over.
export const ATHLETE_TYPE_WEEKS = 12;

// The first day of each of the last `count` weeks, the oldest first and the
// week of `today` last. Weeks start on `firstWeekday` (1 is Sunday), as in the
// week shown in Today.
export function lastWeekStarts(
  today: Date,
  firstWeekday: number,
  count: number,
): Date[] {
  const [thisWeek] = getWeekDays(today, firstWeekday);
  return Array.from({ length: count }, (_, index) => {
    const weeksBack = count - 1 - index;
    return new Date(
      thisWeek.getFullYear(),
      thisWeek.getMonth(),
      thisWeek.getDate() - weeksBack * 7,
    );
  });
}

export type AthleteTypeRow = {
  workoutId: string;
  startedAt: Date;
  exerciseId: string;
  key: string | null;
  name: string | null;
  description: string | null;
  trackingType: TrackingType;
};

export function toWeeklySessions(
  rows: readonly AthleteTypeRow[],
  weekStarts: readonly Date[],
): number[] {
  return weekStarts.map((weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const workoutIds = new Set(
      rows
        .filter((row) => row.startedAt >= weekStart && row.startedAt < weekEnd)
        .map((row) => row.workoutId),
    );

    return workoutIds.size;
  });
}

// The exercises done in the most workouts. A row is a set, so the workouts are
// counted apart: twenty sets in one workout are one workout.
export function toFrequentExercises(
  rows: readonly AthleteTypeRow[],
  limit: number,
): FrequentExercise[] {
  const workoutsByExercise = new Map<string, Set<string>>();
  const exercises = new Map<string, AthleteTypeRow>();
  for (const row of rows) {
    const workoutIds = workoutsByExercise.get(row.exerciseId) ?? new Set();
    workoutIds.add(row.workoutId);
    workoutsByExercise.set(row.exerciseId, workoutIds);
    exercises.set(row.exerciseId, row);
  }

  return [...exercises.values()]
    .map((row) => ({
      id: row.exerciseId,
      key: row.key,
      name: row.name,
      description: row.description,
      trackingType: row.trackingType,
      workoutCount: workoutsByExercise.get(row.exerciseId)?.size ?? 0,
    }))
    .sort((a, b) => b.workoutCount - a.workoutCount || a.id.localeCompare(b.id))
    .slice(0, limit);
}

// The style most of the sets belong to; if none has enough of them, all-round.
export function trainingStyle(rows: readonly AthleteTypeRow[]): TrainingStyle {
  function shareOf(types: readonly TrackingType[]) {
    const sets = rows.filter((row) => types.includes(row.trackingType));
    return sets.length / rows.length;
  }

  if (rows.length === 0) {
    return "allRound";
  }
  if (shareOf(["weight_reps"]) >= STYLE_SHARE) {
    return "strength";
  }
  if (shareOf(["bodyweight_reps"]) >= STYLE_SHARE) {
    return "calisthenics";
  }
  if (shareOf(["duration", "distance_duration"]) >= STYLE_SHARE) {
    return "endurance";
  }
  return "allRound";
}
