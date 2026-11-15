import type { Language } from "@/i18n";

// Accepts both "62,5" and "62.5": Spanish keyboards type a comma.
export function parseDecimal(text: string): number | null {
  const normalized = text.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$|^\d+\.$|^\.\d+$/.test(normalized)) {
    return null;
  }
  return Number(normalized);
}

export function parseInteger(text: string): number | null {
  const trimmed = text.trim();
  return /^\d+$/.test(trimmed) ? Number(trimmed) : null;
}

// Up to two decimals and no thousands separator, so it can go back into an
// input: 62.5 reads "62,5" in Spanish.
export function formatDecimal(value: number, language: Language) {
  return value.toLocaleString(language, {
    maximumFractionDigits: 2,
    useGrouping: false,
  });
}

// A share from 0 to 1 as each language writes a percentage: "33 %" in Spanish,
// "33%" in English, "% 33" in Basque.
export function formatPercent(share: number, language: Language) {
  return share.toLocaleString(language, {
    style: "percent",
    maximumFractionDigits: 0,
  });
}

// One decimal, as weights and speeds are shown. Also hides the float noise of
// repeated steps of 0.1.
export function roundToTenth(value: number) {
  return Math.round(value * 10) / 10;
}

// The sign of a rounded change before its text, which shows it unsigned: a
// change that rounds to nothing carries none.
export function withSign(rounded: number, text: string) {
  return `${rounded > 0 ? "+" : rounded < 0 ? "-" : ""}${text}`;
}

// Like value % size, but never negative: on a clock face one step back from 0
// is size - 1.
export function wrap(value: number, size: number) {
  return ((value % size) + size) % size;
}
