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

export const THEME_PREFERENCES = ["system", "light", "dark"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const LANGUAGE_PREFERENCES = ["system", "en", "es"] as const;
export type LanguagePreference = (typeof LANGUAGE_PREFERENCES)[number];

export const WEIGHT_UNITS = ["kg", "lb"] as const;
export type WeightUnit = (typeof WEIGHT_UNITS)[number];

export const DISTANCE_UNITS = ["km", "mi"] as const;
export type DistanceUnit = (typeof DISTANCE_UNITS)[number];

export const WEIGHT_UNIT_PREFERENCES = ["system", ...WEIGHT_UNITS] as const;
export type WeightUnitPreference = (typeof WEIGHT_UNIT_PREFERENCES)[number];

export const DISTANCE_UNIT_PREFERENCES = ["system", ...DISTANCE_UNITS] as const;
export type DistanceUnitPreference = (typeof DISTANCE_UNIT_PREFERENCES)[number];

export const ACCENT_COLORS = [
  "orange",
  "blue",
  "green",
  "purple",
  "pink",
  "amber",
] as const;
export type AccentColor = (typeof ACCENT_COLORS)[number];
