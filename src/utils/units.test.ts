import { describe, expect, it } from "@jest/globals";

import {
  cmToFeetInches,
  distanceFromUnit,
  distanceToUnit,
  feetInchesToCm,
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

describe("heights", () => {
  it("converts feet and inches to centimeters", () => {
    expect(feetInchesToCm(5, 10)).toBe(178);
    expect(feetInchesToCm(6, 0)).toBe(183);
  });

  it("reads centimeters as feet and inches, rolling the inches over", () => {
    expect(cmToFeetInches(178)).toEqual({ feet: 5, inches: 10 });
    expect(cmToFeetInches(183)).toEqual({ feet: 6, inches: 0 });
    // 181 cm is 71.26 inches: 5 feet 11, not 5 feet 12.
    expect(cmToFeetInches(181)).toEqual({ feet: 5, inches: 11 });
  });

  it("gives the same height back from what it shows", () => {
    for (const cm of [150, 165, 172, 190]) {
      const { feet, inches } = cmToFeetInches(cm);
      expect(Math.abs(feetInchesToCm(feet, inches) - cm)).toBeLessThanOrEqual(
        2,
      );
    }
  });
});
