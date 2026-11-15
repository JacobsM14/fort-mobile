import { Storage } from "expo-sqlite/kv-store";

// The key is still the one of the onboarding that held the setup and the
// tutorial together, so whoever finished it doesn't get the setup again.
const KEY = "onboarding_completed_v2";

export function hasCompletedSetup() {
  const value = Storage.getItemSync(KEY);
  return value === "true";
}

export function markSetupCompleted() {
  Storage.setItemSync(KEY, "true");
}
