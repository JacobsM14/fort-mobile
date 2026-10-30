import type {
  ConsistencyLevel,
  TrainingStyle,
} from "@/features/profile/athlete-type";

export const profileTexts = {
  profile: {
    athleteType: {
      title: "Tu tipo de deportista",
      styles: {
        strength: {
          name: "Atleta de fuerza",
          description:
            "Casi todas tus series llevan carga: lo tuyo es mover peso.",
        },
        calisthenics: {
          name: "Atleta de calistenia",
          description:
            "Entrenas sobre todo con tu propio peso: dominadas, flexiones y compañía.",
        },
        endurance: {
          name: "Atleta de resistencia",
          description:
            "Lo tuyo es aguantar: tus ejercicios se miden en tiempo y distancia.",
        },
        allRound: {
          name: "Atleta polivalente",
          description:
            "Combinas fuerza, peso corporal y cardio sin que ninguno mande sobre los demás.",
        },
      } satisfies Record<TrainingStyle, { name: string; description: string }>,
      empty:
        "Termina un entreno y aquí verás qué tipo de deportista eres y cuánta constancia tienes.",
      frequentExercises: "Ejercicios más frecuentes",
      workoutCount: (count: number) =>
        count === 1 ? "1 entreno" : `${count} entrenos`,
      consistency: "Constancia",
      sessionsPerWeek: "sesiones/sem",
      averageSessions: (average: string) =>
        `${average} sesiones por semana de media`,
      levels: {
        sporadic: "Esporádico",
        regular: "Regular",
        steady: "Constante",
        unstoppable: "Imparable",
      } satisfies Record<ConsistencyLevel, string>,
      levelSummary: (level: string, position: number, total: number) =>
        `Nivel ${level}, ${position} de ${total}`,
      toNextLevel: {
        regular: (sessions: number) =>
          `Haz ${sessions} sesiones por semana para llegar a Regular.`,
        steady: (sessions: number) =>
          `Haz ${sessions} sesiones por semana para llegar a Constante.`,
        unstoppable: (sessions: number, weeks: number) =>
          `Haz ${sessions} sesiones por semana durante ${weeks} semanas seguidas para llegar a Imparable.`,
      },
      topLevel: (sessions: number) =>
        `Estás en lo más alto: sigue con ${sessions} sesiones por semana para no bajar.`,
    },
    activity: {
      title: "Actividad",
      less: "Menos",
      more: "Más",
      summary: (weeks: number) =>
        `Calendario de actividad de las últimas ${weeks} semanas`,
    },
  },
};
