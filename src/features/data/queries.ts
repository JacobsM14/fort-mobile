import { eq, isNotNull, isNull, sql } from "drizzle-orm";

import { db } from "@/db/client";
import {
  bodyWeights,
  exerciseMuscles,
  exercises,
  routineExercises,
  routines,
  routineSets,
  workoutExercises,
  workoutSets,
  workouts,
} from "@/db/schema";
import { isMuscleId } from "@/features/exercises/catalog";
import { loadUserProfile } from "@/features/settings/user-profile";

import { groupBy } from "@/utils/array";
import { toIso, toIsoOrNull } from "@/utils/date";

import {
  BACKUP_FORMAT_VERSION,
  type BackupBodyWeight,
  type BackupExercise,
  type BackupExerciseRef,
  type BackupFile,
  type BackupRoutine,
  type BackupWorkout,
} from "./backup";

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
        ? [{ exerciseId: row.exerciseId, muscleId: row.muscleId, role: row.role }]
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
