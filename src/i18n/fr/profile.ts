import type { Translations } from "@/i18n/es";

// In French, 0 and 1 take the singular.
const sessions = (count: number) =>
  `${count} ${count <= 1 ? "séance" : "séances"}`;

export const profileTexts: Pick<Translations, "profile"> = {
  profile: {
    athleteType: {
      title: "Ton profil d'athlète",
      styles: {
        strength: {
          name: "Athlète de force",
          description:
            "Presque toutes tes séries sont avec charge : ton truc, c'est de soulever du lourd.",
        },
        calisthenics: {
          name: "Athlète de callisthénie",
          description:
            "Tu t'entraînes surtout au poids du corps : tractions, pompes et compagnie.",
        },
        endurance: {
          name: "Athlète d'endurance",
          description:
            "Ton truc, c'est de durer : tes exercices se mesurent en temps et en distance.",
        },
        allRound: {
          name: "Athlète tout-terrain",
          description:
            "Tu combines force, poids du corps et cardio sans qu'aucun ne prenne le dessus.",
        },
      },
      empty:
        "Termine un entraînement et tu verras ici ton profil d'athlète et ta régularité.",
      frequentExercises: "Exercices les plus fréquents",
      workoutCount: (count) =>
        count <= 1 ? `${count} entraînement` : `${count} entraînements`,
      consistency: "Régularité",
      sessionsPerWeek: "séances/sem.",
      averageSessions: (average) => `${average} séances par semaine en moyenne`,
      levels: {
        sporadic: "Occasionnel",
        regular: "Régulier",
        steady: "Assidu",
        unstoppable: "Inarrêtable",
      },
      levelSummary: (level, position, total) =>
        `Niveau ${level}, ${position} sur ${total}`,
      toNextLevel: {
        regular: (count) =>
          `Fais ${sessions(count)} par semaine pour atteindre le niveau Régulier.`,
        steady: (count) =>
          `Fais ${sessions(count)} par semaine pour atteindre le niveau Assidu.`,
        unstoppable: (count, weeks) =>
          `Fais ${sessions(count)} par semaine pendant ${weeks} semaines d'affilée pour atteindre le niveau Inarrêtable.`,
      },
      topLevel: (count) =>
        `Tu es au sommet : garde le rythme de ${sessions(count)} par semaine pour y rester.`,
    },
    activity: {
      title: "Activité",
      less: "Moins",
      more: "Plus",
      summary: (weeks) =>
        `Calendrier d'activité des ${weeks} dernières semaines`,
    },
  },
};
