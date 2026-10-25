import type { TrackingType } from "@/constants/enums";
import type { ExerciseKey } from "@/features/exercises/catalog";
import type { SetValues } from "@/features/workouts/queries";
import type { ChartPoint } from "@/utils/chart";

import { dailyMetric } from "./metrics";

// Made-up workouts to try the progress chart before it reads the database.
// Each day holds its sets, so they go through the same dailyMetric the real
// data will.

export type SampleExercise = {
  key: ExerciseKey;
  trackingType: TrackingType;
  points: ChartPoint[];
};

type SampleDay = {
  // Counted from the first; the last one lands on today.
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

// Shifted so the last day is today, as it would be right after training.
function toPoints(trackingType: TrackingType, days: SampleDay[]) {
  const today = new Date();
  const lastDay = Math.max(...days.map(({ day }) => day));
  return days.flatMap(({ day, sets }): ChartPoint[] => {
    const value = dailyMetric(trackingType, sets);
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (lastDay - day),
    );
    return value === null ? [] : [{ date, value }];
  });
}

// A session every `everyDays` over about a year, so every range of the
// filter has something to show.
function sessions(
  count: number,
  everyDays: number,
  setsFor: (session: number) => SetValues[],
): SampleDay[] {
  return Array.from({ length: count }, (_, session) => ({
    day: session * everyDays,
    sets: setsFor(session),
  }));
}

// Small ups and downs on top of the trend, the same every time.
function wobble(session: number, size: number) {
  return ((session * 7) % 5) * size - 2 * size;
}

export const SAMPLE_EXERCISES: SampleExercise[] = [
  {
    key: "bench_press",
    trackingType: "weight_reps",
    points: toPoints(
      "weight_reps",
      sessions(52, 7, (session) => {
        const weight = 50 + 2.5 * Math.floor(session / 4);
        return lifts(
          [weight + wobble(session, 1.25), 5 + (session % 3)],
          [weight - 5, 8],
        );
      }),
    ),
  },
  {
    key: "pull_up",
    trackingType: "bodyweight_reps",
    points: toPoints(
      "bodyweight_reps",
      sessions(40, 9, (session) => {
        const best = 4 + Math.floor(session / 5) + (session % 2);
        return reps(best, best - 1, best - 2);
      }),
    ),
  },
  {
    key: "plank",
    trackingType: "duration",
    points: toPoints(
      "duration",
      sessions(45, 8, (session) =>
        holds(40 + Math.round(session * 1.2) + wobble(session, 3), 40),
      ),
    ),
  },
  {
    key: "running",
    trackingType: "distance_duration",
    points: toPoints(
      "distance_duration",
      sessions(52, 7, (session) =>
        runs([5000, 1900 - session * 6 + wobble(session, 15)]),
      ),
    ),
  },
];
