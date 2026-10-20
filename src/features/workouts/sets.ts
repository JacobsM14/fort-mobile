import type { TrackingType } from "@/constants/enums";
import type { Language } from "@/i18n";
import type { Translations } from "@/i18n/es";

import { formatDuration } from "@/utils/duration";
import { formatDecimal } from "@/utils/number";

import type { SetValues, WorkoutExercise, WorkoutSet } from "./queries";

// Timed and distance exercises run from one big stopwatch; the others log
// sets in rows.
export type StopwatchTrackingType = Extract<
  TrackingType,
  "duration" | "distance_duration"
>;

export type RepsTrackingType = Exclude<TrackingType, StopwatchTrackingType>;

export function isStopwatchTracking(
  trackingType: TrackingType,
): trackingType is StopwatchTrackingType {
  return trackingType === "duration" || trackingType === "distance_duration";
}

function isPositive(value: number | null) {
  return value !== null && value > 0;
}

// What a row needs before it can be marked as done. Stopwatch sets are done
// when the stopwatch stops.
export function canCompleteSet(
  trackingType: RepsTrackingType,
  values: SetValues,
) {
  switch (trackingType) {
    case "weight_reps":
      return values.weightKg !== null && isPositive(values.reps);
    case "bodyweight_reps":
      return isPositive(values.reps);
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

export type StopwatchState =
  | { status: "idle" }
  // offsetS is the time run before a pause, counted on top of since.
  | { status: "running"; set: WorkoutSet; since: Date; offsetS: number }
  | { status: "paused"; set: WorkoutSet; seconds: number };

// The stopwatch always works on the first set not done yet. While paused,
// that set keeps the time run so far in durationS.
export function getStopwatchState(sets: readonly WorkoutSet[]): StopwatchState {
  const set = sets.find((candidate) => !isSetDone(candidate));
  if (set === undefined) {
    return { status: "idle" };
  }
  if (set.startedAt !== null) {
    return {
      status: "running",
      set,
      since: set.startedAt,
      offsetS: set.durationS ?? 0,
    };
  }
  if (set.durationS !== null && set.durationS > 0) {
    return { status: "paused", set, seconds: set.durationS };
  }
  return { status: "idle" };
}

// The distance is typed after the stopwatch stops, so it may be missing:
// "5,2 km / 26:10" or "26:10".
function formatDistanceSet(set: SetValues, language: Language) {
  return [
    set.distanceM === null
      ? null
      : `${formatDecimal(set.distanceM / 1000, language)} km`,
    set.durationS === null ? null : formatDuration(set.durationS),
  ]
    .filter((part) => part !== null)
    .join(" / ");
}

// A set from last time, short enough for a column next to the inputs:
// "77,5×5", "12", "0:45", "5,2 km / 26:10".
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
      return formatDistanceSet(set, language);
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
      return formatDistanceSet(set, language);
  }
}
