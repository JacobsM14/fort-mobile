import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  inArray,
  isNotNull,
  isNull,
  lt,
  max,
  ne,
  notInArray,
} from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import { newId } from "@/db/id";
import {
  routineExercises,
  routines,
  workoutExercises,
  workoutSets,
  workouts,
} from "@/db/schema";

export type SetValues = {
  weightKg: number | null;
  reps: number | null;
  durationS: number | null;
  distanceM: number | null;
};

export type WorkoutSet = SetValues & {
  id: string;
  startedAt: Date | null;
  completedAt: Date | null;
  restStartedAt: Date | null;
  restS: number | null;
};

export type WorkoutExercise = {
  // The workout_exercises row, not the exercise.
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
};

export type RestChoice = "timed" | "none";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

// Whole seconds, like the live stopwatches show, so a time doesn't change by
// a second when it's saved.
function secondsBetween(from: Date, to: Date) {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / 1000));
}

// A set's stopwatch can be paused and resumed: durationS holds the time
// before the current run, which started at startedAt.
function accumulatedSeconds(
  durationS: number | null,
  startedAt: Date,
  now: Date,
) {
  return (durationS ?? 0) + secondsBetween(startedAt, now);
}

// Only these four columns: a whole set passed as SetValues would otherwise
// write its id, timestamps and rest too.
function pickSetValues(values: SetValues): SetValues {
  return {
    weightKg: values.weightKg,
    reps: values.reps,
    durationS: values.durationS,
    distanceM: values.distanceM,
  };
}

function getSetContext(tx: Transaction, setId: string) {
  return tx
    .select({
      workoutId: workoutExercises.workoutId,
      workoutExerciseId: workoutSets.workoutExerciseId,
      position: workoutSets.position,
      durationS: workoutSets.durationS,
      startedAt: workoutSets.startedAt,
      restStartedAt: workoutSets.restStartedAt,
      restS: workoutSets.restS,
    })
    .from(workoutSets)
    .innerJoin(
      workoutExercises,
      eq(workoutExercises.id, workoutSets.workoutExerciseId),
    )
    .where(eq(workoutSets.id, setId))
    .get();
}

function workoutExerciseIds(tx: Transaction, workoutId: string) {
  return tx
    .select({ id: workoutExercises.id })
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, workoutId));
}

// Only one rest runs at a time: starting another one, or doing a set, ends it.
function endRunningRests(tx: Transaction, workoutId: string, now: Date) {
  const running = tx
    .select({ id: workoutSets.id, restStartedAt: workoutSets.restStartedAt })
    .from(workoutSets)
    .where(
      and(
        inArray(
          workoutSets.workoutExerciseId,
          workoutExerciseIds(tx, workoutId),
        ),
        isNotNull(workoutSets.restStartedAt),
        isNull(workoutSets.restS),
      ),
    )
    .all();
  for (const { id, restStartedAt } of running) {
    if (restStartedAt !== null) {
      tx.update(workoutSets)
        .set({ restS: secondsBetween(restStartedAt, now) })
        .where(eq(workoutSets.id, id))
        .run();
    }
  }
}

// Likewise, only one set's stopwatch runs at a time: starting another one
// pauses it, keeping its time.
function pauseRunningTimers(tx: Transaction, workoutId: string, now: Date) {
  const running = tx
    .select({
      id: workoutSets.id,
      durationS: workoutSets.durationS,
      startedAt: workoutSets.startedAt,
    })
    .from(workoutSets)
    .where(
      and(
        inArray(
          workoutSets.workoutExerciseId,
          workoutExerciseIds(tx, workoutId),
        ),
        isNotNull(workoutSets.startedAt),
        isNull(workoutSets.completedAt),
      ),
    )
    .all();
  for (const { id, durationS, startedAt } of running) {
    if (startedAt !== null) {
      tx.update(workoutSets)
        .set({
          durationS: accumulatedSeconds(durationS, startedAt, now),
          startedAt: null,
        })
        .where(eq(workoutSets.id, id))
        .run();
    }
  }
}

// New sets start with the previous set's values, which is usually what the
// next one repeats.
function appendSet(
  tx: Transaction,
  workoutExerciseId: string,
  overrides: Partial<SetValues> = {},
) {
  const last = tx
    .select({
      position: workoutSets.position,
      weightKg: workoutSets.weightKg,
      reps: workoutSets.reps,
      durationS: workoutSets.durationS,
      distanceM: workoutSets.distanceM,
    })
    .from(workoutSets)
    .where(eq(workoutSets.workoutExerciseId, workoutExerciseId))
    .orderBy(desc(workoutSets.position))
    .limit(1)
    .get();

  const id = newId();
  tx.insert(workoutSets)
    .values(
      last === undefined
        ? { id, workoutExerciseId, position: 0 }
        : {
            ...last,
            ...overrides,
            id,
            workoutExerciseId,
            position: last.position + 1,
          },
    )
    .run();
  return id;
}

function startTimer(
  tx: Transaction,
  setId: string,
  workoutId: string,
  now: Date,
) {
  endRunningRests(tx, workoutId, now);
  pauseRunningTimers(tx, workoutId, now);
  tx.update(workoutSets)
    .set({ startedAt: now })
    .where(eq(workoutSets.id, setId))
    .run();
}

// Each exercise starts with one empty set.
function insertWorkoutExercises(
  tx: Transaction,
  workoutId: string,
  exerciseIds: readonly string[],
  firstPosition: number,
) {
  const rows = exerciseIds.map((exerciseId, index) => ({
    id: newId(),
    workoutId,
    exerciseId,
    position: firstPosition + index,
  }));
  if (rows.length > 0) {
    tx.insert(workoutExercises).values(rows).run();
    tx.insert(workoutSets)
      .values(
        rows.map((row) => ({
          id: newId(),
          workoutExerciseId: row.id,
          position: 0,
        })),
      )
      .run();
  }
  return rows.map((row) => row.id);
}

export function startWorkout(routineId: string, now = new Date()) {
  const workoutId = newId();
  db.transaction((tx) => {
    const routine = tx
      .select({ name: routines.name })
      .from(routines)
      .where(eq(routines.id, routineId))
      .get();
    if (routine === undefined) {
      throw new Error(`Routine ${routineId} not found`);
    }
    const exerciseIds = tx
      .select({ exerciseId: routineExercises.exerciseId })
      .from(routineExercises)
      .where(eq(routineExercises.routineId, routineId))
      .orderBy(asc(routineExercises.position))
      .all()
      .map((row) => row.exerciseId);

    // The name is copied so the workout keeps it if the routine is renamed
    // or deleted later.
    tx.insert(workouts)
      .values({ id: workoutId, routineId, name: routine.name, startedAt: now })
      .run();
    insertWorkoutExercises(tx, workoutId, exerciseIds, 0);
  });
  return workoutId;
}

// Extra exercises go only into this workout; the routine doesn't change.
export function addWorkoutExercises(
  workoutId: string,
  exerciseIds: readonly string[],
) {
  return db.transaction((tx) => {
    const last = tx
      .select({ position: max(workoutExercises.position) })
      .from(workoutExercises)
      .where(eq(workoutExercises.workoutId, workoutId))
      .get();
    const firstPosition = (last?.position ?? -1) + 1;
    return insertWorkoutExercises(tx, workoutId, exerciseIds, firstPosition);
  });
}

export function addSet(workoutExerciseId: string) {
  db.transaction((tx) => {
    appendSet(tx, workoutExerciseId);
  });
}

export function updateSetValues(setId: string, values: SetValues) {
  db.update(workoutSets)
    .set(pickSetValues(values))
    .where(eq(workoutSets.id, setId))
    .run();
}

export function completeSet(
  setId: string,
  values: SetValues,
  now = new Date(),
) {
  db.transaction((tx) => {
    const set = getSetContext(tx, setId);
    if (set === undefined) {
      return;
    }
    endRunningRests(tx, set.workoutId, now);
    tx.update(workoutSets)
      .set({
        ...pickSetValues(values),
        // A set finished with its stopwatch running lasts until now.
        durationS:
          set.startedAt === null
            ? values.durationS
            : accumulatedSeconds(set.durationS, set.startedAt, now),
        startedAt: null,
        completedAt: now,
      })
      .where(eq(workoutSets.id, setId))
      .run();
  });
}

// The rest after it goes with it. The other sets keep their positions; they
// are only ever read in order.
export function deleteSet(setId: string) {
  db.delete(workoutSets).where(eq(workoutSets.id, setId)).run();
}

// Timed and distance exercises run from one stopwatch instead of rows: it
// starts (or resumes) the first set not done yet, adding one when all are
// done.
export function startNextSetTimer(workoutExerciseId: string, now = new Date()) {
  db.transaction((tx) => {
    const pending = tx
      .select({ id: workoutSets.id, workoutId: workoutExercises.workoutId })
      .from(workoutSets)
      .innerJoin(
        workoutExercises,
        eq(workoutExercises.id, workoutSets.workoutExerciseId),
      )
      .where(
        and(
          eq(workoutSets.workoutExerciseId, workoutExerciseId),
          isNull(workoutSets.completedAt),
        ),
      )
      .orderBy(asc(workoutSets.position))
      .limit(1)
      .get();
    if (pending !== undefined) {
      startTimer(tx, pending.id, pending.workoutId, now);
      return;
    }
    const exercise = tx
      .select({ workoutId: workoutExercises.workoutId })
      .from(workoutExercises)
      .where(eq(workoutExercises.id, workoutExerciseId))
      .get();
    if (exercise !== undefined) {
      // Its time is counted from zero; an inherited one would count as
      // already run.
      const setId = appendSet(tx, workoutExerciseId, { durationS: null });
      startTimer(tx, setId, exercise.workoutId, now);
    }
  });
}

export function pauseSetTimer(setId: string, now = new Date()) {
  db.transaction((tx) => {
    const set = getSetContext(tx, setId);
    if (set === undefined || set.startedAt === null) {
      return;
    }
    tx.update(workoutSets)
      .set({
        durationS: accumulatedSeconds(set.durationS, set.startedAt, now),
        startedAt: null,
      })
      .where(eq(workoutSets.id, setId))
      .run();
  });
}

// Drops the time run so far without saving a set.
export function resetSetTimer(setId: string) {
  db.update(workoutSets)
    .set({ durationS: null, startedAt: null })
    .where(and(eq(workoutSets.id, setId), isNull(workoutSets.completedAt)))
    .run();
}

// Both choices bring up the next set right away, so it can be adjusted while
// resting.
export function chooseRest(
  setId: string,
  choice: RestChoice,
  now = new Date(),
) {
  db.transaction((tx) => {
    const set = getSetContext(tx, setId);
    if (set === undefined) {
      return;
    }
    endRunningRests(tx, set.workoutId, now);
    tx.update(workoutSets)
      .set(
        choice === "timed"
          ? { restStartedAt: now, restS: null }
          : { restStartedAt: null, restS: 0 },
      )
      .where(eq(workoutSets.id, setId))
      .run();

    const next = tx
      .select({ id: workoutSets.id })
      .from(workoutSets)
      .where(
        and(
          eq(workoutSets.workoutExerciseId, set.workoutExerciseId),
          gt(workoutSets.position, set.position),
        ),
      )
      .limit(1)
      .get();
    if (next === undefined) {
      appendSet(tx, set.workoutExerciseId);
    }
  });
}

export function endRest(setId: string, now = new Date()) {
  db.transaction((tx) => {
    const set = getSetContext(tx, setId);
    if (set === undefined || set.restStartedAt === null || set.restS !== null) {
      return;
    }
    tx.update(workoutSets)
      .set({ restS: secondsBetween(set.restStartedAt, now) })
      .where(eq(workoutSets.id, setId))
      .run();
  });
}

// Keeps only what was done: sets not marked and exercises left without sets
// are removed, and a workout with nothing done is discarded.
export function finishWorkout(workoutId: string): "finished" | "discarded" {
  return db.transaction((tx) => {
    const exerciseIds = workoutExerciseIds(tx, workoutId);
    // A rest still running came after the last set, not between two.
    tx.update(workoutSets)
      .set({ restStartedAt: null })
      .where(
        and(
          inArray(workoutSets.workoutExerciseId, exerciseIds),
          isNotNull(workoutSets.restStartedAt),
          isNull(workoutSets.restS),
        ),
      )
      .run();
    tx.delete(workoutSets)
      .where(
        and(
          inArray(workoutSets.workoutExerciseId, exerciseIds),
          isNull(workoutSets.completedAt),
        ),
      )
      .run();

    const done = tx
      .select({
        workoutExerciseId: workoutSets.workoutExerciseId,
        completedAt: workoutSets.completedAt,
      })
      .from(workoutSets)
      .where(inArray(workoutSets.workoutExerciseId, exerciseIds))
      .all();
    if (done.length === 0) {
      tx.delete(workouts).where(eq(workouts.id, workoutId)).run();
      return "discarded";
    }

    const doneExerciseIds = [
      ...new Set(done.map((row) => row.workoutExerciseId)),
    ];
    tx.delete(workoutExercises)
      .where(
        and(
          eq(workoutExercises.workoutId, workoutId),
          notInArray(workoutExercises.id, doneExerciseIds),
        ),
      )
      .run();

    // It ends with its last set, so a workout finished the next day (from
    // Today) keeps its real length.
    const endedAt = Math.max(
      ...done.map((row) => row.completedAt?.getTime() ?? 0),
    );
    tx.update(workouts)
      .set({ endedAt: new Date(endedAt) })
      .where(eq(workouts.id, workoutId))
      .run();
    return "finished";
  });
}

// Cancelling a workout: everything logged in it goes (its exercises and sets
// cascade).
export function discardWorkout(workoutId: string) {
  db.delete(workouts).where(eq(workouts.id, workoutId)).run();
}

export type WorkoutExerciseRow = { id: string; exerciseId: string };

export type WorkoutSetRow = WorkoutSet & { workoutExerciseId: string };

// The sets come from their own query (see useWorkout); this hands each
// exercise its sets, in order.
export function toWorkoutExercises(
  exercises: readonly WorkoutExerciseRow[],
  sets: readonly WorkoutSetRow[],
): WorkoutExercise[] {
  const setsByExercise = new Map<string, WorkoutSet[]>();
  for (const { workoutExerciseId, ...set } of sets) {
    const exerciseSets = setsByExercise.get(workoutExerciseId) ?? [];
    exerciseSets.push(set);
    setsByExercise.set(workoutExerciseId, exerciseSets);
  }
  return exercises.map((exercise) => ({
    ...exercise,
    sets: setsByExercise.get(exercise.id) ?? [],
  }));
}

// Three live queries because useLiveQuery only re-runs when the main table of
// its query changes.
export function useWorkout(id: string) {
  const workout = useLiveQuery(
    db
      .select({
        name: workouts.name,
        startedAt: workouts.startedAt,
        endedAt: workouts.endedAt,
      })
      .from(workouts)
      .where(eq(workouts.id, id)),
    [id],
  );
  const exercises = useLiveQuery(
    db
      .select({
        id: workoutExercises.id,
        exerciseId: workoutExercises.exerciseId,
      })
      .from(workoutExercises)
      .where(eq(workoutExercises.workoutId, id))
      .orderBy(asc(workoutExercises.position)),
    [id],
  );
  const sets = useLiveQuery(
    db
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
      .where(eq(workoutExercises.workoutId, id))
      .orderBy(asc(workoutSets.position)),
    [id],
  );

  return {
    workout: workout.data.at(0),
    exercises: toWorkoutExercises(exercises.data, sets.data),
    loaded:
      workout.updatedAt !== undefined &&
      exercises.updatedAt !== undefined &&
      sets.updatedAt !== undefined,
  };
}

export type WorkoutHistoryExercise = {
  // The workout_exercises row, not the exercise.
  id: string;
  exerciseId: string;
  sets: SetValues[];
};

export type WorkoutHistoryItem = {
  id: string;
  name: string | null;
  startedAt: Date;
  // null while in progress.
  endedAt: Date | null;
  // Only the exercises with a set done, each with its done sets in order.
  exercises: WorkoutHistoryExercise[];
  setCount: number;
};

export type WorkoutHistoryRow = {
  id: string;
  name: string | null;
  startedAt: Date;
  endedAt: Date | null;
};

export type DoneSetRow = SetValues & {
  workoutId: string;
  workoutExerciseId: string;
  exerciseId: string;
};

// The done sets come ordered by exercise and set position; this groups them
// per workout and exercise.
export function toWorkoutHistory(
  workoutRows: readonly WorkoutHistoryRow[],
  doneSets: readonly DoneSetRow[],
): WorkoutHistoryItem[] {
  // One pass over all the sets, so it stays fast as the history grows.
  const exercisesByWorkout = new Map<
    string,
    Map<string, WorkoutHistoryExercise>
  >();
  for (const {
    workoutId,
    workoutExerciseId,
    exerciseId,
    ...values
  } of doneSets) {
    const exercises =
      exercisesByWorkout.get(workoutId) ??
      new Map<string, WorkoutHistoryExercise>();
    const exercise = exercises.get(workoutExerciseId) ?? {
      id: workoutExerciseId,
      exerciseId,
      sets: [],
    };
    exercise.sets.push(values);
    exercises.set(workoutExerciseId, exercise);
    exercisesByWorkout.set(workoutId, exercises);
  }

  return workoutRows.map((workout) => {
    const exercises = [...(exercisesByWorkout.get(workout.id)?.values() ?? [])];
    return {
      ...workout,
      exercises,
      setCount: exercises.reduce(
        (count, exercise) => count + exercise.sets.length,
        0,
      ),
    };
  });
}

// Newest first. The done sets come from their own query so the workout in
// progress updates as sets are marked.
export function useWorkoutHistory() {
  const workoutRows = useLiveQuery(
    db
      .select({
        id: workouts.id,
        name: workouts.name,
        startedAt: workouts.startedAt,
        endedAt: workouts.endedAt,
      })
      .from(workouts)
      .orderBy(desc(workouts.startedAt)),
  );
  const doneSets = useLiveQuery(
    db
      .select({
        workoutId: workoutExercises.workoutId,
        workoutExerciseId: workoutSets.workoutExerciseId,
        exerciseId: workoutExercises.exerciseId,
        weightKg: workoutSets.weightKg,
        reps: workoutSets.reps,
        durationS: workoutSets.durationS,
        distanceM: workoutSets.distanceM,
      })
      .from(workoutSets)
      .innerJoin(
        workoutExercises,
        eq(workoutExercises.id, workoutSets.workoutExerciseId),
      )
      .where(isNotNull(workoutSets.completedAt))
      .orderBy(asc(workoutExercises.position), asc(workoutSets.position)),
  );

  return {
    workouts: toWorkoutHistory(workoutRows.data, doneSets.data),
    loaded:
      workoutRows.updatedAt !== undefined && doneSets.updatedAt !== undefined,
  };
}

// The days (as toDateString keys) between from and to with a workout that
// has a set done. Reads only that range, not the whole history.
export function useTrainedDays(from: Date, to: Date) {
  const { data } = useLiveQuery(
    db
      .selectDistinct({ startedAt: workouts.startedAt })
      .from(workoutSets)
      .innerJoin(
        workoutExercises,
        eq(workoutExercises.id, workoutSets.workoutExerciseId),
      )
      .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
      .where(
        and(
          isNotNull(workoutSets.completedAt),
          gte(workouts.startedAt, from),
          lt(workouts.startedAt, to),
        ),
      ),
    [from.getTime(), to.getTime()],
  );

  return new Set(data.map((row) => row.startedAt.toDateString()));
}

export function useDailyExerciseCounts(from: Date, to: Date) {
  const { data } = useLiveQuery(
    db
      .selectDistinct({
        startedAt: workouts.startedAt,
        workoutExerciseId: workoutExercises.id,
      })
      .from(workoutSets)
      .innerJoin(
        workoutExercises,
        eq(workoutExercises.id, workoutSets.workoutExerciseId),
      )
      .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
      .where(
        and(
          isNotNull(workoutSets.completedAt),
          gte(workouts.startedAt, from),
          lt(workouts.startedAt, to),
        ),
      ),
    [from.getTime(), to.getTime()],
  );

  const counts = new Map<string, number>();
  for (const row of data) {
    const key = row.startedAt.toDateString();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

// The sets done for an exercise the last time it was in another finished
// workout, in order. Finishing removes exercises with nothing done, so that
// one always has sets.
export function previousSetsQuery(exerciseId: string, workoutId: string) {
  const lastTime = db
    .select({ id: workoutExercises.id })
    .from(workoutExercises)
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(
      and(
        eq(workoutExercises.exerciseId, exerciseId),
        ne(workouts.id, workoutId),
        isNotNull(workouts.endedAt),
      ),
    )
    .orderBy(desc(workouts.startedAt))
    .limit(1);
  return db
    .select({
      weightKg: workoutSets.weightKg,
      reps: workoutSets.reps,
      durationS: workoutSets.durationS,
      distanceM: workoutSets.distanceM,
    })
    .from(workoutSets)
    .where(
      and(
        inArray(workoutSets.workoutExerciseId, lastTime),
        isNotNull(workoutSets.completedAt),
      ),
    )
    .orderBy(asc(workoutSets.position));
}

export function usePreviousSets(
  exerciseId: string,
  workoutId: string,
): SetValues[] {
  const { data } = useLiveQuery(previousSetsQuery(exerciseId, workoutId), [
    exerciseId,
    workoutId,
  ]);
  return data;
}

// The workout started and not finished yet, if any.
export function useActiveWorkout() {
  const { data, updatedAt } = useLiveQuery(
    db
      .select({
        id: workouts.id,
        routineId: workouts.routineId,
        name: workouts.name,
      })
      .from(workouts)
      .where(isNull(workouts.endedAt))
      .orderBy(desc(workouts.startedAt))
      .limit(1),
  );

  return { activeWorkout: data.at(0), loaded: updatedAt !== undefined };
}
