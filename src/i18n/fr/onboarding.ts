import type { Translations } from "@/i18n/es";

export const onboardingTexts: Pick<Translations, "onboarding"> = {
  onboarding: {
    welcomeTitle: (app) => `Bienvenue dans ${app}`,
    welcomeMessage:
      "Planifie tes routines, note chaque série et suis tes progrès, le tout sur ton téléphone.",
    skip: "Passer",
    previous: "Précédent",
    next: "Suivant",
    finish: "Terminer",
    progress: (step, total) => `Étape ${step} sur ${total}`,
    tour: {
      newRoutine: {
        title: "Crée tes routines",
        message:
          "Donne-leur un nom et ajoute les exercices. Tu ne le fais qu'une fois.",
      },
      picker: {
        title: "Choisis les exercices",
        message:
          "Cherche dans le catalogue ou filtre par muscle. S'il en manque un, crée le tien.",
      },
      today: {
        title: "Choisis la séance du jour",
        message:
          "Chaque jour d'entraînement est marqué sur la semaine. Touche Commencer sur la routine du jour.",
      },
      workout: {
        title: "Note chaque série",
        message:
          "Saisis le poids et les répétitions, valide la série et chronomètre le repos.",
      },
      progress: {
        title: "Suis tes progrès",
        message:
          "Suis la force estimée de chaque exercice et ton poids corporel.",
      },
      history: {
        title: "Revois ton historique",
        message:
          "Toutes tes séances et pesées, jour par jour. Modifie-les ou ajoute celles que tu as oubliées.",
      },
    },
  },
};
