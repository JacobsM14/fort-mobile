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
  countExercisesByDay,
  dailyExerciseRowsQuery,
  deleteSet,
  deleteWorkoutExercise,
  discardWorkout,
  discardWorkoutIfEmpty,
  doneSetsQuery,
  endRest,
  finishWorkout,
  firstWorkoutStartQuery,
  logWorkout,
  pauseSetTimer,
  previousSetsQuery,
  resetSetTimer,
  startNextSetTimer,
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

describe("logWorkout", () => {
  it("creates the routine's workout already finished, with empty sets", () => {
    const routineId = createRoutine({
      name: "Legs",
      exerciseIds: [catalogId("bench_press")],
    });

    const workoutId = logWorkout(routineId, START);

    const workout = readWorkoutRow(workoutId);
    expect(workout?.name).toBe("Legs");
    expect(workout?.startedAt).toEqual(START);
    expect(workout?.endedAt).toEqual(START);
    const [bench] = readWorkout(workoutId);
    expect(bench.sets).toHaveLength(1);
    expect(bench.sets[0].completedAt).toBeNull();
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

  it("takes the values it is given over the previous set's", () => {
    const { workoutId, plank } = startPushDay();
    updateSetValues(plank.sets[0].id, { ...BENCH, durationS: 45 });

    addSet(plank.id, { durationS: null });

    expect(readWorkout(workoutId)[1].sets[1]).toMatchObject({
      ...BENCH,
      durationS: null,
      completedAt: null,
    });
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

    startNextSetTimer(plank.id, at(90));

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
    startNextSetTimer(plank.id, at(10));

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
    // The new set counts from zero instead of inheriting the 40 s.
    expect(sets[1]).toMatchObject({
      durationS: null,
      startedAt: at(100),
      completedAt: null,
    });
  });

  it("starting another stopwatch pauses the running one, keeping its time", () => {
    const { workoutId, plank } = startPushDay();
    const [run] = addWorkoutExercises(workoutId, [catalogId("plank")]);
    startNextSetTimer(plank.id, at(0));

    startNextSetTimer(run, at(30));

    const [, first, second] = readWorkout(workoutId);
    expect(first.sets[0]).toMatchObject({ durationS: 30, startedAt: null });
    expect(second.sets[0].startedAt).toEqual(at(30));
  });
});

describe("pausing and resetting a stopwatch", () => {
  const none = { weightKg: null, reps: null, durationS: null, distanceM: null };

  it("resuming continues the same set, adding up its time", () => {
    const { workoutId, plank } = startPushDay();
    startNextSetTimer(plank.id, at(0));

    pauseSetTimer(plank.sets[0].id, at(30));
    expect(readWorkout(workoutId)[1].sets[0]).toMatchObject({
      durationS: 30,
      startedAt: null,
    });

    startNextSetTimer(plank.id, at(100));
    completeSet(plank.sets[0].id, none, at(120));

    const sets = readWorkout(workoutId)[1].sets;
    expect(sets).toHaveLength(1);
    expect(sets[0]).toMatchObject({ durationS: 50, completedAt: at(120) });
  });

  it("pausing a stopwatch that isn't running changes nothing", () => {
    const { workoutId, plank } = startPushDay();
    startNextSetTimer(plank.id, at(0));
    pauseSetTimer(plank.sets[0].id, at(30));

    pauseSetTimer(plank.sets[0].id, at(90));

    expect(readWorkout(workoutId)[1].sets[0].durationS).toBe(30);
  });

  it("resetting drops the time without saving a set", () => {
    const { workoutId, plank } = startPushDay();
    startNextSetTimer(plank.id, at(0));
    pauseSetTimer(plank.sets[0].id, at(30));

    resetSetTimer(plank.sets[0].id);

    expect(readWorkout(workoutId)[1].sets[0]).toMatchObject({
      durationS: null,
      startedAt: null,
      completedAt: null,
    });
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

  it("skips a later time with nothing done, like a workout logged empty", () => {
    const DAY = 24 * 60 * 60;
    const benchId = catalogId("bench_press");
    const routineId = createRoutine({ name: "Bench", exerciseIds: [benchId] });

    const done = startWorkout(routineId, at(4 * DAY));
    const [doneBench] = readWorkout(done);
    completeSet(
      doneBench.sets[0].id,
      { ...BENCH, weightKg: 82.5, reps: 4 },
      at(4 * DAY + 30),
    );
    finishWorkout(done);
    // Logged afterwards from the history, its set never filled in.
    logWorkout(routineId, at(5 * DAY));

    const current = startWorkout(routineId, at(6 * DAY));

    expect(previousSetsQuery(benchId, current).all()).toEqual([
      { ...BENCH, weightKg: 82.5, reps: 4 },
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

describe("discardWorkoutIfEmpty", () => {
  function logLegDay() {
    const routineId = createRoutine({
      name: "Legs",
      exerciseIds: [catalogId("bench_press")],
    });
    const workoutId = logWorkout(routineId, START);
    const [bench] = readWorkout(workoutId);
    return { workoutId, bench };
  }

  it("discards a logged workout left with nothing done", () => {
    const { workoutId } = logLegDay();

    expect(discardWorkoutIfEmpty(workoutId)).toBe(true);
    expect(readWorkoutRow(workoutId)).toBeUndefined();
    expect(readWorkout(workoutId)).toEqual([]);
  });

  it("keeps a finished workout with a set done", () => {
    const { workoutId, bench } = logLegDay();
    completeSet(bench.sets[0].id, BENCH, at(30));

    expect(discardWorkoutIfEmpty(workoutId)).toBe(false);
    expect(readWorkoutRow(workoutId)).toBeDefined();
  });

  it("never touches the workout in progress", () => {
    const { workoutId } = startPushDay();

    expect(discardWorkoutIfEmpty(workoutId)).toBe(false);
    expect(readWorkoutRow(workoutId)).toBeDefined();
  });

  it("does nothing for a workout that no longer exists", () => {
    expect(discardWorkoutIfEmpty("missing")).toBe(false);
  });
});

describe("deleteWorkoutExercise", () => {
  it("removes the exercise with its sets and keeps the others", () => {
    const { workoutId, bench, plank } = startPushDay();
    completeSet(bench.sets[0].id, BENCH, at(30));

    deleteWorkoutExercise(bench.id);

    expect(readWorkout(workoutId).map((exercise) => exercise.id)).toEqual([
      plank.id,
    ]);
    expect(
      db
        .select()
        .from(workoutSets)
        .where(eq(workoutSets.workoutExerciseId, bench.id))
        .all(),
    ).toEqual([]);
  });
});

describe("doneSetsQuery", () => {
  it("reads only the done sets of the workouts started in the range", () => {
    const benchId = catalogId("bench_press");
    const routineId = createRoutine({ name: "Bench", exerciseIds: [benchId] });
    const inside = logWorkout(routineId, new Date(2031, 2, 10, 10));
    const outside = logWorkout(routineId, new Date(2031, 2, 11, 10));
    for (const workoutId of [inside, outside]) {
      completeSet(readWorkout(workoutId)[0].sets[0].id, BENCH);
    }

    const rows = doneSetsQuery({
      from: new Date(2031, 2, 10),
      to: new Date(2031, 2, 11),
    }).all();

    expect(rows.map((row) => row.workoutId)).toEqual([inside]);
  });
});

describe("firstWorkoutStartQuery", () => {
  it("reads when the earliest workout started, as a date", () => {
    const routineId = createRoutine({
      name: "Old",
      exerciseIds: [catalogId("bench_press")],
    });
    const earliest = new Date(2001, 0, 1, 9);
    logWorkout(routineId, new Date(2001, 5, 1, 9));
    logWorkout(routineId, earliest);

    const [row] = firstWorkoutStartQuery().all();

    expect(row.startedAt).toEqual(earliest);
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

describe("countExercisesByDay", () => {
  it("counts the rows of each day", () => {
    const rows = [
      { startedAt: at(0) },
      { startedAt: at(60) },
      { startedAt: at(24 * 60 * 60) },
    ];
    expect(countExercisesByDay(rows)).toEqual(
      new Map([
        [at(0).toDateString(), 2],
        [at(24 * 60 * 60).toDateString(), 1],
      ]),
    );
  });
});

describe("dailyExerciseRowsQuery", () => {
  // A day no other test uses: the database is shared by the whole file.
  const DAY = new Date(2030, 0, 15, 10, 0, 0);

  function onDay(seconds: number) {
    return new Date(DAY.getTime() + seconds * 1000);
  }

  it("returns one row per exercise with a set done in the range", () => {
    const benchId = catalogId("bench_press");
    const routineId = createRoutine({ name: "Bench", exerciseIds: [benchId] });
    const workoutId = startWorkout(routineId, onDay(0));
    const [bench] = readWorkout(workoutId);
    completeSet(bench.sets[0].id, BENCH, onDay(30));
    addSet(bench.id);
    completeSet(readWorkout(workoutId)[0].sets[1].id, BENCH, onDay(90));

    const rows = dailyExerciseRowsQuery(
      new Date(2030, 0, 15),
      new Date(2030, 0, 16),
    ).all();

    expect(rows).toEqual([
      { startedAt: onDay(0), workoutExerciseId: bench.id },
    ]);
  });

  // Each test below uses its own days so the shared database doesn't mix them.
  function benchWorkout(startedAt: Date, done: boolean) {
    const benchId = catalogId("bench_press");
    const routineId = createRoutine({ name: "Bench", exerciseIds: [benchId] });
    const workoutId = startWorkout(routineId, startedAt);
    const [bench] = readWorkout(workoutId);
    if (done) {
      completeSet(
        bench.sets[0].id,
        BENCH,
        new Date(startedAt.getTime() + 30_000),
      );
    }
    return bench.id;
  }

  it("ignores exercises with no set done", () => {
    benchWorkout(new Date(2030, 0, 20, 10), false);

    const rows = dailyExerciseRowsQuery(
      new Date(2030, 0, 20),
      new Date(2030, 0, 21),
    ).all();

    expect(rows).toEqual([]);
  });

  it("includes the start of the range and leaves out its end", () => {
    const from = new Date(2030, 0, 25, 10);
    const to = new Date(2030, 0, 26, 10);
    const atStart = benchWorkout(from, true);
    benchWorkout(to, true);
    benchWorkout(new Date(2030, 0, 24, 9), true);

    const rows = dailyExerciseRowsQuery(from, to).all();

    expect(rows).toEqual([{ startedAt: from, workoutExerciseId: atStart }]);
  });

  it("returns the exercises of every workout on the same day", () => {
    const first = benchWorkout(new Date(2030, 0, 30, 8), true);
    const second = benchWorkout(new Date(2030, 0, 30, 18), true);

    const rows = dailyExerciseRowsQuery(
      new Date(2030, 0, 30),
      new Date(2030, 0, 31),
    ).all();

    expect(rows.map((row) => row.workoutExerciseId).sort()).toEqual(
      [first, second].sort(),
    );
    expect(countExercisesByDay(rows)).toEqual(
      new Map([[new Date(2030, 0, 30).toDateString(), 2]]),
    );
  });
});
