import { useLocales } from "expo-localization";
import { createContext, use, useState, type ReactNode } from "react";

import {
  loadDistanceUnitPreference,
  loadWeightUnitPreference,
  saveDistanceUnitPreference,
  saveWeightUnitPreference,
} from "@/features/settings/unit-preferences";

import type {
  DistanceUnit,
  DistanceUnitPreference,
  WeightUnit,
  WeightUnitPreference,
} from "@/constants/enums";
import type { Units } from "@/utils/units";

type UnitsContextValue = {
  weightPreference: WeightUnitPreference;
  distancePreference: DistanceUnitPreference;
  setWeightPreference: (preference: WeightUnitPreference) => void;
  setDistancePreference: (preference: DistanceUnitPreference) => void;
};

const UnitsContext = createContext<UnitsContextValue | null>(null);

// Weight and distance are picked apart: plenty of people lift in kg and run
// in miles, or the other way round.
export function UnitsProvider({ children }: { children: ReactNode }) {
  const [weightPreference, setWeightPreferenceState] = useState(
    loadWeightUnitPreference,
  );
  const [distancePreference, setDistancePreferenceState] = useState(
    loadDistanceUnitPreference,
  );

  function setWeightPreference(next: WeightUnitPreference) {
    saveWeightUnitPreference(next);
    setWeightPreferenceState(next);
  }

  function setDistancePreference(next: DistanceUnitPreference) {
    saveDistanceUnitPreference(next);
    setDistancePreferenceState(next);
  }

  return (
    <UnitsContext
      value={{
        weightPreference,
        distancePreference,
        setWeightPreference,
        setDistancePreference,
      }}
    >
      {children}
    </UnitsContext>
  );
}

// The units to show, with "system" resolved from the device: the US uses
// pounds and miles, the UK kg in the gym and miles on the road.
export function useUnits(): Units &
  UnitsContextValue & {
    systemWeight: WeightUnit;
    systemDistance: DistanceUnit;
  } {
  const context = use(UnitsContext);
  if (context === null) {
    throw new Error("useUnits must be used inside UnitsProvider");
  }
  const [locale] = useLocales();
  const system = locale.measurementSystem;
  const systemWeight: WeightUnit = system === "us" ? "lb" : "kg";
  const systemDistance: DistanceUnit =
    system === "us" || system === "uk" ? "mi" : "km";
  const weight =
    context.weightPreference !== "system"
      ? context.weightPreference
      : systemWeight;
  const distance =
    context.distancePreference !== "system"
      ? context.distancePreference
      : systemDistance;

  return { ...context, weight, distance, systemWeight, systemDistance };
}
