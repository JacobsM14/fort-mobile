import type { Language } from "@/i18n";

export function formatDayHeader(date: Date, language: Language) {
  const weekday = date.toLocaleDateString(language, { weekday: "long" });
  const month = date
    .toLocaleDateString(language, { month: "short" })
    .replace(".", "");

  return `${weekday} ${date.getDate()} ${month}`.toLocaleUpperCase(language);
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
