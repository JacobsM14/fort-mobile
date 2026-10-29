import type { DistanceUnit, WeightUnit } from "@/constants/enums";

// The database keeps kg and meters; other units are only converted for
// showing and typing, so the history never changes when the unit does.

export type Units = {
  weight: WeightUnit;
  distance: DistanceUnit;
};

const KG_PER_LB = 0.45359237;
const METERS_PER_UNIT: Record<DistanceUnit, number> = {
  km: 1000,
  mi: 1609.344,
};

export function weightToUnit(kg: number, unit: WeightUnit) {
  return unit === "kg" ? kg : kg / KG_PER_LB;
}

// Not rounded: 100 lb is stored as 45.359237 kg, so it reads 100 lb again.
export function weightFromUnit(value: number, unit: WeightUnit) {
  return unit === "kg" ? value : value * KG_PER_LB;
}

export function distanceToUnit(meters: number, unit: DistanceUnit) {
  return meters / METERS_PER_UNIT[unit];
}

export function distanceFromUnit(value: number, unit: DistanceUnit) {
  return Math.round(value * METERS_PER_UNIT[unit]);
}

const CM_PER_INCH = 2.54;
const INCHES_PER_FOOT = 12;

// Heights are kept in cm; feet and inches are only for typing and showing.
export function feetInchesToCm(feet: number, inches: number) {
  return Math.round((feet * INCHES_PER_FOOT + inches) * CM_PER_INCH);
}

export function cmToFeetInches(cm: number) {
  const totalInches = Math.round(cm / CM_PER_INCH);
  return {
    feet: Math.floor(totalInches / INCHES_PER_FOOT),
    inches: totalInches % INCHES_PER_FOOT,
  };
}
