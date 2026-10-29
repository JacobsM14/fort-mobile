export const todayTexts = {
  today: {
    title: "¿Qué toca hoy?",
    emptyTitle: "Aún no tienes rutinas",
    emptyMessage:
      "Crea tu primera rutina y elígela cada día que vayas a entrenar.",
    emptyAction: "Crear mi primera rutina",
    howItWorks: "Cómo funciona",
    steps: [
      "Crea tus rutinas una sola vez",
      "Selecciona los ejercicios que quieras",
      "El día que toque, elige una y empieza",
    ],
    pickRoutine: "Elige una de tus rutinas",
    start: "Empezar",
    startRoutine: (name: string) => `Empezar ${name}`,
    manageRoutines: "Gestionar mis rutinas",
    inProgress: "En curso",
    continue: "Continuar",
    continueRoutine: (name: string) => `Continuar ${name}`,
    activeTitle: "Tienes un entrenamiento en curso",
    activeMessage: (current: string, next: string) =>
      `Se terminará ${current} con las series que hayas marcado y empezará ${next}.`,
    activeConfirm: "Terminar y empezar",
    cancel: "Cancelar",
    startError: "No se ha podido empezar el entrenamiento",
  },
};
