import type { TrackingType } from "@/constants/enums";
import type { SymbolViewProps } from "expo-symbols";

export const TRACKING_TYPE_ICONS: Record<
  TrackingType,
  SymbolViewProps["name"]
> = {
  weight_reps: {
    ios: "dumbbell.fill",
    android: "fitness_center",
    web: "fitness_center",
  },
  bodyweight_reps: {
    ios: "figure.strengthtraining.functional",
    android: "sports_gymnastics",
    web: "sports_gymnastics",
  },
  duration: { ios: "timer", android: "timer", web: "timer" },
  distance_duration: {
    ios: "figure.run",
    android: "directions_run",
    web: "directions_run",
  },
};
