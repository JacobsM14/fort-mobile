// The hour of the day the reminder goes off, local time.
const REMINDER_HOUR = 9;

// When to remind the user to weigh in next, or null when the reminder is off.
// Today counts while its hour hasn't passed, unless they already weighed in.
export function nextWeightReminder(
  weekday: number | null,
  now: Date,
  weighedToday: boolean,
): Date | null {
  if (weekday === null) {
    return null;
  }
  const daysAhead = (weekday - now.getDay() + 7) % 7;
  // Built from the calendar day, not by adding milliseconds, so it stays at
  // the same local hour across a clock change.
  const at = (days: number) =>
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + days,
      REMINDER_HOUR,
    );

  const next = at(daysAhead);
  const skipToday = daysAhead === 0 && weighedToday;
  return next <= now || skipToday ? at(daysAhead + 7) : next;
}
