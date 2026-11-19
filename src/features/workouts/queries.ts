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
  min,
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

import { elapsedSeconds } from "@/utils/duration";

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

// A set's stopwatch can be paused and resumed: durationS holds the time
// before the current run, which started at startedAt.
function accumulatedSeconds(
  durationS: number | null,
  startedAt: Date,
  now: Date,
) {
  return (durationS ?? 0) + elapsedSeconds(startedAt, now.getTime());
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
        .set({ restS: elapsedSeconds(restStartedAt, now.getTime()) })
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
  return createWorkout(routineId, now, null);
}

// A workout done on another day and not logged then: it is created already
// finished, so it never becomes the workout in progress, and its sets are
// filled in from the history.
export function logWorkout(routineId: string, startedAt: Date) {
  return createWorkout(routineId, startedAt, startedAt);
}

function createWorkout(
  routineId: string,
  startedAt: Date,
  endedAt: Date | null,
) {
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
      .values({
        id: workoutId,
        routineId,
        name: routine.name,
        startedAt,
        endedAt,
      })
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

export function addSet(
  workoutExerciseId: string,
  overrides: Partial<SetValues> = {},
) {
  db.transaction((tx) => {
    appendSet(tx, workoutExerciseId, overrides);
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
      .set({ restS: elapsedSeconds(set.restStartedAt, now.getTime()) })
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

    // Discard the workout if no sets were completed.
    if (done.length === 0) {
      tx.delete(workouts).where(eq(workouts.id, workoutId)).run();
      return "discarded";
    }

    const doneExerciseIds = [
      ...new Set(done.map((row) => row.workoutExerciseId)),
    ];
    // Remove exercises that have no completed sets.
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

// The rule finishWorkout follows, for a finished workout left from the
// history with nothing done (one logged and never filled in, for one). The
// workout in progress is never touched. Returns whether it was discarded.
export function discardWorkoutIfEmpty(workoutId: string) {
  return db.transaction((tx) => {
    const workout = tx
      .select({ endedAt: workouts.endedAt })
      .from(workouts)
      .where(eq(workouts.id, workoutId))
      .get();
    if (workout === undefined || workout.endedAt === null) {
      return false;
    }
    const doneSet = tx
      .select({ id: workoutSets.id })
      .from(workoutSets)
      .where(
        and(
          inArray(
            workoutSets.workoutExerciseId,
            workoutExerciseIds(tx, workoutId),
          ),
          isNotNull(workoutSets.completedAt),
        ),
      )
      .limit(1)
      .get();
    if (doneSet !== undefined) {
      return false;
    }
    tx.delete(workouts).where(eq(workouts.id, workoutId)).run();
    return true;
  });
}

// Its sets go with it (cascade).
export function deleteWorkoutExercise(workoutExerciseId: string) {
  db.delete(workoutExercises)
    .where(eq(workoutExercises.id, workoutExerciseId))
    .run();
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
  id: string;
  exerciseId: string;
  sets: SetValues[];
};

export type WorkoutHistoryItem = {
  id: string;
  name: string | null;
  startedAt: Date;
  endedAt: Date | null;
  exercises: WorkoutHistoryExercise[];
  setCount: number;
};

export type FinishedWorkoutHistoryItem = WorkoutHistoryItem & { endedAt: Date };

export function isFinishedWorkout(
  workout: WorkoutHistoryItem,
): workout is FinishedWorkoutHistoryItem {
  return workout.endedAt !== null;
}

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

// The sets done, in order, of every workout or only of those started within
// a range, so a single day doesn't read the whole history.
export function doneSetsQuery(range?: { from: Date; to: Date }) {
  return db
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
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(
      and(
        isNotNull(workoutSets.completedAt),
        range === undefined ? undefined : gte(workouts.startedAt, range.from),
        range === undefined ? undefined : lt(workouts.startedAt, range.to),
      ),
    )
    .orderBy(asc(workoutExercises.position), asc(workoutSets.position));
}

// Newest first, all of them or only those started within a range. The done
// sets come from their own query so the workout in progress updates as sets
// are marked.
export function useWorkoutHistory(range?: { from: Date; to: Date }) {
  const workoutRows = useLiveQuery(
    db
      .select({
        id: workouts.id,
        name: workouts.name,
        startedAt: workouts.startedAt,
        endedAt: workouts.endedAt,
      })
      .from(workouts)
      .where(
        range === undefined
          ? undefined
          : and(
              gte(workouts.startedAt, range.from),
              lt(workouts.startedAt, range.to),
            ),
      )
      .orderBy(desc(workouts.startedAt)),
    [range?.from.getTime(), range?.to.getTime()],
  );
  const doneSets = useLiveQuery(doneSetsQuery(range), [
    range?.from.getTime(),
    range?.to.getTime(),
  ]);

  return {
    workouts: toWorkoutHistory(workoutRows.data, doneSets.data),
    loaded:
      workoutRows.updatedAt !== undefined && doneSets.updatedAt !== undefined,
  };
}

// The sets done for an exercise the last time it was in another finished
// workout, in order. Only a time with a set done counts: a workout logged from
// the history, or corrected there, can keep the exercise with nothing done.
export function previousSetsQuery(exerciseId: string, workoutId: string) {
  const lastTime = db
    .select({ id: workoutExercises.id })
    .from(workoutExercises)
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .innerJoin(
      workoutSets,
      and(
        eq(workoutSets.workoutExerciseId, workoutExercises.id),
        isNotNull(workoutSets.completedAt),
      ),
    )
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

// When the first workout started; undefined while there is none. Tells the
// history how far back it can go.
export function firstWorkoutStartQuery() {
  return db.select({ startedAt: min(workouts.startedAt) }).from(workouts);
}

export function useFirstWorkoutStart() {
  const { data, updatedAt } = useLiveQuery(firstWorkoutStartQuery());

  return {
    firstWorkoutStart: data.at(0)?.startedAt ?? undefined,
    loaded: updatedAt !== undefined,
  };
}

// A row per exercise with a set done, with the day its workout started, for
// workouts started between from and to. Reads only that range.
export function dailyExerciseRowsQuery(from: Date, to: Date) {
  return db
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
    );
}

export function countExercisesByDay(rows: { startedAt: Date }[]) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = row.startedAt.toDateString();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

// The exercises done each day, by toDateString key. A day with nothing done
// has no entry, so it also tells which days were trained.
export function useDailyExerciseCounts(from: Date, to: Date) {
  const { data } = useLiveQuery(dailyExerciseRowsQuery(from, to), [
    from.getTime(),
    to.getTime(),
  ]);

  return countExercisesByDay(data);
}
