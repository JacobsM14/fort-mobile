import type { WeightUnit } from "@/constants/enums";

import { toDateKey } from "@/utils/date";
import { parseDecimal, parseInteger } from "@/utils/number";
import { feetInchesToCm, weightFromUnit } from "@/utils/units";

const MIN_HEIGHT_CM = 50;
const MAX_HEIGHT_CM = 260;
const MIN_WEIGHT_KG = 20;
const MAX_WEIGHT_KG = 400;
const MIN_BIRTH_YEAR = 1900;
const MAX_FEET = 8;
const MAX_INCHES = 11;

// Whole centimeters, within what a person can measure.
export function parseHeightCm(text: string): number | null {
  const value = parseInteger(text);
  return value !== null && value >= MIN_HEIGHT_CM && value <= MAX_HEIGHT_CM
    ? value
    : null;
}

// A body weight typed in the user's unit, in kg, within what a person can
// weigh.
export function parseBodyWeightKg(
  text: string,
  unit: WeightUnit,
): number | null {
  const value = parseDecimal(text);
  if (value === null) {
    return null;
  }
  const kg = weightFromUnit(value, unit);
  return kg >= MIN_WEIGHT_KG && kg <= MAX_WEIGHT_KG ? kg : null;
}

// Inches may be left empty: 6 feet is 6 feet 0.
export function parseHeightFeetInches(
  feetText: string,
  inchesText: string,
): number | null {
  const feet = parseInteger(feetText);
  const inches = inchesText.trim() === "" ? 0 : parseInteger(inchesText);
  if (feet === null || feet < 1 || feet > MAX_FEET) {
    return null;
  }
  if (inches === null || inches > MAX_INCHES) {
    return null;
  }
  return parseHeightCm(String(feetInchesToCm(feet, inches)));
}

// "1994-03-07" from three texts, or null when it isn't a real day, or hasn't
// happened yet.
export function parseBirthDate(
  dayText: string,
  monthText: string,
  yearText: string,
  today: Date,
): string | null {
  const day = parseInteger(dayText);
  const month = parseInteger(monthText);
  const year = parseInteger(yearText);
  if (day === null || month === null || year === null) {
    return null;
  }
  if (year < MIN_BIRTH_YEAR) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  // 31 February rolls over to March: the date no longer matches what was typed.
  const real =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  return real && date.getTime() <= today.getTime() ? toDateKey(date) : null;
}
