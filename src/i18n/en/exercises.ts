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
    breadCrumb: "New routine",
    breadCrumbEdit: "Edit routine",
    title: "Exercises",
    searchPlaceholder: "Search exercise",
    clearSearch: "Clear search",
    filters: "Filters",
    clearFilters: "Clear",
    closeFilters: "Close filters",
    typeLabel: "Type",
    groupLabel: "Muscle group",
    muscleLabel: "Muscle",
    showResults: (count) =>
      count === 1 ? "Show 1 exercise" : `Show ${count} exercises`,
    noResults: "No matching exercises",
    createCustom: "Create your own exercise",
    done: (count) => `Done · ${count} selected`,
  },
  newCustomExercise: {
    breadCrumb: "Exercises",
    title1: "New",
    title2: "Exercise",
    primaryButton: "Create exercise",
  },
  editExercise: {
    title1: "Edit",
    title2: "Exercise",
    primaryButton: "Save changes",
    delete: "Delete exercise",
    deleteTitle: "Delete this exercise?",
    deleteMessage: (routineCount) =>
      routineCount === 0
        ? "This can't be undone."
        : `It will also be removed from ${routineCount} ${routineCount === 1 ? "routine" : "routines"}. This can't be undone.`,
    deleteConfirm: "Delete",
    cancel: "Cancel",
    deleteError: "Couldn't delete the exercise",
  },
  exerciseForm: {
    nameLabel: "Name",
    trackingLabel: "Tracking type",
    trackingLocked:
      "It already has logged sets, so its type can't change. For another type, create a new exercise.",
    musclesLabel: "Main muscles",
    descriptionLabel: "Description",
  },
  manageExercises: {
    add: "Create exercise",
    emptyTitle: "You haven't created any exercises yet",
    emptyMessage:
      "Create the ones that aren't in the catalog and use them in your routines like any other.",
  },
  exercises: {
    namePlaceholder: "Exercise name",
    descriptionPlaceholder: "Description (optional)",
    saveError: "Couldn't save the exercise",
    showInfo: "Show exercise info",
    noDescription: "No description",
    noImages: "No photos",
    closeInfo: "Close",
    equipmentLabel: "Equipment",
    enlargeImage: "Enlarge photo",
    closeImage: "Close photo",
    trackingTypes: {
      weight_reps: "Weight + reps",
      bodyweight_reps: "Bodyweight",
      duration: "Duration",
      distance_duration: "Distance",
    },
  },
  muscles: {
    chest: "Chest",
    front_delts: "Front delts",
    triceps: "Triceps",
    abs: "Abs",
    side_delts: "Side delts",
    traps: "Traps",
    lats: "Lats",
    biceps: "Biceps",
    forearms: "Forearms",
    glutes: "Glutes",
    quads: "Quads",
    hamstrings: "Hamstrings",
    calves: "Calves",
    obliques: "Obliques",
    rear_delts: "Rear delts",
    neck: "Neck",
    lower_back: "Lower back",
    upper_back: "Upper back",
    adductors: "Adductors",
    abductors: "Abductors",
    hip_flexors: "Hip flexors",
  },
  muscleGroups: {
    chest: "Chest",
    back: "Back",
    shoulders: "Shoulders",
    arms: "Arms",
    neck: "Neck",
    legs: "Legs",
    core: "Core",
  },
  equipment: {
    barbell: "Barbell",
    dumbbell: "Dumbbells",
    cable: "Cable",
    machine: "Machine",
    kettlebells: "Kettlebell",
    bands: "Bands",
    medicine_ball: "Medicine ball",
    exercise_ball: "Exercise ball",
    foam_roll: "Foam roller",
    ez_bar: "EZ bar",
    bodyweight: "Bodyweight",
    other: "Other",
  },
};
