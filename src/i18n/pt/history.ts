import type { Translations } from "@/i18n/es";

export const historyTexts: Pick<Translations, "history"> = {
  history: {
    title: "Histórico",
    day: "Dia",
    inProgress: "Em curso",
    workoutSummary: (exercises, sets) =>
      `${exercises} ${exercises === 1 ? "exercício" : "exercícios"} · ${sets} ${sets === 1 ? "série" : "séries"}`,
    exerciseCount: (count) =>
      `${count} ${count === 1 ? "exercício" : "exercícios"}`,
    noWorkout: "Sem treino",
    weight: "Peso",
    workouts: "Treinos",
    noWeighIn: "Sem pesagem neste dia",
    logWeight: "Registar",
    closeWeight: "Fechar registo de peso",
    cancel: "Cancelar",
    deleteWeight: "Eliminar peso",
    deleteWeightTitle: "Eliminar o peso deste dia?",
    deleteWeightMessage: (day) => `A pesagem de ${day} vai ser apagada.`,
    deleteWeightConfirm: "Eliminar",
    addExercise: "Adicionar exercício",
    addRoutine: "Adicionar rotina",
    todayAddRoutineHint:
      "Só para registar um treino que já fizeste. Para treinar agora, inicia a rotina a partir de Hoje.",
    chooseRoutine: "Escolhe a rotina que fizeste",
    logError: "Não foi possível adicionar. Tenta novamente.",
    exerciseOptions: (name) => `Opções de ${name}`,
    removeExercise: "Remover exercício",
    closeMenu: "Fechar menu",
    deleteExerciseTitle: (name) => `Remover ${name}?`,
    deleteExerciseMessage:
      "Todas as suas séries deste treino vão ser apagadas.",
    deleteExerciseConfirm: "Remover",
    deleteWorkout: "Eliminar treino",
    deleteWorkoutTitle: "Eliminar o treino?",
    deleteWorkoutMessage:
      "Todos os seus exercícios e séries vão ser apagados. Não é possível anular.",
    deleteWorkoutConfirm: "Eliminar",
    deleteError: "Não foi possível apagar. Tenta novamente.",
  },
};
