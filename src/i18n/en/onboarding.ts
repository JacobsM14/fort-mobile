import type { Translations } from "@/i18n/es";

export const onboardingTexts: Pick<Translations, "onboarding"> = {
  onboarding: {
    welcomeTitle: (app) => `Welcome to ${app}`,
    welcomeMessage:
      "Plan your routines, log every set and watch your progress, all on your phone.",
    skip: "Skip",
    previous: "Previous",
    next: "Next",
    finish: "Finish",
    progress: (step, total) => `Step ${step} of ${total}`,
    tour: {
      newRoutine: {
        title: "Create your routines",
        message: "Name them and add the exercises. You only do it once.",
      },
      picker: {
        title: "Pick the exercises",
        message:
          "Search the catalog or filter by muscle. If one is missing, create your own.",
      },
      today: {
        title: "Choose today's workout",
        message:
          "Every day you train is marked on the week. Tap Start on today's routine.",
      },
      workout: {
        title: "Log every set",
        message:
          "Type the weight and reps, mark the set as done and time your rest.",
      },
      progress: {
        title: "Watch your progress",
        message:
          "Follow each exercise's estimated strength and your body weight.",
      },
      history: {
        title: "Look back on your history",
        message:
          "Every workout and weigh-in, day by day. Edit them or add the ones you forgot.",
      },
    },
  },
};
