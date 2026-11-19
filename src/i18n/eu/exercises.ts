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
    breadCrumb: "Errutina berria",
    breadCrumbEdit: "Editatu errutina",
    title: "Ariketak",
    searchPlaceholder: "Bilatu ariketa",
    clearSearch: "Garbitu bilaketa",
    filters: "Iragazkiak",
    clearFilters: "Garbitu",
    closeFilters: "Itxi iragazkiak",
    typeLabel: "Mota",
    groupLabel: "Muskulu-taldea",
    muscleLabel: "Muskulua",
    showResults: (count) =>
      count === 1 ? "Ikusi ariketa 1" : `Ikusi ${count} ariketa`,
    noResults: "Ez dago bat datorren ariketarik",
    createCustom: "Sortu zure ariketa",
    done: (count) => `Prest · ${count} hautatuta`,
  },
  newCustomExercise: {
    breadCrumb: "Ariketak",
    title1: "Ariketa",
    title2: "Berria",
    primaryButton: "Sortu ariketa",
  },
  editExercise: {
    title1: "Editatu",
    title2: "Ariketa",
    primaryButton: "Gorde aldaketak",
    delete: "Ezabatu ariketa",
    deleteTitle: "Ariketa hau ezabatu nahi duzu?",
    deleteMessage: (routineCount) =>
      routineCount === 0
        ? "Ekintza hau ezin da desegin."
        : routineCount === 1
          ? "Errutina batetik ere kenduko da. Ekintza hau ezin da desegin."
          : `${routineCount} errutinatatik ere kenduko da. Ekintza hau ezin da desegin.`,
    deleteConfirm: "Ezabatu",
    cancel: "Utzi",
    deleteError: "Ezin izan da ariketa ezabatu",
  },
  exerciseForm: {
    nameLabel: "Izena",
    trackingLabel: "Erregistro mota",
    trackingLocked:
      "Dagoeneko serieak erregistratuta ditu; beraz, ezin zaio mota aldatu. Beste mota baterako, sortu ariketa berri bat.",
    musclesLabel: "Muskulu nagusiak",
    descriptionLabel: "Deskribapena",
  },
  manageExercises: {
    add: "Sortu ariketa",
    emptyTitle: "Oraindik ez duzu ariketarik sortu",
    emptyMessage:
      "Sortu katalogoan ez daudenak, eta erabili zure errutinetan beste edozein bezala.",
  },
  exercises: {
    namePlaceholder: "Ariketaren izena",
    descriptionPlaceholder: "Deskribapena (aukerakoa)",
    saveError: "Ezin izan da ariketa gorde",
    showInfo: "Ikusi ariketaren informazioa",
    noDescription: "Deskribapenik ez",
    noImages: "Argazkirik ez",
    closeInfo: "Itxi",
    equipmentLabel: "Materiala",
    enlargeImage: "Handitu argazkia",
    closeImage: "Itxi argazkia",
    trackingTypes: {
      weight_reps: "Pisua + errep.",
      bodyweight_reps: "Gorputz-pisua",
      duration: "Iraupena",
      distance_duration: "Distantzia",
    },
  },
  muscles: {
    chest: "Bularra",
    front_delts: "Aurreko deltoidea",
    triceps: "Trizepsa",
    abs: "Abdominalak",
    side_delts: "Alboko deltoidea",
    traps: "Trapezioa",
    lats: "Dortsalak",
    biceps: "Bizepsa",
    forearms: "Besaurreak",
    glutes: "Gluteoak",
    quads: "Koadrizepsa",
    hamstrings: "Iskiotibialak",
    calves: "Bernazaharrak",
    obliques: "Zeiharrak",
    rear_delts: "Atzeko deltoidea",
    neck: "Lepoa",
    lower_back: "Bizkarraren behealdea",
    upper_back: "Bizkarraren goialdea",
    adductors: "Aduktoreak",
    abductors: "Abduktoreak",
    hip_flexors: "Aldakako flexoreak",
  },
  muscleGroups: {
    chest: "Bularra",
    back: "Bizkarra",
    shoulders: "Sorbaldak",
    arms: "Besoak",
    neck: "Lepoa",
    legs: "Hankak",
    core: "Enborra",
  },
  equipment: {
    barbell: "Barra",
    dumbbell: "Halterak",
    cable: "Polea",
    machine: "Makina",
    kettlebells: "Kettlebell",
    bands: "Banda elastikoak",
    medicine_ball: "Medizina-baloia",
    exercise_ball: "Fitball",
    foam_roll: "Apar-arrabola",
    ez_bar: "Z barra",
    bodyweight: "Gorputz-pisua",
    other: "Bestelakoa",
  },
};
