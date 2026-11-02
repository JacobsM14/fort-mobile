import type { Translations } from "@/i18n/es";

export const routinesTexts: Pick<
  Translations,
  "routines" | "newRoutine" | "editRoutine"
> = {
  routines: {
    title: "Rutines",
    subtitle: "Prepara-les un cop i tria la que toqui cada dia.",
    add: "Nova rutina",
    noContent: "Encara no hi ha rutines",
    exerciseCount: (count) =>
      `${count} ${count === 1 ? "exercici" : "exercicis"}`,
  },
  newRoutine: {
    breadCrumb: "Cancel·la",
    title1: "Nova",
    title2: "Rutina",
    nameLabel: "Nom",
    namePlaceholder: "Nom de la rutina",
    exercisesLabel: "Exercicis",
    addExercise: "Afegeix un exercici",
    removeExercise: "Treu l'exercici",
    noContent: "Afegeix exercicis per començar",
    primaryButton: "Desa la rutina",
    saveError: "No s'ha pogut desar la rutina",
  },
  editRoutine: {
    title1: "Editar",
    title2: "Rutina",
    primaryButton: "Desa els canvis",
    delete: "Elimina la rutina",
    deleteTitle: "Vols eliminar aquesta rutina?",
    deleteMessage:
      "S'esborrarà la rutina. Els teus exercicis i els entrenaments que ja hi vas fer es conserven.",
    deleteConfirm: "Elimina",
    cancel: "Cancel·la",
    deleteError: "No s'ha pogut eliminar la rutina",
  },
};
