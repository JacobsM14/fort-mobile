// Accents are stripped so typing "biceps" still finds "Bíceps": NFD splits
// each accented letter into the letter plus a combining mark, which the regex
// removes.
export function normalizeForSearch(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
