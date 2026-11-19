import { useTranslation } from "@/i18n";

import { getExerciseText } from "@/features/exercises/catalog";
import { useExerciseList } from "@/features/exercises/queries";

import type { TrackingType } from "@/constants/enums";
import type { MuscleId } from "@/features/exercises/catalog";
import type { ExerciseSummary } from "@/features/exercises/queries";
import type {
  FinishedWorkoutHistoryItem,
  SetValues,
  WorkoutHistoryExercise,
} from "@/features/workouts/queries";
import type { Language } from "@/i18n";
import type { Translations } from "@/i18n/es";
import type { Units } from "@/utils/units";

import { elapsedSeconds, formatDuration } from "@/utils/duration";
import { formatDecimal, roundToTenth } from "@/utils/number";
import { distanceToUnit, weightToUnit } from "@/utils/units";

export type TodayEntry = WorkoutHistoryExercise & {
  summary: ExerciseSummary;
  name: string;
};

// The summaries include archived exercises, so one deleted since still shows.
export function toTodayEntries(
  exercises: readonly WorkoutHistoryExercise[],
  summaries: readonly ExerciseSummary[],
  t: Translations,
): TodayEntry[] {
  const summariesById = new Map(summaries.map((s) => [s.id, s] as const));
  return exercises.flatMap((exercise): TodayEntry[] => {
    const summary = summariesById.get(exercise.exerciseId);
    return summary === undefined
      ? []
      : [{ ...exercise, summary, name: getExerciseText(summary, t).name }];
  });
}

export function useTodayEntries(
  workout: FinishedWorkoutHistoryItem | undefined,
) {
  const { t } = useTranslation();
  const { exercises: summaries, loaded } = useExerciseList({
    includeArchived: true,
  });

  return {
    entries: toTodayEntries(workout?.exercises ?? [], summaries, t),
    loaded,
  };
}

// A workout logged afterwards from the history starts and ends at the same
// time, so it has no length to show.
export function formatWorkoutDuration(
  workout: FinishedWorkoutHistoryItem,
  t: Translations,
) {
  const seconds = elapsedSeconds(workout.startedAt, workout.endedAt.getTime());
  return seconds > 0 ? t.progress.minutes(Math.floor(seconds / 60)) : "-";
}

// Every set done counts once, split evenly between its exercise's primary
// muscles; exercises with none are left out so the shares still add up to 1.
export function muscleShares(
  entries: readonly TodayEntry[],
): Partial<Record<MuscleId, number>> {
  const counts = new Map<MuscleId, number>();

  let total = 0;

  for (const entry of entries) {
    const muscles = entry.summary.primaryMuscles;

    if (muscles.length === 0) {
      continue;
    }

    const sets = entry.sets.length;
    total += sets;
    for (const muscle of muscles) {
      counts.set(muscle, (counts.get(muscle) ?? 0) + sets / muscles.length);
    }
  }

  return Object.fromEntries(
    [...counts].map(([muscle, count]) => [muscle, count / total]),
  );
}

// What an exercise added up to: the weight lifted (kg × reps), the reps, the
// time or the distance, depending on how it is tracked.
export function exerciseTotal(
  trackingType: TrackingType,
  sets: readonly SetValues[],
): number {
  return sets.reduce((total, set) => {
    switch (trackingType) {
      case "weight_reps":
        return total + (set.weightKg ?? 0) * (set.reps ?? 0);
      case "bodyweight_reps":
        return total + (set.reps ?? 0);
      case "duration":
        return total + (set.durationS ?? 0);
      case "distance_duration":
        return total + (set.distanceM ?? 0);
    }
  }, 0);
}

export function formatTotal(
  trackingType: TrackingType,
  total: number,
  units: Units,
  t: Translations,
  language: Language,
): string {
  switch (trackingType) {
    case "weight_reps":
      return `${formatDecimal(Math.round(weightToUnit(total, units.weight)), language)} ${units.weight}`;
    case "bodyweight_reps":
      return t.progress.reps(total);
    case "duration":
      return formatDuration(total);
    case "distance_duration":
      return `${formatDecimal(roundToTenth(distanceToUnit(total, units.distance)), language)} ${units.distance}`;
  }
}
