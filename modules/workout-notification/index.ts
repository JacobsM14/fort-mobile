import { NativeModule, requireOptionalNativeModule } from "expo";
import type { ShowOptions } from "./src/types";

declare class WorkoutNotificationModule extends NativeModule<{}> {
  show(options: ShowOptions): void;
  dismiss(): void;
}

const native = requireOptionalNativeModule<WorkoutNotificationModule>(
  "WorkoutNotification",
);

export function show(options: ShowOptions): void {
  native?.show(options);
}
export function dismiss(): void {
  native?.dismiss();
}
