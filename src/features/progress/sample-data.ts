import type { ChartPoint } from "@/utils/chart";

// Made-up weigh-ins to try the body weight chart: nothing records the weight
// yet. The exercise charts already read the database.

// Small ups and downs on top of the trend, the same every time.
function wobble(weighIn: number, size: number) {
  return ((weighIn * 7) % 5) * size - 2 * size;
}

// A weigh-in every few days over a year, in kg like the body_weights table:
// a slow gain with the day-to-day ups and downs a scale shows.
export const SAMPLE_BODY_WEIGHT: ChartPoint[] = (() => {
  const today = new Date();
  const count = 90;
  const everyDays = 4;
  return Array.from({ length: count }, (_, weighIn) => ({
    date: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (count - 1 - weighIn) * everyDays,
    ),
    value: 72 + weighIn * 0.04 + wobble(weighIn, 0.3),
  }));
})();
