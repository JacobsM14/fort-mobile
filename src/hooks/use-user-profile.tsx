import { createContext, use, useState, type ReactNode } from "react";

import {
  loadUserProfile,
  saveUserProfile,
  type UserProfile,
} from "@/features/settings/user-profile";

type UserProfileContextValue = {
  profile: UserProfile;
  updateProfile: (changes: Partial<UserProfile>) => void;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

// The height, birth date and gender, read once at startup so any screen that
// needs them (the BMI card, for one) has them at hand.
export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(loadUserProfile);

  function updateProfile(changes: Partial<UserProfile>) {
    const next = { ...profile, ...changes };
    saveUserProfile(next);
    setProfile(next);
  }

  return (
    <UserProfileContext value={{ profile, updateProfile }}>
      {children}
    </UserProfileContext>
  );
}

export function useUserProfile(): UserProfileContextValue {
  const context = use(UserProfileContext);
  if (context === null) {
    throw new Error("useUserProfile must be used inside UserProfileProvider");
  }
  return context;
}
