import type { LmsRow } from "@/features/progress/bmi-for-age";

export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

// The WHO bands for adults. The scale is cut at 15 and 40: past them the
// column has nothing more to tell.
export const BMI_CATEGORIES: readonly {
  id: BmiCategory;
  from: number;
  to: number;
}[] = [
  { id: "underweight", from: 15, to: 18.5 },
  { id: "normal", from: 18.5, to: 25 },
  { id: "overweight", from: 25, to: 30 },
  { id: "obese", from: 30, to: 40 },
];

const SCALE_MIN = BMI_CATEGORIES[0].from;
const SCALE_MAX = BMI_CATEGORIES[BMI_CATEGORIES.length - 1].to;

// A band starts at its own threshold: 25 is already overweight.
export function bmiCategory(value: number): BmiCategory {
  let category = BMI_CATEGORIES[0].id;
  for (const band of BMI_CATEGORIES) {
    if (value >= band.from) {
      category = band.id;
    }
  }
  return category;
}

// Each block's height in a column of the given height, lowest band first, as
// tall as the stretch of the scale it covers.
export function bmiBlockHeights(height: number, gap: number) {
  const room = height - gap * (BMI_CATEGORIES.length - 1);
  return BMI_CATEGORIES.map(
    (band) => (room * (band.to - band.from)) / (SCALE_MAX - SCALE_MIN),
  );
}

// Where a value sits in the column, from the top: the highest band is drawn
// on top. A threshold falls in the middle of the gap between its two blocks,
// and values off the scale stick to its ends.
export function bmiScaleY(value: number, height: number, gap: number) {
  const clamped = Math.min(Math.max(value, SCALE_MIN), SCALE_MAX);
  const heights = bmiBlockHeights(height, gap);
  const last = BMI_CATEGORIES.length - 1;
  let fromBottom = 0;
  for (const [index, band] of BMI_CATEGORIES.entries()) {
    const blockHeight = heights[index];
    if (clamped === band.to && index < last) {
      return height - (fromBottom + blockHeight + gap / 2);
    }
    if (clamped <= band.to) {
      const fraction = (clamped - band.from) / (band.to - band.from);
      return height - (fromBottom + fraction * blockHeight);
    }
    fromBottom += blockHeight + gap;
  }
  return 0;
}

export function bmiValue(weight: number, height: number) {
  const heightM = height / 100;
  return weight / (heightM * heightM);
}

export function ageInMonths(birthDate: Date, referenceDate: Date = new Date()) {
  const years = referenceDate.getFullYear() - birthDate.getFullYear();
  const months = referenceDate.getMonth() - birthDate.getMonth();
  const dayNotReached = referenceDate.getDate() < birthDate.getDate() ? 1 : 0;
  return years * 12 + months - dayNotReached;
}

export function lmsBmi(row: LmsRow, z: number): number {
  const { l, m, s } = row;
  return m * Math.pow(1 + l * s * z, 1 / l);
}
