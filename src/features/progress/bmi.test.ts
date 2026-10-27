import { describe, expect, it } from "@jest/globals";

import { bmiBlockHeights, bmiCategory, bmiScaleY } from "./bmi";

const HEIGHT = 200;
const GAP = 2;

describe("bmiCategory", () => {
  it("starts each band at its own threshold", () => {
    expect(bmiCategory(18.4)).toBe("underweight");
    expect(bmiCategory(18.5)).toBe("normal");
    expect(bmiCategory(24.9)).toBe("normal");
    expect(bmiCategory(25)).toBe("overweight");
    expect(bmiCategory(30)).toBe("obese");
  });

  it("keeps the values off the scale in the end bands", () => {
    expect(bmiCategory(12)).toBe("underweight");
    expect(bmiCategory(45)).toBe("obese");
  });
});

describe("bmiBlockHeights", () => {
  it("shares the column without the gaps, as wide as each band", () => {
    const heights = bmiBlockHeights(HEIGHT, GAP);

    expect(heights.reduce((sum, height) => sum + height, 0)).toBeCloseTo(
      HEIGHT - 3 * GAP,
    );
    // Obesity covers 30 to 40, ten points; underweight 15 to 18.5.
    expect(heights[3] / heights[0]).toBeCloseTo(10 / 3.5);
  });
});

describe("bmiScaleY", () => {
  const [under, normal] = bmiBlockHeights(HEIGHT, GAP);

  it("puts the ends of the scale at the bottom and the top", () => {
    expect(bmiScaleY(15, HEIGHT, GAP)).toBe(HEIGHT);
    expect(bmiScaleY(40, HEIGHT, GAP)).toBeCloseTo(0);
  });

  it("puts a threshold in the middle of the gap", () => {
    expect(bmiScaleY(18.5, HEIGHT, GAP)).toBeCloseTo(HEIGHT - under - GAP / 2);
  });

  it("places a value within its block", () => {
    // 20 is 1.5 of the 6.5 points of the normal band.
    expect(bmiScaleY(20, HEIGHT, GAP)).toBeCloseTo(
      HEIGHT - (under + GAP + (normal * 1.5) / 6.5),
    );
  });

  it("sticks the values off the scale to its ends", () => {
    expect(bmiScaleY(10, HEIGHT, GAP)).toBe(HEIGHT);
    expect(bmiScaleY(55, HEIGHT, GAP)).toBeCloseTo(0);
  });
});
