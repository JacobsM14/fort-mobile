import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { eq } from "drizzle-orm";

import { db } from "@/db/client";
import {
  bodyWeights,
  exerciseMuscles,
  exercises,
  routineExercises,
  routines,
  routineSets,
  workoutExercises,
  workouts,
  workoutSets,
} from "@/db/schema";
import { saveBodyWeight } from "@/features/body/queries";
import { createExercise } from "@/features/exercises/queries";
import { syncCatalog } from "@/features/exercises/sync-catalog";
import { createRoutine } from "@/features/routines/queries";

import type { BackupFile } from "./backup";
import { importBackup, readBackup } from "./queries";

// The profile lives in expo-sqlite's key-value store, which needs the native app.
jest.mock("@/features/settings/user-profile", () => ({
  loadUserProfile: () => ({ heightCm: null, birthDate: null, gender: null }),
}));

const EARLY = "2026-01-01T10:00:00.000Z";
const LATE = "2026-06-01T10:00:00.000Z";

function catalogId(key: string) {
  const [row] = db
    .select({ id: exercises.id })
    .from(exercises)
    .where(eq(exercises.key, key))
    .all();
  return row.id;
}

// Every table the backup carries, children first. The catalog stays.
function emptyTables() {
  db.delete(workoutSets).run();
  db.delete(workoutExercises).run();
  db.delete(workouts).run();
  db.delete(routineSets).run();
  db.delete(routineExercises).run();
  db.delete(routines).run();
  db.delete(bodyWeights).run();
  for (const custom of db
    .select({ id: exercises.id, key: exercises.key })
    .from(exercises)
    .all()
    .filter((row) => row.key === null)) {
    db.delete(exerciseMuscles)
      .where(eq(exerciseMuscles.exerciseId, custom.id))
      .run();
    db.delete(exercises).where(eq(exercises.id, custom.id)).run();
  }
}

function emptyBackup(): BackupFile {
  return {
    app: "fortapp",
    formatVersion: 1,
    exportedAt: LATE,
    profile: { heightCm: null, birthDate: null, gender: null },
    exercises: [],
    routines: [],
    workouts: [],
    bodyWeights: [],
  };
}

function routineWith(
  id: string,
  name: string,
  updatedAt: string,
  exercise: { key: string } | { id: string } = { key: "bench_press" },
): BackupFile["routines"][number] {
  return {
    id,
    name,
    createdAt: EARLY,
    updatedAt,
    exercises: [
      {
        id: `${id}-exercise`,
        exercise,
        position: 0,
        restS: 90,
        createdAt: EARLY,
        updatedAt,
        sets: [
          {
            id: `${id}-set`,
            position: 0,
            setType: "normal",
            weightKg: 60,
            reps: 10,
            durationS: null,
            distanceM: null,
            createdAt: EARLY,
            updatedAt,
          },
        ],
      },
    ],
  };
}

function workoutWith(
  id: string,
  routineId: string | null,
): BackupFile["workouts"][number] {
  return {
    id,
    routineId,
    name: null,
    startedAt: EARLY,
    endedAt: LATE,
    createdAt: EARLY,
    updatedAt: EARLY,
    exercises: [
      {
        id: `${id}-exercise`,
        exercise: { key: "bench_press" },
        position: 0,
        createdAt: EARLY,
        updatedAt: EARLY,
        sets: [
          {
            id: `${id}-set`,
            position: 0,
            setType: "normal",
            weightKg: 60,
            reps: 10,
            durationS: null,
            distanceM: null,
            startedAt: null,
            completedAt: EARLY,
            restStartedAt: null,
            restS: 60,
            createdAt: EARLY,
            updatedAt: EARLY,
          },
        ],
      },
    ],
  };
}

function storedRoutineName(id: string) {
  return db
    .select({ name: routines.name })
    .from(routines)
    .where(eq(routines.id, id))
    .get()?.name;
}

beforeAll(() => {
  syncCatalog();
});

beforeEach(() => {
  emptyTables();
});

describe("importBackup", () => {
  it("restores everything readBackup wrote, on an empty database", () => {
    const customId = createExercise({
      name: "Cable fly",
      description: "",
      trackingType: "weight_reps",
      equipment: "cable",
      primaryMuscles: ["chest", "front_delts"],
    });
    const routineId = createRoutine({
      name: "Push",
      exerciseIds: [catalogId("bench_press"), customId],
    });
    const [routineExercise] = db
      .select({ id: routineExercises.id })
      .from(routineExercises)
      .where(eq(routineExercises.routineId, routineId))
      .all();
    db.insert(routineSets)
      .values({
        id: "stored-set",
        routineExerciseId: routineExercise.id,
        position: 0,
        reps: 8,
      })
      .run();
    db.insert(workouts)
      .values({
        id: "stored-workout",
        routineId,
        startedAt: new Date(EARLY),
        endedAt: new Date(LATE),
      })
      .run();
    db.insert(workoutExercises)
      .values({
        id: "stored-workout-exercise",
        workoutId: "stored-workout",
        exerciseId: customId,
        position: 0,
      })
      .run();
    db.insert(workoutSets)
      .values({
        id: "stored-workout-set",
        workoutExerciseId: "stored-workout-exercise",
        position: 0,
        reps: 12,
        completedAt: new Date(EARLY),
      })
      .run();
    saveBodyWeight(new Date(2043, 4, 6), 79.5);
    const backup = readBackup();

    emptyTables();
    const result = importBackup(backup);

    expect(result).toEqual({
      exercises: 1,
      routines: 1,
      workouts: 1,
      bodyWeights: 1,
      skippedExercises: 0,
    });
    expect(readBackup(new Date(backup.exportedAt))).toEqual(backup);
  });

  it("changes nothing when the same file is imported again", () => {
    const backup = {
      ...emptyBackup(),
      routines: [routineWith("routine-a", "Push", EARLY)],
      workouts: [workoutWith("workout-a", "routine-a")],
    };
    importBackup(backup);
    const afterFirst = readBackup(new Date(LATE));

    const second = importBackup(backup);

    expect(second).toEqual({
      exercises: 0,
      routines: 0,
      workouts: 0,
      bodyWeights: 0,
      skippedExercises: 0,
    });
    expect(readBackup(new Date(LATE))).toEqual(afterFirst);
  });

  it("replaces a stored row only when the file's is newer", () => {
    importBackup({
      ...emptyBackup(),
      routines: [routineWith("routine-a", "Original", LATE)],
    });

    importBackup({
      ...emptyBackup(),
      routines: [routineWith("routine-a", "Older edit", EARLY)],
    });
    expect(storedRoutineName("routine-a")).toBe("Original");

    importBackup({
      ...emptyBackup(),
      routines: [
        routineWith("routine-a", "Newer edit", "2026-12-01T10:00:00.000Z"),
      ],
    });
    expect(storedRoutineName("routine-a")).toBe("Newer edit");
  });

  it("never deletes what the file doesn't carry", () => {
    importBackup({
      ...emptyBackup(),
      routines: [routineWith("routine-a", "Kept", EARLY)],
    });

    importBackup(emptyBackup());

    expect(storedRoutineName("routine-a")).toBe("Kept");
  });

  it("finds a catalog exercise by its key, whatever its id here", () => {
    importBackup({
      ...emptyBackup(),
      routines: [
        routineWith("routine-a", "Push", EARLY, { key: "bench_press" }),
      ],
    });

    const [row] = db
      .select({ exerciseId: routineExercises.exerciseId })
      .from(routineExercises)
      .where(eq(routineExercises.routineId, "routine-a"))
      .all();

    expect(row.exerciseId).toBe(catalogId("bench_press"));
  });

  it("leaves out, and counts, exercises of a catalog this app doesn't know", () => {
    const result = importBackup({
      ...emptyBackup(),
      routines: [
        routineWith("routine-a", "Future", EARLY, {
          key: "from_a_newer_catalog",
        }),
      ],
    });

    expect(result.skippedExercises).toBe(1);
    expect(result.routines).toBe(1);
    expect(
      db
        .select({ id: routineExercises.id })
        .from(routineExercises)
        .where(eq(routineExercises.routineId, "routine-a"))
        .all(),
    ).toEqual([]);
    expect(
      db
        .select({ id: routineSets.id })
        .from(routineSets)
        .where(eq(routineSets.id, "routine-a-set"))
        .all(),
    ).toEqual([]);
  });

  it("keeps a custom exercise with its id and its muscles in order", () => {
    importBackup({
      ...emptyBackup(),
      exercises: [
        {
          id: "custom-a",
          name: "Cable fly",
          description: null,
          equipment: "cable",
          trackingType: "weight_reps",
          archivedAt: null,
          muscles: [
            { muscleId: "chest", role: "primary" },
            { muscleId: "front_delts", role: "primary" },
          ],
          createdAt: EARLY,
          updatedAt: EARLY,
        },
      ],
      routines: [routineWith("routine-a", "Push", EARLY, { id: "custom-a" })],
    });

    const muscles = db
      .select({ muscleId: exerciseMuscles.muscleId })
      .from(exerciseMuscles)
      .where(eq(exerciseMuscles.exerciseId, "custom-a"))
      .all();
    const [routineExercise] = db
      .select({ exerciseId: routineExercises.exerciseId })
      .from(routineExercises)
      .where(eq(routineExercises.routineId, "routine-a"))
      .all();

    expect(muscles.map((row) => row.muscleId)).toEqual([
      "chest",
      "front_delts",
    ]);
    expect(routineExercise.exerciseId).toBe("custom-a");
  });

  it("drops the routine of a workout that is neither stored nor in the file", () => {
    importBackup({
      ...emptyBackup(),
      workouts: [workoutWith("workout-a", "routine-nobody-has")],
    });

    const [workout] = db
      .select({ routineId: workouts.routineId })
      .from(workouts)
      .where(eq(workouts.id, "workout-a"))
      .all();

    expect(workout.routineId).toBeNull();
  });

  it("keeps a workout's routine when the file carries it", () => {
    importBackup({
      ...emptyBackup(),
      routines: [routineWith("routine-a", "Push", EARLY)],
      workouts: [workoutWith("workout-a", "routine-a")],
    });

    const [workout] = db
      .select({ routineId: workouts.routineId })
      .from(workouts)
      .where(eq(workouts.id, "workout-a"))
      .all();

    expect(workout.routineId).toBe("routine-a");
  });

  it("keeps the stored id of a weigh-in on the same day, and the newer weight", () => {
    saveBodyWeight(new Date(2044, 2, 10), 80);
    const [stored] = db.select().from(bodyWeights).all();

    importBackup({
      ...emptyBackup(),
      bodyWeights: [
        {
          id: "from-the-file",
          measuredOn: "2044-03-10",
          weightKg: 78,
          createdAt: EARLY,
          updatedAt: "2099-01-01T00:00:00.000Z",
        },
      ],
    });

    const rows = db.select().from(bodyWeights).all();
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe(stored.id);
    expect(rows[0].weightKg).toBe(78);
  });

  it("leaves nothing half done when a row fails", () => {
    expect(() =>
      importBackup({
        ...emptyBackup(),
        routines: [routineWith("routine-a", "Push", EARLY)],
        // A custom exercise the file doesn't carry: the foreign key refuses it.
        workouts: [
          {
            ...workoutWith("workout-a", null),
            exercises: [
              {
                ...workoutWith("workout-a", null).exercises[0],
                exercise: { id: "nobody-has-this" },
              },
            ],
          },
        ],
      }),
    ).toThrow();

    expect(storedRoutineName("routine-a")).toBeUndefined();
  });
});
