import { describe, expect, it } from "@jest/globals";
import { eq, isNotNull, sql } from "drizzle-orm";

import { db } from "@/db/client";
import {
  exerciseMuscles,
  exercises,
  muscles,
  workoutExercises,
  workouts,
} from "@/db/schema";

import { EXERCISE_CATALOG, MUSCLES } from "./catalog";
import { syncCatalog } from "./sync-catalog";

function catalogExercises() {
  return db
    .select({
      key: exercises.key,
      equipment: exercises.equipment,
      updatedAt: exercises.updatedAt,
    })
    .from(exercises)
    .where(isNotNull(exercises.key))
    .all();
}

function muscleRowIds() {
  return db
    .select({ rowid: sql<number>`${exerciseMuscles}.rowid` })
    .from(exerciseMuscles)
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

function getExercise(id: string) {
  return db.select().from(exercises).where(eq(exercises.id, id)).all().at(0);
}

// The tests share one database and build on each other, like app launches.
describe("syncCatalog", () => {
  it("writes the whole catalog on the first launch", () => {
    syncCatalog();

    expect(catalogExercises()).toHaveLength(EXERCISE_CATALOG.length);
    expect(db.select().from(muscles).all()).toHaveLength(MUSCLES.length);
    expect(
      db
        .select({
          muscleId: exerciseMuscles.muscleId,
          role: exerciseMuscles.role,
        })
        .from(exerciseMuscles)
        .where(eq(exerciseMuscles.exerciseId, catalogId("bench_press")))
        .orderBy(sql`${exerciseMuscles}.rowid`)
        .all(),
    ).toEqual([
      { muscleId: "chest", role: "primary" },
      { muscleId: "front_delts", role: "secondary" },
      { muscleId: "triceps", role: "secondary" },
    ]);
  });

  it("writes nothing when the catalog hasn't changed", () => {
    db.update(exercises)
      .set({ updatedAt: new Date(0) })
      .where(isNotNull(exercises.key))
      .run();
    const before = catalogExercises();
    const rowIds = muscleRowIds();

    syncCatalog();

    expect(catalogExercises()).toEqual(before);
    // Rewritten muscle rows would get new rowids.
    expect(muscleRowIds()).toEqual(rowIds);
  });

  it("puts back only what differs from the catalog", () => {
    const benchId = catalogId("bench_press");
    db.update(exercises)
      .set({ equipment: "dumbbell" })
      .where(eq(exercises.id, benchId))
      .run();
    db.delete(exerciseMuscles)
      .where(eq(exerciseMuscles.exerciseId, benchId))
      .run();
    db.update(exercises)
      .set({ updatedAt: new Date(0) })
      .where(isNotNull(exercises.key))
      .run();

    syncCatalog();

    const changed = catalogExercises().filter(
      (row) => row.updatedAt.getTime() !== 0,
    );
    expect(changed.map((row) => row.key)).toEqual(["bench_press"]);
    expect(getExercise(benchId)?.equipment).toBe("barbell");
    expect(
      db
        .select()
        .from(exerciseMuscles)
        .where(eq(exerciseMuscles.exerciseId, benchId))
        .all(),
    ).toHaveLength(3);
  });

  it("removes exercises dropped from the catalog, archiving logged ones", () => {
    db.insert(exercises)
      .values([
        { id: "dropped", key: "dropped_exercise", trackingType: "duration" },
        { id: "logged", key: "dropped_logged", trackingType: "duration" },
      ])
      .run();
    db.insert(workouts).values({ id: "workout", startedAt: new Date() }).run();
    db.insert(workoutExercises)
      .values({
        id: "workout-0",
        workoutId: "workout",
        exerciseId: "logged",
        position: 0,
      })
      .run();

    syncCatalog();

    expect(getExercise("dropped")).toBeUndefined();
    expect(getExercise("logged")?.archivedAt).toBeInstanceOf(Date);

    // Once archived it's left alone on later launches.
    db.update(exercises)
      .set({ updatedAt: new Date(0) })
      .where(eq(exercises.id, "logged"))
      .run();
    syncCatalog();
    expect(getExercise("logged")?.updatedAt.getTime()).toBe(0);
  });
});
