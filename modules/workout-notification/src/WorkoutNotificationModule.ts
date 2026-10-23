import { NativeModule, requireNativeModule } from "expo";

import type { ShowOptions } from "./types";

declare class WorkoutNotificationModule extends NativeModule<{}> {
  show(options: ShowOptions): Promise<void>;
  dismiss(): Promise<void>;
}

export default requireNativeModule<WorkoutNotificationModule>(
  "WorkoutNotification",
);
