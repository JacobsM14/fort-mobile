import type { Translations } from "@/i18n/es";

export const historyTexts: Pick<Translations, "history"> = {
  history: {
    title: "History",
    day: "Day",
    inProgress: "In progress",
    workoutSummary: (exercises, sets) =>
      `${exercises} ${exercises === 1 ? "exercise" : "exercises"} · ${sets} ${sets === 1 ? "set" : "sets"}`,
    exerciseCount: (count) =>
      `${count} ${count === 1 ? "exercise" : "exercises"}`,
    noWorkout: "No workout",
    weight: "Weight",
    workouts: "Workouts",
    noWeighIn: "No weigh-in this day",
    logWeight: "Log",
    closeWeight: "Close weight log",
    cancel: "Cancel",
    deleteWeight: "Delete weight",
    deleteWeightTitle: "Delete this day's weight?",
    deleteWeightMessage: (day) => `The weigh-in of ${day} will be deleted.`,
    deleteWeightConfirm: "Delete",
    addExercise: "Add exercise",
    addRoutine: "Add routine",
    chooseRoutine: "Choose the routine you did",
    logError: "It couldn't be added. Try again.",
    exerciseOptions: (name) => `Options for ${name}`,
    removeExercise: "Remove exercise",
    closeMenu: "Close menu",
    deleteExerciseTitle: (name) => `Remove ${name}?`,
    deleteExerciseMessage: "All its sets in this workout will be deleted.",
    deleteExerciseConfirm: "Remove",
    deleteWorkout: "Delete workout",
    deleteWorkoutTitle: "Delete the workout?",
    deleteWorkoutMessage:
      "All its exercises and sets will be deleted. This can't be undone.",
    deleteWorkoutConfirm: "Delete",
    deleteError: "It couldn't be deleted. Try again.",
  },
};
