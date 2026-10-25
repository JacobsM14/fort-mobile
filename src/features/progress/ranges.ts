import type { ChartPoint } from "@/utils/chart";

export const PROGRESS_RANGES = ["4w", "3m", "6m", "1y"] as const;
export type ProgressRange = (typeof PROGRESS_RANGES)[number];

// The first local day the range covers, counting today: 4 weeks back from
// today is 27 days before it.
export function rangeStart(range: ProgressRange, today: Date) {
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  switch (range) {
    case "4w":
      return new Date(year, month, day - 27);
    case "3m":
      return new Date(year, month - 3, day + 1);
    case "6m":
      return new Date(year, month - 6, day + 1);
    case "1y":
      return new Date(year - 1, month, day + 1);
  }
}

export function pointsInRange(
  points: readonly ChartPoint[],
  range: ProgressRange,
  today: Date,
) {
  const start = rangeStart(range, today);
  return points.filter((point) => point.date >= start);
}
