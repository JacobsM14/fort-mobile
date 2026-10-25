import type { TrackingType } from "@/constants/enums";
import type { ExerciseKey } from "@/features/exercises/catalog";
import type { SetValues } from "@/features/workouts/queries";

import { dailyMetric } from "./metrics";

// Made-up workouts to try the progress chart before it reads the database.
// Each day holds its sets, so they go through the same dailyMetric the real
// data will.

export type ProgressPoint = {
  date: Date;
  value: number;
};

export type SampleExercise = {
  key: ExerciseKey;
  trackingType: TrackingType;
  points: ProgressPoint[];
};

type SampleDay = {
  // Days into October 2026.
  day: number;
  sets: SetValues[];
};

const EMPTY: SetValues = {
  weightKg: null,
  reps: null,
  durationS: null,
  distanceM: null,
};

function lifts(...sets: [weightKg: number, reps: number][]): SetValues[] {
  return sets.map(([weightKg, reps]) => ({ ...EMPTY, weightKg, reps }));
}

function reps(...counts: number[]): SetValues[] {
  return counts.map((count) => ({ ...EMPTY, reps: count }));
}

function holds(...seconds: number[]): SetValues[] {
  return seconds.map((durationS) => ({ ...EMPTY, durationS }));
}

function runs(...sets: [distanceM: number, durationS: number][]): SetValues[] {
  return sets.map(([distanceM, durationS]) => ({
    ...EMPTY,
    distanceM,
    durationS,
  }));
}

function toPoints(trackingType: TrackingType, days: SampleDay[]) {
  return days.flatMap(({ day, sets }): ProgressPoint[] => {
    const value = dailyMetric(trackingType, sets);
    return value === null ? [] : [{ date: new Date(2026, 9, day), value }];
  });
}

export const SAMPLE_EXERCISES: SampleExercise[] = [
  {
    key: "bench_press",
    trackingType: "weight_reps",
    points: toPoints("weight_reps", [
      { day: 1, sets: lifts([60, 8], [60, 8], [60, 7]) },
      { day: 3, sets: lifts([62.5, 6], [60, 8]) },
      { day: 6, sets: lifts([62.5, 8], [62.5, 7]) },
      { day: 8, sets: lifts([65, 5], [62.5, 6]) },
      { day: 10, sets: lifts([60, 8]) },
      { day: 13, sets: lifts([65, 7], [65, 6]) },
      { day: 15, sets: lifts([67.5, 5], [65, 6]) },
      { day: 17, sets: lifts([67.5, 6], [67.5, 6]) },
      { day: 20, sets: lifts([70, 4], [67.5, 5]) },
      { day: 22, sets: lifts([70, 6], [70, 5]) },
      { day: 24, sets: lifts([72.5, 5], [70, 6]) },
    ]),
  },
  {
    key: "pull_up",
    trackingType: "bodyweight_reps",
    points: toPoints("bodyweight_reps", [
      { day: 2, sets: reps(5, 4, 4) },
      { day: 5, sets: reps(6, 5, 4) },
      { day: 9, sets: reps(6, 6, 5) },
      { day: 12, sets: reps(5, 5) },
      { day: 16, sets: reps(7, 6, 5) },
      { day: 19, sets: reps(8, 6, 6) },
      { day: 23, sets: reps(8, 7, 7) },
      { day: 26, sets: reps(9, 7) },
    ]),
  },
  {
    key: "plank",
    trackingType: "duration",
    points: toPoints("duration", [
      { day: 1, sets: holds(45, 40) },
      { day: 4, sets: holds(50, 45) },
      { day: 7, sets: holds(48, 50) },
      { day: 11, sets: holds(60, 55) },
      { day: 14, sets: holds(65) },
      { day: 18, sets: holds(62, 58) },
      { day: 21, sets: holds(75, 70) },
      { day: 25, sets: holds(80, 72) },
    ]),
  },
  {
    key: "running",
    trackingType: "distance_duration",
    points: toPoints("distance_duration", [
      { day: 2, sets: runs([5000, 1800]) },
      { day: 6, sets: runs([5000, 1740]) },
      { day: 9, sets: runs([6000, 2160]) },
      { day: 13, sets: runs([5000, 1680]) },
      { day: 16, sets: runs([8000, 2960]) },
      { day: 20, sets: runs([5000, 1620]) },
      { day: 23, sets: runs([5000, 1650]) },
      { day: 27, sets: runs([5000, 1590]) },
    ]),
  },
];
