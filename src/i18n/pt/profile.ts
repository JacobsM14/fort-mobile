import type { Translations } from "@/i18n/es";

const sessions = (count: number) =>
  `${count} ${count === 1 ? "sessão" : "sessões"}`;

export const profileTexts: Pick<Translations, "profile"> = {
  profile: {
    athleteType: {
      title: "O teu tipo de atleta",
      styles: {
        strength: {
          name: "Atleta de força",
          description:
            "Quase todas as tuas séries levam carga: o teu forte é levantar peso.",
        },
        calisthenics: {
          name: "Atleta de calistenia",
          description:
            "Treinas sobretudo com o teu próprio peso: elevações, flexões e afins.",
        },
        endurance: {
          name: "Atleta de resistência",
          description:
            "O teu forte é aguentar: os teus exercícios medem-se em tempo e distância.",
        },
        allRound: {
          name: "Atleta polivalente",
          description:
            "Combinas força, peso corporal e cardio sem que nenhum domine os outros.",
        },
      },
      empty:
        "Termina um treino e vais ver aqui que tipo de atleta és e quão constante és.",
      frequentExercises: "Exercícios mais frequentes",
      workoutCount: (count) => (count === 1 ? "1 treino" : `${count} treinos`),
      consistency: "Constância",
      sessionsPerWeek: "sessões/sem.",
      averageSessions: (average) => `${average} sessões por semana em média`,
      levels: {
        sporadic: "Esporádico",
        regular: "Regular",
        steady: "Constante",
        unstoppable: "Imparável",
      },
      levelSummary: (level, position, total) =>
        `Nível ${level}, ${position} de ${total}`,
      toNextLevel: {
        regular: (count) =>
          `Faz ${sessions(count)} por semana para chegares a Regular.`,
        steady: (count) =>
          `Faz ${sessions(count)} por semana para chegares a Constante.`,
        unstoppable: (count, weeks) =>
          `Faz ${sessions(count)} por semana durante ${weeks} semanas seguidas para chegares a Imparável.`,
      },
      topLevel: (count) =>
        `Estás no topo: mantém ${sessions(count)} por semana para não desceres.`,
    },
    activity: {
      title: "Atividade",
      less: "Menos",
      more: "Mais",
      summary: (weeks) =>
        `Calendário de atividade das últimas ${weeks} semanas`,
    },
  },
};
