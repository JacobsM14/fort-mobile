import type { Translations } from "@/i18n/es";

// After a number the noun stays singular, and "1" goes after it:
// "ariketa 1", "3 ariketa".
export const historyTexts: Pick<Translations, "history"> = {
  history: {
    title: "Historia",
    day: "Eguna",
    inProgress: "Abian",
    workoutSummary: (exercises, sets) =>
      `${exercises === 1 ? "ariketa 1" : `${exercises} ariketa`} · ${sets === 1 ? "serie 1" : `${sets} serie`}`,
    exerciseCount: (count) => (count === 1 ? "ariketa 1" : `${count} ariketa`),
    noWorkout: "Entrenamendurik ez",
    weight: "Pisua",
    workouts: "Entrenamenduak",
    noWeighIn: "Egun honetan ez zara pisatu",
    logWeight: "Erregistratu",
    closeWeight: "Itxi pisu-erregistroa",
    cancel: "Utzi",
    deleteWeight: "Ezabatu pisua",
    deleteWeightTitle: "Egun honetako pisua ezabatu nahi duzu?",
    deleteWeightMessage: (day) => `Data honetako pisua ezabatuko da: ${day}.`,
    deleteWeightConfirm: "Ezabatu",
    addExercise: "Gehitu ariketa",
    addRoutine: "Gehitu errutina",
    chooseRoutine: "Aukeratu egin zenuen errutina",
    logError: "Ezin izan da gehitu. Saiatu berriro.",
    exerciseOptions: (name) => `${name} ariketaren aukerak`,
    removeExercise: "Kendu ariketa",
    closeMenu: "Itxi menua",
    deleteExerciseTitle: (name) => `${name} ariketa kendu nahi duzu?`,
    deleteExerciseMessage:
      "Entrenamendu honetako bere serie guztiak ezabatuko dira.",
    deleteExerciseConfirm: "Kendu",
    deleteWorkout: "Ezabatu entrenamendua",
    deleteWorkoutTitle: "Entrenamendua ezabatu nahi duzu?",
    deleteWorkoutMessage:
      "Bere ariketa eta serie guztiak ezabatuko dira. Ezin da desegin.",
    deleteWorkoutConfirm: "Ezabatu",
    deleteError: "Ezin izan da ezabatu. Saiatu berriro.",
  },
};
