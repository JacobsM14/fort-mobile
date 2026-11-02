import Storage from "expo-sqlite/kv-store";

// Which notifications the user wants. The day and time of the weigh-in
// reminder are kept apart (weight-reminder.ts), so turning it off and on again
// doesn't lose them.
export type NotificationPreferences = {
  // Over the rest: while it is off, no notification is shown.
  enabled: boolean;
  workout: boolean;
  weightReminder: boolean;
};

const KEYS: Record<keyof NotificationPreferences, string> = {
  enabled: "notifications_enabled",
  workout: "workout_notification_enabled",
  weightReminder: "weight_reminder_enabled",
};

// The workout notification was always shown before it could be turned off,
// so it stays on. The reminder only makes sense once the user asks for it.
const DEFAULTS: NotificationPreferences = {
  enabled: true,
  workout: true,
  weightReminder: false,
};

function loadFlag(name: keyof NotificationPreferences): boolean {
  const stored = Storage.getItemSync(KEYS[name]);
  return stored === null ? DEFAULTS[name] : stored === "1";
}

function saveFlag(name: keyof NotificationPreferences, value: boolean) {
  Storage.setItemSync(KEYS[name], value ? "1" : "0");
}

export function loadNotificationPreferences(): NotificationPreferences {
  return {
    enabled: loadFlag("enabled"),
    workout: loadFlag("workout"),
    weightReminder: loadFlag("weightReminder"),
  };
}

export function saveNotificationPreferences(
  preferences: NotificationPreferences,
) {
  saveFlag("enabled", preferences.enabled);
  saveFlag("workout", preferences.workout);
  saveFlag("weightReminder", preferences.weightReminder);
}
