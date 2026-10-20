import Storage from "expo-sqlite/kv-store";

import {
  DISTANCE_UNIT_PREFERENCES,
  WEIGHT_UNIT_PREFERENCES,
  type DistanceUnitPreference,
  type WeightUnitPreference,
} from "@/constants/enums";

const WEIGHT_KEY = "weight_unit_preference";
const DISTANCE_KEY = "distance_unit_preference";

function isWeightUnitPreference(
  value: string | null,
): value is WeightUnitPreference {
  return WEIGHT_UNIT_PREFERENCES.some((preference) => preference === value);
}

function isDistanceUnitPreference(
  value: string | null,
): value is DistanceUnitPreference {
  return DISTANCE_UNIT_PREFERENCES.some((preference) => preference === value);
}

export function loadWeightUnitPreference(): WeightUnitPreference {
  const stored = Storage.getItemSync(WEIGHT_KEY);
  return isWeightUnitPreference(stored) ? stored : "system";
}

export function saveWeightUnitPreference(preference: WeightUnitPreference) {
  Storage.setItemSync(WEIGHT_KEY, preference);
}

export function loadDistanceUnitPreference(): DistanceUnitPreference {
  const stored = Storage.getItemSync(DISTANCE_KEY);
  return isDistanceUnitPreference(stored) ? stored : "system";
}

export function saveDistanceUnitPreference(preference: DistanceUnitPreference) {
  Storage.setItemSync(DISTANCE_KEY, preference);
}
