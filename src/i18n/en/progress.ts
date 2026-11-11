import type { Translations } from "@/i18n/es";

export const progressTexts: Pick<Translations, "progress"> = {
  progress: {
    reps: (count) => `${count} reps`,
    strength: "Strength",
    bodyWeight: "Body weight",
    oneRepMaxNote:
      "Estimated 1RM: the most weight you could lift once, worked out from the day's best set (Epley formula). Sets of more than 15 reps count as 15.",
    today: "Today",
    chooseExercise: (name) => `Choose exercise, ${name}`,
    metrics: {
      weight_reps: "Estimated 1RM",
      bodyweight_reps: "Best set",
      duration: "Best time",
      distance_duration: "Speed",
    },
    speedUnit: { km: "km/h", mi: "mph" },
    chartSummary: (metric, first, last, days) =>
      `${metric}: from ${first} to ${last} over ${days} ${days === 1 ? "day" : "days"}`,
    chartHint: "Swipe up or down to change the day",
    noData: "No data in this period",
    noWeight: "No weight recorded yet.",
    noTrained: "Log a workout to see your progress here",
    changeLabel: (change) => `Change over the period: ${change}`,
    oneRepMaxShort: "est. 1RM",
    views: {
      today: { short: "TODAY", label: "Today" },
      "4w": { short: "4W", label: "4 weeks" },
      "3m": { short: "3M", label: "3 months" },
      "6m": { short: "6M", label: "6 months" },
      "1y": { short: "1Y", label: "1 year" },
    },
    registerWeight: "Register body weight",
    saveWeight: "Save body weight",
    weightSaved: "Body weight saved",
    saveWeightError: "The body weight couldn't be saved",
    decreaseWeight: "Decrease weight",
    increaseWeight: "Increase weight",
    weightInput: "Body weight",
    oneWeightPerDay: "You can only have one weight entry per day.",
    weightViews: { chart: "Chart", list: "List" },
    bmi: "Body Mass Index",
    bmiTitleEmpty: "Missing BMI data",
    bmiMissing: {
      height: "Add your height to your details to work out your BMI.",
      weight: "Log your weight above to work out your BMI.",
      heightAndWeight:
        "Add your height to your details and log your weight above to work out your BMI.",
      gender: "Under 19, the BMI is read by sex: add it to your details.",
    },
    bmiEmptyAction: "Complete my details",
    bmiAssumedAdult:
      "Worked out as an adult. If you are under 19, add your birth date.",
    bmiNoReference:
      "The WHO reference for under-19s is by sex, so only the value is shown.",
    bmiCategories: {
      underweight: "Underweight",
      normal: "Normal weight",
      overweight: "Overweight",
      obese: "Obesity",
    },
    bmiBands: {
      underweight: "Under",
      normal: "Normal",
      overweight: "Overweight",
      obese: "Obese",
    },
    bmiToIdeal: {
      over: (weight: string) => `${weight} above your ideal weight`,
      under: (weight: string) => `${weight} below your ideal weight`,
      inRange: (weight: string) => `Ideal weight, ${weight} from the limit`,
    },
    bmiSummary: (score: string, category: string) =>
      `BMI ${score}: ${category}`,
  },
};
