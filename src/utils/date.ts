import type { Language } from "@/i18n";

export function formatDayHeader(date: Date, language: Language) {
  const weekday = date.toLocaleDateString(language, { weekday: "long" });
  const month = date
    .toLocaleDateString(language, { month: "short" })
    .replace(".", "");

  return `${weekday} ${date.getDate()} ${month}`.toLocaleUpperCase(language);
}

// "26 oct" / "Oct 26": the day and month, in the language's own order and
// without the month's dot, like the header.
export function formatShortDay(date: Date, language: Language) {
  return date
    .toLocaleDateString(language, { day: "numeric", month: "short" })
    .replace(".", "");
}

// "18:05"
export function formatTime(date: Date, language: Language) {
  return date.toLocaleTimeString(language, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// "lun 19 oct"
export function formatShortDate(date: Date, language: Language) {
  return date
    .toLocaleDateString(language, {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    .replaceAll(".", "")
    .replace(",", "");
}

// "lun 19 oct · 18:05"
export function formatDateTime(date: Date, language: Language) {
  return `${formatShortDate(date, language)} · ${formatTime(date, language)}`;
}

export function getWeekDays(date: Date, firstWeekday: number) {
  const offset = (date.getDay() - (firstWeekday - 1) + 7) % 7;

  return Array.from(
    { length: 7 },
    (_, i) =>
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - offset + i,
      ),
  );
}

// The first day of each of the last `count` weeks, the oldest first and the
// week of `today` last. Weeks start on `firstWeekday` (1 is Sunday), as in the
// week shown in Today.
export function lastWeekStarts(
  today: Date,
  firstWeekday: number,
  count: number,
): Date[] {
  const [thisWeek] = getWeekDays(today, firstWeekday);
  return Array.from({ length: count }, (_, index) => {
    const weeksBack = count - 1 - index;
    return new Date(
      thisWeek.getFullYear(),
      thisWeek.getMonth(),
      thisWeek.getDate() - weeksBack * 7,
    );
  });
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// The first day of the week of `today` and of every week before it back to
// the week of `since`, the newest first. Without `since`, or with one in this
// week or later, only this week.
export function weekStartsSince(
  today: Date,
  firstWeekday: number,
  since: Date | undefined,
): Date[] {
  if (since === undefined) {
    return lastWeekStarts(today, firstWeekday, 1);
  }
  const [thisWeek] = getWeekDays(today, firstWeekday);
  const [firstWeek] = getWeekDays(since, firstWeekday);
  // Rounded: a daylight saving change leaves one week an hour short or long.
  const weeksBack = Math.round(
    (thisWeek.getTime() - firstWeek.getTime()) / WEEK_MS,
  );
  return lastWeekStarts(
    today,
    firstWeekday,
    Math.max(weeksBack, 0) + 1,
  ).reverse();
}

// When the week that starts on `weekStart` is over: a week is [start, end).
export function weekEnd(weekStart: Date) {
  return new Date(
    weekStart.getFullYear(),
    weekStart.getMonth(),
    weekStart.getDate() + 7,
  );
}

// The earliest of the dates given, leaving out the missing ones.
export function earliestDate(dates: readonly (Date | undefined)[]) {
  return dates.reduce<Date | undefined>(
    (earliest, date) =>
      date !== undefined && (earliest === undefined || date < earliest)
        ? date
        : earliest,
    undefined,
  );
}

// A day already gone without a workout: Today's week and the history draw it
// dashed. Today itself isn't missed yet.
export function isMissedDay(day: Date, trained: boolean, today: Date) {
  return !trained && day < today && day.toDateString() !== today.toDateString();
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Until the next local midnight. Built from the calendar day, so a day made an
// hour shorter or longer by a clock change still ends at midnight.
export function msUntilNextDay(now: Date) {
  const nextDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );
  return nextDay.getTime() - now.getTime();
}

// Every local day from `from` up to (not including) `to`, newest first.
export function getDaysBetween(from: Date, to: Date) {
  const days: Date[] = [];
  const cursor = new Date(to.getFullYear(), to.getMonth(), to.getDate() - 1);
  while (cursor >= from) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() - 1);
  }
  return days;
}

// "2026-10-24", in local time: the key a day travels with in a route.
export function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// The inverse of toDateKey: midnight of that day, in local time.
export function parseDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Whether a value is a key toDateKey could have written. The round trip
// through Date rejects days that don't exist, like February 30th, without
// depending on how an engine parses them.
export function isDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// The backup file keeps instants as ISO 8601 strings.
export function toIso(date: Date) {
  return date.toISOString();
}

export function toIsoOrNull(date: Date | null) {
  return date === null ? null : date.toISOString();
}

export function fromIso(iso: string) {
  return new Date(iso);
}

export function fromIsoOrNull(iso: string | null) {
  return iso === null ? null : new Date(iso);
}

// Exactly what toISOString writes: parsing anything looser would accept
// formats that differ from one JavaScript engine to another.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export function isIsoDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    ISO_DATE.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
}
