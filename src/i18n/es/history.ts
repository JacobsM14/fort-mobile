export const historyTexts = {
  history: {
    title: "Historial",
    day: "Día",
    inProgress: "En curso",
    workoutSummary: (exercises: number, sets: number) =>
      `${exercises} ${exercises === 1 ? "ejercicio" : "ejercicios"} · ${sets} ${sets === 1 ? "serie" : "series"}`,
    exerciseCount: (count: number) =>
      `${count} ${count === 1 ? "ejercicio" : "ejercicios"}`,
    noWorkout: "Sin entreno",
    weight: "Peso",
    workouts: "Entrenos",
    noWeighIn: "Sin pesaje este día",
    logWeight: "Registrar",
    closeWeight: "Cerrar registro de peso",
    cancel: "Cancelar",
    deleteWeight: "Eliminar peso",
    deleteWeightTitle: "¿Eliminar el peso de este día?",
    deleteWeightMessage: (day: string) => `Se borrará el pesaje del ${day}.`,
    deleteWeightConfirm: "Eliminar",
    addExercise: "Añadir ejercicio",
    addRoutine: "Añadir rutina",
    // Today's own workout is started from Today, not logged here.
    todayAddRoutineHint:
      "Solo para registrar un entrenamiento que ya has hecho. Para entrenar ahora, empieza la rutina desde Hoy.",
    chooseRoutine: "Elige la rutina que hiciste",
    logError: "No se ha podido añadir. Inténtalo de nuevo.",
    exerciseOptions: (name: string) => `Opciones de ${name}`,
    removeExercise: "Quitar ejercicio",
    closeMenu: "Cerrar menú",
    deleteExerciseTitle: (name: string) => `¿Quitar ${name}?`,
    deleteExerciseMessage: "Se borrarán todas sus series de este entreno.",
    deleteExerciseConfirm: "Quitar",
    deleteWorkout: "Eliminar entreno",
    deleteWorkoutTitle: "¿Eliminar el entreno?",
    deleteWorkoutMessage:
      "Se borrarán todos sus ejercicios y series. No se puede deshacer.",
    deleteWorkoutConfirm: "Eliminar",
    deleteError: "No se ha podido borrar. Inténtalo de nuevo.",
  },
};
