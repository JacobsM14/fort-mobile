import { ACCENT_COLORS } from "@/constants/enums";

import { storedChoice } from "./stored-choice";

const accentColor = storedChoice("accent_color", ACCENT_COLORS, "orange");

export const loadAccentColor = accentColor.load;
export const saveAccentColor = accentColor.save;
