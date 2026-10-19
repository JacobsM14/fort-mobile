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
