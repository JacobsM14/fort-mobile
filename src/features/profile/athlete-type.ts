import type { TrackingType } from "@/constants/enums";

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
  name: string;
  trackingType: TrackingType;
  workoutCount: number;
};

export type AthleteType = {
  style: TrainingStyle;
  frequentExercises: FrequentExercise[];
  // The sessions of each week, the oldest first and this week last.
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
