import type { Translations } from "@/i18n/es";

export const commonTexts: Pick<
  Translations,
  "tabs" | "notifications" | "errors"
> = {
  tabs: {
    today: "Hoje",
    routines: "Rotinas",
    progress: "Progresso",
    profile: "Perfil",
  },
  notifications: {
    channel: "Treino em curso",
    weightReminder: {
      channel: "Lembrete de pesagem",
      title: "Hora de te pesares",
      text: "Regista o teu peso para acompanhares o teu progresso",
    },
  },
  errors: {
    database:
      "Não foi possível carregar os teus dados. Fecha a app e volta a abri-la.",
    openUrl: "Não foi possível abrir a ligação",
  },
};
