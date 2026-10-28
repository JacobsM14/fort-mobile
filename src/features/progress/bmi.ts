import {
  BMI_FOR_AGE,
  BMI_FOR_AGE_FIRST_MONTH,
  BMI_FOR_AGE_LAST_MONTH,
} from "@/features/progress/bmi-for-age";

import type { LmsRow, ReferenceSex } from "@/features/progress/bmi-for-age";
import type { BodyWeightEntry } from "@/features/progress/queries";
import type { UserProfile } from "@/features/settings/user-profile";

import { parseDateKey } from "@/utils/date";

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

// How far the weight is from the normal band: what is over it while above,
// what is missing while below, and to the nearest limit while inside. The
// category decides the side, not the weight, so the hint agrees with the
// rounded BMI shown; the rounding can leave a hair past the limit, hence 0.
export function kilosToIdeal(
  weightKg: number,
  heightCm: number,
  bands: readonly BmiBand[],
  category: BmiCategory,
): number {
  const normal = bands.find((band) => band.id === "normal");
  if (normal === undefined) {
    throw new Error("The BMI bands have no normal band");
  }
  const heightM2 = (heightCm / 100) ** 2;
  const minKg = normal.from * heightM2;
  const maxKg = normal.to * heightM2;
  const distance =
    category === "underweight"
      ? minKg - weightKg
      : category === "normal"
        ? Math.min(weightKg - minKg, maxKg - weightKg)
        : weightKg - maxKg;
  return Math.max(0, distance);
}

export type BmiAssessment =
  | {
      status: "ready";
      value: number;
      category: BmiCategory;
      bands: readonly BmiBand[];
      toIdealKg: number;
      // No birth date: worked out as an adult.
      assumedAdult: boolean;
    }
  // A minor whose gender has no WHO reference: the value alone.
  | { status: "uncategorized"; value: number }
  | { status: "missing"; missing: readonly ("height" | "weight" | "gender")[] }
  | { status: "unsupported" };

// The BMI of the latest weigh-in, read for the user's age on that day: adults
// on the fixed WHO bands, from 5 to 19 years on the WHO reference for their
// sex. Without a birth date the user is taken for an adult.
export function assessBmi(
  profile: UserProfile,
  latest: BodyWeightEntry | undefined,
): BmiAssessment {
  const { heightCm, birthDate, gender } = profile;
  if (heightCm === null || latest === undefined) {
    return {
      status: "missing",
      missing: [
        ...(heightCm === null ? (["height"] as const) : []),
        ...(latest === undefined ? (["weight"] as const) : []),
      ],
    };
  }

  // Rounded as shown, so the category agrees with the number.
  const value = Math.round(bmiValue(latest.weightKg, heightCm) * 10) / 10;
  let bands = ADULT_BMI_BANDS;
  if (birthDate !== null) {
    const months = ageInMonths(parseDateKey(birthDate), latest.date);
    if (months < BMI_FOR_AGE_FIRST_MONTH) {
      return { status: "unsupported" };
    }
    if (months <= BMI_FOR_AGE_LAST_MONTH) {
      if (gender === null) {
        return { status: "missing", missing: ["gender"] };
      }
      if (gender === "other") {
        return { status: "uncategorized", value };
      }
      bands = bmiBandsForAge(gender, months);
    }
  }

  const category = bmiCategory(value, bands);
  return {
    status: "ready",
    value,
    category,
    bands,
    toIdealKg: kilosToIdeal(latest.weightKg, heightCm, bands, category),
    assumedAdult: birthDate === null,
  };
}
