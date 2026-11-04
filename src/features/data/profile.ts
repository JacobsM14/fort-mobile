import type { BackupProfile } from "./backup";
import type { UserProfile } from "@/features/settings/user-profile";

// What to write into the profile of this device from the one in a file: only
// the fields still empty here. What the user typed on this device is never
// replaced.
export function profileBlanksFilledFrom(
  current: UserProfile,
  imported: BackupProfile,
): Partial<UserProfile> {
  const changes: Partial<UserProfile> = {};
  if (current.heightCm === null && imported.heightCm !== null) {
    changes.heightCm = imported.heightCm;
  }
  if (current.birthDate === null && imported.birthDate !== null) {
    changes.birthDate = imported.birthDate;
  }
  if (current.gender === null && imported.gender !== null) {
    changes.gender = imported.gender;
  }
  return changes;
}
