import type {
  Equipment,
  Gender,
  MuscleRole,
  SetType,
  TrackingType,
} from "@/constants/enums";
import type { MuscleId } from "@/features/exercises/catalog";

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
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  sets: BackupRoutineSet[];
};

export type BackupRoutine = {
  id: string;
  name: string;
  notes: string | null;
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
  notes: string | null;
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
  notes: string | null;
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
