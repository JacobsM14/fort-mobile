import { catalogTexts } from "./catalog";
import { commonTexts } from "./common";
import { exercisesTexts } from "./exercises";
import { historyTexts } from "./history";
import { profileTexts } from "./profile";
import { progressTexts } from "./progress";
import { routinesTexts } from "./routines";
import { settingsTexts } from "./settings";
import { todayTexts } from "./today";
import { workoutTexts } from "./workout";

import type { Translations } from "@/i18n/es";

export const en: Translations = {
  ...catalogTexts,
  ...commonTexts,
  ...exercisesTexts,
  ...historyTexts,
  ...profileTexts,
  ...progressTexts,
  ...routinesTexts,
  ...settingsTexts,
  ...todayTexts,
  ...workoutTexts,
};
