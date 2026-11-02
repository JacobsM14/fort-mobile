import { requireOptionalNativeModule } from "expo";

import type { ScheduleOptions } from "./src/types";

type WeightReminderModule = {
  schedule(options: ScheduleOptions): void;
  cancel(): void;
};

// Android only. On iOS, web, Expo Go and in tests there is no native module,
// and these do nothing.
const native =
  requireOptionalNativeModule<WeightReminderModule>("WeightReminder");

export function schedule(options: ScheduleOptions): void {
  native?.schedule(options);
}

export function cancel(): void {
  native?.cancel();
}
