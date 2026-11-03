import { describe, expect, it } from "@jest/globals";

import {
  BACKUP_FORMAT_VERSION,
  BackupError,
  backupFileName,
  parseBackupFile,
  summarizeBackup,
  type BackupFile,
} from "./backup";

const ISO = "2026-10-30T10:00:00.000Z";
const stamps = { createdAt: ISO, updatedAt: ISO };

function validFile(): BackupFile {
  return {
    app: "fortapp",
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: ISO,
    profile: { heightCm: 180, birthDate: "1990-04-12", gender: "female" },
    exercises: [
      {
        id: "custom-1",
        name: "Cable fly",
        description: null,
        equipment: "cable",
        trackingType: "weight_reps",
        archivedAt: null,
        muscles: [{ muscleId: "chest", role: "primary" }],
        ...stamps,
      },
    ],
    routines: [
      {
        id: "routine-1",
        name: "Push",
        exercises: [
          {
            id: "routine-exercise-1",
            exercise: { key: "bench_press" },
            position: 0,
            restS: 90,
            sets: [
              {
                id: "routine-set-1",
                position: 0,
                setType: "normal",
                weightKg: 60,
                reps: 10,
                durationS: null,
                distanceM: null,
                ...stamps,
              },
            ],
            ...stamps,
          },
        ],
        ...stamps,
      },
    ],
    workouts: [
      {
        id: "workout-1",
        routineId: "routine-1",
        name: null,
        startedAt: ISO,
        endedAt: ISO,
        exercises: [
          {
            id: "workout-exercise-1",
            exercise: { id: "custom-1" },
            position: 0,
            sets: [
              {
                id: "workout-set-1",
                position: 0,
                setType: "warmup",
                weightKg: null,
                reps: 12,
                durationS: null,
                distanceM: null,
                startedAt: null,
                completedAt: ISO,
                restStartedAt: null,
                restS: 60,
                ...stamps,
              },
            ],
            ...stamps,
          },
        ],
        ...stamps,
      },
    ],
    bodyWeights: [
      { id: "weight-1", measuredOn: "2026-10-24", weightKg: 80.5, ...stamps },
    ],
  };
}

// The text of a valid file with some top-level fields replaced, so a test can
// break one thing at a time (a field of any type, which BackupFile wouldn't
// allow).
function textWith(changes: Record<string, unknown>) {
  return JSON.stringify({ ...validFile(), ...changes });
}

function errorCode(text: string) {
  try {
    parseBackupFile(text);
  } catch (error) {
    return error instanceof BackupError ? error.code : "not a BackupError";
  }
  return null;
}

describe("parseBackupFile", () => {
  it("returns the data of a valid file", () => {
    expect(parseBackupFile(JSON.stringify(validFile()))).toEqual(validFile());
  });

  it("accepts empty lists and an empty profile", () => {
    const text = textWith({
      profile: { heightCm: null, birthDate: null, gender: null },
      exercises: [],
      routines: [],
      workouts: [],
      bodyWeights: [],
    });

    expect(errorCode(text)).toBeNull();
  });

  it.each([
    ["text that is not JSON", "not json at all"],
    ["a list", "[]"],
    ["a number", "42"],
    ["JSON from something else", '{"name":"my-project","version":"1.0.0"}'],
    ["another app", textWith({ app: "otherapp" })],
  ])("says it is not a backup for %s", (_name, text) => {
    expect(errorCode(text)).toBe("not_a_backup");
  });

  it("asks for an update when the file comes from a newer version", () => {
    expect(
      errorCode(textWith({ formatVersion: BACKUP_FORMAT_VERSION + 1 })),
    ).toBe("unsupported_version");
  });

  it("checks the version before the rest, which a newer app may have changed", () => {
    const text = JSON.stringify({ app: "fortapp", formatVersion: 99 });

    expect(errorCode(text)).toBe("unsupported_version");
  });

  it.each([
    ["no version", undefined],
    ["a version that is not a number", "1"],
    ["a version below 1", 0],
    ["a version that is not an integer", 1.5],
  ])("rejects %s", (_name, formatVersion) => {
    expect(errorCode(textWith({ formatVersion }))).toBe("invalid");
  });

  it.each(["profile", "exercises", "routines", "workouts", "bodyWeights"])(
    "rejects a file without %s",
    (field) => {
      expect(errorCode(textWith({ [field]: undefined }))).toBe("invalid");
    },
  );

  it.each([
    ["a list that is an object", { routines: {} }],
    ["an exportedAt that is not a date", { exportedAt: "yesterday" }],
    ["a date without the ISO format", { exportedAt: "2026-10-30" }],
    [
      "a negative height",
      { profile: { heightCm: -1, birthDate: null, gender: null } },
    ],
    [
      "a birth date that does not exist",
      { profile: { heightCm: null, birthDate: "2026-02-30", gender: null } },
    ],
    [
      "an unknown gender",
      { profile: { heightCm: null, birthDate: null, gender: "x" } },
    ],
    [
      "a weigh-in on a day that does not exist",
      {
        bodyWeights: [
          { id: "w", measuredOn: "2026-13-01", weightKg: 80, ...stamps },
        ],
      },
    ],
    [
      "a weight that is not a number",
      {
        bodyWeights: [
          { id: "w", measuredOn: "2026-10-24", weightKg: "80", ...stamps },
        ],
      },
    ],
    ["an item that is not an object", { workouts: [1] }],
  ])("rejects %s", (_name, changes) => {
    expect(errorCode(textWith(changes))).toBe("invalid");
  });

  it("rejects a muscle that is not in the catalog", () => {
    const [exercise] = validFile().exercises;
    const text = textWith({
      exercises: [
        { ...exercise, muscles: [{ muscleId: "wings", role: "primary" }] },
      ],
    });

    expect(errorCode(text)).toBe("invalid");
  });

  it("rejects a muscle repeated in one exercise", () => {
    const [exercise] = validFile().exercises;
    const text = textWith({
      exercises: [
        {
          ...exercise,
          muscles: [
            { muscleId: "chest", role: "primary" },
            { muscleId: "chest", role: "secondary" },
          ],
        },
      ],
    });

    expect(errorCode(text)).toBe("invalid");
  });

  it.each(["", "   "])("rejects a routine named %p", (name) => {
    const [routine] = validFile().routines;

    expect(errorCode(textWith({ routines: [{ ...routine, name }] }))).toBe(
      "invalid",
    );
  });

  it.each(["", "   "])("rejects a custom exercise named %p", (name) => {
    const [exercise] = validFile().exercises;

    expect(errorCode(textWith({ exercises: [{ ...exercise, name }] }))).toBe(
      "invalid",
    );
  });

  it("rejects a set type it does not know, deep inside a routine", () => {
    const [routine] = validFile().routines;
    const [exercise] = routine.exercises;
    const [set] = exercise.sets;
    const text = textWith({
      routines: [
        {
          ...routine,
          exercises: [{ ...exercise, sets: [{ ...set, setType: "huge" }] }],
        },
      ],
    });

    expect(errorCode(text)).toBe("invalid");
  });

  it.each([
    ["both a key and an id", { key: "bench_press", id: "custom-1" }],
    ["neither a key nor an id", {}],
    ["a key that is not text", { key: 5 }],
  ])("rejects an exercise reference with %s", (_name, exercise) => {
    const [routine] = validFile().routines;
    const text = textWith({
      routines: [
        {
          ...routine,
          exercises: [{ ...routine.exercises[0], exercise }],
        },
      ],
    });

    expect(errorCode(text)).toBe("invalid");
  });

  it("rejects a reference to a custom exercise the file does not carry", () => {
    expect(errorCode(textWith({ exercises: [] }))).toBe("invalid");
  });

  it("does not need the catalog to know a key", () => {
    const [routine] = validFile().routines;
    const text = textWith({
      routines: [
        {
          ...routine,
          exercises: [
            {
              ...routine.exercises[0],
              exercise: { key: "from_a_newer_catalog" },
            },
          ],
        },
      ],
    });

    expect(errorCode(text)).toBeNull();
  });

  it("rejects an id that repeats in a nested level", () => {
    // The second routine is new, but its exercise and set ids are the first one's.
    const [routine] = validFile().routines;
    const text = textWith({
      routines: [routine, { ...routine, id: "routine-2" }],
    });

    expect(errorCode(text)).toBe("invalid");
  });

  it("rejects two weigh-ins on the same day", () => {
    const [weight] = validFile().bodyWeights;
    const text = textWith({
      bodyWeights: [weight, { ...weight, id: "weight-2" }],
    });

    expect(errorCode(text)).toBe("invalid");
  });
});

describe("backupFileName", () => {
  it("is named after the local day, with no colons", () => {
    expect(backupFileName(new Date(2026, 9, 30, 23, 50))).toBe(
      "fort-backup-2026-10-30.json",
    );
  });
});

describe("summarizeBackup", () => {
  it("counts what the file carries at the top level", () => {
    expect(summarizeBackup(validFile())).toEqual({
      exercises: 1,
      routines: 1,
      workouts: 1,
      bodyWeights: 1,
    });
  });

  it("counts zero for an empty file", () => {
    expect(
      summarizeBackup({
        ...validFile(),
        exercises: [],
        routines: [],
        workouts: [],
        bodyWeights: [],
      }),
    ).toEqual({ exercises: 0, routines: 0, workouts: 0, bodyWeights: 0 });
  });
});
