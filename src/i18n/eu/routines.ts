import type { Translations } from "@/i18n/es";

export const routinesTexts: Pick<
  Translations,
  "routines" | "newRoutine" | "editRoutine"
> = {
  routines: {
    title: "Errutinak",
    subtitle: "Prestatu behin, eta aukeratu egun bakoitzean dagokiona.",
    add: "Errutina berria",
    noContent: "Oraindik ez dago errutinarik",
    exerciseCount: (count) => (count === 1 ? "ariketa 1" : `${count} ariketa`),
  },
  newRoutine: {
    breadCrumb: "Utzi",
    title1: "Errutina",
    title2: "Berria",
    nameLabel: "Izena",
    namePlaceholder: "Errutinaren izena",
    exercisesLabel: "Ariketak",
    addExercise: "Gehitu ariketa",
    removeExercise: "Kendu ariketa",
    noContent: "Gehitu ariketak hasteko",
    primaryButton: "Gorde errutina",
    saveError: "Ezin izan da errutina gorde",
  },
  editRoutine: {
    title1: "Editatu",
    title2: "Errutina",
    primaryButton: "Gorde aldaketak",
    delete: "Ezabatu errutina",
    deleteTitle: "Errutina hau ezabatu nahi duzu?",
    deleteMessage:
      "Errutina ezabatu egingo da. Zure ariketak eta errutina horrekin egindako entrenamenduak gorde egingo dira.",
    deleteConfirm: "Ezabatu",
    cancel: "Utzi",
    deleteError: "Ezin izan da errutina ezabatu",
  },
};
