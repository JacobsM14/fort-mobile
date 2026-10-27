import { beforeAll, describe, expect, it } from "@jest/globals";
import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { exercises, workoutExercises, workoutSets } from "@/db/schema";
import { syncCatalog } from "@/features/exercises/sync-catalog";
import { createRoutine } from "@/features/routines/queries";
import {
  addSet,
  completeSet,
  logWorkout,
  type SetValues,
} from "@/features/workouts/queries";

import {
  bodyWeightsQuery,
  recentBodyWeights,
  exerciseSetsQuery,
  saveBodyWeight,
  toBodyWeightEntries,
  toBodyWeightPoints,
  toDailyPoints,
  toTrainedExercises,
  trainedExercisesQuery,
} from "./queries";

import type { ExerciseSummary } from "@/features/exercises/queries";

const EMPTY: SetValues = {
  weightKg: null,
  reps: null,
  durationS: null,
  distanceM: null,
};

function catalogId(key: string) {
  const [row] = db
    .select({ id: exercises.id })
    .from(exercises)
    .where(eq(exercises.key, key))
    .all();
  return row.id;
}

// A finished workout of one exercise on a given day, with those sets done.
// Every test uses its own exercises and days: the database is shared by the
// whole file.
function train(key: string, startedAt: Date, sets: SetValues[]) {
  const routineId = createRoutine({
    name: key,
    exerciseIds: [catalogId(key)],
  });
  const workoutId = logWorkout(routineId, startedAt);
  const [exercise] = db
    .select({ id: workoutExercises.id })
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, workoutId))
    .all();
  // The workout starts with one empty set.
  for (let extra = 1; extra < sets.length; extra += 1) {
    addSet(exercise.id);
  }
  const rows = db
    .select({ id: workoutSets.id })
    .from(workoutSets)
    .where(eq(workoutSets.workoutExerciseId, exercise.id))
    .orderBy(asc(workoutSets.position))
    .all();
  rows.forEach((row, index) => {
    completeSet(row.id, sets[index], startedAt);
  });
  return exercise.id;
}

beforeAll(() => {
  syncCatalog();
});

describe("exerciseSetsQuery", () => {
  const FIRST = new Date(2031, 2, 10, 18);
  const SECOND = new Date(2031, 2, 17, 18);

  it("reads the done sets of the exercise, oldest day first", () => {
    train("bench_press", SECOND, [{ ...EMPTY, weightKg: 70, reps: 5 }]);
    train("bench_press", FIRST, [
      { ...EMPTY, weightKg: 60, reps: 8 },
      { ...EMPTY, weightKg: 62.5, reps: 6 },
    ]);

    const rows = exerciseSetsQuery(catalogId("bench_press")).all();

    expect(rows).toEqual([
      { ...EMPTY, startedAt: FIRST, weightKg: 60, reps: 8 },
      { ...EMPTY, startedAt: FIRST, weightKg: 62.5, reps: 6 },
      { ...EMPTY, startedAt: SECOND, weightKg: 70, reps: 5 },
    ]);
  });

  it("leaves out sets not done yet and the other exercises", () => {
    const lastDone = new Date(2031, 5, 1, 9);
    const workoutExerciseId = train("incline_treadmill_walk", lastDone, [
      { ...EMPTY, distanceM: 2000, durationS: 1200 },
    ]);
    // A set added and never done stays empty.
    addSet(workoutExerciseId);
    train("plank", lastDone, [{ ...EMPTY, durationS: 60 }]);

    const rows = exerciseSetsQuery(catalogId("incline_treadmill_walk")).all();

    expect(rows).toEqual([
      { ...EMPTY, startedAt: lastDone, distanceM: 2000, durationS: 1200 },
    ]);
  });
});

describe("trainedExercisesQuery", () => {
  const SINCE = new Date(2032, 0, 1);

  it("lists each exercise once, the one trained last first", () => {
    train("pull_up", new Date(2032, 2, 1, 10), [{ ...EMPTY, reps: 6 }]);
    train("pull_up", new Date(2032, 2, 20, 10), [{ ...EMPTY, reps: 8 }]);
    train("treadmill_run", new Date(2032, 2, 10, 10), [
      { ...EMPTY, distanceM: 5000, durationS: 1800 },
    ]);

    const rows = trainedExercisesQuery(SINCE).all();

    expect(rows).toEqual([
      {
        exerciseId: catalogId("pull_up"),
        lastTrained: new Date(2032, 2, 20, 10),
      },
      {
        exerciseId: catalogId("treadmill_run"),
        lastTrained: new Date(2032, 2, 10, 10),
      },
    ]);
  });

  it("leaves out what was last trained before the day, and what was never done", () => {
    train("running", new Date(2031, 11, 31, 23), [
      { ...EMPTY, distanceM: 3000, durationS: 900 },
    ]);
    // A routine logged with its sets still empty.
    logWorkout(
      createRoutine({
        name: "Walk",
        exerciseIds: [catalogId("treadmill_walk")],
      }),
      new Date(2032, 3, 1, 10),
    );

    const ids = trainedExercisesQuery(SINCE)
      .all()
      .map((row) => row.exerciseId);

    expect(ids).not.toContain(catalogId("running"));
    expect(ids).not.toContain(catalogId("treadmill_walk"));
  });
});

describe("toTrainedExercises", () => {
  function summary(id: string): ExerciseSummary {
    return {
      id,
      key: null,
      name: id,
      description: null,
      equipment: null,
      trackingType: "weight_reps",
      primaryMuscles: [],
      secondaryMuscles: [],
    };
  }

  const NEWER = new Date(2026, 9, 24);
  const OLDER = new Date(2026, 9, 20);

  it("adds the exercise to each row, keeping their order", () => {
    const result = toTrainedExercises(
      [
        { exerciseId: "b", lastTrained: NEWER },
        { exerciseId: "a", lastTrained: OLDER },
      ],
      [summary("a"), summary("b")],
    );

    expect(result).toEqual([
      { ...summary("b"), lastTrained: NEWER },
      { ...summary("a"), lastTrained: OLDER },
    ]);
  });

  it("drops the rows whose exercise has no summary, as archived ones", () => {
    const result = toTrainedExercises(
      [
        { exerciseId: "gone", lastTrained: NEWER },
        { exerciseId: "a", lastTrained: OLDER },
      ],
      [summary("a")],
    );

    expect(result.map((exercise) => exercise.id)).toEqual(["a"]);
  });
});

describe("toDailyPoints", () => {
  const lift = (startedAt: Date, weightKg: number, reps: number) => ({
    ...EMPTY,
    startedAt,
    weightKg,
    reps,
  });

  it("gives a day its best set, even from two workouts", () => {
    const points = toDailyPoints("weight_reps", [
      lift(new Date(2026, 9, 20, 10), 60, 5),
      lift(new Date(2026, 9, 20, 19), 80, 5),
    ]);

    expect(points).toHaveLength(1);
    expect(points[0].date).toEqual(new Date(2026, 9, 20));
    expect(points[0].value).toBeCloseTo(80 * (1 + 5 / 30));
  });

  it("orders the days, oldest first", () => {
    const points = toDailyPoints("bodyweight_reps", [
      { ...EMPTY, startedAt: new Date(2026, 9, 22, 9), reps: 8 },
      { ...EMPTY, startedAt: new Date(2026, 9, 18, 9), reps: 5 },
    ]);

    expect(points.map((point) => point.value)).toEqual([5, 8]);
    expect(points.map((point) => point.date)).toEqual([
      new Date(2026, 9, 18),
      new Date(2026, 9, 22),
    ]);
  });

  it("leaves out a day with nothing to measure", () => {
    const points = toDailyPoints("duration", [
      { ...EMPTY, startedAt: new Date(2026, 9, 18, 9), durationS: null },
      { ...EMPTY, startedAt: new Date(2026, 9, 19, 9), durationS: 60 },
    ]);

    expect(points).toEqual([{ date: new Date(2026, 9, 19), value: 60 }]);
  });

  it("is empty without sets", () => {
    expect(toDailyPoints("weight_reps", [])).toEqual([]);
  });
});

describe("saveBodyWeight", () => {
  // Reads back only the days of the test: the database is shared by the file.
  function savedIn(year: number) {
    return bodyWeightsQuery()
      .all()
      .filter((row) => row.measuredOn.startsWith(`${year}-`));
  }

  it("saves the weight under its day", () => {
    saveBodyWeight(new Date(2033, 2, 10, 8), 80.5);

    expect(savedIn(2033)).toEqual([
      { id: expect.any(String), measuredOn: "2033-03-10", weightKg: 80.5 },
    ]);
  });

  it("replaces the weight when saved again the same day, at any hour", () => {
    saveBodyWeight(new Date(2034, 5, 1, 10), 81);
    saveBodyWeight(new Date(2034, 5, 1, 19, 30), 80.2);

    const rows = savedIn(2034);

    expect(rows).toHaveLength(1);
    expect(rows[0].weightKg).toBe(80.2);
  });

  it("keeps the same row, and its id, when it replaces a weight", () => {
    saveBodyWeight(new Date(2035, 0, 5, 9), 90);
    const [before] = savedIn(2035);
    saveBodyWeight(new Date(2035, 0, 5, 21), 89);

    expect(savedIn(2035)[0].id).toBe(before.id);
  });

  it("counts the night and the next morning as two days", () => {
    saveBodyWeight(new Date(2036, 6, 9, 23, 30), 70);
    saveBodyWeight(new Date(2036, 6, 10, 0, 10), 71);

    expect(savedIn(2036).map((row) => row.measuredOn)).toEqual([
      "2036-07-09",
      "2036-07-10",
    ]);
  });

  it("is read oldest day first, whatever the order saved", () => {
    saveBodyWeight(new Date(2037, 8, 20), 75);
    saveBodyWeight(new Date(2037, 8, 3), 76);

    expect(savedIn(2037).map((row) => row.measuredOn)).toEqual([
      "2037-09-03",
      "2037-09-20",
    ]);
  });
});

describe("toBodyWeightEntries", () => {
  it("turns each day key into midnight of that day, keeping the order", () => {
    const entries = toBodyWeightEntries([
      { id: "a", measuredOn: "2026-10-24", weightKg: 82 },
      { id: "b", measuredOn: "2026-10-26", weightKg: 81.5 },
    ]);

    expect(entries).toEqual([
      { id: "a", date: new Date(2026, 9, 24), weightKg: 82 },
      { id: "b", date: new Date(2026, 9, 26), weightKg: 81.5 },
    ]);
  });

  it("is empty without rows", () => {
    expect(toBodyWeightEntries([])).toEqual([]);
  });
});

describe("toBodyWeightPoints", () => {
  it("keeps the day and the weight of each entry", () => {
    const points = toBodyWeightPoints([
      { id: "a", date: new Date(2026, 9, 24), weightKg: 82 },
      { id: "b", date: new Date(2026, 9, 26), weightKg: 81.5 },
    ]);

    expect(points).toEqual([
      { date: new Date(2026, 9, 24), value: 82 },
      { date: new Date(2026, 9, 26), value: 81.5 },
    ]);
  });
});

describe("recentBodyWeights", () => {
  const entry = (day: number, weightKg: number) => ({
    id: `d${day}`,
    date: new Date(2026, 9, day),
    weightKg,
  });

  it("lists the latest first, each with its change from the day before", () => {
    const result = recentBodyWeights(
      [entry(20, 82), entry(22, 81.5), entry(25, 82.5)],
      5,
    );

    expect(result.map((item) => item.id)).toEqual(["d25", "d22", "d20"]);
    expect(result.map((item) => item.changeKg)).toEqual([1, -0.5, null]);
  });

  it("keeps the last ones, comparing the oldest shown with the one before", () => {
    const result = recentBodyWeights(
      [entry(1, 80), entry(2, 81), entry(3, 79), entry(4, 79)],
      2,
    );

    expect(result.map((item) => item.id)).toEqual(["d4", "d3"]);
    expect(result.map((item) => item.changeKg)).toEqual([0, -2]);
  });

  it("is empty without weigh-ins", () => {
    expect(recentBodyWeights([], 5)).toEqual([]);
  });
});
