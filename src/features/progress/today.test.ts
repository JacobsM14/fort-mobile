import { describe, expect, it } from "@jest/globals";

import { es } from "@/i18n/es";

import {
  exerciseTotal,
  formatTotal,
  formatWorkoutDuration,
  muscleShares,
  toTodayEntries,
  type TodayEntry,
} from "./today";

import type { MuscleId } from "@/features/exercises/catalog";
import type { ExerciseSummary } from "@/features/exercises/queries";
import type {
  FinishedWorkoutHistoryItem,
  SetValues,
} from "@/features/workouts/queries";

const SET: SetValues = {
  weightKg: 60,
  reps: 10,
  durationS: null,
  distanceM: null,
};

let nextId = 0;

// An exercise of the workout with that many sets done.
function entry(
  sets: number,
  primaryMuscles: MuscleId[],
  secondaryMuscles: MuscleId[] = [],
): TodayEntry {
  nextId += 1;
  return {
    id: `workout-exercise-${nextId}`,
    exerciseId: `exercise-${nextId}`,
    sets: Array.from({ length: sets }, () => SET),
    name: `Exercise ${nextId}`,
    summary: {
      id: `exercise-${nextId}`,
      key: null,
      name: `Exercise ${nextId}`,
      description: null,
      equipment: null,
      trackingType: "weight_reps",
      primaryMuscles,
      secondaryMuscles,
    },
  };
}

describe("muscleShares", () => {
  it("gives each muscle its part of the sets done", () => {
    expect(muscleShares([entry(3, ["chest"]), entry(1, ["biceps"])])).toEqual({
      chest: 0.75,
      biceps: 0.25,
    });
  });

  it("adds up a muscle worked in several exercises", () => {
    expect(
      muscleShares([
        entry(2, ["chest"]),
        entry(2, ["chest"]),
        entry(4, ["triceps"]),
      ]),
    ).toEqual({ chest: 0.5, triceps: 0.5 });
  });

  it("splits an exercise's sets evenly between its primary muscles", () => {
    expect(
      muscleShares([entry(2, ["quads", "hamstrings"]), entry(2, ["chest"])]),
    ).toEqual({ quads: 0.25, hamstrings: 0.25, chest: 0.5 });
  });

  it("leaves the secondary muscles out", () => {
    expect(muscleShares([entry(3, ["chest"], ["triceps"])])).toEqual({
      chest: 1,
    });
  });

  it("leaves out exercises without muscles, so the rest still add up to 1", () => {
    expect(muscleShares([entry(3, []), entry(1, ["abs"])])).toEqual({
      abs: 1,
    });
  });

  it("always adds up to 1", () => {
    const shares = muscleShares([
      entry(4, ["chest"]),
      entry(3, ["quads", "glutes", "hamstrings"]),
      entry(2, ["lats"], ["biceps"]),
    ]);
    const total = Object.values(shares).reduce((sum, share) => sum + share, 0);
    expect(total).toBeCloseTo(1);
  });

  it("is empty without exercises", () => {
    expect(muscleShares([])).toEqual({});
  });
});

describe("exerciseTotal", () => {
  const EMPTY: SetValues = {
    weightKg: null,
    reps: null,
    durationS: null,
    distanceM: null,
  };

  it("adds up the weight lifted, weight times reps", () => {
    expect(
      exerciseTotal("weight_reps", [
        { ...EMPTY, weightKg: 80, reps: 8 },
        { ...EMPTY, weightKg: 90, reps: 5 },
      ]),
    ).toBe(1090);
  });

  it("counts nothing for a weighted set missing its weight or reps", () => {
    expect(
      exerciseTotal("weight_reps", [
        { ...EMPTY, weightKg: null, reps: 8 },
        { ...EMPTY, weightKg: 80, reps: null },
        { ...EMPTY, weightKg: 50, reps: 10 },
      ]),
    ).toBe(500);
  });

  it("adds up the reps of a bodyweight exercise", () => {
    expect(
      exerciseTotal("bodyweight_reps", [
        { ...EMPTY, reps: 12 },
        { ...EMPTY, reps: 10 },
        { ...EMPTY, reps: 8 },
      ]),
    ).toBe(30);
  });

  it("adds up the time of a timed exercise", () => {
    expect(
      exerciseTotal("duration", [
        { ...EMPTY, durationS: 75 },
        { ...EMPTY, durationS: 60 },
        { ...EMPTY, durationS: null },
      ]),
    ).toBe(135);
  });

  it("adds up the distance of a distance exercise, not its time", () => {
    expect(
      exerciseTotal("distance_duration", [
        { ...EMPTY, distanceM: 5200, durationS: 1570 },
        { ...EMPTY, distanceM: 800, durationS: 240 },
      ]),
    ).toBe(6000);
  });

  it("only adds the values its tracking type uses", () => {
    const set = { weightKg: 60, reps: 10, durationS: 45, distanceM: 1000 };
    expect(exerciseTotal("bodyweight_reps", [set])).toBe(10);
    expect(exerciseTotal("duration", [set])).toBe(45);
  });

  it("is 0 without sets", () => {
    expect(exerciseTotal("weight_reps", [])).toBe(0);
  });
});

describe("formatTotal", () => {
  const metric = { weight: "kg", distance: "km" } as const;
  const imperial = { weight: "lb", distance: "mi" } as const;

  it("shows the weight lifted rounded to whole units", () => {
    expect(formatTotal("weight_reps", 856.4, metric, es, "es")).toBe("856 kg");
    expect(formatTotal("weight_reps", 100, imperial, es, "es")).toBe("220 lb");
  });

  it("shows the reps", () => {
    expect(formatTotal("bodyweight_reps", 30, metric, es, "es")).toBe(
      "30 reps",
    );
  });

  it("shows the time like a stopwatch", () => {
    expect(formatTotal("duration", 195, metric, es, "es")).toBe("3:15");
  });

  it("shows the distance with one decimal in the language's format", () => {
    expect(formatTotal("distance_duration", 5240, metric, es, "es")).toBe(
      "5,2 km",
    );
    expect(formatTotal("distance_duration", 5240, metric, es, "en")).toBe(
      "5.2 km",
    );
    expect(formatTotal("distance_duration", 8046.72, imperial, es, "es")).toBe(
      "5 mi",
    );
  });
});

describe("toTodayEntries", () => {
  function summary(id: string, fields: Partial<ExerciseSummary> = {}) {
    return {
      id,
      key: null,
      name: null,
      description: null,
      equipment: null,
      trackingType: "weight_reps",
      primaryMuscles: [],
      secondaryMuscles: [],
      ...fields,
    } satisfies ExerciseSummary;
  }

  const exercises = [
    { id: "we-1", exerciseId: "bench", sets: [SET, SET] },
    { id: "we-2", exerciseId: "deleted", sets: [SET] },
    { id: "we-3", exerciseId: "custom", sets: [SET] },
  ];
  const summaries = [
    summary("custom", { name: "Mi press" }),
    summary("bench", { key: "bench_press", primaryMuscles: ["chest"] }),
  ];

  it("joins each exercise with its summary, in the workout's order", () => {
    const entries = toTodayEntries(exercises, summaries, es);
    expect(entries.map((entry) => entry.id)).toEqual(["we-1", "we-3"]);
    expect(entries[0].summary.primaryMuscles).toEqual(["chest"]);
    expect(entries[0].sets).toHaveLength(2);
  });

  it("names catalog exercises in the language and keeps custom names", () => {
    const entries = toTodayEntries(exercises, summaries, es);
    expect(entries.map((entry) => entry.name)).toEqual([
      es.exerciseCatalog.bench_press.name,
      "Mi press",
    ]);
  });

  it("leaves out exercises deleted since", () => {
    const entries = toTodayEntries(exercises, summaries, es);
    expect(entries.some((entry) => entry.exerciseId === "deleted")).toBe(false);
  });
});

describe("formatWorkoutDuration", () => {
  function workout(startedAt: Date, endedAt: Date): FinishedWorkoutHistoryItem {
    return {
      id: "workout",
      name: null,
      startedAt,
      endedAt,
      exercises: [],
      setCount: 0,
    };
  }

  const start = new Date(2026, 10, 14, 9, 12);

  it("shows the whole minutes it lasted", () => {
    expect(
      formatWorkoutDuration(
        workout(start, new Date(2026, 10, 14, 10, 10, 40)),
        es,
      ),
    ).toBe("58 min");
  });

  it("shows a dash for a workout logged afterwards, with no length", () => {
    expect(formatWorkoutDuration(workout(start, start), es)).toBe("-");
  });
});
