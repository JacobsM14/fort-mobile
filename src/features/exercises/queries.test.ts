import { beforeAll, describe, expect, it } from "@jest/globals";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import {
  exerciseMuscles,
  exercises,
  routines,
  workoutExercises,
  workouts,
  workoutSets,
} from "@/db/schema";
import { createRoutine } from "@/features/routines/queries";

import {
  countRoutinesWithExercise,
  createExercise,
  deleteExercise,
  EXERCISE_NAME_MAX_LENGTH,
  exerciseHasDoneSets,
  exerciseListQuery,
  toExerciseSummaries,
  updateExercise,
  type ExerciseInput,
} from "./queries";
import { syncCatalog } from "./sync-catalog";

const INPUT: ExerciseInput = {
  name: "  Remo con banda ",
  description: "   ",
  trackingType: "weight_reps",
  equipment: "bands",
  primaryMuscles: ["lats", "biceps"],
};

function getExercise(id: string) {
  return db.select().from(exercises).where(eq(exercises.id, id)).all().at(0);
}

function getMuscles(id: string) {
  return db
    .select({ muscleId: exerciseMuscles.muscleId, role: exerciseMuscles.role })
    .from(exerciseMuscles)
    .where(eq(exerciseMuscles.exerciseId, id))
    .orderBy(sql`${exerciseMuscles}.rowid`)
    .all();
}

function catalogId(key: string) {
  const [row] = db
    .select({ id: exercises.id })
    .from(exercises)
    .where(eq(exercises.key, key))
    .all();
  return row.id;
}

function logWorkoutWith(exerciseId: string) {
  const workoutId = `workout-${exerciseId}`;
  const workoutExerciseId = `${workoutId}-0`;
  db.insert(workouts).values({ id: workoutId, startedAt: new Date() }).run();
  db.insert(workoutExercises)
    .values({ id: workoutExerciseId, workoutId, exerciseId, position: 0 })
    .run();
  return workoutExerciseId;
}

function exerciseIdsListed(includeArchived: boolean) {
  return exerciseListQuery(includeArchived)
    .all()
    .map((row) => row.id);
}

beforeAll(() => {
  syncCatalog();
});

describe("createExercise", () => {
  it("saves a user exercise with trimmed text and its main muscles", () => {
    const id = createExercise(INPUT);

    expect(getExercise(id)).toMatchObject({
      key: null,
      name: "Remo con banda",
      description: null,
      equipment: "bands",
      trackingType: "weight_reps",
      archivedAt: null,
    });
    expect(getMuscles(id)).toEqual([
      { muscleId: "lats", role: "primary" },
      { muscleId: "biceps", role: "primary" },
    ]);
  });

  it("cuts a name longer than the limit", () => {
    const id = createExercise({ ...INPUT, name: "a".repeat(70) });

    expect(getExercise(id)?.name).toHaveLength(EXERCISE_NAME_MAX_LENGTH);
  });
});

describe("updateExercise", () => {
  it("changes the text and replaces the main muscles", () => {
    const id = createExercise(INPUT);

    updateExercise(id, {
      ...INPUT,
      name: "Remo",
      description: "Lento",
      equipment: null,
      primaryMuscles: ["upper_back"],
    });

    expect(getExercise(id)).toMatchObject({
      name: "Remo",
      description: "Lento",
      equipment: null,
    });
    expect(getMuscles(id)).toEqual([
      { muscleId: "upper_back", role: "primary" },
    ]);
  });
});

describe("deleteExercise", () => {
  it("deletes an exercise nothing uses, with its muscles", () => {
    const id = createExercise(INPUT);

    deleteExercise(id);

    expect(getExercise(id)).toBeUndefined();
    expect(getMuscles(id)).toEqual([]);
  });

  it("takes it out of its routines and marks them as changed", () => {
    const id = createExercise(INPUT);
    const routineId = createRoutine({
      name: "Back",
      exerciseIds: [id, catalogId("barbell_row")],
    });
    db.update(routines)
      .set({ updatedAt: new Date(0) })
      .where(eq(routines.id, routineId))
      .run();
    expect(countRoutinesWithExercise(id)).toBe(1);

    deleteExercise(id);

    expect(countRoutinesWithExercise(id)).toBe(0);
    const [routine] = db
      .select({ updatedAt: routines.updatedAt })
      .from(routines)
      .where(eq(routines.id, routineId))
      .all();
    // useRoutineList only watches the routines table.
    expect(routine.updatedAt.getTime()).toBeGreaterThan(0);
  });

  it("archives it instead when logged workouts used it", () => {
    const id = createExercise(INPUT);
    logWorkoutWith(id);

    deleteExercise(id);

    expect(getExercise(id)?.archivedAt).toBeInstanceOf(Date);
  });
});

describe("exerciseListQuery", () => {
  it("leaves out a deleted exercise unless asked for the archived ones", () => {
    const id = createExercise(INPUT);
    logWorkoutWith(id);
    deleteExercise(id);

    expect(exerciseIdsListed(false)).not.toContain(id);
    expect(exerciseIdsListed(true)).toContain(id);
  });
});

describe("exerciseHasDoneSets", () => {
  it("is false for an exercise only in routines", () => {
    const id = createExercise(INPUT);
    createRoutine({ name: "A", exerciseIds: [id] });

    expect(exerciseHasDoneSets(id)).toBe(false);
  });

  it("is true only once one of its sets is done", () => {
    const id = createExercise(INPUT);
    const workoutExerciseId = logWorkoutWith(id);
    db.insert(workoutSets)
      .values({
        id: `${workoutExerciseId}-set`,
        workoutExerciseId,
        position: 0,
      })
      .run();
    expect(exerciseHasDoneSets(id)).toBe(false);

    db.update(workoutSets)
      .set({ completedAt: new Date() })
      .where(eq(workoutSets.id, `${workoutExerciseId}-set`))
      .run();
    expect(exerciseHasDoneSets(id)).toBe(true);
  });
});

describe("countRoutinesWithExercise", () => {
  it("counts each routine once", () => {
    const id = createExercise(INPUT);
    createRoutine({ name: "A", exerciseIds: [id] });
    createRoutine({ name: "B", exerciseIds: [id, catalogId("bench_press")] });

    expect(countRoutinesWithExercise(id)).toBe(2);
  });
});

describe("toExerciseSummaries", () => {
  const base = {
    key: null,
    name: "Remo",
    description: null,
    equipment: null,
    trackingType: "weight_reps" as const,
  };

  it("folds one row per muscle into one summary per exercise", () => {
    expect(
      toExerciseSummaries([
        { ...base, id: "a", muscleId: "lats", role: "primary" },
        { ...base, id: "a", muscleId: "biceps", role: "secondary" },
        { ...base, id: "a", muscleId: "upper_back", role: "primary" },
        { ...base, id: "b", muscleId: null, role: null },
      ]),
    ).toEqual([
      {
        ...base,
        id: "a",
        primaryMuscles: ["lats", "upper_back"],
        secondaryMuscles: ["biceps"],
      },
      { ...base, id: "b", primaryMuscles: [], secondaryMuscles: [] },
    ]);
  });

  it("skips muscles the app doesn't know", () => {
    const [summary] = toExerciseSummaries([
      { ...base, id: "a", muscleId: "removed_muscle", role: "primary" },
    ]);
    expect(summary.primaryMuscles).toEqual([]);
  });
});
