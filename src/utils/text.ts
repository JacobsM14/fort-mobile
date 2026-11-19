// Trimmed and cut to `max` characters, counted as characters rather than
// UTF-16 units so an emoji isn't cut in half.
export function limitChars(text: string, max: number) {
  return Array.from(text.trim()).slice(0, max).join("").trim();
}

// A field's label with the usual mark of a field that must be filled in.
export function requiredLabel(label: string, required: boolean) {
  return required ? `${label} *` : label;
}

// Accents are stripped so typing "biceps" still finds "Bíceps": NFD splits
// each accented letter into the letter plus a combining mark, which the regex
// removes.
export function normalizeForSearch(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
