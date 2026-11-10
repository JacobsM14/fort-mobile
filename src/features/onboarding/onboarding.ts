import { Storage } from "expo-sqlite/kv-store";

const KEY = "onboarding_completed";

export function hasCompletedOnboarding() {
  const value = Storage.getItemSync(KEY);
  return value === "true";
}

export function markOnboardingCompleted() {
  Storage.setItemSync(KEY, "true");
}
