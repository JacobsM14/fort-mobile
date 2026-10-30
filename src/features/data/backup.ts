import {
  EQUIPMENT,
  GENDERS,
  MUSCLE_ROLES,
  SET_TYPES,
  TRACKING_TYPES,
  type Equipment,
  type Gender,
  type MuscleRole,
  type SetType,
  type TrackingType,
} from "@/constants/enums";
import { isMuscleId, type MuscleId } from "@/features/exercises/catalog";

import { areUnique } from "@/utils/array";
import { isDateKey, isIsoDate, toDateKey } from "@/utils/date";
import {
  isArrayOf,
  isFiniteNumber,
  isInteger,
  isOneOf,
  isRecord,
  isString,
  orNull,
} from "@/utils/guards";

export const BACKUP_FORMAT_VERSION = 1;

// Dates are ISO 8601 strings, except the day of a weigh-in ("2026-10-24").

// A catalog exercise has the same key on every device but a different id
// (each install generates its own), so it is referenced by key. A custom
// exercise keeps its id and is listed in BackupFile.exercises.
export type BackupExerciseRef = { key: string } | { id: string };

// Custom exercises only: the catalog comes with the app.
export type BackupExercise = {
  id: string;
  name: string;
  description: string | null;
  equipment: Equipment | null;
  trackingType: TrackingType;
  archivedAt: string | null;
  muscles: { muscleId: MuscleId; role: MuscleRole }[];
  createdAt: string;
  updatedAt: string;
};

export type BackupRoutineSet = {
  id: string;
  position: number;
  setType: SetType;
  weightKg: number | null;
  reps: number | null;
  durationS: number | null;
  distanceM: number | null;
  createdAt: string;
  updatedAt: string;
};

export type BackupRoutineExercise = {
  id: string;
  exercise: BackupExerciseRef;
  position: number;
  restS: number | null;
  createdAt: string;
  updatedAt: string;
  sets: BackupRoutineSet[];
};

export type BackupRoutine = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  exercises: BackupRoutineExercise[];
};

export type BackupWorkoutSet = {
  id: string;
  position: number;
  setType: SetType;
  weightKg: number | null;
  reps: number | null;
  durationS: number | null;
  distanceM: number | null;
  startedAt: string | null;
  completedAt: string | null;
  restStartedAt: string | null;
  restS: number | null;
  createdAt: string;
  updatedAt: string;
};

export type BackupWorkoutExercise = {
  id: string;
  exercise: BackupExerciseRef;
  position: number;
  createdAt: string;
  updatedAt: string;
  sets: BackupWorkoutSet[];
};

// Finished workouts only: one in progress stays on its device.
export type BackupWorkout = {
  id: string;
  routineId: string | null;
  name: string | null;
  startedAt: string;
  endedAt: string;
  createdAt: string;
  updatedAt: string;
  exercises: BackupWorkoutExercise[];
};

export type BackupBodyWeight = {
  id: string;
  measuredOn: string;
  weightKg: number;
  createdAt: string;
  updatedAt: string;
};

export type BackupProfile = {
  heightCm: number | null;
  birthDate: string | null;
  gender: Gender | null;
};

export type BackupFile = {
  app: "fortapp";
  formatVersion: number;
  exportedAt: string;
  profile: BackupProfile;
  exercises: BackupExercise[];
  routines: BackupRoutine[];
  workouts: BackupWorkout[];
  bodyWeights: BackupBodyWeight[];
};

export type BackupErrorCode =
  "not_a_backup" | "unsupported_version" | "invalid";

export class BackupError extends Error {
  constructor(readonly code: BackupErrorCode) {
    super(code);
  }
}

// What a file carries, to show before importing it.
export type BackupSummary = {
  exercises: number;
  routines: number;
  workouts: number;
  bodyWeights: number;
};

export function summarizeBackup(file: BackupFile): BackupSummary {
  return {
    exercises: file.exercises.length,
    routines: file.routines.length,
    workouts: file.workouts.length,
    bodyWeights: file.bodyWeights.length,
  };
}

// The local day, with no colons: not every system accepts them in file names.
export function backupFileName(date: Date) {
  return `fortapp-backup-${toDateKey(date)}.json`;
}

const isNullableString = orNull(isString);
const isNullableNumber = orNull(isFiniteNumber);
const isNullableInteger = orNull(isInteger);
const isNullableIsoDate = orNull(isIsoDate);

function hasTimestamps(value: Record<string, unknown>) {
  return isIsoDate(value.createdAt) && isIsoDate(value.updatedAt);
}

// A routine or a custom exercise always has a name to show in its row.
function isName(value: unknown): value is string {
  return isString(value) && value.trim() !== "";
}

// Either a catalog key or the id of a custom exercise, never both.
function isExerciseRef(value: unknown): value is BackupExerciseRef {
  return isRecord(value) && isString(value.key) !== isString(value.id);
}

function isProfile(value: unknown): value is BackupProfile {
  return (
    isRecord(value) &&
    (value.heightCm === null ||
      (isFiniteNumber(value.heightCm) && value.heightCm > 0)) &&
    (value.birthDate === null || isDateKey(value.birthDate)) &&
    (value.gender === null || isOneOf(GENDERS, value.gender))
  );
}

function isExerciseMuscle(
  value: unknown,
): value is BackupExercise["muscles"][number] {
  return (
    isRecord(value) &&
    isString(value.muscleId) &&
    isMuscleId(value.muscleId) &&
    isOneOf(MUSCLE_ROLES, value.role)
  );
}

function isExercise(value: unknown): value is BackupExercise {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isName(value.name) &&
    isNullableString(value.description) &&
    (value.equipment === null || isOneOf(EQUIPMENT, value.equipment)) &&
    isOneOf(TRACKING_TYPES, value.trackingType) &&
    isNullableIsoDate(value.archivedAt) &&
    isArrayOf(value.muscles, isExerciseMuscle) &&
    // A muscle appears once per exercise: the table's key is the pair.
    areUnique(value.muscles.map((muscle) => muscle.muscleId)) &&
    hasTimestamps(value)
  );
}

// What a set of a routine and a set of a workout have in common.
function hasSetValues(value: Record<string, unknown>) {
  return (
    isInteger(value.position) &&
    isOneOf(SET_TYPES, value.setType) &&
    isNullableNumber(value.weightKg) &&
    isNullableInteger(value.reps) &&
    isNullableInteger(value.durationS) &&
    isNullableNumber(value.distanceM) &&
    hasTimestamps(value)
  );
}

function isRoutineSet(value: unknown): value is BackupRoutineSet {
  return isRecord(value) && isString(value.id) && hasSetValues(value);
}

function isRoutineExercise(value: unknown): value is BackupRoutineExercise {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isExerciseRef(value.exercise) &&
    isInteger(value.position) &&
    isNullableInteger(value.restS) &&
    isArrayOf(value.sets, isRoutineSet) &&
    hasTimestamps(value)
  );
}

function isRoutine(value: unknown): value is BackupRoutine {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isName(value.name) &&
    isArrayOf(value.exercises, isRoutineExercise) &&
    hasTimestamps(value)
  );
}

function isWorkoutSet(value: unknown): value is BackupWorkoutSet {
  return (
    isRecord(value) &&
    isString(value.id) &&
    hasSetValues(value) &&
    isNullableIsoDate(value.startedAt) &&
    isNullableIsoDate(value.completedAt) &&
    isNullableIsoDate(value.restStartedAt) &&
    isNullableInteger(value.restS)
  );
}

function isWorkoutExercise(value: unknown): value is BackupWorkoutExercise {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isExerciseRef(value.exercise) &&
    isInteger(value.position) &&
    isArrayOf(value.sets, isWorkoutSet) &&
    hasTimestamps(value)
  );
}

function isWorkout(value: unknown): value is BackupWorkout {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isNullableString(value.routineId) &&
    isNullableString(value.name) &&
    isIsoDate(value.startedAt) &&
    isIsoDate(value.endedAt) &&
    isArrayOf(value.exercises, isWorkoutExercise) &&
    hasTimestamps(value)
  );
}

function isBodyWeight(value: unknown): value is BackupBodyWeight {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isDateKey(value.measuredOn) &&
    isFiniteNumber(value.weightKg) &&
    hasTimestamps(value)
  );
}

// What a field-by-field check can't see: ids that repeat, which an upsert
// would silently merge, and references to custom exercises the file doesn't
// carry. A catalog key is not checked here: the app that imports decides what
// to do with one it doesn't know.
function hasConsistentRelations(
  file: Pick<BackupFile, "exercises" | "routines" | "workouts" | "bodyWeights">,
) {
  const routineExercises = file.routines.flatMap(
    (routine) => routine.exercises,
  );
  const workoutExercises = file.workouts.flatMap(
    (workout) => workout.exercises,
  );
  const customIds = new Set(file.exercises.map((exercise) => exercise.id));

  const referencesExist = [...routineExercises, ...workoutExercises].every(
    ({ exercise }) => !("id" in exercise) || customIds.has(exercise.id),
  );
  const idsAreUnique = [
    file.exercises,
    file.routines,
    routineExercises,
    routineExercises.flatMap((item) => item.sets),
    file.workouts,
    workoutExercises,
    workoutExercises.flatMap((item) => item.sets),
    file.bodyWeights,
  ].every((rows) => areUnique(rows.map((row) => row.id)));

  return (
    referencesExist &&
    idsAreUnique &&
    // One weigh-in per day.
    areUnique(file.bodyWeights.map((weight) => weight.measuredOn))
  );
}

// Reads the text of a backup file. Nothing is returned that has not been
// checked: the importer can trust the result without looking at it again.
export function parseBackupFile(json: string): BackupFile {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    throw new BackupError("not_a_backup");
  }
  if (!isRecord(data)) {
    throw new BackupError("not_a_backup");
  }

  const {
    app,
    formatVersion,
    exportedAt,
    profile,
    exercises,
    routines,
    workouts,
    bodyWeights,
  } = data;
  if (app !== "fortapp") {
    throw new BackupError("not_a_backup");
  }
  if (!isInteger(formatVersion) || formatVersion < 1) {
    throw new BackupError("invalid");
  }
  // Checked before the rest: a newer app may have changed any of the fields.
  if (formatVersion > BACKUP_FORMAT_VERSION) {
    throw new BackupError("unsupported_version");
  }
  if (
    !isIsoDate(exportedAt) ||
    !isProfile(profile) ||
    !isArrayOf(exercises, isExercise) ||
    !isArrayOf(routines, isRoutine) ||
    !isArrayOf(workouts, isWorkout) ||
    !isArrayOf(bodyWeights, isBodyWeight)
  ) {
    throw new BackupError("invalid");
  }

  const file: BackupFile = {
    app,
    formatVersion,
    exportedAt,
    profile,
    exercises,
    routines,
    workouts,
    bodyWeights,
  };
  if (!hasConsistentRelations(file)) {
    throw new BackupError("invalid");
  }
  return file;
}
