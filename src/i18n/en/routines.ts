import type { Translations } from "@/i18n/es";

export const routinesTexts: Pick<
  Translations,
  "routines" | "newRoutine" | "editRoutine"
> = {
  routines: {
    title: "Routines",
    subtitle: "Prepare them once and choose the one for each day.",
    add: "New routine",
    noContent: "No routines yet",
    exerciseCount: (count) =>
      `${count} ${count === 1 ? "exercise" : "exercises"}`,
  },
  newRoutine: {
    breadCrumb: "Cancel",
    title1: "New",
    title2: "Routine",
    nameLabel: "Name",
    namePlaceholder: "Routine name",
    exercisesLabel: "Exercises",
    addExercise: "Add exercise",
    removeExercise: "Remove exercise",
    noContent: "Add exercises to get started",
    primaryButton: "Save routine",
    saveError: "Couldn't save the routine",
  },
  editRoutine: {
    title1: "Edit",
    title2: "Routine",
    primaryButton: "Save changes",
    delete: "Delete routine",
    deleteTitle: "Delete this routine?",
    deleteMessage:
      "The routine will be deleted. Your exercises and the workouts you already did with it are kept.",
    deleteConfirm: "Delete",
    cancel: "Cancel",
    deleteError: "Couldn't delete the routine",
  },
};
