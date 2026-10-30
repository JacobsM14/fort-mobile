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

// One file per area. The texts in ../en have the same file names and are
// checked against Translations, so a text missing there is a type error.
export const es = {
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

export type Translations = typeof es;
