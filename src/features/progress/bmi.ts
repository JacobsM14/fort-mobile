import {
  BMI_FOR_AGE,
  BMI_FOR_AGE_FIRST_MONTH,
} from "@/features/progress/bmi-for-age";

import type { LmsRow, ReferenceSex } from "@/features/progress/bmi-for-age";

export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

// One band of the scale, lowest first. The first band's start and the last
// band's end are where the scale is cut.
export type BmiBand = { id: BmiCategory; from: number; to: number };

// The WHO bands for adults. The scale is cut at 15 and 40: past them the
// column has nothing more to tell.
export const ADULT_BMI_BANDS: readonly BmiBand[] = [
  { id: "underweight", from: 15, to: 18.5 },
  { id: "normal", from: 18.5, to: 25 },
  { id: "overweight", from: 25, to: 30 },
  { id: "obese", from: 30, to: 40 },
];

// A band starts at its own threshold: 25 is already overweight.
export function bmiCategory(
  value: number,
  bands: readonly BmiBand[],
): BmiCategory {
  let category = bands[0].id;
  for (const band of bands) {
    if (value >= band.from) {
      category = band.id;
    }
  }
  return category;
}

// Each block's height in a column of the given height, lowest band first, as
// tall as the stretch of the scale it covers.
export function bmiBlockHeights(
  bands: readonly BmiBand[],
  height: number,
  gap: number,
) {
  const room = height - gap * (bands.length - 1);
  const span = bands[bands.length - 1].to - bands[0].from;
  return bands.map((band) => (room * (band.to - band.from)) / span);
}

// Where a value sits in the column, from the top: the highest band is drawn
// on top. A threshold falls in the middle of the gap between its two blocks,
// and values off the scale stick to its ends.
export function bmiScaleY(
  value: number,
  bands: readonly BmiBand[],
  height: number,
  gap: number,
) {
  const last = bands.length - 1;
  const clamped = Math.min(Math.max(value, bands[0].from), bands[last].to);
  const heights = bmiBlockHeights(bands, height, gap);
  let fromBottom = 0;
  for (const [index, band] of bands.entries()) {
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

export function bmiBandsForAge(
  sex: ReferenceSex,
  months: number,
): readonly BmiBand[] {
  const row = BMI_FOR_AGE[sex][months - BMI_FOR_AGE_FIRST_MONTH];
  if (row?.month !== months) {
    throw new Error(`No BMI-for-age reference for ${months} months`);
  }
  const [min, thin, over, obese, max] = [-3, -2, 1, 2, 3].map((z) =>
    lmsBmi(row, z),
  );
  return [
    { id: "underweight", from: min, to: thin },
    { id: "normal", from: thin, to: over },
    { id: "overweight", from: over, to: obese },
    { id: "obese", from: obese, to: max },
  ];
}
