import { eq, getTableColumns, isNotNull, isNull, sql } from "drizzle-orm";

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
import { isMuscleId } from "@/features/exercises/catalog";
import { loadUserProfile } from "@/features/settings/user-profile";

import {
  BACKUP_FORMAT_VERSION,
  type BackupBodyWeight,
  type BackupExercise,
  type BackupExerciseRef,
  type BackupFile,
  type BackupRoutine,
  type BackupWorkout,
} from "./backup";

import type { SQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";

import { groupBy } from "@/utils/array";
import { fromIso, fromIsoOrNull, toIso, toIsoOrNull } from "@/utils/date";

// Maps an exercise id to its reference in the file.
function makeExerciseRef(): (exerciseId: string) => BackupExerciseRef {
  const rows = db
    .select({ id: exercises.id, key: exercises.key })
    .from(exercises)
    .all();
  const keyById = new Map(rows.map((row) => [row.id, row.key]));

  return (exerciseId) => {
    const key = keyById.get(exerciseId);
    return key ? { key } : { id: exerciseId };
  };
}

function readCustomExercises(): BackupExercise[] {
  const customExercises = db
    .select({
      id: exercises.id,
      name: exercises.name,
      description: exercises.description,
      equipment: exercises.equipment,
      trackingType: exercises.trackingType,
      archivedAt: exercises.archivedAt,
      createdAt: exercises.createdAt,
      updatedAt: exercises.updatedAt,
    })
    .from(exercises)
    .where(isNull(exercises.key))
    .orderBy(exercises.createdAt)
    .all();

  // Rowid order is insertion order, which keeps each exercise's main muscle
  // first (the same order syncCatalog relies on).
  const muscleRows = db
    .select({
      exerciseId: exerciseMuscles.exerciseId,
      muscleId: exerciseMuscles.muscleId,
      role: exerciseMuscles.role,
    })
    .from(exerciseMuscles)
    .innerJoin(exercises, eq(exercises.id, exerciseMuscles.exerciseId))
    .where(isNull(exercises.key))
    .orderBy(sql`${exerciseMuscles}.rowid`)
    .all();
  const musclesByExercise = groupBy(
    muscleRows.flatMap((row) =>
      isMuscleId(row.muscleId)
        ? [
            {
              exerciseId: row.exerciseId,
              muscleId: row.muscleId,
              role: row.role,
            },
          ]
        : [],
    ),
    (row) => row.exerciseId,
  );

  return customExercises.flatMap((row) =>
    row.name === null
      ? []
      : [
          {
            id: row.id,
            name: row.name,
            description: row.description,
            equipment: row.equipment,
            trackingType: row.trackingType,
            archivedAt: toIsoOrNull(row.archivedAt),
            muscles: (musclesByExercise.get(row.id) ?? []).map((muscle) => ({
              muscleId: muscle.muscleId,
              role: muscle.role,
            })),
            createdAt: toIso(row.createdAt),
            updatedAt: toIso(row.updatedAt),
          },
        ],
  );
}

function readRoutines(
  exerciseRef: (exerciseId: string) => BackupExerciseRef,
): BackupRoutine[] {
  const routineRows = db
    .select({
      id: routines.id,
      name: routines.name,
      createdAt: routines.createdAt,
      updatedAt: routines.updatedAt,
    })
    .from(routines)
    .orderBy(routines.createdAt)
    .all();

  const exerciseRows = db
    .select({
      id: routineExercises.id,
      routineId: routineExercises.routineId,
      exerciseId: routineExercises.exerciseId,
      position: routineExercises.position,
      restS: routineExercises.restS,
      createdAt: routineExercises.createdAt,
      updatedAt: routineExercises.updatedAt,
    })
    .from(routineExercises)
    .orderBy(routineExercises.position)
    .all();

  const setRows = db
    .select({
      id: routineSets.id,
      routineExerciseId: routineSets.routineExerciseId,
      position: routineSets.position,
      setType: routineSets.setType,
      weightKg: routineSets.weightKg,
      reps: routineSets.reps,
      durationS: routineSets.durationS,
      distanceM: routineSets.distanceM,
      createdAt: routineSets.createdAt,
      updatedAt: routineSets.updatedAt,
    })
    .from(routineSets)
    .orderBy(routineSets.position)
    .all();

  const setsByExercise = groupBy(setRows, (row) => row.routineExerciseId);
  const exercisesByRoutine = groupBy(exerciseRows, (row) => row.routineId);

  return routineRows.map((routine) => ({
    id: routine.id,
    name: routine.name,
    createdAt: toIso(routine.createdAt),
    updatedAt: toIso(routine.updatedAt),
    exercises: (exercisesByRoutine.get(routine.id) ?? []).map((exercise) => ({
      id: exercise.id,
      exercise: exerciseRef(exercise.exerciseId),
      position: exercise.position,
      restS: exercise.restS,
      createdAt: toIso(exercise.createdAt),
      updatedAt: toIso(exercise.updatedAt),
      sets: (setsByExercise.get(exercise.id) ?? []).map((set) => ({
        id: set.id,
        position: set.position,
        setType: set.setType,
        weightKg: set.weightKg,
        reps: set.reps,
        durationS: set.durationS,
        distanceM: set.distanceM,
        createdAt: toIso(set.createdAt),
        updatedAt: toIso(set.updatedAt),
      })),
    })),
  }));
}

// Finished workouts only: the one in progress stays on its device. The joins
// leave out the exercises and sets of that workout too.
function readWorkouts(
  exerciseRef: (exerciseId: string) => BackupExerciseRef,
): BackupWorkout[] {
  const workoutRows = db
    .select({
      id: workouts.id,
      routineId: workouts.routineId,
      name: workouts.name,
      startedAt: workouts.startedAt,
      endedAt: workouts.endedAt,
      createdAt: workouts.createdAt,
      updatedAt: workouts.updatedAt,
    })
    .from(workouts)
    .where(isNotNull(workouts.endedAt))
    .orderBy(workouts.startedAt)
    .all();

  const exerciseRows = db
    .select({
      id: workoutExercises.id,
      workoutId: workoutExercises.workoutId,
      exerciseId: workoutExercises.exerciseId,
      position: workoutExercises.position,
      createdAt: workoutExercises.createdAt,
      updatedAt: workoutExercises.updatedAt,
    })
    .from(workoutExercises)
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(isNotNull(workouts.endedAt))
    .orderBy(workoutExercises.position)
    .all();

  const setRows = db
    .select({
      id: workoutSets.id,
      workoutExerciseId: workoutSets.workoutExerciseId,
      position: workoutSets.position,
      setType: workoutSets.setType,
      weightKg: workoutSets.weightKg,
      reps: workoutSets.reps,
      durationS: workoutSets.durationS,
      distanceM: workoutSets.distanceM,
      startedAt: workoutSets.startedAt,
      completedAt: workoutSets.completedAt,
      restStartedAt: workoutSets.restStartedAt,
      restS: workoutSets.restS,
      createdAt: workoutSets.createdAt,
      updatedAt: workoutSets.updatedAt,
    })
    .from(workoutSets)
    .innerJoin(
      workoutExercises,
      eq(workoutExercises.id, workoutSets.workoutExerciseId),
    )
    .innerJoin(workouts, eq(workouts.id, workoutExercises.workoutId))
    .where(isNotNull(workouts.endedAt))
    .orderBy(workoutSets.position)
    .all();

  const setsByExercise = groupBy(setRows, (row) => row.workoutExerciseId);
  const exercisesByWorkout = groupBy(exerciseRows, (row) => row.workoutId);

  return workoutRows.flatMap((workout) =>
    workout.endedAt === null
      ? []
      : [
          {
            id: workout.id,
            routineId: workout.routineId,
            name: workout.name,
            startedAt: toIso(workout.startedAt),
            endedAt: toIso(workout.endedAt),
            createdAt: toIso(workout.createdAt),
            updatedAt: toIso(workout.updatedAt),
            exercises: (exercisesByWorkout.get(workout.id) ?? []).map(
              (exercise) => ({
                id: exercise.id,
                exercise: exerciseRef(exercise.exerciseId),
                position: exercise.position,
                createdAt: toIso(exercise.createdAt),
                updatedAt: toIso(exercise.updatedAt),
                sets: (setsByExercise.get(exercise.id) ?? []).map((set) => ({
                  id: set.id,
                  position: set.position,
                  setType: set.setType,
                  weightKg: set.weightKg,
                  reps: set.reps,
                  durationS: set.durationS,
                  distanceM: set.distanceM,
                  startedAt: toIsoOrNull(set.startedAt),
                  completedAt: toIsoOrNull(set.completedAt),
                  restStartedAt: toIsoOrNull(set.restStartedAt),
                  restS: set.restS,
                  createdAt: toIso(set.createdAt),
                  updatedAt: toIso(set.updatedAt),
                })),
              }),
            ),
          },
        ],
  );
}

function readBodyWeights(): BackupBodyWeight[] {
  return db
    .select({
      id: bodyWeights.id,
      measuredOn: bodyWeights.measuredOn,
      weightKg: bodyWeights.weightKg,
      createdAt: bodyWeights.createdAt,
      updatedAt: bodyWeights.updatedAt,
    })
    .from(bodyWeights)
    .orderBy(bodyWeights.measuredOn)
    .all()
    .map((row) => ({
      id: row.id,
      measuredOn: row.measuredOn,
      weightKg: row.weightKg,
      createdAt: toIso(row.createdAt),
      updatedAt: toIso(row.updatedAt),
    }));
}

export function readBackup(now = new Date()): BackupFile {
  const exerciseRef = makeExerciseRef();

  return {
    app: "fortapp",
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: now.toISOString(),
    profile: loadUserProfile(),
    exercises: readCustomExercises(),
    routines: readRoutines(exerciseRef),
    workouts: readWorkouts(exerciseRef),
    bodyWeights: readBodyWeights(),
  };
}

// Rows per INSERT: the widest table (workout_sets, 14 columns) stays well under
// the limit SQLite puts on the variables of one statement.
const IMPORT_BATCH_SIZE = 50;

export type ImportResult = {
  exercises: number;
  routines: number;
  workouts: number;
  bodyWeights: number;
  details: number;
  skippedExercises: number;
};

// Every column but the id, taken from the row that failed to insert.
function fromExcluded(table: SQLiteTable) {
  return Object.fromEntries(
    Object.entries(getTableColumns(table))
      .filter(([key]) => key !== "id")
      .map(([key, column]) => [key, sql.raw(`excluded."${column.name}"`)]),
  );
}

// The row of the file replaces the stored one only when it is newer.
function isNewer(table: { updatedAt: SQLiteColumn }) {
  return sql`excluded."updated_at" > ${table.updatedAt}`;
}

// Runs the writes in batches and adds up the rows each one changed.
function inBatches<T>(rows: readonly T[], write: (batch: T[]) => number) {
  let changes = 0;
  for (let start = 0; start < rows.length; start += IMPORT_BATCH_SIZE) {
    changes += write(rows.slice(start, start + IMPORT_BATCH_SIZE));
  }
  return changes;
}

// Merges a validated backup into the database: a row is inserted when it is
// new and replaces the stored one only when the file's is newer. Nothing is
// deleted, and importing the same file again changes nothing. It all happens
// in one transaction, so a failure leaves the database as it was. The
// transaction is synchronous because the Expo driver doesn't support async
// callbacks in transactions.
export function importBackup(file: BackupFile): ImportResult {
  return db.transaction((tx) => {
    const result: ImportResult = {
      exercises: 0,
      routines: 0,
      workouts: 0,
      bodyWeights: 0,
      details: 0,
      skippedExercises: 0,
    };

    for (const exercise of file.exercises) {
      const written = tx
        .insert(exercises)
        .values({
          id: exercise.id,
          name: exercise.name,
          description: exercise.description,
          equipment: exercise.equipment,
          trackingType: exercise.trackingType,
          archivedAt: fromIsoOrNull(exercise.archivedAt),
          createdAt: fromIso(exercise.createdAt),
          updatedAt: fromIso(exercise.updatedAt),
        })
        .onConflictDoUpdate({
          target: exercises.id,
          set: fromExcluded(exercises),
          setWhere: isNewer(exercises),
        })
        .run().changes;

      if (written === 0) {
        continue;
      }

      result.exercises += 1;
      tx.delete(exerciseMuscles)
        .where(eq(exerciseMuscles.exerciseId, exercise.id))
        .run();
      if (exercise.muscles.length > 0) {
        tx.insert(exerciseMuscles)
          .values(
            exercise.muscles.map((muscle) => ({
              exerciseId: exercise.id,
              muscleId: muscle.muscleId,
              role: muscle.role,
            })),
          )
          .run();
      }
    }

    // A catalog exercise has a different id on each install: its key finds it.
    const catalogIds = new Map(
      tx
        .select({ id: exercises.id, key: exercises.key })
        .from(exercises)
        .where(isNotNull(exercises.key))
        .all()
        .map((row) => [row.key, row.id] as const),
    );

    function exerciseIdOf(ref: BackupExerciseRef) {
      return "key" in ref ? catalogIds.get(ref.key) : ref.id;
    }

    const routineRows: (typeof routines.$inferInsert)[] = [];
    const routineExerciseRows: (typeof routineExercises.$inferInsert)[] = [];
    const routineSetRows: (typeof routineSets.$inferInsert)[] = [];

    for (const routine of file.routines) {
      routineRows.push({
        id: routine.id,
        name: routine.name,
        createdAt: fromIso(routine.createdAt),
        updatedAt: fromIso(routine.updatedAt),
      });

      for (const exercise of routine.exercises) {
        const exerciseId = exerciseIdOf(exercise.exercise);
        if (exerciseId === undefined) {
          result.skippedExercises += 1;
          continue;
        }
        routineExerciseRows.push({
          id: exercise.id,
          routineId: routine.id,
          exerciseId,
          position: exercise.position,
          restS: exercise.restS,
          createdAt: fromIso(exercise.createdAt),
          updatedAt: fromIso(exercise.updatedAt),
        });
        for (const set of exercise.sets) {
          routineSetRows.push({
            id: set.id,
            routineExerciseId: exercise.id,
            position: set.position,
            setType: set.setType,
            weightKg: set.weightKg,
            reps: set.reps,
            durationS: set.durationS,
            distanceM: set.distanceM,
            createdAt: fromIso(set.createdAt),
            updatedAt: fromIso(set.updatedAt),
          });
        }
      }
    }
    result.routines = inBatches(
      routineRows,
      (batch) =>
        tx
          .insert(routines)
          .values(batch)
          .onConflictDoUpdate({
            target: routines.id,
            set: fromExcluded(routines),
            setWhere: isNewer(routines),
          })
          .run().changes,
    );
    result.details += inBatches(
      routineExerciseRows,
      (batch) =>
        tx
          .insert(routineExercises)
          .values(batch)
          .onConflictDoUpdate({
            target: routineExercises.id,
            set: fromExcluded(routineExercises),
            setWhere: isNewer(routineExercises),
          })
          .run().changes,
    );
    result.details += inBatches(
      routineSetRows,
      (batch) =>
        tx
          .insert(routineSets)
          .values(batch)
          .onConflictDoUpdate({
            target: routineSets.id,
            set: fromExcluded(routineSets),
            setWhere: isNewer(routineSets),
          })
          .run().changes,
    );

    // A workout whose routine is neither stored nor in the file keeps no link,
    // like a deleted routine does (onDelete: set null).
    const routineIds = new Set(
      tx
        .select({ id: routines.id })
        .from(routines)
        .all()
        .map((row) => row.id),
    );
    const workoutRows: (typeof workouts.$inferInsert)[] = [];
    const workoutExerciseRows: (typeof workoutExercises.$inferInsert)[] = [];
    const workoutSetRows: (typeof workoutSets.$inferInsert)[] = [];
    for (const workout of file.workouts) {
      workoutRows.push({
        id: workout.id,
        routineId:
          workout.routineId !== null && routineIds.has(workout.routineId)
            ? workout.routineId
            : null,
        name: workout.name,
        startedAt: fromIso(workout.startedAt),
        endedAt: fromIso(workout.endedAt),
        createdAt: fromIso(workout.createdAt),
        updatedAt: fromIso(workout.updatedAt),
      });
      for (const exercise of workout.exercises) {
        const exerciseId = exerciseIdOf(exercise.exercise);
        if (exerciseId === undefined) {
          result.skippedExercises += 1;
          continue;
        }
        workoutExerciseRows.push({
          id: exercise.id,
          workoutId: workout.id,
          exerciseId,
          position: exercise.position,
          createdAt: fromIso(exercise.createdAt),
          updatedAt: fromIso(exercise.updatedAt),
        });
        for (const set of exercise.sets) {
          workoutSetRows.push({
            id: set.id,
            workoutExerciseId: exercise.id,
            position: set.position,
            setType: set.setType,
            weightKg: set.weightKg,
            reps: set.reps,
            durationS: set.durationS,
            distanceM: set.distanceM,
            startedAt: fromIsoOrNull(set.startedAt),
            completedAt: fromIsoOrNull(set.completedAt),
            restStartedAt: fromIsoOrNull(set.restStartedAt),
            restS: set.restS,
            createdAt: fromIso(set.createdAt),
            updatedAt: fromIso(set.updatedAt),
          });
        }
      }
    }
    result.workouts = inBatches(
      workoutRows,
      (batch) =>
        tx
          .insert(workouts)
          .values(batch)
          .onConflictDoUpdate({
            target: workouts.id,
            set: fromExcluded(workouts),
            setWhere: isNewer(workouts),
          })
          .run().changes,
    );
    result.details += inBatches(
      workoutExerciseRows,
      (batch) =>
        tx
          .insert(workoutExercises)
          .values(batch)
          .onConflictDoUpdate({
            target: workoutExercises.id,
            set: fromExcluded(workoutExercises),
            setWhere: isNewer(workoutExercises),
          })
          .run().changes,
    );
    result.details += inBatches(
      workoutSetRows,
      (batch) =>
        tx
          .insert(workoutSets)
          .values(batch)
          .onConflictDoUpdate({
            target: workoutSets.id,
            set: fromExcluded(workoutSets),
            setWhere: isNewer(workoutSets),
          })
          .run().changes,
    );

    // One weigh-in per day: the day is the conflict, and the stored row keeps
    // its id.
    result.bodyWeights = inBatches(
      file.bodyWeights.map((weight) => ({
        id: weight.id,
        measuredOn: weight.measuredOn,
        weightKg: weight.weightKg,
        createdAt: fromIso(weight.createdAt),
        updatedAt: fromIso(weight.updatedAt),
      })),
      (batch) =>
        tx
          .insert(bodyWeights)
          .values(batch)
          .onConflictDoUpdate({
            target: bodyWeights.measuredOn,
            set: fromExcluded(bodyWeights),
            setWhere: isNewer(bodyWeights),
          })
          .run().changes,
    );

    return result;
  });
}
