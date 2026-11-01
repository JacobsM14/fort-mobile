import Constants from "expo-constants";

export const APP_NAME = Constants.expoConfig?.name ?? "FortApp";

export const CONTACT_EMAIL = "marcel.esplu@gmail.com";

// Empty until the app is published; the rate row stays hidden without a URL.
export const STORE_URLS: { ios?: string; android?: string } = {};

export const COPYRIGHT = { year: 2026, holder: "Marcel" };

// Update it whenever the privacy text changes.
export const PRIVACY_UPDATED_AT = new Date(2026, 10, 1);
