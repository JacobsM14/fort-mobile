import { describe, expect, it } from "@jest/globals";

import {
  distanceFromUnit,
  distanceToUnit,
  weightFromUnit,
  weightToUnit,
} from "./units";

describe("weights", () => {
  it("keeps kg as they are", () => {
    expect(weightToUnit(62.5, "kg")).toBe(62.5);
    expect(weightFromUnit(62.5, "kg")).toBe(62.5);
  });

  it("converts pounds, and a weight typed in pounds reads the same again", () => {
    expect(weightFromUnit(100, "lb")).toBeCloseTo(45.359237);
    expect(weightToUnit(weightFromUnit(100, "lb"), "lb")).toBeCloseTo(100);
    expect(weightToUnit(60, "lb")).toBeCloseTo(132.277);
  });
});

describe("distances", () => {
  it("converts kilometers and miles to whole meters", () => {
    expect(distanceFromUnit(5.2, "km")).toBe(5200);
    expect(distanceFromUnit(3.1, "mi")).toBe(4989);
    expect(distanceToUnit(5200, "km")).toBe(5.2);
    expect(distanceToUnit(1609.344, "mi")).toBe(1);
  });
});
