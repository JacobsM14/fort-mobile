import { db } from "@/db/client";
import {
  exercises,
  routineExercises,
  routines,
  routineSets,
} from "@/db/schema";
import { isNull } from "drizzle-orm";

import { groupBy } from "@/utils/array";
import { toIso, toIsoOrNull } from "@/utils/date";

import { loadUserProfile } from "@/features/settings/user-profile";

import {
  BACKUP_FORMAT_VERSION,
  type BackupExercise,
  type BackupExerciseRef,
  type BackupFile,
  type BackupRoutine,
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
            muscles: [], // pendiente: leer exercise_muscles
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

export function readBackup(now = new Date()): BackupFile {
  const exerciseRef = makeExerciseRef();

  return {
    app: "fortapp",
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: now.toISOString(),
    profile: loadUserProfile(),
    exercises: readCustomExercises(),
    routines: readRoutines(exerciseRef),
    workouts: [],
    bodyWeights: [],
  };
}
