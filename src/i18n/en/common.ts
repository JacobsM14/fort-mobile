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
    weightReminder: {
      channel: "Weigh-in reminder",
      title: "Time to weigh yourself",
      text: "Log your weight to track your progress",
    },
  },
  errors: {
    database: "Couldn't load your data. Close the app and open it again.",
    openUrl: "Couldn't open the link",
  },
};
