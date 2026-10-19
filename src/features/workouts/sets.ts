import type { TrackingType } from "@/constants/enums";
import type { Language } from "@/i18n";
import type { Translations } from "@/i18n/es";

import { formatDuration } from "@/utils/duration";
import { formatDecimal } from "@/utils/number";

import type { SetValues, WorkoutExercise, WorkoutSet } from "./queries";

function isPositive(value: number | null) {
  return value !== null && value > 0;
}

// What each tracking type needs before a set can be marked as done.
export function canCompleteSet(trackingType: TrackingType, values: SetValues) {
  switch (trackingType) {
    case "weight_reps":
      return values.weightKg !== null && isPositive(values.reps);
    case "bodyweight_reps":
      return isPositive(values.reps);
    case "duration":
      return isPositive(values.durationS);
    case "distance_duration":
      return isPositive(values.distanceM);
  }
}

export function isSetDone(set: WorkoutSet) {
  return set.completedAt !== null;
}

export function isExerciseDone(exercise: WorkoutExercise) {
  return exercise.sets.some(isSetDone);
}

// Sets are done in order: one can be marked only once the one before it is.
export function isSetUnlocked(sets: readonly WorkoutSet[], index: number) {
  return index === 0 || isSetDone(sets[index - 1]);
}

// Offered after the last set done, even with more sets already added after
// it, until a rest is picked or the next set is done.
export function needsRestChoice(sets: readonly WorkoutSet[], index: number) {
  const set = sets[index];
  const next = sets.at(index + 1);
  return (
    isSetDone(set) &&
    set.restStartedAt === null &&
    set.restS === null &&
    (next === undefined || !isSetDone(next))
  );
}

// The workout opens on the first exercise with nothing done yet, or on the
// last one once all are.
export function getDefaultExerciseId(exercises: readonly WorkoutExercise[]) {
  return (
    exercises.find((exercise) => !isExerciseDone(exercise)) ?? exercises.at(-1)
  )?.id;
}

export function elapsedSeconds(from: Date, now: number) {
  return Math.max(0, Math.floor((now - from.getTime()) / 1000));
}

// A set from last time, short enough for a column next to the inputs:
// "77,5×5", "12", "0:45", "5,2 km · 26:10".
export function formatPreviousSet(
  trackingType: TrackingType,
  set: SetValues,
  language: Language,
) {
  switch (trackingType) {
    case "weight_reps":
      return `${formatDecimal(set.weightKg ?? 0, language)}×${set.reps ?? 0}`;
    case "bodyweight_reps":
      return String(set.reps ?? 0);
    case "duration":
      return formatDuration(set.durationS ?? 0);
    case "distance_duration":
      return [
        `${formatDecimal((set.distanceM ?? 0) / 1000, language)} km`,
        set.durationS === null ? null : formatDuration(set.durationS),
      ]
        .filter((part) => part !== null)
        .join(" · ");
  }
}

// One done set as text for summaries: "60 kg × 10", "12 reps", "0:45",
// "5,2 km / 26:10".
export function formatSet(
  trackingType: TrackingType,
  set: SetValues,
  t: Translations,
  language: Language,
) {
  switch (trackingType) {
    case "weight_reps":
      return `${formatDecimal(set.weightKg ?? 0, language)} kg × ${set.reps ?? 0}`;
    case "bodyweight_reps":
      return t.progress.reps(set.reps ?? 0);
    case "duration":
      return formatDuration(set.durationS ?? 0);
    case "distance_duration":
      return [
        `${formatDecimal((set.distanceM ?? 0) / 1000, language)} km`,
        set.durationS === null ? null : formatDuration(set.durationS),
      ]
        .filter((part) => part !== null)
        .join(" / ");
  }
}
