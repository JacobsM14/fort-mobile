import { beforeAll, describe, expect, it } from "@jest/globals";
import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { exercises, routineExercises, routines, workouts } from "@/db/schema";
import { syncCatalog } from "@/features/exercises/sync-catalog";

import {
  createRoutine,
  deleteRoutine,
  ROUTINE_NAME_MAX_LENGTH,
  toRoutineSummaries,
  updateRoutine,
} from "./queries";

import type { ExerciseSummary } from "@/features/exercises/queries";

function catalogId(key: string) {
  const [row] = db
    .select({ id: exercises.id })
    .from(exercises)
    .where(eq(exercises.key, key))
    .all();
  return row.id;
}

function routineRows(routineId: string) {
  return db
    .select({
      id: routineExercises.id,
      exerciseId: routineExercises.exerciseId,
      position: routineExercises.position,
    })
    .from(routineExercises)
    .where(eq(routineExercises.routineId, routineId))
    .orderBy(asc(routineExercises.position))
    .all();
}

beforeAll(() => {
  syncCatalog();
});

describe("createRoutine", () => {
  it("saves the trimmed name and the exercises in order", () => {
    const ids = [
      catalogId("bench_press"),
      catalogId("overhead_press"),
      catalogId("dip"),
    ];
    const routineId = createRoutine({ name: "  Push  ", exerciseIds: ids });

    const [routine] = db
      .select()
      .from(routines)
      .where(eq(routines.id, routineId))
      .all();
    expect(routine.name).toBe("Push");
    expect(routineRows(routineId).map((row) => row.exerciseId)).toEqual(ids);
  });

  it("cuts a name longer than the limit", () => {
    const routineId = createRoutine({
      name: "a".repeat(ROUTINE_NAME_MAX_LENGTH + 10),
      exerciseIds: [],
    });

    const [routine] = db
      .select()
      .from(routines)
      .where(eq(routines.id, routineId))
      .all();
    expect(routine.name).toHaveLength(ROUTINE_NAME_MAX_LENGTH);
  });
});

describe("updateRoutine", () => {
  it("keeps the rows of exercises that stay, reorders, adds and removes", () => {
    const [bench, press, dip, row] = [
      "bench_press",
      "overhead_press",
      "dip",
      "barbell_row",
    ].map(catalogId);
    const routineId = createRoutine({
      name: "Push",
      exerciseIds: [bench, press, dip],
    });
    const before = new Map(
      routineRows(routineId).map((item) => [item.exerciseId, item.id]),
    );

    updateRoutine(routineId, {
      name: "Push B",
      exerciseIds: [dip, bench, row],
    });

    const after = routineRows(routineId);
    expect(after.map((item) => item.exerciseId)).toEqual([dip, bench, row]);
    expect(after.map((item) => item.position)).toEqual([0, 1, 2]);
    // Same rows for the exercises that stayed, so their ids survive a sync.
    expect(after[0].id).toBe(before.get(dip));
    expect(after[1].id).toBe(before.get(bench));
    expect(before.has(row)).toBe(false);
  });
});

describe("deleteRoutine", () => {
  it("removes its exercises and keeps the workouts done with it", () => {
    const routineId = createRoutine({
      name: "Legs",
      exerciseIds: [catalogId("back_squat")],
    });
    db.insert(workouts)
      .values({ id: "workout-legs", routineId, startedAt: new Date() })
      .run();

    deleteRoutine(routineId);

    expect(
      db.select().from(routines).where(eq(routines.id, routineId)).all(),
    ).toEqual([]);
    expect(routineRows(routineId)).toEqual([]);
    const [workout] = db
      .select({ routineId: workouts.routineId })
      .from(workouts)
      .where(eq(workouts.id, "workout-legs"))
      .all();
    expect(workout.routineId).toBeNull();
  });
});

describe("toRoutineSummaries", () => {
  const exercise = (
    id: string,
    primaryMuscles: ExerciseSummary["primaryMuscles"],
    trackingType: ExerciseSummary["trackingType"],
  ): ExerciseSummary => ({
    id,
    key: null,
    name: id,
    description: null,
    equipment: null,
    trackingType,
    primaryMuscles,
    secondaryMuscles: [],
  });

  it("counts exercises and lists main muscles and tracking types once", () => {
    const summaries = toRoutineSummaries(
      [
        { id: "r1", name: "Upper", exerciseId: "bench" },
        { id: "r1", name: "Upper", exerciseId: "fly" },
        { id: "r1", name: "Upper", exerciseId: "plank" },
        { id: "r2", name: "Empty", exerciseId: null },
      ],
      [
        exercise("bench", ["chest", "triceps"], "weight_reps"),
        exercise("fly", ["chest"], "weight_reps"),
        exercise("plank", ["abs"], "duration"),
      ],
    );

    expect(summaries).toEqual([
      {
        id: "r1",
        name: "Upper",
        exerciseCount: 3,
        muscles: ["chest", "abs"],
        trackingTypes: ["weight_reps", "duration"],
      },
      {
        id: "r2",
        name: "Empty",
        exerciseCount: 0,
        muscles: [],
        trackingTypes: [],
      },
    ]);
  });
});
