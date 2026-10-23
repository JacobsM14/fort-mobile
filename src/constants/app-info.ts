import Constants from "expo-constants";

export const APP_NAME = Constants.expoConfig?.name ?? "FortApp";

export const CONTACT_EMAIL = "marcel.esplu@gmail.com";

// Empty until the app is published; the rate row stays hidden without a URL.
export const STORE_URLS: { ios?: string; android?: string } = {};

export const COPYRIGHT = { year: 2026, holder: "Marcel" };

export const EXERCISE_IMAGES_SOURCE = {
  name: "free-exercise-db",
  url: "https://github.com/yuhonas/free-exercise-db",
};

// Update it whenever the privacy text changes.
export const PRIVACY_UPDATED_AT = new Date(2026, 9, 18);
