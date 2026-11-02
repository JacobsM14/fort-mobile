import type { Translations } from "@/i18n/es";

export const routinesTexts: Pick<
  Translations,
  "routines" | "newRoutine" | "editRoutine"
> = {
  routines: {
    title: "Routines",
    subtitle: "Prépare-les une fois et choisis celle du jour.",
    add: "Nouvelle routine",
    noContent: "Aucune routine pour l'instant",
    // In French, 0 and 1 take the singular.
    exerciseCount: (count) =>
      `${count} ${count <= 1 ? "exercice" : "exercices"}`,
  },
  newRoutine: {
    breadCrumb: "Annuler",
    title1: "Nouvelle",
    title2: "routine",
    nameLabel: "Nom",
    namePlaceholder: "Nom de la routine",
    exercisesLabel: "Exercices",
    addExercise: "Ajouter un exercice",
    removeExercise: "Retirer l'exercice",
    noContent: "Ajoute des exercices pour commencer",
    primaryButton: "Enregistrer la routine",
    saveError: "Impossible d'enregistrer la routine",
  },
  editRoutine: {
    title1: "Modifier",
    title2: "la routine",
    primaryButton: "Enregistrer",
    delete: "Supprimer la routine",
    deleteTitle: "Supprimer cette routine ?",
    deleteMessage:
      "La routine sera supprimée. Tes exercices et les entraînements déjà faits avec elle sont conservés.",
    deleteConfirm: "Supprimer",
    cancel: "Annuler",
    deleteError: "Impossible de supprimer la routine",
  },
};
