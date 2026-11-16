import type { Translations } from "@/i18n/es";

// In French, 0 and 1 take the singular.
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
    breadCrumb: "Nouvelle routine",
    breadCrumbEdit: "Modifier la routine",
    title: "Exercices",
    searchPlaceholder: "Rechercher un exercice",
    clearSearch: "Effacer la recherche",
    filters: "Filtres",
    clearFilters: "Effacer",
    closeFilters: "Fermer les filtres",
    typeLabel: "Type",
    groupLabel: "Groupe musculaire",
    muscleLabel: "Muscle",
    showResults: (count) =>
      count <= 1 ? `Voir ${count} exercice` : `Voir ${count} exercices`,
    noResults: "Aucun exercice ne correspond",
    createCustom: "Créer un exercice personnalisé",
    done: (count) =>
      `Valider · ${count} ${count <= 1 ? "sélectionné" : "sélectionnés"}`,
  },
  newCustomExercise: {
    breadCrumb: "Exercices",
    title1: "Nouvel",
    title2: "exercice",
    primaryButton: "Créer l'exercice",
  },
  editExercise: {
    title1: "Modifier",
    title2: "l'exercice",
    primaryButton: "Enregistrer",
    delete: "Supprimer l'exercice",
    deleteTitle: "Supprimer cet exercice ?",
    deleteMessage: (routineCount) =>
      routineCount === 0
        ? "Cette action est irréversible."
        : routineCount === 1
          ? "Il sera aussi retiré d'une routine. Cette action est irréversible."
          : `Il sera aussi retiré de ${routineCount} routines. Cette action est irréversible.`,
    deleteConfirm: "Supprimer",
    cancel: "Annuler",
    deleteError: "Impossible de supprimer l'exercice",
  },
  exerciseForm: {
    nameLabel: "Nom",
    trackingLabel: "Type de suivi",
    musclesLabel: "Muscles principaux",
    descriptionLabel: "Description",
  },
  manageExercises: {
    add: "Créer un exercice",
    emptyTitle: "Tu n'as encore créé aucun exercice",
    emptyMessage:
      "Crée ceux qui ne sont pas dans le catalogue et utilise-les dans tes routines comme les autres.",
  },
  exercises: {
    namePlaceholder: "Nom de l'exercice",
    descriptionPlaceholder: "Description (facultatif)",
    saveError: "Impossible d'enregistrer l'exercice",
    showInfo: "Voir les infos de l'exercice",
    noDescription: "Aucune description",
    noImages: "Aucune photo",
    closeInfo: "Fermer",
    equipmentLabel: "Équipement",
    enlargeImage: "Agrandir la photo",
    closeImage: "Fermer la photo",
    trackingTypes: {
      weight_reps: "Poids + rép.",
      bodyweight_reps: "Poids du corps",
      duration: "Durée",
      distance_duration: "Distance",
    },
  },
  muscles: {
    chest: "Pectoraux",
    front_delts: "Deltoïde antérieur",
    triceps: "Triceps",
    abs: "Abdominaux",
    side_delts: "Deltoïde latéral",
    traps: "Trapèzes",
    lats: "Dorsaux",
    biceps: "Biceps",
    forearms: "Avant-bras",
    glutes: "Fessiers",
    quads: "Quadriceps",
    hamstrings: "Ischio-jambiers",
    calves: "Mollets",
    obliques: "Obliques",
    rear_delts: "Deltoïde postérieur",
    neck: "Cou",
    lower_back: "Bas du dos",
    upper_back: "Haut du dos",
    adductors: "Adducteurs",
    abductors: "Abducteurs",
    hip_flexors: "Fléchisseurs de la hanche",
  },
  muscleGroups: {
    chest: "Pectoraux",
    back: "Dos",
    shoulders: "Épaules",
    arms: "Bras",
    neck: "Cou",
    legs: "Jambes",
    core: "Tronc",
  },
  equipment: {
    barbell: "Barre",
    dumbbell: "Haltères",
    cable: "Poulie",
    machine: "Machine",
    kettlebells: "Kettlebell",
    bands: "Élastiques",
    medicine_ball: "Médecine-ball",
    exercise_ball: "Swiss ball",
    foam_roll: "Rouleau de massage",
    ez_bar: "Barre EZ",
    bodyweight: "Poids du corps",
    other: "Autre",
  },
};
