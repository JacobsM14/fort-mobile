import type { Translations } from "@/i18n/es";

// In French, 0 and 1 take the singular.
export const historyTexts: Pick<Translations, "history"> = {
  history: {
    title: "Historique",
    day: "Jour",
    inProgress: "En cours",
    workoutSummary: (exercises, sets) =>
      `${exercises} ${exercises <= 1 ? "exercice" : "exercices"} · ${sets} ${sets <= 1 ? "série" : "séries"}`,
    exerciseCount: (count) =>
      `${count} ${count <= 1 ? "exercice" : "exercices"}`,
    noWorkout: "Pas d'entraînement",
    weight: "Poids",
    workouts: "Entraînements",
    noWeighIn: "Pas de pesée ce jour-là",
    logWeight: "Noter",
    closeWeight: "Fermer la saisie du poids",
    cancel: "Annuler",
    deleteWeight: "Supprimer le poids",
    deleteWeightTitle: "Supprimer le poids de ce jour ?",
    deleteWeightMessage: (day) => `La pesée du ${day} sera supprimée.`,
    deleteWeightConfirm: "Supprimer",
    addExercise: "Ajouter un exercice",
    addRoutine: "Ajouter une routine",
    todayAddRoutineHint:
      "Uniquement pour enregistrer un entraînement déjà fait. Pour t'entraîner maintenant, commence la routine depuis Aujourd'hui.",
    chooseRoutine: "Choisis la routine que tu as faite",
    logError: "Impossible de l'ajouter. Réessaie.",
    exerciseOptions: (name) => `Options de l'exercice ${name}`,
    removeExercise: "Retirer l'exercice",
    closeMenu: "Fermer le menu",
    deleteExerciseTitle: (name) => `Retirer ${name} ?`,
    deleteExerciseMessage:
      "Toutes ses séries de cet entraînement seront supprimées.",
    deleteExerciseConfirm: "Retirer",
    deleteWorkout: "Supprimer l'entraînement",
    deleteWorkoutTitle: "Supprimer l'entraînement ?",
    deleteWorkoutMessage:
      "Tous ses exercices et séries seront supprimés. Cette action est irréversible.",
    deleteWorkoutConfirm: "Supprimer",
    deleteError: "Impossible de supprimer. Réessaie.",
  },
};
