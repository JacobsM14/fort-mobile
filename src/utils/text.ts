// Accents are stripped so typing "biceps" still finds "Bíceps".
export function normalizeForSearch(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
