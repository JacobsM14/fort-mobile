export const onboardingTexts = {
  onboarding: {
    welcomeTitle: (app: string) => `Bienvenido a ${app}`,
    welcomeMessage:
      "Planifica tus rutinas, apunta cada serie y sigue tu progreso, todo en tu móvil.",
    skip: "Omitir",
    previous: "Anterior",
    next: "Siguiente",
    finish: "Terminar",
    progress: (step: number, total: number) => `Paso ${step} de ${total}`,
    setup: "Configuración",
    doneTitle: "Todo listo",
    doneMessage:
      "Ya puedes crear tu primera rutina. Si quieres, te enseñamos en un momento cómo funciona la app.",
    seeTutorial: "Ver tutorial",
    tour: {
      newRoutine: {
        title: "Crea tus rutinas",
        message: "Ponles nombre y añade los ejercicios. Solo lo haces una vez.",
      },
      picker: {
        title: "Elige los ejercicios",
        message:
          "Busca en el catálogo o filtra por músculo. Si falta alguno, crea el tuyo.",
      },
      today: {
        title: "Elige qué toca hoy",
        message:
          "Cada día entrenado se marca en la semana. Pulsa Empezar en la rutina del día.",
      },
      workout: {
        title: "Apunta cada serie",
        message:
          "Escribe el peso y las repeticiones, márcala como hecha y cronometra el descanso.",
      },
      progress: {
        title: "Mira cómo progresas",
        message:
          "Sigue la fuerza estimada de cada ejercicio y tu peso corporal.",
      },
      history: {
        title: "Repasa tu historial",
        message:
          "Todos tus entrenos y pesajes, día a día. Puedes editarlos o añadir los que olvidaste.",
      },
    },
  },
};
