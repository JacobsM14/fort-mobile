import type { Translations } from "@/i18n/es";

export const historyTexts: Pick<Translations, "history"> = {
  history: {
    title: "Historial",
    day: "Dia",
    inProgress: "En curs",
    workoutSummary: (exercises, sets) =>
      `${exercises} ${exercises === 1 ? "exercici" : "exercicis"} · ${sets} ${sets === 1 ? "sèrie" : "sèries"}`,
    exerciseCount: (count) =>
      `${count} ${count === 1 ? "exercici" : "exercicis"}`,
    noWorkout: "Sense entrenament",
    weight: "Pes",
    workouts: "Entrenaments",
    noWeighIn: "Aquest dia no t'has pesat",
    logWeight: "Registra",
    closeWeight: "Tanca el registre de pes",
    cancel: "Cancel·la",
    deleteWeight: "Elimina el pes",
    deleteWeightTitle: "Vols eliminar el pes d'aquest dia?",
    deleteWeightMessage: (day) => `S'esborrarà el pes registrat el dia ${day}.`,
    deleteWeightConfirm: "Elimina",
    addExercise: "Afegeix un exercici",
    addRoutine: "Afegeix una rutina",
    chooseRoutine: "Tria la rutina que vas fer",
    logError: "No s'ha pogut afegir. Torna-ho a provar.",
    exerciseOptions: (name) => `Opcions de l'exercici ${name}`,
    removeExercise: "Treu l'exercici",
    closeMenu: "Tanca el menú",
    deleteExerciseTitle: (name) => `Vols treure ${name}?`,
    deleteExerciseMessage:
      "S'esborraran totes les seves sèries d'aquest entrenament.",
    deleteExerciseConfirm: "Treu",
    deleteWorkout: "Elimina l'entrenament",
    deleteWorkoutTitle: "Vols eliminar l'entrenament?",
    deleteWorkoutMessage:
      "S'esborraran tots els seus exercicis i sèries. No es pot desfer.",
    deleteWorkoutConfirm: "Elimina",
    deleteError: "No s'ha pogut esborrar. Torna-ho a provar.",
  },
};
