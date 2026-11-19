import { setIcon } from "react-native-app-icon-changer";

import { ACCENT_COLORS, type AccentColor } from "@/constants/enums";

import { storedChoice } from "./stored-choice";

// Saved here because on Android getActiveIcon only reports the new icon after a restart.
const appIcon = storedChoice("app_icon", ACCENT_COLORS, "orange");

export const loadAppIcon = appIcon.load;

// Must match the alias names in plugins/android-app-icons.js.
export function nativeIconName(icon: AccentColor): string {
  return icon === "orange"
    ? "Default"
    : icon.charAt(0).toUpperCase() + icon.slice(1);
}

export async function changeAppIcon(icon: AccentColor) {
  try {
    await setIcon(nativeIconName(icon));
  } catch {
    // No error thrown
    // Is for when the icon is already the active one.
  }
  appIcon.save(icon);
}
