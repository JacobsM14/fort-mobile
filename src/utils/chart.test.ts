import { describe, expect, it } from "@jest/globals";

import { areaPath, linePath, nearestIndex, scalePoints } from "./chart";

const PLOT = { left: 10, top: 20, width: 100, height: 50 };

describe("scalePoints", () => {
  it("spreads the points across the width, lowest at the bottom", () => {
    expect(scalePoints([2, 6, 4], PLOT)).toEqual([
      { x: 10, y: 70 },
      { x: 60, y: 20 },
      { x: 110, y: 45 },
    ]);
  });

  it("puts a single point in the middle", () => {
    expect(scalePoints([5], PLOT)).toEqual([{ x: 60, y: 45 }]);
  });

  it("keeps equal values at mid height", () => {
    expect(scalePoints([3, 3], PLOT).map((point) => point.y)).toEqual([45, 45]);
  });
});

describe("nearestIndex", () => {
  const points = [
    { x: 0, y: 0 },
    { x: 50, y: 0 },
    { x: 100, y: 0 },
  ];

  it("snaps to the closest point", () => {
    expect(nearestIndex(20, points)).toBe(0);
    expect(nearestIndex(30, points)).toBe(1);
    expect(nearestIndex(90, points)).toBe(2);
  });

  it("stays on the edges past them", () => {
    expect(nearestIndex(-40, points)).toBe(0);
    expect(nearestIndex(400, points)).toBe(2);
  });

  it("is -1 with no points", () => {
    expect(nearestIndex(10, [])).toBe(-1);
  });
});

describe("paths", () => {
  const points = [
    { x: 0, y: 10 },
    { x: 20, y: 5 },
  ];

  it("joins the points", () => {
    expect(linePath(points)).toBe("M0 10 L20 5");
  });

  it("closes the area down to the baseline", () => {
    expect(areaPath(points, 30)).toBe("M0 10 L20 5 L20 30 L0 30 Z");
    expect(areaPath([], 30)).toBe("");
  });
});
