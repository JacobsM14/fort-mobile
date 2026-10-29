import { describe, expect, it } from "@jest/globals";

import { pointsInRange, rangeStart } from "./ranges";

const TODAY = new Date(2026, 9, 25, 18, 30);

describe("rangeStart", () => {
  it("starts each range at midnight, counting today in it", () => {
    expect(rangeStart("4w", TODAY)).toEqual(new Date(2026, 8, 28));
    expect(rangeStart("3m", TODAY)).toEqual(new Date(2026, 6, 26));
    expect(rangeStart("6m", TODAY)).toEqual(new Date(2026, 3, 26));
    expect(rangeStart("1y", TODAY)).toEqual(new Date(2025, 9, 26));
  });

  it("crosses into the previous year", () => {
    expect(rangeStart("3m", new Date(2026, 1, 10))).toEqual(
      new Date(2025, 10, 11),
    );
  });
});

describe("pointsInRange", () => {
  it("keeps the days from the start of the range on", () => {
    const points = [
      { date: new Date(2026, 8, 27), value: 1 },
      { date: new Date(2026, 8, 28), value: 2 },
      { date: new Date(2026, 9, 25), value: 3 },
    ];
    expect(pointsInRange(points, "4w", TODAY).map((p) => p.value)).toEqual([
      2, 3,
    ]);
  });
});
