import type { Translations } from "@/i18n/es";

export const exercisesTexts: Pick<
  Translations,
  | "newExercises"
  | "newCustomExercise"
  | "editExercise"
  | "exerciseForm"
  | "manageExercises"
  | "exercises"
  | "muscles"
  | "muscleGroups"
  | "equipment"
> = {
  newExercises: {
    breadCrumb: "Nova rutina",
    breadCrumbEdit: "Edita la rutina",
    title: "Exercicis",
    searchPlaceholder: "Cerca un exercici",
    clearSearch: "Esborra la cerca",
    filters: "Filtres",
    clearFilters: "Neteja",
    closeFilters: "Tanca els filtres",
    typeLabel: "Tipus",
    muscleLabel: "Múscul",
    showResults: (count) =>
      count === 1 ? "Mostra 1 exercici" : `Mostra ${count} exercicis`,
    noResults: "No hi ha exercicis que coincideixin",
    createCustom: "Crea un exercici propi",
    done: (count) =>
      `Fet · ${count} ${count === 1 ? "seleccionat" : "seleccionats"}`,
  },
  newCustomExercise: {
    breadCrumb: "Exercicis",
    title1: "Nou",
    title2: "Exercici",
    primaryButton: "Crea l'exercici",
  },
  editExercise: {
    title1: "Editar",
    title2: "Exercici",
    primaryButton: "Desa els canvis",
    delete: "Elimina l'exercici",
    deleteTitle: "Vols eliminar aquest exercici?",
    // "de" + number would need "d'" before 1 and 11, so the number goes
    // after "les" instead.
    deleteMessage: (routineCount) =>
      routineCount === 0
        ? "Aquesta acció no es pot desfer."
        : routineCount === 1
          ? "També es traurà de la rutina que l'inclou. Aquesta acció no es pot desfer."
          : `També es traurà de les ${routineCount} rutines que l'inclouen. Aquesta acció no es pot desfer.`,
    deleteConfirm: "Elimina",
    cancel: "Cancel·la",
    deleteError: "No s'ha pogut eliminar l'exercici",
  },
  exerciseForm: {
    nameLabel: "Nom",
    trackingLabel: "Tipus de registre",
    musclesLabel: "Músculs principals",
    descriptionLabel: "Descripció",
  },
  manageExercises: {
    add: "Crea un exercici",
    emptyTitle: "Encara no has creat cap exercici",
    emptyMessage:
      "Crea els que no siguin al catàleg i fes-los servir a les teves rutines com qualsevol altre.",
  },
  exercises: {
    namePlaceholder: "Nom de l'exercici",
    descriptionPlaceholder: "Descripció (opcional)",
    saveError: "No s'ha pogut desar l'exercici",
    showInfo: "Mostra la informació de l'exercici",
    noDescription: "Sense descripció",
    noImages: "Sense fotos",
    closeInfo: "Tanca",
    equipmentLabel: "Material",
    enlargeImage: "Amplia la foto",
    closeImage: "Tanca la foto",
    trackingTypes: {
      weight_reps: "Pes + rep.",
      bodyweight_reps: "Pes corporal",
      duration: "Durada",
      distance_duration: "Distància",
    },
  },
  muscles: {
    chest: "Pit",
    front_delts: "Deltoide anterior",
    triceps: "Tríceps",
    abs: "Abdominals",
    side_delts: "Deltoide lateral",
    traps: "Trapezi",
    lats: "Dorsals",
    biceps: "Bíceps",
    forearms: "Avantbraços",
    glutes: "Glutis",
    quads: "Quàdriceps",
    hamstrings: "Isquiotibials",
    calves: "Panxells",
    obliques: "Oblics",
    rear_delts: "Deltoide posterior",
    neck: "Coll",
    lower_back: "Part baixa de l'esquena",
    upper_back: "Part alta de l'esquena",
    adductors: "Adductors",
    abductors: "Abductors",
    hip_flexors: "Flexors del maluc",
  },
  muscleGroups: {
    chest: "Pit",
    back: "Esquena",
    shoulders: "Espatlles",
    arms: "Braços",
    neck: "Coll",
    legs: "Cames",
    core: "Core",
  },
  equipment: {
    barbell: "Barra",
    dumbbell: "Halters",
    cable: "Politja",
    machine: "Màquina",
    kettlebells: "Kettlebell",
    bands: "Bandes elàstiques",
    medicine_ball: "Pilota medicinal",
    exercise_ball: "Fitball",
    foam_roll: "Corró d'escuma",
    ez_bar: "Barra Z",
    bodyweight: "Pes corporal",
    other: "Altres",
  },
};
