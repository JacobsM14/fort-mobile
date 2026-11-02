import Storage from "expo-sqlite/kv-store";

const KEY = "weight_reminder";

// When the user wants to be reminded to weigh in, local time. Whether the
// reminder is on is a notification preference (notification-preferences.ts).
export type WeightReminder = {
  // 0 (Sunday) to 6 (Saturday), as Date.getDay() counts them.
  weekday: number;
  hour: number;
  minute: number;
};

// Until the user picks another: Monday morning, as the week starts.
const DEFAULT_REMINDER: WeightReminder = { weekday: 1, hour: 9, minute: 0 };

function isIntegerBetween(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

// The default when nothing was stored, or when what was stored doesn't make
// sense. Apart from loadWeightReminder so it can be tested without storage.
export function parseWeightReminder(stored: string | null): WeightReminder {
  if (stored === null) {
    return DEFAULT_REMINDER;
  }
  const [weekday, hour, minute] = stored.split(",").map(Number);
  if (
    isIntegerBetween(weekday, 0, 6) &&
    isIntegerBetween(hour, 0, 23) &&
    isIntegerBetween(minute, 0, 59)
  ) {
    return { weekday, hour, minute };
  }
  return DEFAULT_REMINDER;
}

export function loadWeightReminder(): WeightReminder {
  return parseWeightReminder(Storage.getItemSync(KEY));
}

// Stored as "weekday,hour,minute" in one key, so the day and the time are
// never out of step.
export function saveWeightReminder({ weekday, hour, minute }: WeightReminder) {
  Storage.setItemSync(KEY, `${weekday},${hour},${minute}`);
}
