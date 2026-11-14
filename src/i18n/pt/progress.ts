import type { Translations } from "@/i18n/es";

export const progressTexts: Pick<Translations, "progress"> = {
  progress: {
    reps: (count) => `${count} rep.`,
    strength: "Força",
    bodyWeight: "Peso corporal",
    oneRepMaxNote:
      "1RM estimado: o peso máximo que conseguirias levantar uma única vez, calculado com a melhor série do dia (fórmula de Epley). As séries com mais de 15 repetições contam como 15.",
    today: "Hoje",
    minutes: (minutes) => `${minutes} min`,
    noWorkoutToday: "Hoje ainda não treinaste",
    todayExercises: "Exercícios de hoje",
    workoutCount: (count) => (count === 1 ? "1 treino" : `${count} treinos`),
    chooseExercise: (name) => `Escolher exercício, ${name}`,
    metrics: {
      weight_reps: "1RM estimado",
      bodyweight_reps: "Melhor série",
      duration: "Melhor tempo",
      distance_duration: "Velocidade",
    },
    speedUnit: { km: "km/h", mi: "mph" },
    chartSummary: (metric, first, last, days) =>
      `${metric}: de ${first} a ${last} em ${days} ${days === 1 ? "dia" : "dias"}`,
    chartHint: "Desliza para cima ou para baixo para mudar de dia",
    noData: "Sem dados neste período",
    noWeight: "Ainda não guardaste nenhum peso.",
    noTrained: "Regista um treino para veres aqui o teu progresso",
    changeLabel: (change) => `Variação no período: ${change}`,
    oneRepMaxShort: "1RM est.",
    views: {
      today: { short: "HOJE", label: "Hoje" },
      "4w": { short: "4S", label: "4 semanas" },
      "3m": { short: "3M", label: "3 meses" },
      "6m": { short: "6M", label: "6 meses" },
      "1y": { short: "1A", label: "1 ano" },
    },
    registerWeight: "Registar peso corporal",
    saveWeight: "Guardar peso corporal",
    weightSaved: "Peso guardado",
    saveWeightError: "Não foi possível guardar o peso",
    decreaseWeight: "Diminuir peso",
    increaseWeight: "Aumentar peso",
    weightInput: "Peso corporal",
    oneWeightPerDay: "Só podes ter um registo de peso por dia.",
    weightViews: { chart: "Gráfico", list: "Lista" },
    bmi: "Índice de massa corporal",
    bmiTitleEmpty: "Faltam dados para o IMC",
    bmiMissing: {
      height: "Adiciona a tua altura nos teus dados para calcular o teu IMC.",
      weight: "Regista o teu peso acima para calcular o teu IMC.",
      heightAndWeight:
        "Adiciona a tua altura nos teus dados e regista o teu peso acima para calcular o teu IMC.",
      gender:
        "Em menores de 19 anos, o IMC lê-se de acordo com o sexo: indica-o nos teus dados.",
    },
    bmiEmptyAction: "Completar os meus dados",
    bmiAssumedAdult:
      "Calculado como adulto. Se tens menos de 19 anos, adiciona a tua data de nascimento.",
    bmiNoReference:
      "A referência da OMS para menores de 19 anos depende do sexo, por isso só é mostrado o valor.",
    bmiCategories: {
      underweight: "Baixo peso",
      normal: "Peso normal",
      overweight: "Excesso de peso",
      obese: "Obesidade",
    },
    bmiBands: {
      underweight: "Baixo",
      normal: "Normal",
      overweight: "Excesso",
      obese: "Obesidade",
    },
    bmiToIdeal: {
      over: (weight) => `Tens ${weight} a mais para o teu peso ideal`,
      under: (weight) => `Faltam-te ${weight} para o teu peso ideal`,
      inRange: (weight) => `No teu peso ideal, a ${weight} do limite`,
    },
    bmiSummary: (score, category) => `IMC ${score}: ${category}`,
  },
};
