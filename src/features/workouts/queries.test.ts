import { beforeAll, describe, expect, it } from "@jest/globals";
import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import {
  exercises,
  workoutExercises,
  workoutSets,
  workouts,
} from "@/db/schema";
import { syncCatalog } from "@/features/exercises/sync-catalog";
import { createRoutine } from "@/features/routines/queries";

import {
  addSet,
  addWorkoutExercises,
  chooseRest,
  completeSet,
  deleteSet,
  discardWorkout,
  endRest,
  finishWorkout,
  previousSetsQuery,
  startNextSetTimer,
  startSetTimer,
  startWorkout,
  toWorkoutExercises,
  toWorkoutHistory,
  updateSetValues,
  type SetValues,
} from "./queries";

const START = new Date(2026, 9, 19, 18, 0, 0);

function at(seconds: number) {
  return new Date(START.getTime() + seconds * 1000);
}

const BENCH: SetValues = {
  weightKg: 60,
  reps: 10,
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

// Same shape useWorkout reads.
function readWorkout(workoutId: string) {
  const exerciseRows = db
    .select({
      id: workoutExercises.id,
      exerciseId: workoutExercises.exerciseId,
    })
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, workoutId))
    .orderBy(asc(workoutExercises.position))
    .all();
  const setRows = db
    .select({
      id: workoutSets.id,
      workoutExerciseId: workoutSets.workoutExerciseId,
      weightKg: workoutSets.weightKg,
      reps: workoutSets.reps,
      durationS: workoutSets.durationS,
      distanceM: workoutSets.distanceM,
      startedAt: workoutSets.startedAt,
      completedAt: workoutSets.completedAt,
      restStartedAt: workoutSets.restStartedAt,
      restS: workoutSets.restS,
    })
    .from(workoutSets)
    .innerJoin(
      workoutExercises,
      eq(workoutExercises.id, workoutSets.workoutExerciseId),
    )
    .where(eq(workoutExercises.workoutId, workoutId))
    .orderBy(asc(workoutSets.position))
    .all();
  return toWorkoutExercises(exerciseRows, setRows);
}

function readWorkoutRow(workoutId: string) {
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.id, workoutId))
    .all()
    .at(0);
}

function startPushDay() {
  const routineId = createRoutine({
    name: "Push",
    exerciseIds: [catalogId("bench_press"), catalogId("plank")],
  });
  const workoutId = startWorkout(routineId, START);
  const [bench, plank] = readWorkout(workoutId);
  return { routineId, workoutId, bench, plank };
}

beforeAll(() => {
  syncCatalog();
});

describe("startWorkout", () => {
  it("copies the routine's name and exercises, each with one empty set", () => {
    const { routineId, workoutId } = startPushDay();

    const workout = readWorkoutRow(workoutId);
    expect(workout?.routineId).toBe(routineId);
    expect(workout?.name).toBe("Push");
    expect(workout?.startedAt).toEqual(START);
    expect(workout?.endedAt).toBeNull();

    const [bench, plank] = readWorkout(workoutId);
    expect(bench.exerciseId).toBe(catalogId("bench_press"));
    expect(plank.exerciseId).toBe(catalogId("plank"));
    for (const exercise of [bench, plank]) {
      expect(exercise.sets).toHaveLength(1);
      expect(exercise.sets[0]).toMatchObject({
        weightKg: null,
        reps: null,
        completedAt: null,
      });
    }
  });
});

describe("addSet", () => {
  it("starts the new set with the previous set's values", () => {
    const { workoutId, bench } = startPushDay();
    updateSetValues(bench.sets[0].id, BENCH);

    addSet(bench.id);

    const sets = readWorkout(workoutId)[0].sets;
    expect(sets).toHaveLength(2);
    expect(sets[1]).toMatchObject({ ...BENCH, completedAt: null });
  });
});

describe("updateSetValues", () => {
  it("writes only the values, even when handed a whole set", () => {
    const { workoutId, bench } = startPushDay();
    const wholeSet = {
      ...bench.sets[0],
      ...BENCH,
      completedAt: at(10),
      restS: 30,
    };

    updateSetValues(wholeSet.id, wholeSet);

    expect(readWorkout(workoutId)[0].sets[0]).toMatchObject({
      ...BENCH,
      completedAt: null,
      restS: null,
    });
  });
});

describe("rests", () => {
  it("going straight on records no rest and brings up the next set", () => {
    const { workoutId, bench } = startPushDay();
    completeSet(bench.sets[0].id, BENCH, at(30));

    chooseRest(bench.sets[0].id, "none", at(35));

    const sets = readWorkout(workoutId)[0].sets;
    expect(sets[0].restS).toBe(0);
    expect(sets).toHaveLength(2);
    expect(sets[1]).toMatchObject(BENCH);
  });

  it("doesn't add a set when the next one is already there", () => {
    const { workoutId, bench } = startPushDay();
    completeSet(bench.sets[0].id, BENCH, at(30));
    addSet(bench.id);

    chooseRest(bench.sets[0].id, "none", at(35));

    expect(readWorkout(workoutId)[0].sets).toHaveLength(2);
  });

  it("a timed rest runs until it's stopped", () => {
    const { workoutId, bench } = startPushDay();
    completeSet(bench.sets[0].id, BENCH, at(30));
    chooseRest(bench.sets[0].id, "timed", at(30));

    let sets = readWorkout(workoutId)[0].sets;
    expect(sets[0]).toMatchObject({ restStartedAt: at(30), restS: null });
    expect(sets).toHaveLength(2);

    endRest(bench.sets[0].id, at(122));
    sets = readWorkout(workoutId)[0].sets;
    expect(sets[0].restS).toBe(92);
  });

  it("a running rest ends when the next set is done", () => {
    const { workoutId, bench } = startPushDay();
    completeSet(bench.sets[0].id, BENCH, at(30));
    chooseRest(bench.sets[0].id, "timed", at(30));
    const next = readWorkout(workoutId)[0].sets[1];

    completeSet(next.id, BENCH, at(150));

    expect(readWorkout(workoutId)[0].sets[0].restS).toBe(120);
  });

  it("a running rest ends when a set's stopwatch starts", () => {
    const { workoutId, bench, plank } = startPushDay();
    completeSet(bench.sets[0].id, BENCH, at(30));
    chooseRest(bench.sets[0].id, "timed", at(30));

    startSetTimer(plank.sets[0].id, at(90));

    expect(readWorkout(workoutId)[0].sets[0].restS).toBe(60);
  });

  it("only one rest runs at a time", () => {
    const { workoutId, bench } = startPushDay();
    completeSet(bench.sets[0].id, BENCH, at(30));
    chooseRest(bench.sets[0].id, "timed", at(30));
    const second = readWorkout(workoutId)[0].sets[1];
    completeSet(second.id, BENCH, at(100));

    chooseRest(second.id, "timed", at(100));

    const sets = readWorkout(workoutId)[0].sets;
    expect(sets[0].restS).toBe(70);
    expect(sets[1]).toMatchObject({ restStartedAt: at(100), restS: null });
  });

  it("stopping a rest that isn't running changes nothing", () => {
    const { workoutId, bench } = startPushDay();
    completeSet(bench.sets[0].id, BENCH, at(30));
    chooseRest(bench.sets[0].id, "none", at(30));

    endRest(bench.sets[0].id, at(90));

    expect(readWorkout(workoutId)[0].sets[0].restS).toBe(0);
  });
});

describe("set stopwatch", () => {
  it("a set done while its stopwatch runs lasts until then", () => {
    const { workoutId, plank } = startPushDay();
    startSetTimer(plank.sets[0].id, at(10));

    completeSet(
      plank.sets[0].id,
      { weightKg: null, reps: null, durationS: null, distanceM: null },
      at(55),
    );

    expect(readWorkout(workoutId)[1].sets[0]).toMatchObject({
      durationS: 45,
      startedAt: null,
      completedAt: at(55),
    });
  });
});

describe("startNextSetTimer", () => {
  it("starts the first set not done, and adds one when all are done", () => {
    const { workoutId, plank } = startPushDay();
    const none = {
      weightKg: null,
      reps: null,
      durationS: null,
      distanceM: null,
    };

    startNextSetTimer(plank.id, at(0));
    let sets = readWorkout(workoutId)[1].sets;
    expect(sets).toHaveLength(1);
    expect(sets[0].startedAt).toEqual(at(0));

    completeSet(sets[0].id, none, at(40));
    startNextSetTimer(plank.id, at(100));

    sets = readWorkout(workoutId)[1].sets;
    expect(sets).toHaveLength(2);
    expect(sets[0].durationS).toBe(40);
    expect(sets[1]).toMatchObject({ startedAt: at(100), completedAt: null });
  });
});

describe("deleteSet", () => {
  it("removes only that set, and new sets still go after the last one", () => {
    const { workoutId, bench } = startPushDay();
    completeSet(bench.sets[0].id, BENCH, at(30));
    chooseRest(bench.sets[0].id, "none", at(30));
    addSet(bench.id);
    const [first, second, third] = readWorkout(workoutId)[0].sets;

    deleteSet(second.id);
    addSet(bench.id);

    const sets = readWorkout(workoutId)[0].sets;
    expect(sets).toHaveLength(3);
    expect(sets.slice(0, 2).map((set) => set.id)).toEqual([first.id, third.id]);
  });
});

describe("previousSetsQuery", () => {
  it("reads the sets done the last time, from another finished workout", () => {
    const DAY = 24 * 60 * 60;
    const benchId = catalogId("bench_press");
    const routineId = createRoutine({ name: "Bench", exerciseIds: [benchId] });

    const older = startWorkout(routineId, at(DAY));
    const [olderBench] = readWorkout(older);
    completeSet(olderBench.sets[0].id, BENCH, at(DAY + 30));
    finishWorkout(older);

    const last = startWorkout(routineId, at(2 * DAY));
    const [lastBench] = readWorkout(last);
    completeSet(
      lastBench.sets[0].id,
      { ...BENCH, weightKg: 77.5, reps: 5 },
      at(2 * DAY + 30),
    );
    chooseRest(lastBench.sets[0].id, "none", at(2 * DAY + 30));
    const second = readWorkout(last)[0].sets[1];
    completeSet(
      second.id,
      { ...BENCH, weightKg: 80, reps: 3 },
      at(2 * DAY + 90),
    );
    addSet(lastBench.id);
    finishWorkout(last);

    const current = startWorkout(routineId, at(3 * DAY));

    expect(previousSetsQuery(benchId, current).all()).toEqual([
      { ...BENCH, weightKg: 77.5, reps: 5 },
      { ...BENCH, weightKg: 80, reps: 3 },
    ]);
  });
});

describe("addWorkoutExercises", () => {
  it("adds them after the routine's, each with one empty set", () => {
    const { workoutId } = startPushDay();
    const added = [catalogId("dip"), catalogId("pull_up")];

    const ids = addWorkoutExercises(workoutId, added);

    const all = readWorkout(workoutId);
    expect(all.map((exercise) => exercise.exerciseId).slice(2)).toEqual(added);
    expect(all.slice(2).map((exercise) => exercise.id)).toEqual(ids);
    expect(all[3].sets).toHaveLength(1);
  });
});

describe("discardWorkout", () => {
  it("deletes the workout with everything logged in it", () => {
    const { workoutId, bench } = startPushDay();
    completeSet(bench.sets[0].id, BENCH, at(30));

    discardWorkout(workoutId);

    expect(readWorkoutRow(workoutId)).toBeUndefined();
    expect(readWorkout(workoutId)).toEqual([]);
  });
});

describe("toWorkoutHistory", () => {
  it("groups each workout's done sets by exercise, in order", () => {
    const workout = { name: "Push", startedAt: START, endedAt: null };
    const row = (workoutExerciseId: string, reps: number) => ({
      ...BENCH,
      reps,
      workoutId: "w1",
      workoutExerciseId,
      exerciseId: `exercise-${workoutExerciseId}`,
    });
    const [first, second] = toWorkoutHistory(
      [
        { ...workout, id: "w1" },
        { ...workout, id: "w2" },
      ],
      [row("a", 10), row("a", 8), row("b", 12)],
    );

    expect(first.setCount).toBe(3);
    expect(
      first.exercises.map((exercise) => [
        exercise.exerciseId,
        exercise.sets.map((set) => set.reps),
      ]),
    ).toEqual([
      ["exercise-a", [10, 8]],
      ["exercise-b", [12]],
    ]);
    expect(second).toMatchObject({ exercises: [], setCount: 0 });
  });
});

describe("finishWorkout", () => {
  it("keeps only what was done and ends with the last set", () => {
    const { workoutId, bench } = startPushDay();
    completeSet(bench.sets[0].id, BENCH, at(30));
    chooseRest(bench.sets[0].id, "timed", at(30));
    const second = readWorkout(workoutId)[0].sets[1];
    completeSet(second.id, BENCH, at(150));
    chooseRest(second.id, "timed", at(150));

    expect(finishWorkout(workoutId)).toBe("finished");

    const remaining = readWorkout(workoutId);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].sets).toHaveLength(2);
    expect(remaining[0].sets[0].restS).toBe(120);
    // The rest after the last set never ended, so it isn't kept.
    expect(remaining[0].sets[1]).toMatchObject({
      restStartedAt: null,
      restS: null,
    });
    expect(readWorkoutRow(workoutId)?.endedAt).toEqual(at(150));
  });

  it("discards a workout with nothing done", () => {
    const { workoutId } = startPushDay();

    expect(finishWorkout(workoutId)).toBe("discarded");

    expect(readWorkoutRow(workoutId)).toBeUndefined();
    expect(readWorkout(workoutId)).toEqual([]);
  });
});

describe("toWorkoutExercises", () => {
  it("hands each exercise its sets and keeps exercises without sets", () => {
    const set = {
      ...BENCH,
      startedAt: null,
      completedAt: null,
      restStartedAt: null,
      restS: null,
    };
    const result = toWorkoutExercises(
      [
        { id: "a", exerciseId: "bench" },
        { id: "b", exerciseId: "dip" },
      ],
      [
        { ...set, id: "s1", workoutExerciseId: "a" },
        { ...set, id: "s2", workoutExerciseId: "a" },
      ],
    );

    expect(result.map((exercise) => exercise.sets.map((s) => s.id))).toEqual([
      ["s1", "s2"],
      [],
    ]);
  });
});
