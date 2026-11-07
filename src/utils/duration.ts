// Six digits cover up to 99:59:59.
const MAX_DIGITS = 6;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

// The whole seconds from `from` to `now` (epoch ms), never below zero. Whole,
// like the live stopwatches show, so a time doesn't change by a second when
// it's saved.
export function elapsedSeconds(from: Date, now: number) {
  return Math.max(0, Math.floor((now - from.getTime()) / 1000));
}

// "0:47", "1:32", "1:02:05".
export function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(rest)}`
    : `${minutes}:${pad(rest)}`;
}

// Times are typed like on a microwave: the digits fill from the right, so
// 1, 3, 0 reads 1:30. The number pad has no ":", and this needs none.
export function cleanDurationDigits(text: string) {
  return text.replace(/\D/g, "").replace(/^0+/, "").slice(0, MAX_DIGITS);
}

// Shows the digits as typed, without carrying over: "90" reads 0:90 until the
// field is left, when the duration is saved as 1:30.
export function formatDurationDigits(digits: string) {
  const padded = digits.padStart(3, "0");
  const seconds = padded.slice(-2);
  const minutes = padded.slice(-4, -2);
  const hours = padded.slice(0, -4);

  return hours === ""
    ? `${Number(minutes)}:${seconds}`
    : `${Number(hours)}:${minutes}:${seconds}`;
}

export function durationFromDigits(digits: string): number | null {
  if (digits === "") {
    return null;
  }
  const padded = digits.padStart(MAX_DIGITS, "0");
  const hours = Number(padded.slice(0, 2));
  const minutes = Number(padded.slice(2, 4));
  const seconds = Number(padded.slice(4, 6));

  return hours * 3600 + minutes * 60 + seconds;
}

export function digitsFromDuration(totalSeconds: number | null) {
  if (totalSeconds === null || totalSeconds <= 0) {
    return "";
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return cleanDurationDigits(`${hours}${pad(minutes)}${pad(seconds)}`);
}
