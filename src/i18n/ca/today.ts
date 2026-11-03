import type { Translations } from "@/i18n/es";

export const todayTexts: Pick<Translations, "today"> = {
  today: {
    title: "Què toca avui?",
    emptyTitle: "Encara no tens rutines",
    emptyMessage:
      "Crea la teva primera rutina i tria-la cada dia que vagis a entrenar.",
    emptyAction: "Crea la meva primera rutina",
    howItWorks: "Com funciona",
    steps: [
      "Crea les teves rutines una sola vegada",
      "Selecciona els exercicis que vulguis",
      "El dia que toqui, tria'n una i comença",
    ],
    pickRoutine: "Tria una de les teves rutines",
    start: "Comença",
    startRoutine: (name) => `Comença ${name}`,
    manageRoutines: "Gestiona les meves rutines",
    inProgress: "En curs",
    continue: "Continua",
    continueRoutine: (name) => `Continua ${name}`,
    activeTitle: "Tens un entrenament en curs",
    activeMessage: (current, next) =>
      `S'acabarà ${current} amb les sèries que hagis marcat i començarà ${next}.`,
    activeConfirm: "Acaba i comença",
    cancel: "Cancel·la",
    startError: "No s'ha pogut començar l'entrenament",
  },
};
