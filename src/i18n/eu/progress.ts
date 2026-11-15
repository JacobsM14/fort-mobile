import type { Translations } from "@/i18n/es";

export const progressTexts: Pick<Translations, "progress"> = {
  progress: {
    reps: (count) => `${count} errep.`,
    strength: "Indarra",
    bodyWeight: "Gorputz-pisua",
    oneRepMaxNote:
      "1RM estimatua: behin bakarrik altxa zenezakeen gehieneko pisua, eguneko serie onenarekin kalkulatua (Epleyren formula). 15 errepikapen baino gehiagoko serieek 15 balio dute.",
    today: "Gaur",
    minutes: (minutes) => `${minutes} min`,
    noWorkoutToday: "Gaur ez duzu entrenatu",
    todayExercises: "Gaurko ariketak",
    musclesWorked: "Landutako giharrak",
    bodyFront: "Aurrealdea",
    bodyBack: "Atzealdea",
    workoutCount: (count) =>
      count === 1 ? "entrenamendu 1" : `${count} entrenamendu`,
    setCount: (count) => (count === 1 ? "serie 1" : `${count} serie`),
    chooseExercise: (name) => `Aukeratu ariketa, ${name}`,
    metrics: {
      weight_reps: "1RM estimatua",
      bodyweight_reps: "Serie onena",
      duration: "Denbora onena",
      distance_duration: "Abiadura",
    },
    speedUnit: { km: "km/h", mi: "mph" },
    // The values go without endings: "hasieran 80 kg, amaieran 85 kg".
    chartSummary: (metric, first, last, days) =>
      `${metric}: hasieran ${first}, amaieran ${last}, ${days === 1 ? "egun batean" : `${days} egunetan`}`,
    chartHint: "Pasatu hatza gora edo behera eguna aldatzeko",
    noData: "Ez dago daturik aldi honetan",
    noWeight: "Oraindik ez duzu pisurik gorde.",
    noTrained: "Erregistratu entrenamendu bat zure aurrerapena hemen ikusteko",
    changeLabel: (change) => `Aldaketa aldi honetan: ${change}`,
    oneRepMaxShort: "1RM est.",
    views: {
      today: { short: "GAUR", label: "Gaur" },
      "4w": { short: "4A", label: "4 aste" },
      "3m": { short: "3H", label: "3 hilabete" },
      "6m": { short: "6H", label: "6 hilabete" },
      "1y": { short: "1U", label: "urtebete" },
    },
    registerWeight: "Erregistratu gorputz-pisua",
    saveWeight: "Gorde gorputz-pisua",
    weightSaved: "Pisua gorde da",
    saveWeightError: "Ezin izan da pisua gorde",
    decreaseWeight: "Jaitsi pisua",
    increaseWeight: "Igo pisua",
    weightInput: "Gorputz-pisua",
    oneWeightPerDay: "Egunean pisu-erregistro bakarra izan dezakezu.",
    weightViews: { chart: "Grafikoa", list: "Zerrenda" },
    bmi: "Gorputz-masaren indizea",
    bmiTitleEmpty: "GMIa kalkulatzeko datuak falta dira",
    bmiMissing: {
      height: "Gehitu zure altuera zure datuetan GMIa kalkulatzeko.",
      weight: "Erregistratu zure pisua goian GMIa kalkulatzeko.",
      heightAndWeight:
        "Gehitu zure altuera zure datuetan eta erregistratu zure pisua goian GMIa kalkulatzeko.",
      gender:
        "19 urtetik beherakoetan, GMIa sexuaren arabera irakurtzen da: adierazi zure datuetan.",
    },
    bmiEmptyAction: "Osatu nire datuak",
    bmiAssumedAdult:
      "Heldu gisa kalkulatua. 19 urte baino gutxiago badituzu, gehitu zure jaiotze-data.",
    bmiNoReference:
      "19 urtetik beherakoentzat, OMEren erreferentzia sexuaren araberakoa da; beraz, balioa bakarrik erakusten da.",
    bmiCategories: {
      underweight: "Pisu baxua",
      normal: "Pisu normala",
      overweight: "Gehiegizko pisua",
      obese: "Obesitatea",
    },
    bmiBands: {
      underweight: "Baxua",
      normal: "Normala",
      overweight: "Gehiegizkoa",
      obese: "Obesitatea",
    },
    bmiToIdeal: {
      over: (weight) => `Zure pisu idealaren gainetik: ${weight}`,
      under: (weight) => `Zure pisu idealaren azpitik: ${weight}`,
      inRange: (weight) => `Pisu idealean; mugarako tartea: ${weight}`,
    },
    bmiSummary: (score, category) => `GMI ${score}: ${category}`,
  },
};
