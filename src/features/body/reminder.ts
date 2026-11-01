import type { WeightReminder } from "@/features/settings/weight-reminder";

// When to remind the user to weigh in next, or null when the reminder is off.
// Today counts while the chosen time hasn't passed, unless they already
// weighed in.
export function nextWeightReminder(
  reminder: WeightReminder | null,
  now: Date,
  weighedToday: boolean,
): Date | null {
  if (reminder === null) {
    return null;
  }
  const daysAhead = (reminder.weekday - now.getDay() + 7) % 7;
  // Built from the calendar day, not by adding milliseconds, so it stays at
  // the same local time across a clock change.
  const at = (days: number) =>
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + days,
      reminder.hour,
      reminder.minute,
    );

  const next = at(daysAhead);
  const skipToday = daysAhead === 0 && weighedToday;
  return next <= now || skipToday ? at(daysAhead + 7) : next;
}
