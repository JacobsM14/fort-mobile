import { toDateKey } from "@/utils/date";

// How much was done in a day, from nothing to the most.
export const INTENSITY_LEVELS = [0, 1, 2, 3, 4] as const;
export type IntensityLevel = (typeof INTENSITY_LEVELS)[number];

// A little over 7 months
export const ACTIVITY_CALENDAR_WEEKS = 31;

// Sets done in a day to reach each level from 1 to 4.
export const INTENSITY_THRESHOLDS = [1, 8, 15, 22] as const;

export function intensityLevel(sets: number): IntensityLevel {
  const reached = INTENSITY_THRESHOLDS.filter((min) => sets >= min).length;
  return INTENSITY_LEVELS[reached];
}

// Sets done on each day, keyed with toDateKey. A row is a set done.
export function toDailySets(
  rows: readonly { startedAt: Date }[],
): Map<string, number> {
  const setsByDay = new Map<string, number>();
  for (const { startedAt } of rows) {
    const key = toDateKey(startedAt);
    setsByDay.set(key, (setsByDay.get(key) ?? 0) + 1);
  }
  return setsByDay;
}

// One column per week, 7 days each; null for the days after `today`.
export function toCalendarLevels(
  weekStarts: readonly Date[],
  setsByDay: ReadonlyMap<string, number>,
  today: Date,
): (IntensityLevel | null)[][] {
  const calendar: (IntensityLevel | null)[][] = [];
  for (const weekStart of weekStarts) {
    const week: (IntensityLevel | null)[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      if (day > today) {
        week.push(null);
      } else {
        const key = toDateKey(day);
        const sets = setsByDay.get(key) ?? 0;
        week.push(intensityLevel(sets));
      }
    }
    calendar.push(week);
  }
  return calendar;
}
