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
    languageOptions: {
      system: "System",
      es: "Español",
      en: "English",
    },
    units: {
      weight: "Weight",
      distance: "Distance",
      system: "System",
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
    sections: {
      user: "User",
      privacy: "Privacy policy and licenses",
      permissions: "Permissions",
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
      "Your appearance preferences (theme and color)",
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
    deleteTitle: "Deleting your data",
    delete: "Uninstalling the app deletes everything it stored on this device.",
    changesTitle: "Changes",
    changes:
      "If a future version changes how your data is handled (for example, to sync it across devices), it will be explained here before it happens.",
    contactTitle: "Contact",
    contact: "Privacy questions",
    licenseTitle: "License",
    rightsReserved: "All rights reserved.",
    thirdParty: "Third-party software",
    imagesTitle: "Exercise images",
    images: "Exercise photos come from the free-exercise-db project.",
    lastUpdated: "Last updated",
  },
};
