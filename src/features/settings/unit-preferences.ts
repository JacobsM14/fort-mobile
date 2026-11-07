import {
  DISTANCE_UNIT_PREFERENCES,
  WEIGHT_UNIT_PREFERENCES,
} from "@/constants/enums";

import { storedChoice } from "./stored-choice";

const weightUnitPreference = storedChoice(
  "weight_unit_preference",
  WEIGHT_UNIT_PREFERENCES,
  "system",
);
const distanceUnitPreference = storedChoice(
  "distance_unit_preference",
  DISTANCE_UNIT_PREFERENCES,
  "system",
);

export const loadWeightUnitPreference = weightUnitPreference.load;
export const saveWeightUnitPreference = weightUnitPreference.save;
export const loadDistanceUnitPreference = distanceUnitPreference.load;
export const saveDistanceUnitPreference = distanceUnitPreference.save;
