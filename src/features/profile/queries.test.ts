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
  startWorkout,
  type SetValues,
} from "@/features/workouts/queries";

import {
  toFrequentExercises,
  toWeeklySessions,
  trainingStyle,
} from "./athlete-type";
import { athleteTypeSetsQuery } from "./queries";

const REPS: SetValues = {
  weightKg: 60,
  reps: 8,
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

// The sets of the only exercise of a workout, in order.
function setIds(workoutId: string) {
  const [exercise] = db
    .select({ id: workoutExercises.id })
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, workoutId))
    .all();
  return {
    exerciseId: exercise.id,
    all: () =>
      db
        .select({ id: workoutSets.id })
        .from(workoutSets)
        .where(eq(workoutSets.workoutExerciseId, exercise.id))
        .orderBy(asc(workoutSets.position))
        .all()
        .map((row) => row.id),
  };
}

// A finished workout of one exercise with `done` sets done and `undone` left
// empty. Every test uses its own days: the database is shared by the file.
function train(key: string, startedAt: Date, done: number, undone = 0) {
  const routineId = createRoutine({
    name: key,
    exerciseIds: [catalogId(key)],
  });
  const workoutId = logWorkout(routineId, startedAt);
  const sets = setIds(workoutId);
  // The workout starts with one empty set.
  for (let extra = 1; extra < done + undone; extra += 1) {
    addSet(sets.exerciseId);
  }
  sets
    .all()
    .slice(0, done)
    .forEach((id) => completeSet(id, REPS, startedAt));
  return workoutId;
}

beforeAll(() => {
  syncCatalog();
});

describe("athleteTypeSetsQuery", () => {
  const SINCE = new Date(2033, 0, 1);

  it("reads a row for each done set, with its workout and its exercise", () => {
    const workoutId = train("bench_press", new Date(2033, 1, 3, 18), 3);

    const rows = athleteTypeSetsQuery(SINCE).all();

    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({
      workoutId,
      startedAt: new Date(2033, 1, 3, 18),
      exerciseId: catalogId("bench_press"),
      key: "bench_press",
      name: null,
      description: null,
      trackingType: "weight_reps",
    });
  });

  it("leaves out the sets not done and the workouts before the day", () => {
    train("pull_up", new Date(2033, 2, 3, 18), 1, 2);
    train("running", new Date(2032, 11, 31, 23), 2);

    const rows = athleteTypeSetsQuery(SINCE).all();

    expect(rows.filter((row) => row.key === "pull_up")).toHaveLength(1);
    expect(rows.filter((row) => row.key === "running")).toHaveLength(0);
  });

  it("leaves out a workout not finished yet", () => {
    const routineId = createRoutine({
      name: "plank",
      exerciseIds: [catalogId("plank")],
    });
    const workoutId = startWorkout(routineId, new Date(2033, 3, 3, 18));
    const [id] = setIds(workoutId).all();
    completeSet(id, { ...REPS, durationS: 60 }, new Date(2033, 3, 3, 18));

    const rows = athleteTypeSetsQuery(SINCE).all();

    expect(rows.filter((row) => row.key === "plank")).toHaveLength(0);
  });

  it("feeds what the profile works out from the sets", () => {
    const rows = athleteTypeSetsQuery(SINCE).all();
    const weekStarts = [new Date(2033, 1, 1), new Date(2033, 1, 8)];

    // Three sets in one workout are one session.
    expect(toWeeklySessions(rows, weekStarts)).toEqual([1, 0]);
    expect(
      toFrequentExercises(rows, 1).map((exercise) => exercise.workoutCount),
    ).toEqual([1]);
    expect(trainingStyle(rows)).toBe("strength");
  });
});
