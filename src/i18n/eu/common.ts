import type { Translations } from "@/i18n/es";

export const commonTexts: Pick<
  Translations,
  "tabs" | "notifications" | "errors"
> = {
  tabs: {
    today: "Gaur",
    routines: "Errutinak",
    progress: "Aurrerapena",
    profile: "Profila",
  },
  notifications: {
    channel: "Entrenamendua abian",
    weightReminder: {
      channel: "Pisatzeko gogorarazpena",
      title: "Pisatzeko ordua da",
      text: "Erregistratu zure pisua aurrerapenaren jarraipena egiteko",
    },
  },
  errors: {
    database:
      "Ezin izan dira zure datuak kargatu. Itxi aplikazioa eta ireki berriro.",
    openUrl: "Ezin izan da esteka ireki",
  },
};
