import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import { exercises, routineExercises, routineSets } from "@/db/schema";
import { createExercise } from "@/features/exercises/queries";
import { syncCatalog } from "@/features/exercises/sync-catalog";
import { createRoutine } from "@/features/routines/queries";

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
        { id: "backup-set-2", routineExerciseId: routineExercise.id, position: 1, reps: 8 },
        { id: "backup-set-1", routineExerciseId: routineExercise.id, position: 0, reps: 10, weightKg: 60 },
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
