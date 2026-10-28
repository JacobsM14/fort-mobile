import type { Language } from "@/i18n";

import { formatDecimal, roundToTenth, withSign } from "@/utils/number";
import { weightToUnit, type Units } from "@/utils/units";

// A body weight in the user's unit, without it: "72,4".
export function formatBodyWeightValue(
  weightKg: number,
  units: Units,
  language: Language,
) {
  return formatDecimal(
    roundToTenth(weightToUnit(weightKg, units.weight)),
    language,
  );
}

// The same with the unit after it: "72,4kg".
export function formatBodyWeight(
  weightKg: number,
  units: Units,
  language: Language,
) {
  return `${formatBodyWeightValue(weightKg, units, language)}${units.weight}`;
}

// A change in body weight as it reads next to a weigh-in, which already shows
// the unit: "+0,4". A change that rounds to nothing carries no sign.
export function formatWeightChange(
  changeKg: number,
  units: Units,
  language: Language,
) {
  const rounded = roundToTenth(weightToUnit(changeKg, units.weight));
  return withSign(rounded, formatDecimal(Math.abs(rounded), language));
}
