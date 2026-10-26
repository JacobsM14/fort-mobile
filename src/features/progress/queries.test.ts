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
  exerciseSetsQuery,
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
