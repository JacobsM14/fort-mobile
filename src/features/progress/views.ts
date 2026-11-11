import { PROGRESS_RANGES } from "@/features/progress/ranges";

// What Progress shows: the day's summary, or the statistics over a range.
export const PROGRESS_VIEWS = ["today", ...PROGRESS_RANGES] as const;
export type ProgressView = (typeof PROGRESS_VIEWS)[number];
