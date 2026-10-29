import type { Translations } from "@/i18n/es";

export const commonTexts: Pick<
  Translations,
  "tabs" | "notifications" | "errors"
> = {
  tabs: {
    today: "Today",
    routines: "Routines",
    progress: "Progress",
    profile: "Profile",
  },
  notifications: {
    channel: "Workout in progress",
  },
  errors: {
    database: "Couldn't load your data. Close the app and open it again.",
    openUrl: "Couldn't open the link",
  },
};
