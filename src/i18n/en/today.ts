import type { Translations } from "@/i18n/es";

export const todayTexts: Pick<Translations, "today"> = {
  today: {
    title: "What's on today?",
    emptyTitle: "No routines yet",
    emptyMessage:
      "Create your first routine and pick it each day you go to train.",
    emptyAction: "Create my first routine",
    howItWorks: "How it works",
    steps: [
      "Create your routines just once",
      "Select the exercises you want",
      "On training day, pick one and start",
    ],
    pickRoutine: "Pick one of your routines",
    start: "Start",
    startRoutine: (name: string) => `Start ${name}`,
    manageRoutines: "Manage my routines",
    inProgress: "In progress",
    continue: "Continue",
    continueRoutine: (name) => `Continue ${name}`,
    activeTitle: "You have a workout in progress",
    activeMessage: (current, next) =>
      `${current} will be finished with the sets you marked, and ${next} will start.`,
    activeConfirm: "Finish and start",
    cancel: "Cancel",
    startError: "The workout couldn't be started",
  },
};
