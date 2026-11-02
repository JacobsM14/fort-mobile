import type { Translations } from "@/i18n/es";

export const commonTexts: Pick<
  Translations,
  "tabs" | "notifications" | "errors"
> = {
  tabs: {
    today: "Avui",
    routines: "Rutines",
    progress: "Progrés",
    profile: "Perfil",
  },
  notifications: {
    channel: "Entrenament en curs",
    weightReminder: {
      channel: "Recordatori per pesar-te",
      title: "Hora de pesar-te",
      text: "Anota el teu pes per seguir el teu progrés",
    },
  },
  errors: {
    database:
      "No s'han pogut carregar les teves dades. Tanca l'app i torna-la a obrir.",
    openUrl: "No s'ha pogut obrir l'enllaç",
  },
};
