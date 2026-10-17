import type { Language } from "@/i18n";

export function formatDayHeader(date: Date, language: Language) {
  const weekday = date.toLocaleDateString(language, { weekday: "long" });
  const month = date
    .toLocaleDateString(language, { month: "short" })
    .replace(".", "");

  return `${weekday} ${date.getDate()} ${month}`.toLocaleUpperCase(language);
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
