export const SET_TYPES = ["normal", "warmup", "drop", "failure"] as const;
export type SetType = (typeof SET_TYPES)[number];

export const TRACKING_TYPES = [
  "weight_reps",
  "bodyweight_reps",
  "duration",
  "distance_duration",
] as const;
export type TrackingType = (typeof TRACKING_TYPES)[number];

export const EQUIPMENT = [
  "barbell",
  "dumbbell",
  "cable",
  "machine",
  "kettlebells",
  "bands",
  "medicine_ball",
  "exercise_ball",
  "foam_roll",
  "ez_bar",
  "bodyweight",
  "other",
] as const;
export type Equipment = (typeof EQUIPMENT)[number];

export const MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "arms",
  "neck",
  "legs",
  "core",
] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const MUSCLE_ROLES = ["primary", "secondary"] as const;
export type MuscleRole = (typeof MUSCLE_ROLES)[number];
