import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import {
  exercises,
  routineExercises,
  routineSets,
  workoutExercises,
  workoutSets,
  workouts,
} from "@/db/schema";
import { saveBodyWeight } from "@/features/body/queries";
import { createExercise } from "@/features/exercises/queries";
import { syncCatalog } from "@/features/exercises/sync-catalog";
import { createRoutine } from "@/features/routines/queries";

import { parseBackupFile } from "./backup";
import { readBackup } from "./queries";

// The profile lives in expo-sqlite's key-value store, which needs the native app.
jest.mock("@/features/settings/user-profile", () => ({
  loadUserProfile: () => ({
    heightCm: 180,
    birthDate: "1990-04-12",
    gender: "female",
  }),
}));

function catalogId(key: string) {
  const [row] = db
    .select({ id: exercises.id })
    .from(exercises)
    .where(eq(exercises.key, key))
    .all();
  return row.id;
}

function routineNamed(name: string) {
  const routine = readBackup().routines.find((item) => item.name === name);
  if (routine === undefined) {
    throw new Error(`Routine ${name} not found in the backup`);
  }
  return routine;
}

// One bench press exercise with two sets, saved out of order on purpose.
function insertWorkout(id: string, endedAt: Date | null) {
  db.insert(workouts)
    .values({ id, startedAt: new Date(2041, 0, 5, 18), endedAt })
    .run();
  db.insert(workoutExercises)
    .values({
      id: `${id}-exercise`,
      workoutId: id,
      exerciseId: catalogId("bench_press"),
      position: 0,
    })
    .run();
  db.insert(workoutSets)
    .values([
      {
        id: `${id}-set-2`,
        workoutExerciseId: `${id}-exercise`,
        position: 1,
        reps: 8,
      },
      {
        id: `${id}-set-1`,
        workoutExerciseId: `${id}-exercise`,
        position: 0,
        reps: 10,
        weightKg: 60,
        completedAt: new Date(2041, 0, 5, 18, 5),
        restS: 90,
      },
    ])
    .run();
}

beforeAll(() => {
  syncCatalog();
});

describe("readBackup", () => {
  it("identifies the file and carries the profile", () => {
    const backup = readBackup(new Date("2026-10-30T10:00:00.000Z"));

    expect(backup).toMatchObject({
      app: "fortapp",
      formatVersion: 1,
      exportedAt: "2026-10-30T10:00:00.000Z",
      profile: { heightCm: 180, birthDate: "1990-04-12", gender: "female" },
    });
  });
});

describe("readBackup routines", () => {
  it("nests the exercises of a routine in order, referencing the catalog by key", () => {
    createRoutine({
      name: "Backup push",
      exerciseIds: [catalogId("overhead_press"), catalogId("bench_press")],
    });

    const routine = routineNamed("Backup push");

    expect(routine.exercises.map((item) => item.exercise)).toEqual([
      { key: "overhead_press" },
      { key: "bench_press" },
    ]);
    expect(routine.exercises.map((item) => item.position)).toEqual([0, 1]);
  });

  it("references a custom exercise by id", () => {
    const customId = createExercise({
      name: "Backup custom",
      description: "",
      trackingType: "weight_reps",
      equipment: null,
      primaryMuscles: [],
    });
    createRoutine({ name: "Backup custom routine", exerciseIds: [customId] });

    expect(routineNamed("Backup custom routine").exercises[0].exercise).toEqual(
      { id: customId },
    );
  });

  it("nests the sets of each exercise in order", () => {
    const routineId = createRoutine({
      name: "Backup sets",
      exerciseIds: [catalogId("bench_press")],
    });
    const [routineExercise] = db
      .select({ id: routineExercises.id })
      .from(routineExercises)
      .where(eq(routineExercises.routineId, routineId))
      .all();
    db.insert(routineSets)
      .values([
        {
          id: "backup-set-2",
          routineExerciseId: routineExercise.id,
          position: 1,
          reps: 8,
        },
        {
          id: "backup-set-1",
          routineExerciseId: routineExercise.id,
          position: 0,
          reps: 10,
          weightKg: 60,
        },
      ])
      .run();

    const [exercise] = routineNamed("Backup sets").exercises;

    expect(exercise.sets.map((set) => set.id)).toEqual([
      "backup-set-1",
      "backup-set-2",
    ]);
    expect(exercise.sets[0]).toMatchObject({
      setType: "normal",
      weightKg: 60,
      reps: 10,
      durationS: null,
    });
  });

  it("writes the dates as ISO strings", () => {
    createRoutine({ name: "Backup dates", exerciseIds: [] });

    const routine = routineNamed("Backup dates");

    expect(new Date(routine.createdAt).toISOString()).toBe(routine.createdAt);
    expect(routine.exercises).toEqual([]);
  });
});

describe("readBackup custom exercises", () => {
  it("carries the muscles of a custom exercise in order", () => {
    const customId = createExercise({
      name: "Backup muscles",
      description: "",
      trackingType: "weight_reps",
      equipment: null,
      primaryMuscles: ["lats", "biceps"],
    });

    const custom = readBackup().exercises.find((item) => item.id === customId);

    expect(custom?.muscles).toEqual([
      { muscleId: "lats", role: "primary" },
      { muscleId: "biceps", role: "primary" },
    ]);
  });

  it("leaves the catalog exercises out", () => {
    const ids = readBackup().exercises.map((item) => item.id);

    expect(ids).not.toContain(catalogId("bench_press"));
  });
});

describe("readBackup workouts", () => {
  it("nests the exercises and the sets of a finished workout", () => {
    insertWorkout("backup-finished", new Date(2041, 0, 5, 19));

    const workout = readBackup().workouts.find(
      (item) => item.id === "backup-finished",
    );

    expect(workout).toMatchObject({
      routineId: null,
      name: null,
      startedAt: new Date(2041, 0, 5, 18).toISOString(),
      endedAt: new Date(2041, 0, 5, 19).toISOString(),
    });
    expect(workout?.exercises.map((item) => item.exercise)).toEqual([
      { key: "bench_press" },
    ]);
    expect(workout?.exercises[0].sets.map((set) => set.id)).toEqual([
      "backup-finished-set-1",
      "backup-finished-set-2",
    ]);
    expect(workout?.exercises[0].sets[0]).toMatchObject({
      reps: 10,
      weightKg: 60,
      restS: 90,
      completedAt: new Date(2041, 0, 5, 18, 5).toISOString(),
      startedAt: null,
      restStartedAt: null,
    });
  });

  it("leaves out a workout in progress", () => {
    insertWorkout("backup-in-progress", null);

    const ids = readBackup().workouts.map((item) => item.id);

    expect(ids).not.toContain("backup-in-progress");
  });
});

describe("readBackup body weights", () => {
  it("carries each weigh-in under its day, oldest first", () => {
    saveBodyWeight(new Date(2042, 2, 20, 9), 79);
    saveBodyWeight(new Date(2042, 2, 10, 9), 80.5);

    const days = readBackup().bodyWeights.filter((item) =>
      item.measuredOn.startsWith("2042-"),
    );

    expect(days).toEqual([
      expect.objectContaining({ measuredOn: "2042-03-10", weightKg: 80.5 }),
      expect.objectContaining({ measuredOn: "2042-03-20", weightKg: 79 }),
    ]);
    expect(new Date(days[0].createdAt).toISOString()).toBe(days[0].createdAt);
  });
});

describe("readBackup and parseBackupFile", () => {
  it("parses back, unchanged, what readBackup writes", () => {
    const backup = readBackup();

    expect(parseBackupFile(JSON.stringify(backup))).toEqual(backup);
  });
});
