import type { Translations } from "@/i18n/es";

export const progressTexts: Pick<Translations, "progress"> = {
  progress: {
    reps: (count) => `${count} rép.`,
    strength: "Force",
    bodyWeight: "Poids corporel",
    oneRepMaxNote:
      "1RM estimé : la charge maximale que tu pourrais soulever une seule fois, calculée à partir de la meilleure série du jour (formule d'Epley). Les séries de plus de 15 répétitions comptent comme 15.",
    today: "Aujourd'hui",
    minutes: (minutes) => `${minutes} min`,
    noWorkoutToday: "Pas d'entraînement aujourd'hui",
    todayExercises: "Exercices du jour",
    musclesWorked: "Muscles travaillés",
    bodyFront: "Face",
    bodyBack: "Dos",
    workoutCount: (count) =>
      count <= 1 ? `${count} entraînement` : `${count} entraînements`,
    chooseExercise: (name) => `Choisir l'exercice, ${name}`,
    metrics: {
      weight_reps: "1RM estimé",
      bodyweight_reps: "Meilleure série",
      duration: "Meilleur temps",
      distance_duration: "Vitesse",
    },
    speedUnit: { km: "km/h", mi: "mph" },
    // In French, 0 and 1 take the singular.
    chartSummary: (metric, first, last, days) =>
      `${metric} : de ${first} à ${last} en ${days} ${days <= 1 ? "jour" : "jours"}`,
    chartHint: "Glisse vers le haut ou le bas pour changer de jour",
    noData: "Aucune donnée sur cette période",
    noWeight: "Tu n'as encore enregistré aucun poids.",
    noTrained: "Enregistre un entraînement pour voir ta progression ici",
    changeLabel: (change) => `Évolution sur la période : ${change}`,
    oneRepMaxShort: "1RM est.",
    views: {
      today: { short: "AUJ.", label: "Aujourd'hui" },
      "4w": { short: "4S", label: "4 semaines" },
      "3m": { short: "3M", label: "3 mois" },
      "6m": { short: "6M", label: "6 mois" },
      "1y": { short: "1A", label: "1 an" },
    },
    registerWeight: "Saisir le poids corporel",
    saveWeight: "Enregistrer le poids corporel",
    weightSaved: "Poids enregistré",
    saveWeightError: "Impossible d'enregistrer le poids",
    decreaseWeight: "Diminuer le poids",
    increaseWeight: "Augmenter le poids",
    weightInput: "Poids corporel",
    oneWeightPerDay: "Tu ne peux avoir qu'une pesée par jour.",
    weightViews: { chart: "Graphique", list: "Liste" },
    bmi: "Indice de masse corporelle",
    bmiTitleEmpty: "Données manquantes pour l'IMC",
    bmiMissing: {
      height: "Ajoute ta taille dans tes infos pour calculer ton IMC.",
      weight: "Enregistre ton poids ci-dessus pour calculer ton IMC.",
      heightAndWeight:
        "Ajoute ta taille dans tes infos et enregistre ton poids ci-dessus pour calculer ton IMC.",
      gender:
        "Avant 19 ans, l'IMC se lit selon le sexe : indique-le dans tes infos.",
    },
    bmiEmptyAction: "Compléter mes infos",
    bmiAssumedAdult:
      "Calculé pour un adulte. Si tu as moins de 19 ans, ajoute ta date de naissance.",
    bmiNoReference:
      "La référence de l'OMS pour les moins de 19 ans dépend du sexe, donc seule la valeur est affichée.",
    bmiCategories: {
      underweight: "Maigreur",
      normal: "Poids normal",
      overweight: "Surpoids",
      obese: "Obésité",
    },
    bmiBands: {
      underweight: "Maigreur",
      normal: "Normal",
      overweight: "Surpoids",
      obese: "Obésité",
    },
    bmiToIdeal: {
      over: (weight) => `${weight} au-dessus de ton poids idéal`,
      under: (weight) => `${weight} en dessous de ton poids idéal`,
      inRange: (weight) => `Poids idéal, à ${weight} de la limite`,
    },
    bmiSummary: (score, category) => `IMC ${score} : ${category}`,
  },
};
