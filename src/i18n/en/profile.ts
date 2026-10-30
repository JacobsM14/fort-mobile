import type { Translations } from "@/i18n/es";

export const profileTexts: Pick<Translations, "profile"> = {
  profile: {
    athleteType: {
      title: "Your athlete type",
      styles: {
        strength: {
          name: "Strength athlete",
          description:
            "Nearly all your sets are loaded: moving weight is your thing.",
        },
        calisthenics: {
          name: "Calisthenics athlete",
          description:
            "You train mostly with your own body weight: pull-ups, push-ups and the like.",
        },
        endurance: {
          name: "Endurance athlete",
          description:
            "Going the distance is your thing: your exercises are measured in time and distance.",
        },
        allRound: {
          name: "All-round athlete",
          description:
            "You mix strength, bodyweight and cardio without any one taking over.",
        },
      },
      frequentExercises: "Most frequent exercises",
      workoutCount: (count) =>
        count === 1 ? "1 workout" : `${count} workouts`,
      consistency: "Consistency",
      sessionsPerWeek: "sessions/wk",
      averageSessions: (average) => `${average} sessions a week on average`,
      levels: {
        sporadic: "Sporadic",
        regular: "Regular",
        steady: "Steady",
        unstoppable: "Unstoppable",
      },
      levelSummary: (level, position, total) =>
        `${level} level, ${position} of ${total}`,
      toNextLevel: {
        regular: (sessions) =>
          `Do ${sessions} sessions a week to reach Regular.`,
        steady: (sessions) => `Do ${sessions} sessions a week to reach Steady.`,
        unstoppable: (sessions, weeks) =>
          `Do ${sessions} sessions a week for ${weeks} weeks in a row to reach Unstoppable.`,
      },
      topLevel: (sessions) =>
        `You're at the top: keep to ${sessions} sessions a week to stay there.`,
    },
  },
};
