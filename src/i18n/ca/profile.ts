import type { Translations } from "@/i18n/es";

const sessions = (count: number) =>
  `${count} ${count === 1 ? "sessió" : "sessions"}`;

export const profileTexts: Pick<Translations, "profile"> = {
  profile: {
    athleteType: {
      title: "El teu tipus d'esportista",
      period: (weeks) => `Segons les teves últimes ${weeks} setmanes`,
      styles: {
        strength: {
          name: "Atleta de força",
          description:
            "Gairebé totes les teves sèries són amb càrrega: el teu fort és moure pes.",
        },
        calisthenics: {
          name: "Atleta de calistènia",
          description:
            "Entrenes sobretot amb el teu propi pes: dominades, flexions i companyia.",
        },
        endurance: {
          name: "Atleta de resistència",
          description:
            "El teu fort és aguantar: els teus exercicis es mesuren en temps i distància.",
        },
        allRound: {
          name: "Atleta polivalent",
          description:
            "Combines força, pes corporal i cardio sense que cap s'imposi als altres.",
        },
      },
      empty:
        "Acaba un entrenament i aquí veuràs quin tipus d'esportista ets i quanta constància tens.",
      frequentExercises: "Exercicis més freqüents",
      workoutCount: (count) =>
        count === 1 ? "1 entrenament" : `${count} entrenaments`,
      consistency: "Constància",
      sessionsPerWeek: "sessions/setm.",
      averageSessions: (average) =>
        `${average} sessions per setmana de mitjana`,
      levels: {
        sporadic: "Esporàdic",
        regular: "Regular",
        steady: "Constant",
        unstoppable: "Imparable",
      },
      levelSummary: (level, position, total) =>
        `Nivell ${level}, ${position} de ${total}`,
      toNextLevel: {
        regular: (count) =>
          `Fes ${sessions(count)} per setmana per arribar a Regular.`,
        steady: (count) =>
          `Fes ${sessions(count)} per setmana per arribar a Constant.`,
        unstoppable: (count, weeks) =>
          `Fes ${sessions(count)} per setmana durant ${weeks} setmanes seguides per arribar a Imparable.`,
      },
      topLevel: (count) =>
        `Ets al cim: continua amb ${sessions(count)} per setmana per no baixar.`,
    },
    activity: {
      title: "Activitat",
      less: "Menys",
      more: "Més",
      summary: (weeks) =>
        `Calendari d'activitat de les últimes ${weeks} setmanes`,
    },
  },
};
