import { useCalendars } from "expo-localization";

// Weekdays count from 1 on Sunday, so 2 is Monday.
const MONDAY = 2;

// The day the user's calendar starts its weeks on.
export function useFirstWeekday(): number {
  const [calendar] = useCalendars();
  return calendar.firstWeekday ?? MONDAY;
}
