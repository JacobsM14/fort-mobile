// One capture per slide and language, so the screens match the language
// the user picked in the second step.
import type { Language } from "@/i18n";

export const TOUR_SLIDES = [
  "newRoutine",
  "picker",
  "today",
  "workout",
  "progress",
  "history",
] as const;

export type TourSlide = (typeof TOUR_SLIDES)[number];

export const TOUR_IMAGES: Record<Language, Record<TourSlide, number>> = {
  es: {
    newRoutine: require("@/assets/onboarding/es/new-routine.webp"),
    picker: require("@/assets/onboarding/es/picker.webp"),
    today: require("@/assets/onboarding/es/today.webp"),
    workout: require("@/assets/onboarding/es/workout.webp"),
    progress: require("@/assets/onboarding/es/progress.webp"),
    history: require("@/assets/onboarding/es/history.webp"),
  },
  en: {
    newRoutine: require("@/assets/onboarding/en/new-routine.webp"),
    picker: require("@/assets/onboarding/en/picker.webp"),
    today: require("@/assets/onboarding/en/today.webp"),
    workout: require("@/assets/onboarding/en/workout.webp"),
    progress: require("@/assets/onboarding/en/progress.webp"),
    history: require("@/assets/onboarding/en/history.webp"),
  },
  ca: {
    newRoutine: require("@/assets/onboarding/ca/new-routine.webp"),
    picker: require("@/assets/onboarding/ca/picker.webp"),
    today: require("@/assets/onboarding/ca/today.webp"),
    workout: require("@/assets/onboarding/ca/workout.webp"),
    progress: require("@/assets/onboarding/ca/progress.webp"),
    history: require("@/assets/onboarding/ca/history.webp"),
  },
  eu: {
    newRoutine: require("@/assets/onboarding/eu/new-routine.webp"),
    picker: require("@/assets/onboarding/eu/picker.webp"),
    today: require("@/assets/onboarding/eu/today.webp"),
    workout: require("@/assets/onboarding/eu/workout.webp"),
    progress: require("@/assets/onboarding/eu/progress.webp"),
    history: require("@/assets/onboarding/eu/history.webp"),
  },
  fr: {
    newRoutine: require("@/assets/onboarding/fr/new-routine.webp"),
    picker: require("@/assets/onboarding/fr/picker.webp"),
    today: require("@/assets/onboarding/fr/today.webp"),
    workout: require("@/assets/onboarding/fr/workout.webp"),
    progress: require("@/assets/onboarding/fr/progress.webp"),
    history: require("@/assets/onboarding/fr/history.webp"),
  },
  pt: {
    newRoutine: require("@/assets/onboarding/pt/new-routine.webp"),
    picker: require("@/assets/onboarding/pt/picker.webp"),
    today: require("@/assets/onboarding/pt/today.webp"),
    workout: require("@/assets/onboarding/pt/workout.webp"),
    progress: require("@/assets/onboarding/pt/progress.webp"),
    history: require("@/assets/onboarding/pt/history.webp"),
  },
};
