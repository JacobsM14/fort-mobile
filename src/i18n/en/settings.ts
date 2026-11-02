import type { Translations } from "@/i18n/es";

export const settingsTexts: Pick<
  Translations,
  "settings" | "about" | "privacy"
> = {
  settings: {
    breadCrumb: "Profile",
    title: "Settings",
    appearance: "Appearance",
    themeOptions: {
      system: "System",
      light: "Light",
      dark: "Dark",
    },
    language: "Language",
    closeLanguage: "Close languages",
    languageOptions: {
      system: "System",
      es: "Español",
      en: "English",
      ca: "Català",
      eu: "Euskara",
      fr: "Français",
      pt: "Português",
    },
    units: {
      weight: "Weight",
      distance: "Distance",
      system: "Auto",
    },
    user: {
      height: "Height",
      cm: "cm",
      feet: "ft",
      inches: "in",
      birthDate: "Date of birth",
      day: "DD",
      month: "MM",
      year: "YYYY",
      intro:
        "For a better BMI estimate, fill in your height and date of birth. Height is required to work out your BMI, but age can also affect the result.",
      invalidDate: "That date doesn't exist or hasn't come yet.",
      gender: "Gender",
      genders: {
        female: "Female",
        male: "Male",
        other: "Other / Prefer not to say",
      },
    },
    data: {
      export: {
        title: "Export data",
        description:
          "Save a copy of your data to a file. It includes your profile, so keep it somewhere safe.",
        button: "Export",
        error: "The data could not be exported. Try again.",
      },
      import: {
        title: "Import data",
        description:
          "Restore a copy you exported before. It merges with your data and nothing is deleted.",
        button: "Choose file",
        confirmTitle: "Import this file",
        confirmMessage: (counts: {
          workouts: number;
          routines: number;
          exercises: number;
          bodyWeights: number;
        }) =>
          `The file has:\nWorkouts: ${counts.workouts}\nRoutines: ${counts.routines}\nCustom exercises: ${counts.exercises}\nBody weights: ${counts.bodyWeights}\n\nIt will be merged with your data and nothing will be deleted.`,
        confirm: "Import",
        cancel: "Cancel",
        done: (counts: {
          workouts: number;
          routines: number;
          exercises: number;
          bodyWeights: number;
          details: number;
        }) => {
          const items =
            counts.workouts +
            counts.routines +
            counts.exercises +
            counts.bodyWeights;
          if (items > 0) {
            return `Imported. Workouts: ${counts.workouts}, routines: ${counts.routines}, custom exercises: ${counts.exercises}, weights: ${counts.bodyWeights}.`;
          }
          return counts.details > 0
            ? "Exercises or sets of routines and workouts you already had were updated."
            : "There was nothing new to import.";
        },
        skipped: (count: number) =>
          `Exercises not imported because this version doesn't have them: ${count}.`,
        errors: {
          not_a_backup: "That file is not a backup of this app.",
          unsupported_version:
            "That backup comes from a newer version of the app. Update the app to import it.",
          invalid: "That file is damaged or incomplete. Nothing was imported.",
          failed: "The data could not be imported. Nothing was changed.",
        },
      },
    },
    sections: {
      user: "User",
      privacy: "Privacy policy and licenses",
      notifications: "Notifications",
      data: "Export / Import",
      preferences: "Preferences",
      exercises: "Manage exercises",
      about: "About",
    },
    accent: {
      label: "Color",
      names: {
        orange: "Orange",
        blue: "Blue",
        green: "Green",
        purple: "Purple",
        pink: "Pink",
        amber: "Amber",
      },
    },
    notifications: {
      enabled: "Get notifications",
      enabledDescription: "Turn them off to get none at all",
      blocked: "The app's notifications are blocked in your phone's settings.",
      openSystemSettings: "Open phone settings",
      types: "Which notifications to get",
      workout: "Workout in progress",
      workoutDescription:
        "The exercise you're on and how long you've been at it",
      weightReminder: "Weigh-in reminder",
      weightReminderDescription:
        "A weekly nudge to weigh yourself. If you've already weighed in that day, it stays quiet.",
      day: "Day",
      time: "Time",
      hourEarlier: "One hour earlier",
      hourLater: "One hour later",
      minutesEarlier: (minutes) => `${minutes} minutes earlier`,
      minutesLater: (minutes) => `${minutes} minutes later`,
    },
  },
  about: {
    version: "Version",
    contact: "Contact",
    rate: "Rate the app",
    disclaimer: (appName) =>
      `${appName} is not a medical device and does not diagnose, treat, cure or prevent any medical condition. Talk to a healthcare professional before starting an exercise program.`,
  },
  privacy: {
    summary: (appName) =>
      `${appName} stores everything you log only on this device. There are no accounts, servers, ads or analytics.`,
    storedTitle: "What is stored",
    storedIntro: "In the app's database, on this device:",
    stored: [
      "Your routines and the exercises you add",
      "Your workouts, sets and weights",
      "Your body weight, if you log it",
      "Your preferences: appearance, units, language and notifications, with the day and time of the weigh-in reminder",
    ],
    security:
      "This data lives in the app's private storage, which the system keeps other apps from accessing.",
    notDoneTitle: "What the app doesn't do",
    notDone: [
      "Ask you for an account or personal details",
      "Send anything over the internet",
      "Use analytics or tracking",
      "Show ads",
    ],
    backupsTitle: "Backups",
    backups:
      "If system backups are on (iCloud or Google), your data may be included in them, like any other app's. Those backups belong to your account, not to this app.",
    exports:
      "You can also export your data from Settings. It creates a file with everything you log, your profile included, and you choose where to save it or whom to send it to. The app keeps only the last exported copy, in its private storage. When importing, the app reads only the file you pick.",
    deleteTitle: "Deleting your data",
    delete:
      "Uninstalling the app deletes everything it stored on this device. Copies you exported and saved elsewhere are not deleted.",
    changesTitle: "Changes",
    changes:
      "If a future version changes how your data is handled (for example, to sync it across devices), it will be explained here before it happens.",
    contactTitle: "Contact",
    contact: "Privacy questions",
    licenseTitle: "License",
    rightsReserved: "All rights reserved.",
    thirdParty: "Third-party software",
    imagesTitle: "Exercise images",
    images:
      "The exercise images are generated with artificial intelligence (OpenAI).",
    lastUpdated: "Last updated",
  },
};
