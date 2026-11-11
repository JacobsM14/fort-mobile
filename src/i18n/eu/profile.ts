import type { Translations } from "@/i18n/es";

// After a number the noun stays singular, and "1" goes after it:
// "saio 1", "3 saio".
const sessions = (count: number) => (count === 1 ? "saio 1" : `${count} saio`);

export const profileTexts: Pick<Translations, "profile"> = {
  profile: {
    athleteType: {
      title: "Zure kirolari mota",
      period: (weeks) => `Zure azken ${weeks} asteetan oinarrituta`,
      styles: {
        strength: {
          name: "Indar-kirolaria",
          description:
            "Ia serie guztiak kargarekin egiten dituzu: pisua mugitzea da zure gauza.",
        },
        calisthenics: {
          name: "Kalistenia-kirolaria",
          description:
            "Batez ere zure gorputz-pisuarekin entrenatzen zara: dominadak, flexioak eta antzekoak.",
        },
        endurance: {
          name: "Erresistentzia-kirolaria",
          description:
            "Eustea da zure gauza: zure ariketak denboran eta distantzian neurtzen dira.",
        },
        allRound: {
          name: "Kirolari osoa",
          description:
            "Indarra, gorputz-pisua eta kardioa konbinatzen dituzu, bat bera ere besteen gainetik egon gabe.",
        },
      },
      empty:
        "Amaitu entrenamendu bat, eta hemen ikusiko duzu zer kirolari mota zaren eta zenbateko konstantzia duzun.",
      frequentExercises: "Ariketa ohikoenak",
      workoutCount: (count) =>
        count === 1 ? "entrenamendu 1" : `${count} entrenamendu`,
      consistency: "Konstantzia",
      sessionsPerWeek: "saio/aste",
      averageSessions: (average) => `Batez beste ${average} saio astean`,
      levels: {
        sporadic: "Esporadikoa",
        regular: "Erregularra",
        steady: "Konstantea",
        unstoppable: "Geldiezina",
      },
      levelSummary: (level, position, total) =>
        `Maila: ${level}, ${position}/${total}`,
      toNextLevel: {
        regular: (count) =>
          `Egin ${sessions(count)} astean Erregularra izateko.`,
        steady: (count) => `Egin ${sessions(count)} astean Konstantea izateko.`,
        unstoppable: (count, weeks) =>
          `Egin ${sessions(count)} astean ${weeks} astez jarraian Geldiezina izateko.`,
      },
      topLevel: (count) =>
        `Gailurrean zaude: jarraitu astean ${sessions(count)} egiten, ez jaisteko.`,
    },
    activity: {
      title: "Jarduera",
      less: "Gutxiago",
      more: "Gehiago",
      summary: (weeks) => `Azken ${weeks} asteetako jarduera-egutegia`,
    },
  },
};
