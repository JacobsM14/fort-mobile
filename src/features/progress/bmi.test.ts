import { describe, expect, it } from "@jest/globals";

import {
  ADULT_BMI_BANDS,
  ageInMonths,
  bmiBandsForAge,
  bmiBlockHeights,
  bmiCategory,
  bmiScaleY,
  bmiValue,
  lmsBmi,
} from "./bmi";
import {
  BMI_FOR_AGE,
  BMI_FOR_AGE_FIRST_MONTH,
  BMI_FOR_AGE_LAST_MONTH,
} from "./bmi-for-age";

import type { BmiBand } from "./bmi";

const HEIGHT = 200;
const GAP = 2;

// Narrower than the adult ones, as a child's are.
const OTHER_BANDS: readonly BmiBand[] = [
  { id: "underweight", from: 12, to: 14 },
  { id: "normal", from: 14, to: 18 },
  { id: "overweight", from: 18, to: 20 },
  { id: "obese", from: 20, to: 24 },
];

describe("bmiCategory", () => {
  it("starts each band at its own threshold", () => {
    expect(bmiCategory(18.4, ADULT_BMI_BANDS)).toBe("underweight");
    expect(bmiCategory(18.5, ADULT_BMI_BANDS)).toBe("normal");
    expect(bmiCategory(24.9, ADULT_BMI_BANDS)).toBe("normal");
    expect(bmiCategory(25, ADULT_BMI_BANDS)).toBe("overweight");
    expect(bmiCategory(30, ADULT_BMI_BANDS)).toBe("obese");
  });

  it("keeps the values off the scale in the end bands", () => {
    expect(bmiCategory(12, ADULT_BMI_BANDS)).toBe("underweight");
    expect(bmiCategory(45, ADULT_BMI_BANDS)).toBe("obese");
  });

  it("follows the bands it is given", () => {
    expect(bmiCategory(19, OTHER_BANDS)).toBe("overweight");
  });
});

describe("bmiBlockHeights", () => {
  it("shares the column without the gaps, as wide as each band", () => {
    const heights = bmiBlockHeights(ADULT_BMI_BANDS, HEIGHT, GAP);

    expect(heights.reduce((sum, height) => sum + height, 0)).toBeCloseTo(
      HEIGHT - 3 * GAP,
    );
    // Obesity covers 30 to 40, ten points; underweight 15 to 18.5.
    expect(heights[3] / heights[0]).toBeCloseTo(10 / 3.5);
  });
});

describe("bmiScaleY", () => {
  const [under, normal] = bmiBlockHeights(ADULT_BMI_BANDS, HEIGHT, GAP);

  it("puts the ends of the scale at the bottom and the top", () => {
    expect(bmiScaleY(15, ADULT_BMI_BANDS, HEIGHT, GAP)).toBe(HEIGHT);
    expect(bmiScaleY(40, ADULT_BMI_BANDS, HEIGHT, GAP)).toBeCloseTo(0);
  });

  it("puts a threshold in the middle of the gap", () => {
    expect(bmiScaleY(18.5, ADULT_BMI_BANDS, HEIGHT, GAP)).toBeCloseTo(
      HEIGHT - under - GAP / 2,
    );
  });

  it("places a value within its block", () => {
    // 20 is 1.5 of the 6.5 points of the normal band.
    expect(bmiScaleY(20, ADULT_BMI_BANDS, HEIGHT, GAP)).toBeCloseTo(
      HEIGHT - (under + GAP + (normal * 1.5) / 6.5),
    );
  });

  it("sticks the values off the scale to its ends", () => {
    expect(bmiScaleY(10, ADULT_BMI_BANDS, HEIGHT, GAP)).toBe(HEIGHT);
    expect(bmiScaleY(55, ADULT_BMI_BANDS, HEIGHT, GAP)).toBeCloseTo(0);
  });

  it("cuts the scale where the bands it is given start and end", () => {
    expect(bmiScaleY(12, OTHER_BANDS, HEIGHT, GAP)).toBe(HEIGHT);
    expect(bmiScaleY(24, OTHER_BANDS, HEIGHT, GAP)).toBeCloseTo(0);
  });
});

describe("bmiValue", () => {
  it("divides the weight by the height in metres squared", () => {
    expect(bmiValue(70, 170)).toBeCloseTo(24.22, 2);
  });
});

describe("ageInMonths", () => {
  const birthDate = new Date(2020, 0, 15); // January 15, 2020

  it("leaves out a month whose day hasn't come yet", () => {
    expect(ageInMonths(birthDate, new Date(2024, 5, 14))).toBe(52);
  });

  it("counts the month on the day it is completed", () => {
    expect(ageInMonths(birthDate, new Date(2024, 5, 15))).toBe(53);
  });

  it("counts across the turn of the year", () => {
    expect(ageInMonths(new Date(2020, 10, 15), new Date(2021, 1, 15))).toBe(3);
  });
});

describe("lmsBmi", () => {
  // Boys at 61 months, against the WHO SD columns of the same row.
  const row = BMI_FOR_AGE.male[0];

  it("gives the WHO reference BMI for each z-score", () => {
    expect(lmsBmi(row, -2)).toBeCloseTo(13.031, 2);
    expect(lmsBmi(row, 0)).toBeCloseTo(15.264, 2);
    expect(lmsBmi(row, 1)).toBeCloseTo(16.645, 2);
    expect(lmsBmi(row, 2)).toBeCloseTo(18.259, 2);
  });
});

describe("bmiBandsForAge", () => {
  it("cuts the bands at the WHO z-scores of the age", () => {
    // Boys at 61 months: -2, +1 and +2 SD from the WHO table.
    const [under, normal, over, obese] = bmiBandsForAge("male", 61);

    expect(under.to).toBeCloseTo(13.031, 2);
    expect(normal.from).toBe(under.to);
    expect(normal.to).toBeCloseTo(16.645, 2);
    expect(over.to).toBeCloseTo(18.259, 2);
    expect(obese.from).toBe(over.to);
  });

  it("finds the row of every month of the table", () => {
    for (const sex of ["female", "male"] as const) {
      for (
        let months = BMI_FOR_AGE_FIRST_MONTH;
        months <= BMI_FOR_AGE_LAST_MONTH;
        months++
      ) {
        expect(() => bmiBandsForAge(sex, months)).not.toThrow();
      }
    }
  });

  it("refuses an age the table doesn't cover", () => {
    expect(() => bmiBandsForAge("male", BMI_FOR_AGE_FIRST_MONTH - 1)).toThrow();
    expect(() => bmiBandsForAge("male", BMI_FOR_AGE_LAST_MONTH + 1)).toThrow();
  });
});
