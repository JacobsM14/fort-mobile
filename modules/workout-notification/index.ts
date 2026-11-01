import { requireOptionalNativeModule } from "expo";

import type { ShowOptions } from "./src/types";

type WorkoutNotificationModule = {
  show(options: ShowOptions): void;
  dismiss(): void;
};

// Android only. On iOS, web, Expo Go and in tests there is no native module,
// and these do nothing.
const native = requireOptionalNativeModule<WorkoutNotificationModule>(
  "WorkoutNotification",
);

export function show(options: ShowOptions): void {
  native?.show(options);
}

export function dismiss(): void {
  native?.dismiss();
}
