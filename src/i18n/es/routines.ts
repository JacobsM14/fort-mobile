export const routinesTexts = {
  routines: {
    title: "Rutinas",
    subtitle: "Prepáralas una vez y elige la que toque cada día.",
    add: "Nueva rutina",
    noContent: "No hay rutinas todavía",
    exerciseCount: (count: number) =>
      `${count} ${count === 1 ? "ejercicio" : "ejercicios"}`,
  },
  newRoutine: {
    breadCrumb: "Cancelar",
    title1: "Nueva",
    title2: "Rutina",
    nameLabel: "Nombre",
    namePlaceholder: "Nombre de la rutina",
    exercisesLabel: "Ejercicios",
    addExercise: "Añadir ejercicio",
    removeExercise: "Quitar ejercicio",
    noContent: "Añade ejercicios para empezar",
    primaryButton: "Guardar rutina",
    saveError: "No se ha podido guardar la rutina",
  },
  editRoutine: {
    title1: "Editar",
    title2: "Rutina",
    primaryButton: "Guardar cambios",
    delete: "Eliminar rutina",
    deleteTitle: "¿Eliminar esta rutina?",
    deleteMessage:
      "Se borrará la rutina. Tus ejercicios y los entrenamientos que ya hiciste con ella se conservan.",
    deleteConfirm: "Eliminar",
    cancel: "Cancelar",
    deleteError: "No se ha podido eliminar la rutina",
  },
};
