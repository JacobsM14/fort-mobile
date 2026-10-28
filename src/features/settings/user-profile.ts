import Storage from "expo-sqlite/kv-store";

import { GENDERS, type Gender } from "@/constants/enums";

const HEIGHT_KEY = "user_height_cm";
const BIRTH_DATE_KEY = "user_birth_date";
const GENDER_KEY = "user_gender";

// What the user tells about themselves, for the body measures. Every part is
// optional: nothing is asked until it is needed.
export type UserProfile = {
  heightCm: number | null;
  // "1994-03-07": a day, not an instant.
  birthDate: string | null;
  gender: Gender | null;
};

export const EMPTY_PROFILE: UserProfile = {
  heightCm: null,
  birthDate: null,
  gender: null,
};

function isGender(value: string | null): value is Gender {
  return GENDERS.some((gender) => gender === value);
}

export function loadUserProfile(): UserProfile {
  const height = Number(Storage.getItemSync(HEIGHT_KEY));
  const gender = Storage.getItemSync(GENDER_KEY);
  return {
    heightCm: Number.isFinite(height) && height > 0 ? height : null,
    birthDate: Storage.getItemSync(BIRTH_DATE_KEY),
    gender: isGender(gender) ? gender : null,
  };
}

function store(key: string, value: string | number | null) {
  if (value === null) {
    Storage.removeItemSync(key);
  } else {
    Storage.setItemSync(key, String(value));
  }
}

export function saveUserProfile(profile: UserProfile) {
  store(HEIGHT_KEY, profile.heightCm);
  store(BIRTH_DATE_KEY, profile.birthDate);
  store(GENDER_KEY, profile.gender);
}
