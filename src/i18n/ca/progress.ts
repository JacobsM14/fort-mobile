import type { Translations } from "@/i18n/es";

// "de" is written "d'" before a value read with a vowel: 1 (u), 11 (onze).
const de = (value: string) =>
  /^1{1,2}(?![\d.])/.test(value) ? `d'${value}` : `de ${value}`;

export const progressTexts: Pick<Translations, "progress"> = {
  progress: {
    reps: (count) => `${count} rep.`,
    strength: "Força",
    bodyWeight: "Pes corporal",
    oneRepMaxNote:
      "1RM estimat: el pes màxim que podries aixecar una sola vegada, calculat amb la millor sèrie del dia (fórmula d'Epley). Les sèries de més de 15 repeticions compten com a 15.",
    today: "Avui",
    chooseExercise: (name) => `Tria l'exercici, ${name}`,
    metrics: {
      weight_reps: "1RM estimat",
      bodyweight_reps: "Millor sèrie",
      duration: "Millor temps",
      distance_duration: "Velocitat",
    },
    speedUnit: { km: "km/h", mi: "mph" },
    chartSummary: (metric, first, last, days) =>
      `${metric}: ${de(first)} a ${last} en ${days} ${days === 1 ? "dia" : "dies"}`,
    chartHint: "Llisca amunt o avall per canviar de dia",
    noData: "No hi ha dades en aquest període",
    noWeight: "Encara no has desat cap pes.",
    noTrained: "Registra un entrenament per veure aquí el teu progrés",
    changeLabel: (change) => `Canvi en el període: ${change}`,
    oneRepMaxShort: "1RM est.",
    views: {
      today: { short: "AVUI", label: "Avui" },
      "4w": { short: "4S", label: "4 setmanes" },
      "3m": { short: "3M", label: "3 mesos" },
      "6m": { short: "6M", label: "6 mesos" },
      "1y": { short: "1A", label: "1 any" },
    },
    registerWeight: "Registra el pes corporal",
    saveWeight: "Desa el pes corporal",
    weightSaved: "Pes desat",
    saveWeightError: "No s'ha pogut desar el pes",
    decreaseWeight: "Redueix el pes",
    increaseWeight: "Augmenta el pes",
    weightInput: "Pes corporal",
    oneWeightPerDay: "Només pots tenir un registre de pes per dia.",
    weightViews: { chart: "Gràfic", list: "Llista" },
    bmi: "Índex de massa corporal",
    bmiTitleEmpty: "Falten dades per a l'IMC",
    bmiMissing: {
      height:
        "Afegeix la teva alçada a les teves dades per calcular el teu IMC.",
      weight: "Registra el teu pes a dalt per calcular el teu IMC.",
      heightAndWeight:
        "Afegeix la teva alçada a les teves dades i registra el teu pes a dalt per calcular el teu IMC.",
      gender:
        "En menors de 19 anys l'IMC es llegeix segons el sexe: indica'l a les teves dades.",
    },
    bmiEmptyAction: "Completa les meves dades",
    bmiAssumedAdult:
      "Calculat com a adult. Si tens menys de 19 anys, afegeix la teva data de naixement.",
    bmiNoReference:
      "La referència de l'OMS per a menors de 19 anys va per sexe, així que només es mostra el valor.",
    bmiCategories: {
      underweight: "Pes baix",
      normal: "Pes normal",
      overweight: "Sobrepès",
      obese: "Obesitat",
    },
    bmiBands: {
      underweight: "Baix",
      normal: "Normal",
      overweight: "Sobrepès",
      obese: "Obesitat",
    },
    bmiToIdeal: {
      over: (weight) => `Et sobren ${weight} respecte al teu pes ideal`,
      under: (weight) => `Et falten ${weight} per arribar al teu pes ideal`,
      inRange: (weight) => `Al teu pes ideal, a ${weight} del límit`,
    },
    bmiSummary: (score, category) => `IMC ${score}: ${category}`,
  },
};
