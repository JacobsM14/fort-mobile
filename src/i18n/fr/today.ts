import type { Translations } from "@/i18n/es";

export const todayTexts: Pick<Translations, "today"> = {
  today: {
    title: "Au programme aujourd'hui ?",
    emptyTitle: "Tu n'as pas encore de routine",
    emptyMessage:
      "Crée ta première routine et choisis-la chaque jour où tu t'entraînes.",
    emptyAction: "Créer ma première routine",
    howItWorks: "Comment ça marche",
    steps: [
      "Crée tes routines une seule fois",
      "Sélectionne les exercices que tu veux",
      "Le jour J, choisis-en une et c'est parti",
    ],
    pickRoutine: "Choisis une de tes routines",
    start: "Commencer",
    startRoutine: (name) => `Commencer ${name}`,
    manageRoutines: "Gérer mes routines",
    inProgress: "En cours",
    continue: "Continuer",
    continueRoutine: (name) => `Continuer ${name}`,
    activeTitle: "Tu as un entraînement en cours",
    activeMessage: (current, next) =>
      `${current} se terminera avec les séries que tu as cochées, puis ${next} commencera.`,
    activeConfirm: "Terminer et commencer",
    cancel: "Annuler",
    startError: "Impossible de commencer l'entraînement",
  },
};
