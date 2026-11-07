import Storage from "expo-sqlite/kv-store";

import { isOneOf } from "@/utils/guards";

// A setting that is one of a list of values, kept under its own key. Reading
// it gives the fallback until something valid has been saved, so a value
// from an older version, or a removed one, never reaches the app. NoInfer
// makes a fallback that isn't in the list a type error instead of a new value.
export function storedChoice<T extends string>(
  key: string,
  values: readonly T[],
  fallback: NoInfer<T>,
) {
  return {
    load(): T {
      const stored = Storage.getItemSync(key);
      return isOneOf(values, stored) ? stored : fallback;
    },
    save(value: T) {
      Storage.setItemSync(key, value);
    },
  };
}
