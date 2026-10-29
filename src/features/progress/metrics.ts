import type { TrackingType } from "@/constants/enums";
import type { SetValues } from "@/features/workouts/queries";
import type { Language } from "@/i18n";
import type { Translations } from "@/i18n/es";

import { formatDuration } from "@/utils/duration";
import { formatDecimal, roundToTenth, withSign } from "@/utils/number";
import { distanceToUnit, weightToUnit, type Units } from "@/utils/units";

const SECONDS_PER_HOUR = 3600;
// Epley's formula only holds for low reps: past this, reps measure endurance
// more than strength, and 60 kg x 30 would read as a 120 kg max. Whoever did
// more could surely have done this many, so counting them as this never
// overstates by much and keeps the day on the chart.
const MAX_ONE_REP_MAX_REPS = 15;

// Epley's formula. One rep is already the max, so it gets nothing added.
export function estimatedOneRepMax(weightKg: number, reps: number) {
  const counted = Math.min(reps, MAX_ONE_REP_MAX_REPS);
  return counted <= 1 ? weightKg : weightKg * (1 + counted / 30);
}

function setMetric(trackingType: TrackingType, set: SetValues): number | null {
  switch (trackingType) {
    case "weight_reps":
      return set.weightKg === null || set.reps === null || set.reps === 0
        ? null
        : estimatedOneRepMax(set.weightKg, set.reps);
    case "bodyweight_reps":
      return set.reps;
    case "duration":
      return set.durationS;
    case "distance_duration":
      // Meters per second; formatMetric shows it as km/h or mph. The fastest
      // set wins whatever its distance, so a short sprint beats a long run:
      // to revisit with real data (e.g. comparing similar distances).
      return set.distanceM === null ||
        set.durationS === null ||
        set.durationS === 0
        ? null
        : set.distanceM / set.durationS;
  }
}

// A day is its best set, so doing more or fewer sets doesn't move the line:
// only getting stronger, longer or faster does. Higher is better for all.
export function dailyMetric(
  trackingType: TrackingType,
  sets: readonly SetValues[],
): number | null {
  let best: number | null = null;
  for (const set of sets) {
    const value = setMetric(trackingType, set);
    if (value !== null && value > 0 && (best === null || value > best)) {
      best = value;
    }
  }
  return best;
}

// How much the last day of a period is above (or below) the first one, in the
// metric's own base unit. Null with fewer than two days to compare.
export function progressChange(
  points: readonly { value: number }[],
): number | null {
  const first = points.at(0);
  const last = points.at(-1);
  if (points.length < 2 || first === undefined || last === undefined) {
    return null;
  }
  return last.value - first.value;
}

export function formatMetric(
  trackingType: TrackingType,
  value: number,
  units: Units,
  t: Translations,
  language: Language,
) {
  switch (trackingType) {
    case "weight_reps":
      return `${formatDecimal(roundToTenth(weightToUnit(value, units.weight)), language)} ${units.weight}`;
    case "bodyweight_reps":
      return t.progress.reps(value);
    case "duration":
      return formatDuration(value);
    case "distance_duration": {
      const perHour = distanceToUnit(value * SECONDS_PER_HOUR, units.distance);
      return `${formatDecimal(roundToTenth(perHour), language)} ${t.progress.speedUnit[units.distance]}`;
    }
  }
}

// A change as it reads under the picker: "+16 kg · 1RM est.", "+1,2 km/h".
// A change that rounds to nothing carries no sign.
export function formatChange(
  trackingType: TrackingType,
  change: number,
  units: Units,
  t: Translations,
  language: Language,
) {
  switch (trackingType) {
    case "weight_reps": {
      const rounded = roundToTenth(weightToUnit(change, units.weight));
      return `${withSign(rounded, formatDecimal(Math.abs(rounded), language))} ${units.weight} · ${t.progress.oneRepMaxShort}`;
    }
    case "bodyweight_reps": {
      const rounded = Math.round(change);
      return withSign(rounded, t.progress.reps(Math.abs(rounded)));
    }
    case "duration": {
      const rounded = Math.round(change);
      return withSign(rounded, formatDuration(Math.abs(rounded)));
    }
    case "distance_duration": {
      const rounded = roundToTenth(
        distanceToUnit(change * SECONDS_PER_HOUR, units.distance),
      );
      return `${withSign(rounded, formatDecimal(Math.abs(rounded), language))} ${t.progress.speedUnit[units.distance]}`;
    }
  }
}
