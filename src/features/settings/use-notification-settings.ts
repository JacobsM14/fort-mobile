import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { useRescheduleWeightReminder } from "@/features/body/notification";
import { dismissWorkoutNotification } from "@/features/workouts/notification";

import {
  ensureNotificationPermission,
  hasNotificationPermission,
} from "./notification-permission";
import {
  loadNotificationPreferences,
  saveNotificationPreferences,
  type NotificationPreferences,
} from "./notification-preferences";
import {
  loadWeightReminder,
  saveWeightReminder,
  type WeightReminder,
} from "./weight-reminder";

// The notifications screen. Every change is saved and applied at once: the
// weigh-in reminder is scheduled again, and the workout notification removed
// if it is turned off in the middle of a workout.
export function useNotificationSettings() {
  const [preferences, setPreferences] = useState(loadNotificationPreferences);
  const [reminder, setReminderState] = useState(loadWeightReminder);
  // Null until checked.
  const [permitted, setPermitted] = useState<boolean | null>(null);
  const rescheduleWeightReminder = useRescheduleWeightReminder();

  // Checked again on coming back to the app: the user may have gone to the
  // system settings to allow notifications.
  useEffect(() => {
    function check() {
      void hasNotificationPermission().then(setPermitted);
    }
    check();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        check();
      }
    });
    return () => subscription.remove();
  }, []);

  function update(next: NotificationPreferences) {
    saveNotificationPreferences(next);
    setPreferences(next);
    if (!next.enabled || !next.workout) {
      dismissWorkoutNotification();
    }
    rescheduleWeightReminder();
  }

  // Turning them on asks for the permission. Once denied twice Android no
  // longer shows the dialog, and the screen points to the system settings.
  async function setEnabled(enabled: boolean) {
    if (enabled) {
      const granted = await ensureNotificationPermission();
      setPermitted(granted);
      if (!granted) {
        return;
      }
    }
    update({ ...preferences, enabled });
  }

  function setReminder(next: WeightReminder) {
    saveWeightReminder(next);
    setReminderState(next);
    rescheduleWeightReminder();
  }

  return {
    // Shown off without the permission, whatever was saved: nothing would
    // reach the user anyway.
    enabled: preferences.enabled && permitted !== false,
    blocked: permitted === false,
    workout: preferences.workout,
    weightReminder: preferences.weightReminder,
    reminder,
    setEnabled,
    setWorkout: (workout: boolean) => update({ ...preferences, workout }),
    setWeightReminder: (weightReminder: boolean) =>
      update({ ...preferences, weightReminder }),
    setReminder,
  };
}
