import type { Translations } from "@/i18n/es";

export const commonTexts: Pick<
  Translations,
  "tabs" | "notifications" | "errors"
> = {
  tabs: {
    today: "Aujourd'hui",
    routines: "Routines",
    progress: "Progression",
    profile: "Profil",
  },
  notifications: {
    channel: "Entraînement en cours",
    weightReminder: {
      channel: "Rappel de pesée",
      title: "C'est l'heure de te peser",
      text: "Note ton poids pour suivre ta progression",
    },
  },
  errors: {
    database: "Impossible de charger tes données. Ferme l'app et rouvre-la.",
    openUrl: "Impossible d'ouvrir le lien",
  },
};
