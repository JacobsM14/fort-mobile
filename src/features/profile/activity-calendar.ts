// How much was done in a day, from nothing to the most.
export const INTENSITY_LEVELS = [0, 1, 2, 3, 4] as const;
export type IntensityLevel = (typeof INTENSITY_LEVELS)[number];
