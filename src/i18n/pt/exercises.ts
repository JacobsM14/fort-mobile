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
    breadCrumb: "Nova rotina",
    breadCrumbEdit: "Editar rotina",
    title: "Exercícios",
    searchPlaceholder: "Procurar exercício",
    clearSearch: "Limpar pesquisa",
    filters: "Filtros",
    clearFilters: "Limpar",
    closeFilters: "Fechar filtros",
    typeLabel: "Tipo",
    groupLabel: "Grupo muscular",
    muscleLabel: "Músculo",
    showResults: (count) =>
      count === 1 ? "Ver 1 exercício" : `Ver ${count} exercícios`,
    noResults: "Não há exercícios correspondentes",
    createCustom: "Criar exercício personalizado",
    done: (count) =>
      `Concluído · ${count} ${count === 1 ? "selecionado" : "selecionados"}`,
  },
  newCustomExercise: {
    breadCrumb: "Exercícios",
    title1: "Novo",
    title2: "Exercício",
    primaryButton: "Criar exercício",
  },
  editExercise: {
    title1: "Editar",
    title2: "Exercício",
    primaryButton: "Guardar alterações",
    delete: "Eliminar exercício",
    deleteTitle: "Eliminar este exercício?",
    deleteMessage: (routineCount) =>
      routineCount === 0
        ? "Esta ação não pode ser anulada."
        : `Também vai ser removido de ${routineCount} ${routineCount === 1 ? "rotina" : "rotinas"}. Esta ação não pode ser anulada.`,
    deleteConfirm: "Eliminar",
    cancel: "Cancelar",
    deleteError: "Não foi possível eliminar o exercício",
  },
  exerciseForm: {
    nameLabel: "Nome",
    trackingLabel: "Tipo de registo",
    trackingLocked:
      "Já tem séries registadas, por isso o tipo não pode mudar. Para outro tipo, cria um exercício novo.",
    musclesLabel: "Músculos principais",
    descriptionLabel: "Descrição",
  },
  manageExercises: {
    add: "Criar exercício",
    emptyTitle: "Ainda não criaste exercícios",
    emptyMessage:
      "Cria os que não estão no catálogo e usa-os nas tuas rotinas como qualquer outro.",
  },
  exercises: {
    namePlaceholder: "Nome do exercício",
    descriptionPlaceholder: "Descrição (opcional)",
    saveError: "Não foi possível guardar o exercício",
    showInfo: "Ver informação do exercício",
    noDescription: "Sem descrição",
    noImages: "Sem fotos",
    closeInfo: "Fechar",
    equipmentLabel: "Equipamento",
    enlargeImage: "Ampliar foto",
    closeImage: "Fechar foto",
    trackingTypes: {
      weight_reps: "Peso + rep.",
      bodyweight_reps: "Peso corporal",
      duration: "Duração",
      distance_duration: "Distância",
    },
  },
  muscles: {
    chest: "Peito",
    front_delts: "Deltoide anterior",
    triceps: "Tríceps",
    abs: "Abdominais",
    side_delts: "Deltoide lateral",
    traps: "Trapézio",
    lats: "Dorsais",
    biceps: "Bíceps",
    forearms: "Antebraços",
    glutes: "Glúteos",
    quads: "Quadríceps",
    hamstrings: "Isquiotibiais",
    calves: "Gémeos",
    obliques: "Oblíquos",
    rear_delts: "Deltoide posterior",
    neck: "Pescoço",
    lower_back: "Zona lombar",
    upper_back: "Parte superior das costas",
    adductors: "Adutores",
    abductors: "Abdutores",
    hip_flexors: "Flexores da anca",
  },
  muscleGroups: {
    chest: "Peito",
    back: "Costas",
    shoulders: "Ombros",
    arms: "Braços",
    neck: "Pescoço",
    legs: "Pernas",
    core: "Core",
  },
  equipment: {
    barbell: "Barra",
    dumbbell: "Halteres",
    cable: "Polia",
    machine: "Máquina",
    kettlebells: "Kettlebell",
    bands: "Elásticos",
    medicine_ball: "Bola medicinal",
    exercise_ball: "Bola de pilates",
    foam_roll: "Rolo de espuma",
    ez_bar: "Barra EZ",
    bodyweight: "Peso corporal",
    other: "Outro",
  },
};
