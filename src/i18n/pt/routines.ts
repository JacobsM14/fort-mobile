import type { Translations } from "@/i18n/es";

export const routinesTexts: Pick<
  Translations,
  "routines" | "newRoutine" | "editRoutine"
> = {
  routines: {
    title: "Rotinas",
    subtitle: "Prepara-as uma vez e escolhe a de cada dia.",
    add: "Nova rotina",
    noContent: "Ainda não há rotinas",
    exerciseCount: (count) =>
      `${count} ${count === 1 ? "exercício" : "exercícios"}`,
  },
  newRoutine: {
    breadCrumb: "Cancelar",
    title1: "Nova",
    title2: "Rotina",
    nameLabel: "Nome",
    namePlaceholder: "Nome da rotina",
    exercisesLabel: "Exercícios",
    addExercise: "Adicionar exercício",
    removeExercise: "Remover exercício",
    noContent: "Adiciona exercícios para começar",
    primaryButton: "Guardar rotina",
    saveError: "Não foi possível guardar a rotina",
  },
  editRoutine: {
    title1: "Editar",
    title2: "Rotina",
    primaryButton: "Guardar alterações",
    delete: "Eliminar rotina",
    deleteTitle: "Eliminar esta rotina?",
    deleteMessage:
      "A rotina vai ser apagada. Os teus exercícios e os treinos que já fizeste com ela mantêm-se.",
    deleteConfirm: "Eliminar",
    cancel: "Cancelar",
    deleteError: "Não foi possível eliminar a rotina",
  },
};
