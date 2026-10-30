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

// "lun 19 oct · 18:05"
export function formatDateTime(date: Date, language: Language) {
  const day = date
    .toLocaleDateString(language, {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    .replaceAll(".", "")
    .replace(",", "");
  const time = date.toLocaleTimeString(language, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${day} · ${time}`;
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

// The backup file keeps instants as ISO 8601 strings.
export function toIso(date: Date) {
  return date.toISOString();
}

export function toIsoOrNull(date: Date | null) {
  return date === null ? null : date.toISOString();
}
