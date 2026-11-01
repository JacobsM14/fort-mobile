import Storage from "expo-sqlite/kv-store";

const KEY = "weight_reminder_weekday";

// 0 (Sunday) to 6 (Saturday), as Date.getDay() counts them.
function isWeekday(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 6;
}

// The day of the week the user wants to be reminded to weigh in, or null
// when the reminder is off.
export function loadWeightReminderWeekday(): number | null {
  const stored = Storage.getItemSync(KEY);
  if (stored === null) {
    return null;
  }
  const weekday = Number(stored);
  return isWeekday(weekday) ? weekday : null;
}

export function saveWeightReminderWeekday(weekday: number | null) {
  if (weekday === null) {
    Storage.removeItemSync(KEY);
  } else {
    Storage.setItemSync(KEY, String(weekday));
  }
}
