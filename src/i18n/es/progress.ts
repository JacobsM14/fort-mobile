import type { TrackingType } from "@/constants/enums";
import type { BmiCategory } from "@/features/body/bmi";
import type { ProgressView } from "@/features/progress/views";

export const progressTexts = {
  progress: {
    reps: (count: number) => `${count} reps`,
    strength: "Fuerza",
    bodyWeight: "Peso corporal",
    oneRepMaxNote:
      "1RM estimado: el peso máximo que podrías levantar una sola vez, calculado con la mejor serie del día (fórmula de Epley). Las series de más de 15 repeticiones cuentan como 15.",
    today: "Hoy",
    chooseExercise: (name: string) => `Elegir ejercicio, ${name}`,
    metrics: {
      weight_reps: "1RM estimado",
      bodyweight_reps: "Mejor serie",
      duration: "Mejor tiempo",
      distance_duration: "Velocidad",
    } satisfies Record<TrackingType, string>,
    speedUnit: { km: "km/h", mi: "mph" },
    chartSummary: (metric: string, first: string, last: string, days: number) =>
      `${metric}: de ${first} a ${last} en ${days} ${days === 1 ? "día" : "días"}`,
    chartHint: "Desliza arriba o abajo para cambiar de día",
    noData: "Sin datos en este periodo",
    noWeight: "No has guardado ningún peso aún.",
    noTrained: "Registra un entreno para ver aquí tu progreso",
    changeLabel: (change: string) => `Cambio en el periodo: ${change}`,
    oneRepMaxShort: "1RM est.",
    views: {
      today: { short: "HOY", label: "Hoy" },
      "4w": { short: "4S", label: "4 semanas" },
      "3m": { short: "3M", label: "3 meses" },
      "6m": { short: "6M", label: "6 meses" },
      "1y": { short: "1A", label: "1 año" },
    } satisfies Record<ProgressView, { short: string; label: string }>,
    registerWeight: "Registrar peso corporal",
    saveWeight: "Guardar peso corporal",
    weightSaved: "Peso guardado",
    saveWeightError: "No se ha podido guardar el peso",
    decreaseWeight: "Bajar peso",
    increaseWeight: "Subir peso",
    weightInput: "Peso corporal",
    oneWeightPerDay: "Solo puedes tener un registro de peso por día.",
    weightViews: { chart: "Gráfica", list: "Lista" },
    bmi: "Índice de masa corporal",
    bmiTitleEmpty: "Faltan datos para el IMC",
    bmiMissing: {
      height: "Añade tu altura en tus datos para calcular tu IMC.",
      weight: "Registra tu peso arriba para calcular tu IMC.",
      heightAndWeight:
        "Añade tu altura en tus datos y registra tu peso arriba para calcular tu IMC.",
      gender:
        "En menores de 19 años el IMC se lee según el sexo: indícalo en tus datos.",
    },
    bmiEmptyAction: "Completar mis datos",
    bmiAssumedAdult:
      "Calculado como adulto. Si tienes menos de 19 años, añade tu fecha de nacimiento.",
    bmiNoReference:
      "La referencia de la OMS para menores de 19 años va por sexo, así que solo se muestra el valor.",
    bmiCategories: {
      underweight: "Bajo peso",
      normal: "Peso normal",
      overweight: "Sobrepeso",
      obese: "Obesidad",
    } satisfies Record<BmiCategory, string>,
    bmiBands: {
      underweight: "Bajo",
      normal: "Normal",
      overweight: "Sobrepeso",
      obese: "Obesidad",
    } satisfies Record<BmiCategory, string>,
    bmiToIdeal: {
      over: (weight: string) => `Te sobran ${weight} para tu peso ideal`,
      under: (weight: string) => `Te faltan ${weight} para tu peso ideal`,
      inRange: (weight: string) => `En tu peso ideal, a ${weight} del límite`,
    },
    bmiSummary: (score: string, category: string) =>
      `IMC ${score}: ${category}`,
  },
};
