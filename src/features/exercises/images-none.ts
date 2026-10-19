import type { ExerciseKey } from "./catalog";

// Stands in for ./images.ts in builds without the exercise photos (see
// metro.config.js).
export const EXERCISE_IMAGES: Partial<Record<ExerciseKey, readonly number[]>> =
  {};
